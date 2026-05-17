import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from '../../shared/lib/env.js'
import type { ChapterIndex } from '../../shared/lib/types.js'
import { useImgFallback, PLACEHOLDER_THUMB } from '../../shared/lib/use-img-fallback.js'
import { cn } from '../../shared/lib/cn.js'

export interface ChapterTocProps {
  slug: string
  chapters: ChapterIndex[]
}

type Order = 'desc' | 'asc'

const SORT_KEY = 'heries:chapter-sort-order'

function readSavedOrder(): Order {
  try {
    const v = localStorage.getItem(SORT_KEY)
    return v === 'asc' || v === 'desc' ? v : 'desc'
  } catch {
    return 'desc'
  }
}

export function ChapterToc({ slug, chapters }: ChapterTocProps) {
  const [order, setOrder] = useState<Order>(() => readSavedOrder())

  useEffect(() => {
    try {
      localStorage.setItem(SORT_KEY, order)
    } catch {
      // localStorage 비활성 환경 — silent
    }
  }, [order])

  if (chapters.length === 0) {
    return <p className="empty">아직 등록된 챕터가 없습니다. 작품 진행에 따라 추가됩니다.</p>
  }

  const sorted = [...chapters].sort((a, b) =>
    order === 'desc' ? b.episode - a.episode : a.episode - b.episode,
  )

  return (
    <>
      <div className="flex justify-end m-0 mb-3">
        <div
          role="group"
          aria-label="챕터 정렬"
          className="inline-flex p-1 border border-rule rounded-pill bg-bg-soft gap-1"
        >
          <button
            type="button"
            className={cn(
              'px-3 py-1 text-sm rounded-pill transition-[color,background,box-shadow]',
              order === 'desc'
                ? 'bg-accent text-white font-semibold shadow-soft'
                : 'text-fg-3 hover:text-fg-2 hover:bg-bg-sunken',
            )}
            aria-pressed={order === 'desc'}
            onClick={() => setOrder('desc')}
          >최신순</button>
          <button
            type="button"
            className={cn(
              'px-3 py-1 text-sm rounded-pill transition-[color,background,box-shadow]',
              order === 'asc'
                ? 'bg-accent text-white font-semibold shadow-soft'
                : 'text-fg-3 hover:text-fg-2 hover:bg-bg-sunken',
            )}
            aria-pressed={order === 'asc'}
            onClick={() => setOrder('asc')}
          >연재순</button>
        </div>
      </div>
      <ul className="list-none p-0 m-0">
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
      : assetUrl(`content/series/${slug}/${ch.thumbnail}`)

  return (
    <li className="border-b border-rule first:border-t">
      <Link
        to={`/series/${slug}/chapter/${ch.episode}`}
        className="grid grid-cols-[96px_56px_1fr_auto] items-center gap-4 p-3 transition-colors hover:bg-bg-soft group max-sm:grid-cols-[96px_1fr]"
      >
        {src ? (
          <img
            className="w-24 h-[54px] object-cover rounded-sm bg-bg-soft block max-sm:row-span-3 max-sm:w-20 max-sm:h-[45px]"
            src={src}
            alt=""
            loading="lazy"
            onError={onError}
          />
        ) : (
          <span
            className="w-24 h-[54px] rounded-sm bg-[linear-gradient(135deg,var(--bg-soft),var(--bg-sunken))] border border-rule block max-sm:row-span-3 max-sm:w-20 max-sm:h-[45px]"
            aria-hidden
          />
        )}
        <span className="font-mono text-sm text-fg-4 tabular-nums tracking-[0.04em] max-sm:col-start-2 max-sm:self-end">EP {String(ch.episode).padStart(2, '0')}</span>
        <span className="text-md font-medium text-fg transition-colors group-hover:text-accent max-sm:col-start-2">{ch.title}</span>
        <time className="text-xs text-fg-3 tabular-nums whitespace-nowrap max-sm:col-start-2" dateTime={ch.published}>{ch.published}</time>
      </Link>
    </li>
  )
}
