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
