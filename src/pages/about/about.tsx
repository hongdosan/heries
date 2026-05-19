import { Link } from 'react-router-dom'
import { assetUrl } from '../../shared/lib/env.js'
import { renderMarkdown } from '../../shared/lib/markdown.js'
import { parseFrontmatter } from '../../shared/lib/frontmatter.js'
import { useAsync } from '../../shared/lib/use-async.js'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'
import { Empty } from '../../shared/ui/empty'
import { Loading } from '../../shared/ui/loading'

type AboutFrontmatter = { title?: string; updated?: string }

export function AboutPage() {
  useDocumentTitle('소개')
  const state = useAsync(async () => {
    const res = await fetch(assetUrl('content/about.md'))
    if (!res.ok) throw new Error(`about.md 로드 실패 (${res.status})`)
    const raw = await res.text()
    const { frontmatter, body } = parseFrontmatter<AboutFrontmatter>(raw)
    return { frontmatter, html: renderMarkdown(body) }
  }, [])

  return (
    <main className="flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9">
      <nav className="breadcrumb" aria-label="경로">
        <Link to="/">H-eries</Link>
        <span className="sep">/</span>
        <span>소개</span>
      </nav>

      {state.status === 'loading' && <Loading />}
      {state.status === 'error' && <Empty>오류: {state.error.message}</Empty>}
      {state.status === 'success' && (
        <>
          {state.data.frontmatter.updated && (
            <p className="m-0 mb-5 text-xs text-fg-4 font-mono">
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
