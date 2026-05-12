import { Link } from 'react-router-dom'
import { renderMarkdown } from '../../shared/lib/markdown.js'
import { parseFrontmatter } from '../../shared/lib/frontmatter.js'
import { useAsync } from '../../shared/lib/use-async.js'

type NoticeFrontmatter = { title?: string; updated?: string }

export function NoticePage() {
  const state = useAsync(async () => {
    const res = await fetch('./content/notice.md')
    if (!res.ok) throw new Error(`notice.md 로드 실패 (${res.status})`)
    const raw = await res.text()
    const { frontmatter, body } = parseFrontmatter<NoticeFrontmatter>(raw)
    return { frontmatter, html: renderMarkdown(body) }
  }, [])

  return (
    <main className="page-notice">
      <nav className="breadcrumb">
        <Link to="/">heries</Link>
        <span className="sep">/</span>
        <span>저작권</span>
      </nav>

      {state.status === 'loading' && <p className="loading">불러오는 중…</p>}
      {state.status === 'error' && <p className="empty">오류: {state.error.message}</p>}
      {state.status === 'success' && (
        <>
          {state.data.frontmatter.updated && (
            <p className="about-meta">
              마지막 업데이트{' '}
              <time dateTime={state.data.frontmatter.updated}>{state.data.frontmatter.updated}</time>
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
