import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ChapterIndex } from '../../shared/lib/types.js'
import { useImgFallback, PLACEHOLDER_THUMB } from '../../shared/lib/use-img-fallback.js'

export interface ChapterTocProps {
  slug: string
  chapters: ChapterIndex[]
}

type Order = 'desc' | 'asc'

export function ChapterToc({ slug, chapters }: ChapterTocProps) {
  const [order, setOrder] = useState<Order>('desc')

  if (chapters.length === 0) {
    return <p className="empty">아직 등록된 챕터가 없습니다. 작품 진행에 따라 추가됩니다.</p>
  }

  const sorted = [...chapters].sort((a, b) =>
    order === 'desc' ? b.episode - a.episode : a.episode - b.episode,
  )

  return (
    <>
      <div className="chapter-toc-toolbar">
        <div role="group" aria-label="챕터 정렬" className="sort-toggle">
          <button
            type="button"
            className={order === 'desc' ? 'is-active' : ''}
            aria-pressed={order === 'desc'}
            onClick={() => setOrder('desc')}
          >
            최신순
          </button>
          <button
            type="button"
            className={order === 'asc' ? 'is-active' : ''}
            aria-pressed={order === 'asc'}
            onClick={() => setOrder('asc')}
          >
            연재순
          </button>
        </div>
      </div>
      <ul className="chapter-list">
        {sorted.map((ch) => (
          <ChapterRow key={ch.episode} slug={slug} ch={ch} />
        ))}
      </ul>
    </>
  )
}

function ChapterRow({ slug, ch }: { slug: string; ch: ChapterIndex }) {
  const { error, fatal, onError } = useImgFallback()
  const src = !ch.thumbnail || fatal
    ? null
    : error
      ? PLACEHOLDER_THUMB
      : `./content/series/${slug}/${ch.thumbnail}`

  return (
    <li>
      <Link to={`/series/${slug}/chapter/${ch.episode}`} className="chapter-row">
        {src ? (
          <img className="chapter-thumb" src={src} alt="" loading="lazy" onError={onError} />
        ) : (
          <span className="chapter-thumb chapter-thumb-empty" aria-hidden />
        )}
        <span className="ep">EP {String(ch.episode).padStart(2, '0')}</span>
        <span className="chapter-title">{ch.title}</span>
        <time className="pub" dateTime={ch.published}>{ch.published}</time>
      </Link>
    </li>
  )
}
