import type {DocFile} from '../../../shared/lib/types.js'
import {parseFrontmatter} from '../../../shared/lib/frontmatter.js'
import {renderMarkdown} from '../../../shared/lib/markdown.js'
import {fetchMarkdown} from '../../../shared/api/markdown.js'
import {maskSpoilersFromFrontmatter, maskSpoilersFromMarkdown} from '../../../shared/lib/spoiler.js'
import type {SeriesManifest} from '../../series'
import type {CharacterFrontmatter, CharacterPageData} from '../model/types.js'

/**
 * 캐릭터 상세 페이지 데이터 로더.
 *
 * **흐름**:
 * 1. manifest.characters 에서 `characterId` 매칭 entry 검색 (없으면 error)
 * 2. `content/series/{slug}/characters/{folder}/{id}.md` fetch
 * 3. frontmatter parse + 본문 markdown render
 *
 * **스포일러 마스킹** (작가 모드 OFF 시):
 * - body: `## H-eries 분기 — ` 이하 모든 절 차단
 * - frontmatter: `heries_arc` 필드 차단
 *
 * **추가 차단** (라우터 레벨): 주인공 (`1-protagonist`) 외 카드는 작가 모드 OFF 시
 * 페이지 진입 자체 차단 (정책 #9 v2 (d)). 본 loader 는 이미 진입 통과한 경우만 호출.
 *
 * 호출처: `pages/character/character.tsx` 의 useAsync.
 */
export async function loadCharacter(
  slug: string,
  characterId: string,
  manifest: SeriesManifest,
): Promise<CharacterPageData> {
  const index = manifest.characters.find((c) => c.id === characterId)
  if (!index) {
    throw new Error(`character not found in manifest: ${slug} / ${characterId}`)
  }
  const path = `./content/series/${slug}/characters/${index.folder}/${index.id}.md`
  const raw = await fetchMarkdown(path)
  const doc: DocFile<CharacterFrontmatter> = parseFrontmatter<CharacterFrontmatter>(raw)
  const maskedBody = maskSpoilersFromMarkdown(doc.body, 'character')
  const maskedFm = maskSpoilersFromFrontmatter(doc.frontmatter, 'character')
  return {frontmatter: maskedFm, bodyHtml: renderMarkdown(maskedBody), index}
}
