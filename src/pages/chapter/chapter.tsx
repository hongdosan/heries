import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {loadChapter} from '../../entities/chapter'
import {assetUrl} from '../../shared/lib/env.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {fetchSeriesManifest} from '../../shared/lib/manifest.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'
import {extractOutline} from '../../shared/lib/markdown.js'
import type {ChapterIndex} from '../../shared/lib/types.js'
import {Empty} from '../../shared/ui/empty'
import {Loading} from '../../shared/ui/loading'

// 본문이 viewport 보다 길어야 scroll-nav 표시 (스크롤 가치).
function useIsScrollable(): boolean {
  const [scrollable, setScrollable] = useState<boolean>(false)
  useEffect(() => {
    const check = (): void => {
      setScrollable(document.documentElement.scrollHeight > window.innerHeight + 80)
    }
    check()
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(check)
      : null
    ro?.observe(document.documentElement)
    window.addEventListener('resize', check)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [])
  return scrollable
}

export function ChapterPage() {
  const {slug = '', episode = ''} = useParams<{ slug: string; episode: string }>()
  const cover = useImgFallback()
  const isScrollable = useIsScrollable()

  const state = useAsync(async () => {
    const manifest = await fetchSeriesManifest(slug)
    const data = await loadChapter(slug, episode, manifest)
    return {manifest, data}
  }, [slug, episode])

  const chapterTitle = state.status === 'success'
    ? `${state.data.data.frontmatter.title || state.data.data.index.title} · ${state.data.manifest.title}`
    : ''
  useDocumentTitle(chapterTitle)

  if (state.status === 'loading') return <main className="page-chapter"><Loading /></main>
  if (state.status === 'error') return <main className="page-chapter"><Empty>오류: {state.error.message}</Empty></main>

  const {manifest, data} = state.data
  const sorted = [...manifest.chapters].sort((a, b) => a.episode - b.episode)
  const idx = sorted.findIndex((c) => c.episode === Number(episode))
  const prev: ChapterIndex | undefined = idx > 0 ? sorted[idx - 1] : undefined
  const next: ChapterIndex | undefined = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined
  let heroSrc: string | null
  if (!data.index.thumbnail || cover.fatal) heroSrc = null
  else if (cover.error) heroSrc = PLACEHOLDER_THUMB
  else heroSrc = assetUrl(`content/series/${slug}/${data.index.thumbnail}`)

  return (
    <main className="page-chapter">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to={`/series/${slug}`}>{manifest.title}</Link><span className="sep">/</span>
        <span>ep {episode}</span>
      </nav>

      {heroSrc && (
        <figure className="m-0 mb-5 w-full aspect-[16/9] rounded-lg overflow-hidden bg-bg-soft border border-rule shadow-soft">
          <img src={heroSrc} alt="" loading="eager" onError={cover.onError} className="block w-full h-full object-cover" />
        </figure>
      )}

      <header className="mb-5 pb-3 border-b border-rule">
        <p className="m-0 mb-2 font-mono text-xs font-semibold tracking-[0.16em] uppercase text-accent">EP&nbsp;{String(data.index.episode).padStart(2, '0')}</p>
        <h1 className="m-0">{data.frontmatter.title || data.index.title}</h1>
        {data.index.published && (
          <p className="m-0 mt-2 text-xs text-fg-4 font-mono tabular-nums">
            <time dateTime={data.index.published}>{data.index.published}</time>
          </p>
        )}
      </header>

      {(() => {
        const outline = extractOutline(data.bodyHtml, 2)
        if (outline.length < 2) return null
        return (
          <details className="mb-5 p-3 px-4 bg-bg-soft border border-rule rounded-md group">
            <summary className="cursor-pointer font-semibold text-sm text-fg-2 tracking-[0.02em] list-none inline-flex items-center gap-2 [&::-webkit-details-marker]:hidden before:content-['▸'] before:text-xs before:text-fg-3 before:transition-transform group-open:before:rotate-90">
              목차 · {outline.length}개 절
            </summary>
            <ol className="mt-3 pl-5 text-sm text-fg-3 list-decimal">
              {outline.map((h) => (
                <li key={h.id} className="my-2">
                  <a
                    href={`#${h.id}`}
                    className="text-fg-2 no-underline border-b border-transparent transition-[color,border-color] hover:text-accent hover:border-accent-ring"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >{h.text}</a>
                </li>
              ))}
            </ol>
          </details>
        )
      })()}

      <article
        className="article article-prose"
        dangerouslySetInnerHTML={{__html: data.bodyHtml}}
      />

      <nav className="grid grid-cols-2 gap-3 mt-8 pt-5 border-t border-rule max-sm:grid-cols-1" aria-label="에피소드 이동">
        {prev ? (
          <Link to={`/series/${slug}/chapter/${prev.episode}`} className="flex flex-col gap-1 p-4 px-5 bg-surface border border-rule rounded-md text-fg-2 transition-[transform,border-color,box-shadow] hover:-translate-y-px hover:border-accent-ring hover:shadow-soft no-underline">
            <span className="text-xs text-accent font-semibold tracking-[0.06em] uppercase">← 이전 화</span>
            <span className="text-md text-fg font-medium">ep {prev.episode} · {prev.title}</span>
          </Link>
        ) : <span className="block"/>}
        {next ? (
          <Link to={`/series/${slug}/chapter/${next.episode}`} className="flex flex-col gap-1 p-4 px-5 bg-surface border border-rule rounded-md text-fg-2 text-right transition-[transform,border-color,box-shadow] hover:-translate-y-px hover:border-accent-ring hover:shadow-soft no-underline">
            <span className="text-xs text-accent font-semibold tracking-[0.06em] uppercase">다음 화 →</span>
            <span className="text-md text-fg font-medium">ep {next.episode} · {next.title}</span>
          </Link>
        ) : <span className="block"/>}
      </nav>

      <p className="text-center mt-5 text-sm">
        <Link to={`/series/${slug}?tab=chapters`} className="text-fg-3 hover:text-accent">← 목차로 돌아가기</Link>
      </p>

      {isScrollable && (
        <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2" aria-label="페이지 이동">
          <button
            type="button"
            className="w-11 h-11 rounded-full bg-surface border border-rule text-fg-2 text-lg cursor-pointer shadow-soft transition-[color,background,border-color,transform] hover:text-accent hover:border-accent hover:bg-bg-soft hover:-translate-y-px"
            aria-label="맨 위로"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >↑</button>
          <button
            type="button"
            className="w-11 h-11 rounded-full bg-surface border border-rule text-fg-2 text-lg cursor-pointer shadow-soft transition-[color,background,border-color,transform] hover:text-accent hover:border-accent hover:bg-bg-soft hover:-translate-y-px"
            aria-label="맨 아래로"
            onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
          >↓</button>
        </div>
      )}
    </main>
  )
}
