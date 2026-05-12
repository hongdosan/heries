import { Link } from 'react-router-dom'
import { assetUrl } from '../../shared/lib/env.js'
import type { SeriesIndex } from '../../shared/lib/types.js'
import { useImgFallback, PLACEHOLDER_THUMB } from '../../shared/lib/use-img-fallback.js'

export interface SeriesListProps {
  items: SeriesIndex[]
}

export function SeriesList({ items }: SeriesListProps) {
  return (
    <ul className="series-grid">
      {items.map((item) => (
        <SeriesCard key={item.slug} item={item} />
      ))}
    </ul>
  )
}

function SeriesCard({ item }: { item: SeriesIndex }) {
  const { error, fatal, onError } = useImgFallback()
  // 작품 커버 이미지 없으면 placeholder 를 기본값으로.
  const src = fatal
    ? null
    : !item.thumbnail || error
      ? PLACEHOLDER_THUMB
      : assetUrl(`content/${item.thumbnail}`)

  return (
    <li>
      <Link to={`/series/${item.slug}`} className="series-card">
        {src ? (
          <div className="series-card-thumb">
            <img src={src} alt="" loading="lazy" onError={onError} />
          </div>
        ) : (
          <div className="series-card-thumb series-card-thumb-empty" aria-hidden />
        )}
        <div className="series-card-body">
          <span className="series-card-title">{item.title}</span>
          <span className="status">{item.status}</span>
        </div>
      </Link>
    </li>
  )
}
