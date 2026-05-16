import type {
  ChapterFrontmatter,
  ChapterIndex,
  DocFile,
  SeriesManifest,
} from '../../shared/lib/types.js'
import { parseFrontmatter } from '../../shared/lib/frontmatter.js'
import { renderMarkdown } from '../../shared/lib/markdown.js'
import { fetchMarkdown } from '../../shared/lib/manifest.js'

export interface ChapterPageData {
  frontmatter: ChapterFrontmatter
  bodyHtml: string
  index: ChapterIndex
}

export async function loadChapter(
  slug: string,
  episode: string,
  manifest: SeriesManifest,
): Promise<ChapterPageData> {
  const epNum = Number(episode)
  const index = manifest.chapters.find((c) => c.episode === epNum)
  if (!index) {
    throw new Error(`chapter not found in manifest: ${slug} ep ${episode}`)
  }
  const path = `./content/series/${slug}/chapters/ep-${zeroPad2(index.episode)}.md`
  const raw = await fetchMarkdown(path)
  const doc: DocFile<ChapterFrontmatter> = parseFrontmatter<ChapterFrontmatter>(raw)
  const bodyHtml = renderMarkdown(doc.body)
  return { frontmatter: doc.frontmatter, bodyHtml, index }
}

function zeroPad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}
