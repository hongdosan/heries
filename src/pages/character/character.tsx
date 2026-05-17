import { Link, useParams } from 'react-router-dom'
import { loadCharacter } from '../../entities/character'
import { fetchSeriesManifest } from '../../shared/lib/manifest.js'
import { renderInline } from '../../shared/lib/markdown.js'
import { useAsync } from '../../shared/lib/use-async.js'
import { useAuthorMode } from '../../shared/lib/use-author-mode.js'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'
import { Empty } from '../../shared/ui/empty'
import { Loading } from '../../shared/ui/loading'

const FOLDER_LABEL: Record<string, string> = {
  '1-protagonist': '주인공',
  '2-major-supporting': '주연',
  '3-antagonist': '빌런·멘토',
  '4-minor': '단역·카메오',
}

const MAIN_CLS = 'flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9'

export function CharacterPage() {
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>()
  const isAuthor = useAuthorMode()

  const state = useAsync(async () => {
    const manifest = await fetchSeriesManifest(slug)
    const data = await loadCharacter(slug, id, manifest)
    return { manifest, data }
  }, [slug, id])

  const characterTitle = state.status === 'success'
    ? `${state.data.data.frontmatter.name || state.data.data.index.name} · ${state.data.manifest.title}`
    : ''
  useDocumentTitle(characterTitle)

  if (state.status === 'loading') return <main className={MAIN_CLS}><Loading /></main>
  if (state.status === 'error') return <main className={MAIN_CLS}><Empty>오류: {state.error.message}</Empty></main>

  const { manifest, data } = state.data

  // 정책 (character-doctrine): 주인공 외 캐릭터 상세는 작가 모드 한정.
  if (!isAuthor && data.index.folder !== '1-protagonist') {
    return (
      <main className={MAIN_CLS}>
        <nav className="breadcrumb">
          <Link to="/">H-eries</Link><span className="sep">/</span>
          <Link to={`/series/${slug}`}>{manifest.title}</Link><span className="sep">/</span>
          <span>잠김</span>
        </nav>
        <div className="my-6 p-6 bg-bg-soft border border-rule rounded-md text-center">
          <h1>잠긴 카드</h1>
          <p className="m-0 mb-3 text-fg-2">본 캐릭터의 상세 정보는 <Link to="/unlock">작가 모드</Link>에서 열람할 수 있습니다.</p>
          <p className="text-sm text-fg-3 m-0 mb-5">{manifest.title} · {FOLDER_LABEL[data.index.folder] || data.index.folder}</p>
          <div className="inline-flex gap-2 flex-wrap justify-center">
            <Link to={`/series/${slug}?tab=characters`} className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md border bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover no-underline">등장인물 목록으로</Link>
            <Link to="/unlock" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md border bg-surface text-fg-2 border-rule hover:text-accent hover:border-accent no-underline">작가 모드 잠금 해제</Link>
          </div>
        </div>
      </main>
    )
  }

  const fm = data.frontmatter
  const aliases = Array.isArray(fm.aliases) ? fm.aliases : []
  const hasMeta = fm.origin || fm.affiliation || fm.first_appearance || aliases.length > 0
  const heriesArc = fm.heries_arc ? String(fm.heries_arc) : null

  return (
    <main className={MAIN_CLS}>
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to={`/series/${slug}`}>{manifest.title}</Link><span className="sep">/</span>
        <span>{fm.name || data.index.name}</span>
      </nav>

      <header className="m-0 mb-6 pb-5 border-b border-rule">
        <p className="inline-block font-mono text-xs tracking-[0.16em] text-fg-3 m-0 mb-3 uppercase">{FOLDER_LABEL[data.index.folder] || data.index.folder}</p>
        <h1 className="m-0 mb-2">{fm.name || data.index.name}</h1>
        {fm.role && <p className="font-sans border-0 p-0 m-0">{fm.role}</p>}
      </header>

      <div className="grid gap-7 grid-cols-[clamp(200px,22vw,280px)_1fr] items-start max-[800px]:grid-cols-1">
        {(hasMeta || fm.summary) ? (
          <aside className="sticky top-[calc(clamp(52px,6vh,64px)+var(--s-5))] min-w-0 flex flex-col gap-3 max-[800px]:static">
            {fm.summary && (
              <p
                className="m-0 py-3 px-4 bg-bg-soft border-l-[3px] border-l-accent rounded-r-md text-sm text-fg leading-[1.6] break-keep"
                aria-label="한입 요약"
                dangerouslySetInnerHTML={{ __html: renderInline(String(fm.summary)) }}
              />
            )}
            {hasMeta && (
              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-y-2 gap-x-4 p-4 px-5 bg-bg-soft border border-rule rounded-md m-0 text-sm min-w-0 max-sm:grid-cols-1 max-sm:gap-1 [&>dt]:text-fg-3 [&>dt]:font-medium [&>dt]:uppercase [&>dt]:tracking-[0.04em] [&>dt]:text-xs [&>dd]:m-0 [&>dd]:text-fg [&>dd]:min-w-0 [&>dd]:[overflow-wrap:anywhere] [&>dd]:break-words max-sm:[&>dt]:mt-2">
                {fm.origin && (<><dt>원작</dt><dd dangerouslySetInnerHTML={{ __html: renderInline(String(fm.origin)) }} /></>)}
                {fm.affiliation && (<><dt>소속</dt><dd dangerouslySetInnerHTML={{ __html: renderInline(String(fm.affiliation)) }} /></>)}
                {fm.first_appearance && (<><dt>첫 등장</dt><dd>{fm.first_appearance}</dd></>)}
                {aliases.length > 0 && (<><dt>이명</dt><dd dangerouslySetInnerHTML={{ __html: aliases.map((a) => renderInline(String(a))).join(' · ') }} /></>)}
                {heriesArc && (<><dt className="author-only-label">소환 시점 <span className="author-only-badge">AUTHOR</span></dt><dd className="author-only-value" dangerouslySetInnerHTML={{ __html: renderInline(heriesArc) }} /></>)}
              </dl>
            )}
          </aside>
        ) : <span />}
        <article
          className="article article-wiki"
          dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
        />
      </div>
    </main>
  )
}
