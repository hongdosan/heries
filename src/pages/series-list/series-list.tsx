import {type KeyboardEvent as ReactKeyboardEvent} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {
  fetchSeriesIndex,
  fetchSeriesManifest,
  type SeriesIndex,
  type SeriesManifest
} from '../../entities/series'
import {assetUrl} from '../../shared/lib/env.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'
import {Empty, Loading} from '../../shared/ui'
import PLACEHOLDER_IMG from '../../shared/images/thumbnail-placeholder.webp?url'

type ManifestMap = ReadonlyMap<string, SeriesManifest>

/**
 * 시리즈 목록 페이지 (`/series`).
 *
 * **디자인 정합** (2026-05-19 시안 img_1.png):
 * - Breadcrumb (H-eries / 시리즈)
 * - 페이지 헤더 (MULTI-VERSE COLLECTION 캡션 + 시리즈 타이틀 + 통계)
 * - 필터 탭 (전체 / 연재 중 / 완결)
 * - 가로형 카드 (썸네일 + 시놉시스 + 메타 + 자세히 CTA)
 * - Coming soon placeholder
 */
export function SeriesListPage() {
  useDocumentTitle('시리즈')
  // page-level pre-fetch — series.json + 모든 시리즈 manifest 병렬 fetch.
  // 카드 마다 별도 useAsync (N+1) 폐기 → 1 + Promise.all(N) round trip + UI 깜빡임 0.
  const state = useAsync(async () => {
    const index = await fetchSeriesIndex()
    const manifestEntries = await Promise.all(
      index.series.map(async (s) => [s.slug, await fetchSeriesManifest(s.slug)] as const),
    )
    return {items: index.series, metas: new Map(manifestEntries) as ManifestMap}
  }, [])

  if (state.status === 'loading') return <main className={MAIN_CLS}><Loading/></main>
  if (state.status === 'error') return <main className={MAIN_CLS}>
    <Empty>오류: {state.error.message}</Empty></main>

  return <SeriesListContent items={state.data.items} metas={state.data.metas}/>
}

const MAIN_CLS = 'flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9'

type Filter = 'all' | 'ongoing' | 'done'
const FILTER_LABEL: Record<Filter, string> = {all: '전체', ongoing: '연재 중', done: '완결'}
const FILTER_KEYS: ReadonlySet<Filter> = new Set(['all', 'ongoing', 'done'])

function SeriesListContent({items, metas}: Readonly<{ items: SeriesIndex[]; metas: ManifestMap }>) {
  // 정렬 = 시작일 최신 순 (started 내림차순), 미시작은 뒤로.
  // 필터 = URL ?filter=ongoing|done|all (기본 all).
  const [searchParams, setSearchParams] = useSearchParams()
  const rawFilter = searchParams.get('filter') as Filter | null
  const filter: Filter = rawFilter && FILTER_KEYS.has(rawFilter) ? rawFilter : 'all'

  const total = items.length
  const ongoing = items.filter((x) => x.status === '연재 중').length
  const done = items.filter((x) => x.status === '완결').length

  const visible = items
  .filter((x) => {
    if (filter === 'all') return true
    if (filter === 'ongoing') return x.status === '연재 중'
    return x.status === '완결'
  })
  .sort((a, b) => {
    const da = a.started ?? ''
    const db = b.started ?? ''
    return db.localeCompare(da)
  })

  const setFilter = (next: Filter): void => {
    if (next === 'all') setSearchParams({}, {replace: false})
    else setSearchParams({filter: next}, {replace: false})
  }

  // WAI-ARIA tabs 키보드 네비 (자매 슬라이스 series.tsx TabNav 정합) — Arrow/Home/End + roving tabindex.
  const filterList: Filter[] = ['all', 'ongoing', 'done']
  const onTabKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const key = e.key
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return
    e.preventDefault()
    const idx = filterList.indexOf(filter)
    const nextIdx =
      key === 'ArrowLeft' ? (idx - 1 + filterList.length) % filterList.length
      : key === 'ArrowRight' ? (idx + 1) % filterList.length
      : key === 'Home' ? 0
      : filterList.length - 1
    const next = filterList[nextIdx]
    if (!next) return
    setFilter(next)
    requestAnimationFrame(() => document.getElementById(`filter-tab-${next}`)?.focus())
  }

  return (
    <main className={MAIN_CLS}>
      <nav className="text-xs text-fg-3 mb-4" aria-label="경로">
        <Link to="/" className="hover:text-accent">H-eries</Link>
        <span className="mx-2">/</span>
        <span>시리즈</span>
      </nav>

      <header className="mb-10 py-4 border-b border-rule">

        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <h1
            className="m-0 text-[clamp(32px,5vw,56px)] font-normal tracking-[-0.02em] leading-[1.1]">
            시리즈
          </h1>

          <p
            className="m-0 text-xs sm:text-sm font-medium tracking-[0.24em] uppercase text-fg-3">
            Multi-verse Collection
          </p>
        </div>
      </header>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div role="tablist" aria-label="시리즈 필터"
             className="flex items-center gap-1 text-sm" onKeyDown={onTabKey}>
          <FilterTab filter="all" label={FILTER_LABEL.all} count={total} active={filter === 'all'}
                     onSelect={setFilter}/>
          <FilterTab filter="ongoing" label={FILTER_LABEL.ongoing} count={ongoing}
                     active={filter === 'ongoing'} onSelect={setFilter}/>
          <FilterTab filter="done" label={FILTER_LABEL.done} count={done} active={filter === 'done'}
                     onSelect={setFilter}/>
        </div>
        <div className="text-sm text-fg-3">
          <span>최신 순</span>
        </div>
      </div>

      {visible.length === 0 ? (
        <Empty>해당 상태의 시리즈가 아직 없습니다.</Empty>
      ) : (
        <ul className="m-0 p-0 list-none flex flex-col gap-8">
          {visible.map((item, idx) => (
            <SeriesCard key={item.slug} item={item} index={idx + 1}
                        manifest={metas.get(item.slug)}/>
          ))}
          {filter === 'all' && <ComingSoonCard index={visible.length + 1}/>}
        </ul>
      )}

    </main>
  )
}

function FilterTab({
                     filter, label, count, active, onSelect,
                   }: Readonly<{
  filter: Filter;
  label: string;
  count: number;
  active: boolean;
  onSelect: (f: Filter) => void
}>) {
  const cls = active
    ? 'inline-flex flex-col items-center px-4 py-2 border border-rule rounded-full bg-bg-soft text-fg font-semibold transition-colors cursor-pointer'
    : 'inline-flex flex-col items-center px-4 py-2 text-fg-3 hover:text-accent rounded-full transition-colors cursor-pointer'
  return (
    <button
      type="button"
      id={`filter-tab-${filter}`}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(filter)}
      className={cls}
    >
      <span className="text-sm">{label}</span>
      <span className="text-xs tabular-nums">{count}</span>
    </button>
  )
}

function SeriesCard({item, index, manifest}: Readonly<{
  item: SeriesIndex;
  index: number;
  manifest: SeriesManifest | undefined
}>) {
  const cover = useImgFallback()
  let src: string | null
  if (cover.fatal) src = null
  else if (!item.thumbnail || cover.error) src = PLACEHOLDER_THUMB
  else src = assetUrl(`content/${item.thumbnail}`)

  const ongoing = item.status === '연재 중'

  // 최근 갱신일 = manifest.chapters 중 published 최댓값. page-level pre-fetch (props 전달) — N+1 fetch 폐기.
  let recent: string | undefined
  let chapterCount: number | undefined
  if (manifest) {
    const chapters = manifest.chapters
    chapterCount = chapters.length
    if (chapters.length > 0) {
      const dates = chapters
      .map((c) => c.published)
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort((a, b) => a.localeCompare(b))
      recent = dates.at(-1)
    }
  }
  if (typeof chapterCount !== 'number') chapterCount = item.chapterCount

  return (
    <li>
      <Link
        to={`/series/${item.slug}`}
        className="grid grid-cols-[minmax(0,1fr)_2fr] gap-7 p-2 -m-2 rounded-lg transition-colors hover:bg-bg-soft group max-md:grid-cols-1 max-md:gap-4"
      >
        <div className="aspect-4/3 bg-bg-sunken border border-rule rounded-md overflow-hidden">
          {src ? (
            <img
              src={src}
              alt=""
              loading="lazy"
              onError={cover.onError}
              className="w-full h-full object-cover block transition-transform duration-280 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="w-full h-full bg-[linear-gradient(135deg,var(--bg-soft),var(--bg-sunken))]"/>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-3 flex-wrap text-xs text-fg-3">
            <span
              className="font-mono font-semibold tracking-[0.16em] uppercase">Series {String(index).padStart(2, '0')}</span>
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${ongoing ? 'bg-emerald-500' : 'bg-fg-4'}`}
                aria-hidden/>
              <span>{item.status}</span>
            </span>
          </div>

          <h2
            className="m-0 text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.01em] text-fg group-hover:text-accent transition-colors">
            {item.title}
          </h2>

          {item.description && (
            <p className="m-0 text-md text-fg-2 leading-[1.55] break-keep">
              {item.description}
            </p>
          )}

          <div
            className="flex items-center gap-x-4 gap-y-1 text-xs text-fg-3 flex-wrap mt-1 tabular-nums">
            {typeof chapterCount === 'number' && (
              <span className="inline-flex items-baseline gap-1">
                <span className="text-fg-4">화</span>
                <span className="text-fg-2 font-medium">{chapterCount}</span>
              </span>
            )}
            {item.started && /^\d{4}-\d{2}-\d{2}$/.test(item.started) && (
              <span className="inline-flex items-baseline gap-1">
                <span className="text-fg-4">시작</span>
                <time dateTime={item.started}
                      className="text-fg-2 font-medium">{item.started}</time>
              </span>
            )}
            {recent && (
              <span className="inline-flex items-baseline gap-1">
                <span className="text-fg-4">최근</span>
                <time dateTime={recent} className="text-fg-2 font-medium">{recent.slice(5)}</time>
              </span>
            )}
          </div>

          <p className="m-0 mt-1 text-sm text-fg-3 group-hover:text-accent transition-colors">
            자세히 <span aria-hidden>→</span>
          </p>
        </div>
      </Link>
    </li>
  )
}

function ComingSoonCard({index}: Readonly<{ index: number }>) {
  return (
    <li>
      <div
        className="grid grid-cols-[minmax(0,1fr)_2fr] gap-7 p-2 -m-2 rounded-lg opacity-70 max-md:grid-cols-1 max-md:gap-4">
        <div
          className="aspect-4/3 bg-bg-soft border border-rule rounded-md relative overflow-hidden">
          {/* 임시 = thumbnail-placeholder (H-eries 컬렉션 hero). 실제 시리즈 cover 결정 후 교체. */}
          <img
            src={PLACEHOLDER_IMG}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="flex flex-col gap-3 min-w-0 justify-center">
          <div className="flex items-center gap-3 text-xs text-fg-3">
            <span
              className="font-mono font-semibold tracking-[0.16em] uppercase">Series {String(index).padStart(2, '0')}</span>
            <span className="italic text-fg-4">Coming soon</span>
          </div>

          <h2 className="m-0 text-[clamp(20px,2.5vw,28px)] font-bold tracking-[-0.01em] text-fg-3">
            다음 시리즈
          </h2>

          <p className="m-0 text-sm text-fg-3 leading-[1.55] break-keep">
            새로운 세계가 곧 열립니다. 컬렉션은 계속 확장됩니다.
          </p>
        </div>
      </div>
    </li>
  )
}
