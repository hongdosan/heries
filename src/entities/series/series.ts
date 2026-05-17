import type { DocFile, SeriesFrontmatter, SeriesManifest } from '../../shared/lib/types.js'
import { parseFrontmatter } from '../../shared/lib/frontmatter.js'
import { renderMarkdown } from '../../shared/lib/markdown.js'
import { fetchMarkdown, fetchSeriesManifest } from '../../shared/lib/manifest.js'
import { maskSpoilersFromMarkdown, maskSpoilersFromFrontmatter } from '../../shared/lib/spoiler.js'

export interface SeriesPageData {
  frontmatter: SeriesFrontmatter
  bodyHtml: string
  manifest: SeriesManifest
}

/**
 * 시리즈 페이지 데이터 로더.
 *
 * **2 fetch 병렬**:
 * 1. `_series.md` (frontmatter + 본문 — 시놉시스·페이즈·세계관 요약 등)
 * 2. `manifest.json` (챕터·등장인물 인덱스)
 *
 * **스포일러 마스킹** (작가 모드 OFF 시):
 * - body: `## 시놉시스` 절 차단
 * - frontmatter: 마스킹 적용 (현재 series frontmatter 는 차단 대상 없음, 미래 확장 대비)
 *
 * 호출처: `pages/series/series.tsx` 의 useAsync.
 */
export async function loadSeries(slug: string): Promise<SeriesPageData> {
  const [raw, manifest] = await Promise.all([
    fetchMarkdown(`./content/series/${slug}/_series.md`),
    fetchSeriesManifest(slug),
  ])
  const doc: DocFile<SeriesFrontmatter> = parseFrontmatter<SeriesFrontmatter>(raw)
  const maskedBody = maskSpoilersFromMarkdown(doc.body, 'series')
  const maskedFm = maskSpoilersFromFrontmatter(doc.frontmatter, 'series')
  return { frontmatter: maskedFm, bodyHtml: renderMarkdown(maskedBody), manifest }
}
