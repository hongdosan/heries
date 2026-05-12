import { Link } from 'react-router-dom'
import type { CharacterFolder, CharacterIndex } from '../../shared/lib/types.js'

const GROUP_ORDER: ReadonlyArray<{ folder: CharacterFolder; label: string }> = [
  { folder: '1-protagonist', label: '주인공' },
  { folder: '1-main-character', label: '주인공' },
  { folder: '2-major-supporting', label: '주연' },
  { folder: '3-supporting', label: '조연' },
]

export interface CharacterListProps {
  slug: string
  characters: CharacterIndex[]
}

export function CharacterList({ slug, characters }: Readonly<CharacterListProps>) {
  return (
    <section>
      {GROUP_ORDER.map(({ folder, label }) => {
        const members = characters.filter((c) => c.folder === folder)
        if (members.length === 0) return null
        return (
          <div key={folder} className="character-group">
            <h3>{label}</h3>
            <ul className="character-list">
              {members.map((ch) => (
                <li key={ch.id}>
                  <Link to={`/series/${slug}/character/${ch.id}`}>{ch.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
