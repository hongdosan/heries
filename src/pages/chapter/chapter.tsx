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
  const heroSrc = !data.index.thumbnail || cover.fatal
    ? null
    : cover.error
      ? PLACEHOLDER_THUMB
      : assetUrl(`content/series/${slug}/${data.index.thumbnail}`)

  return (
    <main className="page-chapter">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to={`/series/${slug}`}>{manifest.title}</Link><span className="sep">/</span>
        <span>ep {episode}</span>
      </nav>

      {heroSrc && (
        <figure className="chapter-cover">
          <img src={heroSrc} alt="" loading="eager" onError={cover.onError}/>
        </figure>
      )}

      <header className="chapter-hero">
        <p className="ep-tag">EP&nbsp;{String(data.index.episode).padStart(2, '0')}</p>
        <h1>{data.frontmatter.title || data.index.title}</h1>
        {data.index.published && (
          <p className="chapter-meta">
            <time dateTime={data.index.published}>{data.index.published}</time>
          </p>
        )}
      </header>

      {(() => {
        const outline = extractOutline(data.bodyHtml, 2)
        // 1 절 이하는 목차 가치 작음 — 2 절부터 노출.
        if (outline.length < 2) return null
        return (
          <details className="chapter-outline">
            <summary>목차 · {outline.length}개 절</summary>
            <ol>
              {outline.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(h.id)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }}
                  >
                    {h.text}
                  </a>
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

      <nav className="chapter-nav" aria-label="에피소드 이동">
        {prev ? (
          <Link to={`/series/${slug}/chapter/${prev.episode}`} className="chapter-nav-link prev">
            <span className="dir">← 이전 화</span>
            <span className="title">ep {prev.episode} · {prev.title}</span>
          </Link>
        ) : <span className="chapter-nav-spacer"/>}
        {next ? (
          <Link to={`/series/${slug}/chapter/${next.episode}`} className="chapter-nav-link next">
            <span className="dir">다음 화 →</span>
            <span className="title">ep {next.episode} · {next.title}</span>
          </Link>
        ) : <span className="chapter-nav-spacer"/>}
      </nav>

      <p className="chapter-back">
        <Link to={`/series/${slug}?tab=chapters`}>← 목차로 돌아가기</Link>
      </p>

      {isScrollable && (
        <div className="scroll-nav" aria-label="페이지 이동">
          <button
            type="button"
            className="scroll-nav-btn"
            aria-label="맨 위로"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            ↑
          </button>
          <button
            type="button"
            className="scroll-nav-btn"
            aria-label="맨 아래로"
            onClick={() => window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth'
            })}
          >
            ↓
          </button>
        </div>
      )}
    </main>
  )
}
