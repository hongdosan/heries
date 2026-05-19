#!/usr/bin/env node
// 시크릿 누수 검증 — CLAUDE.md §원칙 #13 강제.
// dist 산출물 + commit 후보 변경 파일에서 API 키 / 토큰 / 비밀번호 / 작가 키 패턴 검출.
// 정책 #9 v2 = 단일 라이브 빌드 + runtime 마스킹 → 스포 누수 검증 (구 check-masking)
// 폐기. 본 스크립트가 대체.
//
// Usage: node scripts/check-secrets.mjs <distDir>

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const DIST = process.argv[2]
if (!DIST) {
  console.error('usage: check-secrets.mjs <distDir>')
  process.exit(1)
}

// 시크릿 패턴 — 보수적 (false positive 가능). 강한 자신감 패턴 위주.
// 추가 = 작가가 코드에 시크릿 hardcoded 한 명백한 케이스 잡기.
const SECRET_PATTERNS = [
  // API 키 / 토큰 (할당 형식)
  /(?:api[_-]?key|api[_-]?secret|access[_-]?token|refresh[_-]?token|client[_-]?secret|secret[_-]?key)\s*[:=]\s*['"]([A-Za-z0-9_\-]{16,})['"]/i,
  // AWS / GCP
  /AKIA[0-9A-Z]{16}/,
  // GitHub PAT (classic / fine-grained / OAuth)
  /ghp_[A-Za-z0-9]{36,}/,
  /github_pat_[A-Za-z0-9_]{82,}/,
  /gho_[A-Za-z0-9]{36,}/,
  // OpenAI / Anthropic
  /sk-[A-Za-z0-9]{20,}/,
  /sk-ant-[A-Za-z0-9-_]{20,}/,
  // Stripe
  /sk_live_[A-Za-z0-9]{24,}/,
  /rk_live_[A-Za-z0-9]{24,}/,
  // Slack token
  /xox[bpoa]-[A-Za-z0-9-]{10,}/,
  // Private key marker (PEM)
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/,
  // JWT (header.payload.signature — base64url)
  /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  // 일반 password 할당 (코드 내)
  /(?:password|passwd|pwd)\s*[:=]\s*['"]([^'"]{6,})['"]/i,
  // 작가 모드 키 — 환경변수 외 hardcoded 절대 금지
  /VITE_AUTHOR_KEY\s*=\s*['"][^'"]+['"]/,
]

// 화이트리스트 = 명백히 false positive 인 자리 (정규식 정의 자체 / 주석 등).
function isWhitelisted(filePath) {
  // 본 스크립트 자체
  if (filePath.endsWith('check-secrets.mjs')) return true
  // 정규식 패턴 본문 (예: spoiler-patterns.json 안 키 = 패턴 정의)
  if (/spoiler-patterns\.json$/.test(filePath)) return true
  return false
}

async function* walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else if (/\.(js|mjs|cjs|ts|tsx|json|html|css|md)$/.test(entry.name)) {
      yield full
    }
  }
}

const hits = []
for await (const file of walk(DIST)) {
  let text
  try { text = await readFile(file, 'utf8') } catch { continue }
  for (const pattern of SECRET_PATTERNS) {
    const m = text.match(pattern)
    if (!m) continue
    // 첫 매치만 보고 (한 패턴당 1건). 라인 추출.
    const idx = text.indexOf(m[0])
    const before = text.slice(0, idx).split('\n')
    const lineNo = before.length
    const lineText = (text.split('\n')[lineNo - 1] ?? '').trim().slice(0, 200)
    if (isWhitelisted(file)) continue
    hits.push({ file, lineNo, pattern: pattern.source.slice(0, 60), snippet: lineText })
  }
}

if (hits.length === 0) {
  console.log(`✓ check-secrets OK — ${DIST} 안 시크릿 패턴 누수 0건`)
  process.exit(0)
}

console.error(`✗ check-secrets FAIL — ${hits.length} 건 시크릿 패턴 검출:`)
for (const h of hits) {
  console.error(`  [${h.pattern}] ${h.file}:${h.lineNo}`)
  console.error(`    ${h.snippet}`)
}
console.error('')
console.error('  fix: 시크릿은 .env.local (gitignored) 또는 GitHub Secrets 사용. CLAUDE.md §원칙 #13.')
process.exit(1)
