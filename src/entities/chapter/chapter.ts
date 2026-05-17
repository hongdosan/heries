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

/**
 * 챕터 (에피소드) 페이지 데이터 로더.
 *
 * **흐름**:
 * 1. manifest.chapters 에서 `episode` (숫자) 매칭 entry 검색 (없으면 error)
 * 2. `content/series/{slug}/chapters/ep-{NN}.md` fetch (zero-pad 2 자리)
 * 3. frontmatter parse + 본문 markdown render
 *
 * **마스킹 미적용**: 챕터 본문은 작가가 의도적으로 공개한 발행 콘텐츠라 마스킹 X.
 * 미발행 챕터는 manifest.chapters 에서 제외 (작가가 게이트).
 *
 * 호출처: `pages/chapter/chapter.tsx` 의 useAsync.
 */
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

/** 1 자리수 → `0N`. URL 의 ep-01 / ep-02 형식 유지. */
function zeroPad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}
