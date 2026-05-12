import type { DocFile } from './types.js'

const FENCE_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

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

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1)
  }
  return s
}
