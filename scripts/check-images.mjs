#!/usr/bin/env node
// Build gate: fail the build if any thumbnail/cover image exceeds the size budget.
// Run BEFORE vite build to force the author to run `npm run optimize:images`.
//
// Targets: content/_shared/*.{webp,jpg,jpeg,png}
//          content/series/*/thumbnails/*.{webp,jpg,jpeg,png}

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const IMG_RE = /\.(webp|jpg|jpeg|png)$/i
const MAX_BYTES = 500 * 1024 // 500 KB budget per image

function walkImages(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkImages(full, acc)
    else if (IMG_RE.test(entry.name)) acc.push(full)
  }
}

function collect(root) {
  // Recurses into content/_shared and content/series/*/thumbnails so subfolders
  // (e.g. chapter-images/) are included.
  const out = []
  try {
    if (statSync(join(root, '_shared')).isDirectory()) walkImages(join(root, '_shared'), out)
  } catch {}
  try {
    const seriesDir = join(root, 'series')
    for (const slug of readdirSync(seriesDir)) {
      const thumbs = join(seriesDir, slug, 'thumbnails')
      try {
        if (statSync(thumbs).isDirectory()) walkImages(thumbs, out)
      } catch {}
    }
  } catch {}
  return out
}

const files = collect('content')
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
