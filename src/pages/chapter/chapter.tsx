import {Link, useParams} from 'react-router-dom'
import {loadChapter} from '../../entities/chapter'
import {CharacterMentionHost} from '../../features/character-mention'
import {assetUrl} from '../../shared/lib/env.js'
import {fetchSeriesManifest} from '../../shared/lib/manifest.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'
import {extractOutline} from '../../shared/lib/markdown.js'
import type {ChapterIndex} from '../../shared/lib/types.js'

export function ChapterPage() {
  const {slug = '', episode = ''} = useParams<{ slug: string; episode: string }>()
  const cover = useImgFallback()

  const state = useAsync(async () => {
    const manifest = await fetchSeriesManifest(slug)
    const data = await loadChapter(slug, episode, manifest)
    return {manifest, data}
  }, [slug, episode])

  if (state.status === 'loading') return <main className="page-chapter"><p className="loading">불러오는
    중…</p></main>
  if (state.status === 'error') return <main className="page-chapter"><p
    className="empty">오류: {state.error.message}</p></main>

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
        if (outline.length === 0) return null
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

      <CharacterMentionHost slug={slug} manifest={manifest}>
        <article
          className="article article-prose"
          dangerouslySetInnerHTML={{__html: data.bodyHtml}}
        />
      </CharacterMentionHost>

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
    </main>
  )
}
