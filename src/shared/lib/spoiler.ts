import { IS_AUTHOR_MODE } from './env.js'
import patterns from './spoiler-patterns.json'

/**
 * Strip spoiler sections from a markdown body.
 * - For `_series.md`: drops the `## 시놉시스` section.
 * - For character cards: drops everything from `## heries 분기 ~` onward,
 *   except the trailing `## 검증 출처` section (kept as it's source attribution, not spoiler).
 *
 * Author mode (`VITE_AUTHOR_MODE=true`) bypasses masking entirely.
 *
 * SSOT for spoiler patterns: spoiler-patterns.json (shared with build-time
 * scripts/copy-content.mjs to keep build / runtime in lockstep).
 */
export function maskSpoilersFromMarkdown(
  raw: string,
  kind: 'series' | 'character' | 'chapter',
): string {
  if (IS_AUTHOR_MODE) return raw
  if (kind === 'chapter') return raw

  const lines = raw.split('\n')
  const out: string[] = []
  let skipping = false

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const isSeriesSpoiler = kind === 'series' && patterns.seriesSpoilerHeaders.some((h) => line.startsWith(h))
      const isHeriesBranch = kind === 'character' && line.startsWith(patterns.heriesBranchHeader)
      const isVerification = line.startsWith(patterns.verificationHeader)

      if (isSeriesSpoiler || isHeriesBranch) {
        skipping = true
        continue
      }
      if (isVerification) {
        skipping = false
      } else {
        if (skipping) continue
      }
    }
    if (!skipping) out.push(line)
  }

  return out.join('\n')
}

/**
 * Strip spoiler frontmatter fields (e.g. `heries_arc` on character cards).
 */
export function maskSpoilersFromFrontmatter<F extends object>(fm: F, kind: 'series' | 'character' | 'chapter'): F {
  if (IS_AUTHOR_MODE) return fm
  if (kind !== 'character') return fm
  const rest: Record<string, unknown> = { ...(fm as Record<string, unknown>) }
  for (const key of patterns.spoilerFrontmatterKeys) {
    delete rest[key]
  }
  return rest as F
}
