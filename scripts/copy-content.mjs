#!/usr/bin/env node
// Copy content/ → <outDir>/content/ with spoiler masking for reader build.
// In author mode (VITE_AUTHOR_MODE=true) everything is copied verbatim.
//
// Usage: node scripts/copy-content.mjs <outDir>
//
// Spoiler patterns SSOT: src/shared/lib/spoiler-patterns.json
// (shared with runtime spoiler.ts to keep build / runtime in lockstep)

import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import patterns from '../src/shared/lib/spoiler-patterns.json' with { type: 'json' }

const SRC = 'content'
const OUT = process.argv[2]
if (!OUT) {
  console.error('usage: copy-content.mjs <outDir>')
  process.exit(1)
}
const IS_AUTHOR = process.env.VITE_AUTHOR_MODE === 'true' || process.env.VITE_AUTHOR_MODE === '1'

const SPOILER_DIRS = new Set(patterns.spoilerDirs)
const FENCE_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function maskBody(raw, kind) {
  if (kind === 'chapter') return raw
  const lines = raw.split('\n')
  const out = []
  let skip = false
  for (const line of lines) {
    if (line.startsWith('## ')) {
      const isSeriesSpoiler = kind === 'series' && patterns.seriesSpoilerHeaders.some((h) => line.startsWith(h))
      const isHeries = kind === 'character' && line.startsWith(patterns.heriesBranchHeader)
      const isVerification = line.startsWith(patterns.verificationHeader)
      if (isSeriesSpoiler || isHeries) { skip = true; continue }
      if (isVerification) { skip = false }
      else if (skip) continue
    }
    if (!skip) out.push(line)
  }
  return out.join('\n')
}

function maskFrontmatter(raw, kind) {
  if (kind !== 'character') return raw
  const m = raw.match(FENCE_RE)
  if (!m) return raw
  const fm = m[1]
  const keyRe = new RegExp(`^(${patterns.spoilerFrontmatterKeys.join('|')})\\s*:`)
  const filtered = fm.split('\n').filter((ln) => !keyRe.test(ln.trim())).join('\n')
  return raw.replace(FENCE_RE, `---\n${filtered}\n---\n`)
}

function classify(relPath) {
  if (/^series\/[^/]+\/_series\.md$/.test(relPath)) return 'series'
  if (/^series\/[^/]+\/chapters\//.test(relPath)) return 'chapter'
  if (/^series\/[^/]+\/characters\//.test(relPath)) return 'character'
  return null
}

async function* walk(dir, base = dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    const rel = relative(base, full)
    if (entry.isDirectory()) {
      // Always skip archived legacy content (`content/_legacy_*`) — kept locally
      // for author reference, never published. Also gitignored, so this matters
      // only when building locally where the working copy still holds it.
      if (/^_legacy_/.test(entry.name)) continue
      if (!IS_AUTHOR) {
        const segments = rel.split('/')
        if (segments.some((s) => SPOILER_DIRS.has(s))) continue
      }
      yield* walk(full, base)
    } else {
      const relSlash = '/' + rel.replace(/\\/g, '/')
      // Skip author-only notes inside thumbnails (e.g. PROMPTS.md).
      if (!IS_AUTHOR && /\/thumbnails\/.+\.md$/.test(relSlash)) continue
      // Skip author-only meta files inside characters/ — pool files (`_*.md`)
      // and the README guide. Card files (slug.md) are reader-exposed.
      if (!IS_AUTHOR && /\/characters\/.*\/_[^/]+\.md$/.test(relSlash)) continue
      if (!IS_AUTHOR && /\/characters\/README\.md$/.test(relSlash)) continue
      // Skip antagonist cards in reader build — they reveal Phase 2/3 spoilers.
      if (!IS_AUTHOR && /\/characters\/3-antagonist\//.test(relSlash)) continue
      yield { full, rel }
    }
  }
}

let copied = 0
let masked = 0
for await (const { full, rel } of walk(SRC)) {
  const dest = join(OUT, 'content', rel)
  await mkdir(dirname(dest), { recursive: true })
  if (IS_AUTHOR || !rel.endsWith('.md')) {
    await copyFile(full, dest)
    copied++
    continue
  }
  const kind = classify(rel)
  if (!kind) {
    await copyFile(full, dest)
    copied++
    continue
  }
  const raw = await readFile(full, 'utf8')
  const m1 = maskFrontmatter(raw, kind)
  const m2 = maskBody(m1, kind)
  await writeFile(dest, m2, 'utf8')
  masked++
}

// NOTICE.md SSOT 동기화 — 루트 NOTICE.md 가 단일 진실. content/notice.md 는
// dev 서버용 git-tracked 미러 (vite 가 ./content/ 를 직접 서빙하므로 필요).
// 빌드 시 항상 루트 NOTICE.md 본문을 `<outDir>/content/notice.md` 로 덮어쓰기하여
// content/notice.md 가 stale 해도 dist 산출물은 항상 최신 SSOT 반영.
try {
  const noticeRaw = await readFile('NOTICE.md', 'utf8')
  const dest = join(OUT, 'content', 'notice.md')
  await mkdir(dirname(dest), { recursive: true })
  // 페이지 hero (`about` 패턴) 가 사용하는 `title` / `updated` frontmatter 를
  // build 시 부착. 루트 NOTICE.md 는 frontmatter 없이 작가가 자유롭게 편집한다.
  const today = new Date().toISOString().slice(0, 10)
  const fm = `---\ntitle: 저작권 고지 (NOTICE)\nupdated: ${today}\n---\n\n`
  await writeFile(dest, fm + noticeRaw, 'utf8')
  copied++
} catch (err) {
  console.warn('copy-content: NOTICE.md mirror skipped —', err.message)
}

const mode = IS_AUTHOR ? 'AUTHOR' : 'reader'
console.log(`copy-content [${mode}]: ${copied} verbatim, ${masked} masked`)
