#!/usr/bin/env node
// Post-build masking validator for reader dist.
// Fails the build if reader dist still contains author-only content
// (시놉시스 절 / H-eries 분기 절 / heries_arc frontmatter / spoiler dirs / legacy dirs).
//
// Usage: node scripts/check-masking.mjs <distDir>
// SSOT: src/shared/lib/spoiler-patterns.json

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import process from 'node:process'
import patterns from '../src/shared/lib/spoiler-patterns.json' with { type: 'json' }

const DIST = process.argv[2]
if (!DIST) {
  console.error('Usage: node scripts/check-masking.mjs <distDir>')
  process.exit(1)
}

const FENCE_RE = /^---\r?\n([\s\S]*?)\r?\n---/

async function walk(dir, hits, root) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    const rel = relative(root, full)
    if (entry.isDirectory()) {
      // Reject spoiler dirs anywhere under content/series/*/
      if (patterns.spoilerDirs.includes(entry.name) && rel.includes('series')) {
        hits.push({ kind: 'spoiler-dir', path: rel })
      }
      // Reject legacy dirs
      if (/^_legacy_/.test(entry.name)) {
        hits.push({ kind: 'legacy-dir', path: rel })
      }
      await walk(full, hits, root)
      continue
    }
    if (!entry.name.endsWith('.md')) continue
    const raw = await readFile(full, 'utf8')
    const lines = raw.replace(/\r\n/g, '\n').split('\n')
    // Spoiler headers anywhere in body
    for (const line of lines) {
      for (const h of patterns.seriesSpoilerHeaders) {
        if (line.startsWith(h)) hits.push({ kind: 'series-spoiler-header', path: rel, line })
      }
      if (line.startsWith(patterns.heriesBranchHeader)) {
        hits.push({ kind: 'heries-branch-header', path: rel, line })
      }
    }
    // Frontmatter spoiler keys
    const fm = raw.match(FENCE_RE)
    if (fm) {
      for (const key of patterns.spoilerFrontmatterKeys) {
        const re = new RegExp(`^${key}:`, 'm')
        if (re.test(fm[1])) {
          hits.push({ kind: 'spoiler-frontmatter-key', path: rel, key })
        }
      }
    }
  }
}

async function main() {
  try {
    await stat(DIST)
  } catch {
    console.error(`check-masking: dist not found at ${DIST}`)
    process.exit(1)
  }
  const hits = []
  await walk(DIST, hits, DIST)
  if (hits.length === 0) {
    console.log(`✓ masking OK — ${DIST} 안 마스킹 누수 0건`)
    return
  }
  console.error(`✗ masking FAIL — ${DIST} 안 마스킹 누수 ${hits.length}건:`)
  for (const h of hits) {
    const detail = h.line ? ` (${h.line.slice(0, 60)})` : h.key ? ` (key=${h.key})` : ''
    console.error(`  [${h.kind}] ${h.path}${detail}`)
  }
  process.exit(1)
}

main().catch((err) => {
  console.error('check-masking error:', err)
  process.exit(1)
})
