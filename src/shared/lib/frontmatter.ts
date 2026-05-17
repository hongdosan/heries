import type { DocFile } from './types.js'

/**
 * Frontmatter parser (의존 0 자체 구현).
 *
 * **frontmatter** = markdown 파일 상단의 `---` fence 안 메타데이터 (YAML 형식).
 * 예:
 * ```
 * ---
 * title: 마수의 등장
 * episode: 1
 * published: 2026-05-15
 * ---
 *
 * 본문 시작...
 * ```
 *
 * **지원 spec** (작가 자작 markdown 만 처리, 최소 spec):
 * - `key: value` 한 줄 (multiline X)
 * - 값 타입: string / number (정수) / boolean / array `[a, b, c]`
 * - 따옴표 strip (`"text"` / `'text'`)
 * - `#` 시작 라인 = 주석 (skip)
 *
 * **미지원** (작가가 사용 안 함): nested object / multiline string / anchor / reference.
 */

// frontmatter fence 검출 — 파일 첫 줄이 `---` 이고 다음 `---` 까지가 YAML 본문.
const FENCE_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * markdown raw text → `{ frontmatter, body }` 분리.
 * fence 없으면 frontmatter = `{}`, body = 전체.
 */
export function parseFrontmatter<F = Record<string, unknown>>(
  raw: string,
): DocFile<F> {
  const match = raw.match(FENCE_RE)
  if (!match) {
    return { frontmatter: {} as F, body: raw }
  }
  const yaml = match[1] ?? ''
  const body = raw.slice(match[0].length)
  return { frontmatter: parseYaml(yaml) as F, body }
}

/** YAML 본문 → 객체 변환 (한 줄 단위 key:value parse). */
function parseYaml(yaml: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const line of yaml.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const colon = trimmed.indexOf(':')
    if (colon < 0) continue
    const key = trimmed.slice(0, colon).trim()
    const rawValue = trimmed.slice(colon + 1).trim()
    if (!key) continue
    out[key] = parseValue(rawValue)
  }
  return out
}

/** YAML 값 1 개 type 추론 — array / number / boolean / string 순. */
function parseValue(raw: string): unknown {
  if (!raw) return ''
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((part) => stripQuotes(part.trim()))
  }
  if (/^-?\d+$/.test(raw)) return Number(raw)
  if (raw === 'true') return true
  if (raw === 'false') return false
  return stripQuotes(raw)
}

/** 따옴표 (`"` 또는 `'`) 양끝 strip — 양쪽 모두 있을 때만. */
function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1)
  }
  return s
}
