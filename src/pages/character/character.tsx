import { Link, useParams } from 'react-router-dom'
import { loadCharacter } from '../../entities/character'
import { fetchSeriesManifest } from '../../shared/lib/manifest.js'
import { renderInline } from '../../shared/lib/markdown.js'
import { useAsync } from '../../shared/lib/use-async.js'
import { useAuthorMode } from '../../shared/lib/use-author-mode.js'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'

const FOLDER_LABEL: Record<string, string> = {
  '1-protagonist': '주인공',
  '2-major-supporting': '주연',
  '3-antagonist': '빌런·멘토',
  '4-minor': '단역·카메오',
}

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

  if (state.status === 'loading') return <main className="page-character"><p className="loading">불러오는 중…</p></main>
  if (state.status === 'error') return <main className="page-character"><p className="empty">오류: {state.error.message}</p></main>

  const { manifest, data } = state.data

  // 정책 (character-doctrine): 주인공 외 캐릭터 상세는 작가 모드 한정.
  // 비-작가가 직접 URL 진입 시 잠금 안내 + 시리즈 복귀 링크.
  if (!isAuthor && data.index.folder !== '1-protagonist') {
    return (
      <main className="page-character">
        <nav className="breadcrumb">
          <Link to="/">H-eries</Link><span className="sep">/</span>
          <Link to={`/series/${slug}`}>{manifest.title}</Link><span className="sep">/</span>
          <span>잠김</span>
        </nav>
        <div className="character-locked">
          <h1>잠긴 카드</h1>
          <p>본 캐릭터의 상세 정보는 <Link to="/unlock">작가 모드</Link>에서 열람할 수 있습니다.</p>
          <p className="character-locked-meta">{manifest.title} · {FOLDER_LABEL[data.index.folder] || data.index.folder}</p>
          <div className="character-locked-actions">
            <Link to={`/series/${slug}?tab=characters`} className="unlock-btn unlock-btn-primary">등장인물 목록으로</Link>
            <Link to="/unlock" className="unlock-btn">작가 모드 잠금 해제</Link>
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

      <div className="character-body">
        {(hasMeta || fm.summary) ? (
          <aside className="character-meta-aside">
            {fm.summary && (
              <p
                className="character-summary"
                aria-label="한입 요약"
                dangerouslySetInnerHTML={{ __html: renderInline(String(fm.summary)) }}
              />
            )}
            {hasMeta && (
              <dl className="meta-card">
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
