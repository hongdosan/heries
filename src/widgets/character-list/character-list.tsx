import {Link} from 'react-router-dom'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import type {CharacterFolder, CharacterIndex} from '../../entities/character'

/**
 * 등장인물 카드 그룹 순서 — 4 폴더 (worldbuilding/character-doctrine 정합).
 *
 * 폴더는 파일시스템 prefix 로 정렬 보장 (`1-` → `4-`).
 * 그룹 라벨 = reader 가 카드 분류 인식 (주인공 / 주연 / 빌런 / 단역).
 */
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

/**
 * 시리즈의 등장인물 목록 (series 페이지의 *등장인물* 탭).
 *
 * **정책 (character-doctrine SSOT)**:
 * - **reader** = *주인공* 카드만 상세 페이지 (`/series/.../character/:id`) 진입 가능.
 *   그 외 (주연/빌런/단역) = 이름 + 한 줄 소개만 노출 (스포일러 차단).
 * - **작가 모드** (sessionStorage `heries:author=1`) = 모든 카드 진입 가능.
 *
 * **레이아웃**: 그룹 (h3) + 카드 그리드 (`auto-fill, minmax(240px, 1fr)`).
 * 빈 그룹 (members.length === 0) 은 렌더 X.
 */
export function CharacterList({slug, characters}: Readonly<CharacterListProps>) {
  // 작가 모드 활성 여부 — sessionStorage flag 구독.
  // 작가가 /unlock 에서 키 입력 시 본 hook 이 자동 재 render → 모든 카드 Link 화.
  const isAuthor = useAuthorMode()

  return (
    <section>
      {GROUP_ORDER.map(({folder, label}) => {
        const members = characters.filter((c) => c.folder === folder)
        // 빈 그룹 = 헤더·카드 모두 숨김 (시각 노이즈 차단).
        if (members.length === 0) return null
        return (
          <div key={folder} className="m-0 mb-6">
            <h3 className="text-sm font-medium text-fg-3 uppercase tracking-[0.08em] m-0 mb-3">{label}</h3>
            <ul className="list-none p-0 m-0 grid gap-3 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              {members.map((ch) => {
                // 진입 가능 = 작가 모드 OR 주인공. 그 외 = 잠긴 카드.
                const linkable = isAuthor || ch.folder === '1-protagonist'
                // 잠긴 카드 = manifest summary 없으면 안내 문구 자동 채움.
                const summary = ch.summary ?? (linkable ? '' : '— 본 캐릭터의 상세는 작가 모드에서 열람.')
                return (
                  <li
                    key={ch.id}
                    // has-[a]:hover = 자식에 <a> 있을 때만 hover 효과 (잠긴 카드는 hover 정적).
                    className="bg-surface border border-rule rounded-md p-0 transition-[transform,border-color,box-shadow] has-[a]:hover:-translate-y-0.5 has-[a]:hover:border-accent-ring has-[a]:hover:shadow-soft group"
                  >
                    {linkable ? (
                      <Link
                        to={`/series/${slug}/character/${ch.id}`}
                        className="flex flex-col gap-1 p-3 px-4 rounded-md text-fg no-underline"
                      >
                        <span className="text-md font-medium text-fg transition-colors group-hover:text-accent">{ch.name}</span>
                        {summary && <span className="text-xs text-fg-3 leading-normal">{summary}</span>}
                      </Link>
                    ) : (
                      <div
                        className="flex flex-col gap-1 p-3 px-4 rounded-md text-fg-2"
                        aria-label={`${ch.name} — 작가 모드에서 상세 열람`}
                      >
                        <span className="text-md font-medium text-fg-2">{ch.name}</span>
                        {summary && <span className="text-xs text-fg-3 leading-normal">{summary}</span>}
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
