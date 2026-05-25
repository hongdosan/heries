#!/usr/bin/env node
// Manifest 정합 검증 — content/series/{slug}/manifest.json 의 chapters[]/characters[] 와
// 실제 파일시스템 (chapters/*.md, characters/*/*.md) 매칭 여부 확인.
// 누락 (manifest 에 있는데 파일 X) / 고아 (파일 있는데 manifest X) 모두 검출.
//
// Usage: node scripts/check-manifest.mjs
// 빌드 게이트 (package.json build 안 prepend) 또는 lint-staged 등에서 호출.

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const SERIES_ROOT = 'content/series'

async function listSeries() {
  const entries = await readdir(SERIES_ROOT, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory()).map((e) => e.name)
}

async function checkSeries(slug) {
  const dir = join(SERIES_ROOT, slug)
  const manifestPath = join(dir, 'manifest.json')
  let manifest
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (err) {
    return [`✗ ${slug}/manifest.json 읽기 실패: ${err.message}`]
  }

  const hits = []

  // 챕터 매칭 — `_` prefix 파일은 운영용 (단역 풀 / 메모 / 템플릿 등) 으로 매칭 제외.
  const declaredChapters = (manifest.chapters || []).map((c) => `${c.slug}.md`)
  let actualChapters = []
  try {
    actualChapters = (await readdir(join(dir, 'chapters')))
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  } catch {
    // chapters 디렉토리 없으면 declared 0 일 때 OK
  }
  for (const declared of declaredChapters) {
    if (!actualChapters.includes(declared)) {
      hits.push(`✗ ${slug}: manifest 의 ${declared} 가 chapters/ 에 없음`)
    }
  }
  for (const actual of actualChapters) {
    if (!declaredChapters.includes(actual)) {
      hits.push(`⚠ ${slug}: chapters/${actual} 가 manifest 에 미등록 (고아)`)
    }
  }

  // 캐릭터 매칭 — `_` prefix 파일은 운영용 (`_mob-pool.md` 등 단역 풀) 으로 매칭 제외.
  const declaredChars = (manifest.characters || []).map((c) => `${c.folder}/${c.id}.md`)
  let actualChars = []
  try {
    const folders = (await readdir(join(dir, 'characters'), { withFileTypes: true }))
      .filter((e) => e.isDirectory())
    for (const folder of folders) {
      const files = (await readdir(join(dir, 'characters', folder.name)))
        .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      actualChars.push(...files.map((f) => `${folder.name}/${f}`))
    }
  } catch {
    // characters 디렉토리 없으면 declared 0 일 때 OK
  }
  for (const declared of declaredChars) {
    if (!actualChars.includes(declared)) {
      hits.push(`✗ ${slug}: manifest 의 ${declared} 가 characters/ 에 없음`)
    }
  }
  for (const actual of actualChars) {
    if (!declaredChars.includes(actual)) {
      hits.push(`⚠ ${slug}: characters/${actual} 가 manifest 에 미등록 (고아)`)
    }
  }

  return hits
}

const allHits = []
for (const slug of await listSeries()) {
  allHits.push(...await checkSeries(slug))
}

if (allHits.length === 0) {
  console.log('✓ check-manifest OK — 모든 시리즈의 chapters/characters 가 manifest 정합')
  process.exit(0)
}

const errors = allHits.filter((h) => h.startsWith('✗'))
const warnings = allHits.filter((h) => h.startsWith('⚠'))

console.error(`✗ check-manifest: ${errors.length} error(s) / ${warnings.length} warning(s)`)
for (const h of allHits) console.error(`  ${h}`)
process.exit(errors.length > 0 ? 1 : 0)
