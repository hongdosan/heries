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
    <section>
      {GROUP_ORDER.map(({folder, label}) => {
        const members = characters.filter((c) => c.folder === folder)
        if (members.length === 0) return null
        return (
          <div key={folder} className="m-0 mb-6">
            <h3 className="text-sm font-medium text-fg-3 uppercase tracking-[0.08em] m-0 mb-3">{label}</h3>
            <ul className="list-none p-0 m-0 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
              {members.map((ch) => {
                const linkable = isAuthor || ch.folder === '1-protagonist'
                const summary = ch.summary ?? (linkable ? '' : '— 본 캐릭터의 상세는 작가 모드에서 열람.')
                return (
                  <li
                    key={ch.id}
                    className="bg-surface border border-rule rounded-md p-0 transition-[transform,border-color,box-shadow] has-[a]:hover:-translate-y-0.5 has-[a]:hover:border-accent-ring has-[a]:hover:shadow-soft group"
                  >
                    {linkable ? (
                      <Link
                        to={`/series/${slug}/character/${ch.id}`}
                        className="flex flex-col gap-1 p-3 px-4 rounded-md text-fg no-underline"
                      >
                        <span className="text-md font-medium text-fg transition-colors group-hover:text-accent">{ch.name}</span>
                        {summary && <span className="text-xs text-fg-3 leading-[1.5]">{summary}</span>}
                      </Link>
                    ) : (
                      <div
                        className="flex flex-col gap-1 p-3 px-4 rounded-md text-fg-2"
                        aria-label={`${ch.name} — 작가 모드에서 상세 열람`}
                      >
                        <span className="text-md font-medium text-fg-2">{ch.name}</span>
                        {summary && <span className="text-xs text-fg-3 leading-[1.5]">{summary}</span>}
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
