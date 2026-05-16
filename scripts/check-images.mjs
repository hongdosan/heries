#!/usr/bin/env node
// Build gate: fail the build if any thumbnail/cover image exceeds the size budget.
// Run BEFORE vite build to force the author to run `npm run optimize:images`.
//
// Targets: src/shared/images/**/*.{webp,jpg,jpeg,png}     (코드 자산)
//          content/series/*/thumbnails/**/*.{webp,jpg,jpeg,png} (작가 자산)

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const IMG_RE = /\.(webp|jpg|jpeg|png)$/i
const MAX_BYTES = 500 * 1024 // 500 KB budget per image

function walkImages(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkImages(full, acc)
    else if (IMG_RE.test(entry.name)) acc.push(full)
  }
}

function collect() {
  // Recurses into src/shared/images (code assets — sprite, mark, placeholder) +
  // content/series/*/thumbnails (author assets — chapter cover, prompt-driven webp).
  const out = []
  try {
    if (statSync('src/shared/images').isDirectory()) walkImages('src/shared/images', out)
  } catch {}
  try {
    const seriesDir = 'content/series'
    for (const slug of readdirSync(seriesDir)) {
      const thumbs = join(seriesDir, slug, 'thumbnails')
      try {
        if (statSync(thumbs).isDirectory()) walkImages(thumbs, out)
      } catch {}
    }
  } catch {}
  return out
}

const files = collect()
const oversized = files
  .map((p) => ({ p, size: statSync(p).size }))
  .filter((x) => x.size > MAX_BYTES)

if (oversized.length === 0) {
  console.log(`✓ image budget OK (${files.length} files, all ≤ ${MAX_BYTES / 1024} KB)`)
  process.exit(0)
}

const fmt = (b) => (b / 1024).toFixed(0) + ' KB'
console.error('')
console.error(`✗ image budget exceeded — ${oversized.length} file(s) over ${MAX_BYTES / 1024} KB:`)
for (const x of oversized) {
  console.error(`  ${x.p}  (${fmt(x.size)})`)
}
console.error('')
console.error('  fix: npm run optimize:images')
console.error('')
process.exit(1)
