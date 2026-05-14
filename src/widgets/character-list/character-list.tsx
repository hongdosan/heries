import {Link} from 'react-router-dom'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import type {CharacterFolder, CharacterIndex} from '../../shared/lib/types.js'

const GROUP_ORDER: ReadonlyArray<{ folder: CharacterFolder; label: string }> = [
  {folder: '1-protagonist', label: '주인공'},
  {folder: '2-major-supporting', label: '주연'},
  {folder: '3-antagonist', label: '빌런·멘토'},
  {folder: '4-minor', label: '단역·카메오'},
]

export interface CharacterListProps {
  slug: string
  characters: CharacterIndex[]
}

// 정책 (character-doctrine): reader 는 주인공 카드만 상세 페이지로 진입 가능.
// 그 외 캐릭터는 이름 + 한 줄 소개 카드만 노출 (스포일러 방지). 작가 모드면 모두 진입 가능.
export function CharacterList({slug, characters}: Readonly<CharacterListProps>) {
  const isAuthor = useAuthorMode()
  return (
    <section className="character-list-section">
      {GROUP_ORDER.map(({folder, label}) => {
        const members = characters.filter((c) => c.folder === folder)
        if (members.length === 0) return null
        return (
          <div key={folder} className="character-group">
            <h3>{label}</h3>
            <ul className="character-card-grid">
              {members.map((ch) => {
                const linkable = isAuthor || ch.folder === '1-protagonist'
                const summary = ch.summary ?? (linkable ? '' : '— 본 캐릭터의 상세는 작가 모드에서 열람.')
                return (
                  <li key={ch.id} className="character-card">
                    {linkable ? (
                      <Link to={`/series/${slug}/character/${ch.id}`} className="character-card-link">
                        <span className="character-card-name">{ch.name}</span>
                        {summary && <span className="character-card-summary">{summary}</span>}
                      </Link>
                    ) : (
                      <div className="character-card-static" aria-label={`${ch.name} — 작가 모드에서 상세 열람`}>
                        <span className="character-card-name">{ch.name}</span>
                        {summary && <span className="character-card-summary">{summary}</span>}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
