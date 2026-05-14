#!/usr/bin/env node
// Optimize thumbnail/cover images in-place.
// Uses sharp-cli via npx (no permanent dependency added to package.json).
//
// Targets: content/_shared/images/**/*.{webp,jpg,jpeg,png}
//          content/series/*/thumbnails/**/*.{webp,jpg,jpeg,png}
//
// Output: same path, WebP, quality 80, resized to max 1600px width.

import { execSync } from 'node:child_process'
import { readdirSync, statSync, mkdtempSync, renameSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'
import process from 'node:process'

const IMG_RE = /\.(webp|jpg|jpeg|png)$/i
const SHARP_CLI = 'sharp-cli@latest'

function findImageDirs(root) {
  // Returns all directories that hold thumbnail/cover images. Recurses into
  // content/_shared/** (mini-game/ 등 하위 sprite 폴더 포함) +
  // content/series/*/thumbnails (chapter-images/ 등 포함).
  const out = []
  try {
    const sharedDir = join(root, '_shared')
    if (statSync(sharedDir).isDirectory()) walkDirs(sharedDir, out)
  } catch {}
  try {
    const seriesDir = join(root, 'series')
    for (const slug of readdirSync(seriesDir)) {
      const thumbs = join(seriesDir, slug, 'thumbnails')
      try {
        if (!statSync(thumbs).isDirectory()) continue
      } catch { continue }
      walkDirs(thumbs, out)
    }
  } catch {}
  return out
}

function walkDirs(dir, acc) {
  if (listImages(dir).length > 0) acc.push(dir)
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) walkDirs(join(dir, entry.name), acc)
  }
}

function listImages(dir) {
  return readdirSync(dir).filter((f) => IMG_RE.test(f))
}

function humanKB(bytes) {
  return (bytes / 1024).toFixed(0) + ' KB'
}

const dirs = findImageDirs('content')
if (dirs.length === 0) {
  console.log('no thumbnail directories found.')
  process.exit(0)
}

let totalBefore = 0
let totalAfter = 0
let count = 0

for (const dir of dirs) {
  const files = listImages(dir)
  if (files.length === 0) continue
  console.log(`\n▸ ${dir} (${files.length} files)`)

  for (const f of files) {
    const inPath = join(dir, f)
    const stem = basename(f, extname(f))
    const before = statSync(inPath).size

    // sharp-cli writes to an output directory using the original input filename
    // (just changes extension to .webp when -f webp is used). To avoid clobbering
    // the source mid-write, we stage to a tmp dir, then swap in.
    const tmpDir = mkdtempSync(join(tmpdir(), 'H-eries-img-'))
    try {
      // --withoutEnlargement = 원본보다 큰 크기로 upscale 방지.
      // 작은 sprite (예: mini-game/mg-impact-*) 가 1600 강제 resize 로
      // 오히려 커지는 현상 방지.
      const cmd = [
        'npx', '-y', SHARP_CLI,
        '-i', JSON.stringify(inPath),
        '-o', JSON.stringify(tmpDir),
        '-f', 'webp',
        '-q', '80',
        'resize', '1600', '--withoutEnlargement',
      ].join(' ')
      execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] })

      // sharp-cli output: <tmpDir>/<stem>.webp (regardless of input extension)
      const outPath = join(tmpDir, `${stem}.webp`)
      statSync(outPath) // throws if missing
      const outSize = statSync(outPath).size

      // 결과가 원본보다 크면 원본 유지 (이미 최적화된 작은 이미지 케이스).
      if (extname(f).toLowerCase() === '.webp' && outSize >= before) {
        totalBefore += before
        totalAfter += before
        console.log(`  · ${stem}: ${humanKB(before)} (이미 최적화됨, 보존)`)
        continue
      }

      // Replace original. If source had non-.webp extension, remove it.
      if (extname(f).toLowerCase() !== '.webp') {
        try { rmSync(inPath) } catch {}
      }
      renameSync(outPath, join(dir, `${stem}.webp`))

      const after = statSync(join(dir, `${stem}.webp`)).size
      totalBefore += before
      totalAfter += after
      count++
      const ratio = ((1 - after / before) * 100).toFixed(0)
      console.log(`  ✓ ${stem}: ${humanKB(before)} → ${humanKB(after)} (-${ratio}%)`)
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  }
}

if (count > 0) {
  const ratio = ((1 - totalAfter / totalBefore) * 100).toFixed(0)
  console.log(`\n✓ optimized ${count} files: ${humanKB(totalBefore)} → ${humanKB(totalAfter)} (-${ratio}%)`)
} else {
  console.log('no images found to optimize.')
}
