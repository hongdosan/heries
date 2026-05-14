#!/usr/bin/env node
// content/ → <outDir>/content/ 평문 복사. 정책 #9 v2 = 단일 라이브 빌드 + runtime 마스킹
// (sessionStorage `heries:author=1`). 빌드 시 콘텐츠 마스킹은 폐기됨.
//
// Usage: node scripts/copy-content.mjs <outDir>

import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'

const SRC = 'content'
const OUT = process.argv[2]
if (!OUT) {
  console.error('usage: copy-content.mjs <outDir>')
  process.exit(1)
}

async function* walk(dir, base = dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    const rel = relative(base, full)
    if (entry.isDirectory()) {
      // Legacy 아카이브 (`content/_legacy_*`) 는 작가 로컬 참조용, 빌드 제외.
      if (/^_legacy_/.test(entry.name)) continue
      yield* walk(full, base)
    } else {
      yield { full, rel }
    }
  }
}

let copied = 0
for await (const { full, rel } of walk(SRC)) {
  const dest = join(OUT, 'content', rel)
  await mkdir(dirname(dest), { recursive: true })
  await copyFile(full, dest)
  copied++
}

// NOTICE.md SSOT 동기화 — 루트 NOTICE.md 가 단일 진실.
// content/notice.md 는 dev 서버용 git-tracked 미러 (vite 가 ./content/ 를 직접 서빙).
// 빌드 시 루트 NOTICE.md 본문을 `<outDir>/content/notice.md` 로 덮어쓰기.
try {
  const noticeRaw = await readFile('NOTICE.md', 'utf8')
  const dest = join(OUT, 'content', 'notice.md')
  await mkdir(dirname(dest), { recursive: true })
  const today = new Date().toISOString().slice(0, 10)
  const fm = `---\ntitle: 저작권 고지 (NOTICE)\nupdated: ${today}\n---\n\n`
  await writeFile(dest, fm + noticeRaw, 'utf8')
  copied++
} catch (err) {
  console.warn('copy-content: NOTICE.md mirror skipped —', err.message)
}

console.log(`✓ copy-content: ${copied} files (단일 빌드, runtime 마스킹)`)
