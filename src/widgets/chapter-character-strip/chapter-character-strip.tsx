import {Link} from 'react-router-dom'
import {loadCharacter} from '../../entities/character/index.js'
import {useAsync} from '../../shared/lib/use-async.js'
import type {CharacterIndex, SeriesManifest} from '../../shared/lib/types.js'

export interface ChapterCharacterStripProps {
  slug: string
  manifest: SeriesManifest
  /** Slugs from chapter frontmatter `characters: [...]` — order preserved. */
  characterIds: string[]
}

interface StripItem {
  id: string
  folder: string
  name: string
  /** Reader-safe gloss — summary preferred, origin (work title only) as fallback. */
  blurb: string
  /** Full text (untruncated) for hover/long-press tooltip. */
  blurbFull: string
  /** Origin work title (always present if origin exists) — secondary line. */
  workTitle: string
}

/**
 * "이 챕터에 등장하는 인물" 미니 strip.
 *
 * Reader-safe: only `summary` (1~3줄 한입 요약) + 원작 작품명 + 이름 + 카드 링크.
 * heries 분기 절·heries_arc 는 loadCharacter() 가 reader 빌드에서 이미 마스킹 후
 * 반환하므로 본 컴포넌트는 frontmatter.heries_arc / heries 분기 본문에 절대
 * 접근하지 않는다.
 */
export function ChapterCharacterStrip({
                                        slug,
                                        manifest,
                                        characterIds
                                      }: Readonly<ChapterCharacterStripProps>) {
  const state = useAsync(async () => {
    const items: StripItem[] = []
    for (const id of characterIds) {
      const idx: CharacterIndex | undefined = manifest.characters.find((c) => c.id === id)
      if (!idx) continue
      try {
        const data = await loadCharacter(slug, id, manifest)
        const fm = data.frontmatter
        const workTitle = shortenOrigin(String(fm.origin || ''))
        const summary = String(fm.summary || '').trim()
        const blurbFull = summary || workTitle
        items.push({
          id,
          folder: idx.folder,
          name: String(fm.name || idx.name),
          blurb: blurbFull,
          blurbFull,
          workTitle,
        })
      } catch {
        // graceful degradation — skip missing/malformed cards
      }
    }
    return items
  }, [slug, characterIds.join(',')])

  if (state.status === 'loading' || state.status === 'error') return null
  if (state.data.length === 0) return null

  return (
    <section className="chapter-character-strip" aria-label="이 챕터 등장인물">
      <h2 className="strip-title">이 챕터 등장인물</h2>
      <ol className="strip-list">
        {state.data.map((it) => (
          <li key={it.id} className="strip-item">
            <Link
              to={`/series/${slug}/character/${it.id}`}
              className="strip-card"
              title={it.blurbFull}
            >
              <span className="strip-thumb" aria-hidden/>
              <span className="strip-text">
                <span className="strip-name">{it.name}</span>
                {it.workTitle && <span className="strip-origin">{it.workTitle}</span>}
                {it.blurb && it.blurb !== it.workTitle && (
                  <span className="strip-blurb">{it.blurb}</span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** 긴 origin 1줄 (작품명 + 작가·플랫폼 등) 에서 *작품명만* 추출. */
function shortenOrigin(origin: string): string {
  if (!origin) return ''
  // Cut at the first em-dash, en-dash, paren, or bracket — these mark the
  // boundary between the work title and meta (writer, platform, etc.).
  const m = origin.match(/^([^—–\-(\[]+)/)
  const head = (m ? m[1] : origin).trim()
  // Drop trailing comma/colon noise
  return head.replace(/[,:;\s]+$/, '')
}
