import { isAuthorMode } from './env.js'
import patterns from '../config/spoiler-patterns.json'

/**
 * 작가 모드 마스킹 (Spoiler Masking) — 정책 #9 v2.
 *
 * **목적**: 동일 dist 빌드 안에 작가 콘텐츠 (스포일러) 가 평문 포함되지만,
 * reader (일반 독자) 화면에서는 특정 절을 마스킹 (= 화면에 안 표시).
 * 작가 모드 활성 시 (sessionStorage `heries:author=1`) 모든 절 노출.
 *
 * **마스킹 대상** (SSOT = `spoiler-patterns.json`):
 * - `series` 타입: `_series.md` 의 `## 시놉시스` 절 + 그 하위 자식 절
 * - `character` 타입: 캐릭터 카드의 `## H-eries 분기 ~` 절 + 그 하위
 * - `chapter` 타입: 챕터 본문은 마스킹 X (전체 노출)
 *
 * **프론트matter**: `heries_arc` 같은 작가 메타도 reader 빌드에서 제거.
 */
export function maskSpoilersFromMarkdown(
  raw: string,
  kind: 'series' | 'character' | 'chapter',
): string {
  // 작가 모드 = 모든 절 노출 (마스킹 X).
  if (isAuthorMode()) return raw
  // 챕터 본문 = 마스킹 X (본문 자체가 reader 콘텐츠).
  if (kind === 'chapter') return raw

  const lines = raw.split('\n')
  const out: string[] = []
  let skipping = false

  // 한 줄씩 순회하면서 `## ` 헤더를 만나면 마스킹 시작/종료 판단.
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // 본 라인이 마스킹 대상 헤더면 그 절부터 skip 시작.
      const isSeriesSpoiler = kind === 'series'
        && patterns.seriesSpoilerHeaders.some((h) => line.startsWith(h))
      const isHeriesBranch = kind === 'character'
        && line.startsWith(patterns.heriesBranchHeader)
      if (isSeriesSpoiler || isHeriesBranch) {
        skipping = true
        continue
      }
      // 마스킹 중에 다음 `## ` 헤더 만나면 마스킹 종료 (그 헤더는 노출).
      if (skipping) skipping = false
    }
    if (!skipping) out.push(line)
  }

  return out.join('\n')
}

/**
 * 작가 전용 frontmatter 필드 제거 (예: `heries_arc`).
 *
 * - 캐릭터 카드만 대상 (series / chapter 는 frontmatter 마스킹 X)
 * - 작가 모드면 그대로 반환
 *
 * SSOT = `spoiler-patterns.json` 의 `spoilerFrontmatterKeys` 배열.
 */
export function maskSpoilersFromFrontmatter<F extends object>(
  fm: F,
  kind: 'series' | 'character' | 'chapter',
): F {
  if (isAuthorMode()) return fm
  if (kind !== 'character') return fm
  const rest: Record<string, unknown> = { ...(fm as Record<string, unknown>) }
  for (const key of patterns.spoilerFrontmatterKeys) {
    delete rest[key]
  }
  return rest as F
}
