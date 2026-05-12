import type {
  CharacterFrontmatter,
  CharacterIndex,
  DocFile,
  SeriesManifest,
} from '../../shared/lib/types.js'
import { parseFrontmatter } from '../../shared/lib/frontmatter.js'
import { renderMarkdown } from '../../shared/lib/markdown.js'
import { fetchMarkdown } from '../../shared/lib/manifest.js'
import { maskSpoilersFromMarkdown, maskSpoilersFromFrontmatter } from '../../shared/lib/spoiler.js'

export interface CharacterPageData {
  frontmatter: CharacterFrontmatter
  bodyHtml: string
  index: CharacterIndex
}

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
  return { frontmatter: maskedFm, bodyHtml: renderMarkdown(maskedBody), index }
}
