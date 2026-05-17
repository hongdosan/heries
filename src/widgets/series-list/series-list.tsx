import { Link } from 'react-router-dom'
import { assetUrl } from '../../shared/lib/env.js'
import type { SeriesIndex } from '../../shared/lib/types.js'
import { useImgFallback, PLACEHOLDER_THUMB } from '../../shared/lib/use-img-fallback.js'

export interface SeriesListProps {
  items: SeriesIndex[]
}

export function SeriesList({ items }: SeriesListProps) {
  return (
    <ul className="grid gap-5 m-0 p-0 list-none [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
      {items.map((item) => (
        <SeriesCard key={item.slug} item={item} />
      ))}
    </ul>
  )
}

function SeriesCard({ item }: { item: SeriesIndex }) {
  const { error, fatal, onError } = useImgFallback()
  const src = fatal
    ? null
    : !item.thumbnail || error
      ? PLACEHOLDER_THUMB
      : assetUrl(`content/${item.thumbnail}`)

  return (
    <li className="list-none">
      <Link
        to={`/series/${item.slug}`}
        className="block bg-surface border border-rule rounded-lg overflow-hidden transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-accent-ring hover:shadow-soft group"
      >
        {src ? (
          <div className="aspect-[16/9] bg-bg-soft overflow-hidden">
            <img
              src={src}
              alt=""
              loading="lazy"
              onError={onError}
              className="w-full h-full object-cover block transition-transform duration-[280ms] group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div
            className="aspect-[16/9] block relative bg-[linear-gradient(135deg,var(--bg-soft),var(--bg-sunken))] after:content-[''] after:absolute after:inset-0 after:bg-[repeating-linear-gradient(45deg,transparent_0_8px,color-mix(in_srgb,var(--rule)_60%,transparent)_8px_9px)] after:opacity-50"
            aria-hidden
          />
        )}
        <div className="flex flex-col gap-2 p-4 px-5 pb-5">
          <span className="text-2xl font-bold tracking-[-0.02em] text-fg transition-colors group-hover:text-accent">{item.title}</span>
          <span className="text-xs text-fg-3 uppercase tracking-[0.08em] font-medium">{item.status}</span>
        </div>
      </Link>
    </li>
  )
}
