import { Link } from 'react-router-dom'
import { assetUrl } from '../../shared/lib/env.js'
import { renderMarkdown } from '../../shared/lib/markdown.js'
import { parseFrontmatter } from '../../shared/lib/frontmatter.js'
import { useAsync } from '../../shared/lib/use-async.js'

type AboutFrontmatter = { title?: string; updated?: string }

export function AboutPage() {
  const state = useAsync(async () => {
    const res = await fetch(assetUrl('content/about.md'))
    if (!res.ok) throw new Error(`about.md 로드 실패 (${res.status})`)
    const raw = await res.text()
    const { frontmatter, body } = parseFrontmatter<AboutFrontmatter>(raw)
    return { frontmatter, html: renderMarkdown(body) }
  }, [])

  return (
    <main className="page-about">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link>
        <span className="sep">/</span>
        <span>소개</span>
      </nav>

      {state.status === 'loading' && <p className="loading">불러오는 중…</p>}
      {state.status === 'error' && <p className="empty">오류: {state.error.message}</p>}
      {state.status === 'success' && (
        <>
          {state.data.frontmatter.updated && (
            <p className="about-meta">
              마지막 업데이트 <time dateTime={state.data.frontmatter.updated}>{state.data.frontmatter.updated}</time>
            </p>
          )}
          <article
            className="article article-prose"
            dangerouslySetInnerHTML={{ __html: state.data.html }}
          />
        </>
      )}
    </main>
  )
}
