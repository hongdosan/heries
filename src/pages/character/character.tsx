import { Link, useParams } from 'react-router-dom'
import { loadCharacter } from '../../entities/character'
import { fetchSeriesManifest } from '../../shared/lib/manifest.js'
import { renderInline } from '../../shared/lib/markdown.js'
import { useAsync } from '../../shared/lib/use-async.js'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'

const FOLDER_LABEL: Record<string, string> = {
  '1-protagonist': '주인공',
  '2-major-supporting': '주연',
  '3-antagonist': '빌런·멘토',
  '4-minor': '단역·카메오',
}

export function CharacterPage() {
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>()

  const state = useAsync(async () => {
    const manifest = await fetchSeriesManifest(slug)
    const data = await loadCharacter(slug, id, manifest)
    return { manifest, data }
  }, [slug, id])

  const characterTitle = state.status === 'success'
    ? `${state.data.data.frontmatter.name || state.data.data.index.name} · ${state.data.manifest.title}`
    : ''
  useDocumentTitle(characterTitle)

  if (state.status === 'loading') return <main className="page-character"><p className="loading">불러오는 중…</p></main>
  if (state.status === 'error') return <main className="page-character"><p className="empty">오류: {state.error.message}</p></main>

  const { manifest, data } = state.data
  const fm = data.frontmatter
  const aliases = Array.isArray(fm.aliases) ? fm.aliases : []
  const hasMeta = fm.origin || fm.affiliation || fm.first_appearance || aliases.length > 0
  const heriesArc = fm.heries_arc ? String(fm.heries_arc) : null

  return (
    <main className="page-character">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to={`/series/${slug}`}>{manifest.title}</Link><span className="sep">/</span>
        <span>{fm.name || data.index.name}</span>
      </nav>

      <header className="character-hero">
        <p className="role-tag">{FOLDER_LABEL[data.index.folder] || data.index.folder}</p>
        <h1>{fm.name || data.index.name}</h1>
        {fm.role && <p className="subtitle">{fm.role}</p>}
      </header>

      {fm.summary && (
        <aside
          className="character-summary"
          aria-label="한입 요약"
          dangerouslySetInnerHTML={{ __html: renderInline(String(fm.summary)) }}
        />
      )}

      <div className="character-body">
        {hasMeta ? (
          <aside className="character-meta-aside">
            <dl className="meta-card">
              {fm.origin && (<><dt>원작</dt><dd dangerouslySetInnerHTML={{ __html: renderInline(String(fm.origin)) }} /></>)}
              {fm.affiliation && (<><dt>소속</dt><dd dangerouslySetInnerHTML={{ __html: renderInline(String(fm.affiliation)) }} /></>)}
              {fm.first_appearance && (<><dt>첫 등장</dt><dd>{fm.first_appearance}</dd></>)}
              {aliases.length > 0 && (<><dt>이명</dt><dd dangerouslySetInnerHTML={{ __html: aliases.map((a) => renderInline(String(a))).join(' · ') }} /></>)}
              {heriesArc && (<><dt className="author-only-label">소환 시점 <span className="author-only-badge">AUTHOR</span></dt><dd className="author-only-value" dangerouslySetInnerHTML={{ __html: renderInline(heriesArc) }} /></>)}
            </dl>
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
