import {Link} from 'react-router-dom'
import {assetUrl} from '../../shared/lib/env.js'
import type {SeriesIndex} from '../../entities/series'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'

export interface SeriesListProps {
  items: SeriesIndex[]
}

export function SeriesList({items}: Readonly<SeriesListProps>) {
  return (
    <ul className="grid gap-5 m-0 p-0 list-none grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
      {items.map((item) => (
        <SeriesCard key={item.slug} item={item}/>
      ))}
    </ul>
  )
}

function SeriesCard({item}: Readonly<{ item: SeriesIndex }>) {
  const {error, fatal, onError} = useImgFallback()
  let src: string | null
  if (fatal) src = null
  else if (!item.thumbnail || error) src = PLACEHOLDER_THUMB
  else src = assetUrl(`content/${item.thumbnail}`)

  return (
    <li className="list-none">
      <Link
        to={`/series/${item.slug}`}
        className="block bg-surface border border-rule rounded-lg overflow-hidden transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-accent-ring hover:shadow-soft group"
      >
        {src ? (
          <div className="aspect-video bg-bg-soft overflow-hidden">
            <img
              src={src}
              alt=""
              loading="lazy"
              onError={onError}
              className="w-full h-full object-cover block transition-transform duration-280 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div
            className="aspect-video block relative bg-[linear-gradient(135deg,var(--bg-soft),var(--bg-sunken))] after:content-[''] after:absolute after:inset-0 after:bg-[repeating-linear-gradient(45deg,transparent_0_8px,color-mix(in_srgb,var(--rule)_60%,transparent)_8px_9px)] after:opacity-50"
            aria-hidden
          />
        )}
        <div className="flex flex-col gap-2 p-4 px-5 pb-5">
          <span
            className="text-2xl font-bold tracking-[-0.02em] text-fg transition-colors group-hover:text-accent">{item.title}</span>
          {item.description && (
            <p className="m-0 text-sm text-fg-2 leading-[1.55] wrap-anywhere break-keep">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-fg-3 mt-1 flex-wrap">
            <span
              className="inline-block py-0.5 px-2 bg-accent-soft text-accent rounded-pill font-semibold tracking-[0.04em]">{item.status}</span>
            {typeof item.chapterCount === 'number' && (
              <span className="tabular-nums">{item.chapterCount}화</span>
            )}
            {item.started && /^\d{4}-\d{2}-\d{2}$/.test(item.started) && (
              <time dateTime={item.started} className="tabular-nums">시작 {item.started}</time>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}
