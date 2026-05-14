import { isAuthorMode } from './env.js'
import patterns from './spoiler-patterns.json'

// Strip spoiler sections from a markdown body.
// - `_series.md`: drops `## 시놉시스` section (until next `## ` or EOF).
// - Character cards: drops `## H-eries 분기 ~` onward (until next `## ` or EOF).
// Author mode (sessionStorage `heries:author=1`) bypasses masking. SSOT: spoiler-patterns.json.
export function maskSpoilersFromMarkdown(
  raw: string,
  kind: 'series' | 'character' | 'chapter',
): string {
  if (isAuthorMode()) return raw
  if (kind === 'chapter') return raw

  const lines = raw.split('\n')
  const out: string[] = []
  let skipping = false

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const isSeriesSpoiler = kind === 'series' && patterns.seriesSpoilerHeaders.some((h) => line.startsWith(h))
      const isHeriesBranch = kind === 'character' && line.startsWith(patterns.heriesBranchHeader)
      if (isSeriesSpoiler || isHeriesBranch) {
        skipping = true
        continue
      }
      if (skipping) skipping = false
    }
    if (!skipping) out.push(line)
  }

  return out.join('\n')
}

/**
 * Strip spoiler frontmatter fields (e.g. `heries_arc` on character cards).
 */
export function maskSpoilersFromFrontmatter<F extends object>(fm: F, kind: 'series' | 'character' | 'chapter'): F {
  if (isAuthorMode()) return fm
  if (kind !== 'character') return fm
  const rest: Record<string, unknown> = { ...(fm as Record<string, unknown>) }
  for (const key of patterns.spoilerFrontmatterKeys) {
    delete rest[key]
  }
  return rest as F
}
