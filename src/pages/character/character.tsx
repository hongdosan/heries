import {Link, useParams} from 'react-router-dom'
import {loadCharacter} from './api/load-character.js'
import {fetchSeriesManifest} from '../../entities/series'
import {renderInline} from '../../shared/lib/markdown.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {Empty, Loading} from '../../shared/ui'
import {LockedCharacterCard} from './locked-character-card'

const FOLDER_LABEL: Record<string, string> = {
  '1-protagonist': '주인공',
  '2-major-supporting': '주연',
  '3-antagonist': '빌런·멘토',
  '4-minor': '단역·카메오',
}

const MAIN_CLS = 'flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9'

export function CharacterPage() {
  const {slug = '', id = ''} = useParams<{slug: string; id: string}>()
  const isAuthor = useAuthorMode()

  // deps 에 isAuthor 포함 — 작가 모드 토글 시 re-fetch 트리거.
  // 마스킹은 loader 내부 spoiler.ts 의 isAuthorMode() 호출 시점에 적용되므로,
  // 작가 모드 변경 = re-fetch = 최신 마스킹 상태 반영 (잠금 후 스포일러 즉시 마스킹).
  const state = useAsync(async () => {
    const manifest = await fetchSeriesManifest(slug)
    const data = await loadCharacter(slug, id, manifest)
    return {manifest, data}
  }, [slug, id, isAuthor])

  const characterTitle = state.status === 'success'
    ? `${state.data.data.frontmatter.name || state.data.data.index.name} · ${state.data.manifest.title}`
    : ''
  useDocumentTitle(characterTitle)

  if (state.status === 'loading') return <main className={MAIN_CLS}><Loading/></main>
  if (state.status === 'error') return <main className={MAIN_CLS}><Empty>오류: {state.error.message}</Empty></main>

  const {manifest, data} = state.data

  // 정책 (character-doctrine): 주인공 외 캐릭터 상세는 작가 모드 한정.
  if (!isAuthor && data.index.folder !== '1-protagonist') {
    return (
      <LockedCharacterCard
        slug={slug}
        manifestTitle={manifest.title}
        folderLabel={FOLDER_LABEL[data.index.folder] || data.index.folder}
        className={MAIN_CLS}
      />
    )
  }

  const fm = data.frontmatter
  const aliases = Array.isArray(fm.aliases) ? fm.aliases : []
  const hasMeta = fm.origin || fm.affiliation || fm.first_appearance || aliases.length > 0
  const heriesArc = fm.heries_arc ?? null

  return (
    <main className={MAIN_CLS}>
      <nav className="breadcrumb" aria-label="경로">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to="/series">시리즈</Link><span className="sep">/</span>
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
                dangerouslySetInnerHTML={{__html: renderInline(fm.summary)}}
              />
            )}
            {hasMeta && (
              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-y-2 gap-x-4 p-4 px-5 bg-bg-soft border border-rule rounded-md m-0 text-sm min-w-0 max-sm:grid-cols-1 max-sm:gap-1 [&>dt]:text-fg-3 [&>dt]:font-medium [&>dt]:uppercase [&>dt]:tracking-[0.04em] [&>dt]:text-xs [&>dd]:m-0 [&>dd]:text-fg [&>dd]:min-w-0 [&>dd]:[overflow-wrap:anywhere] [&>dd]:break-words max-sm:[&>dt]:mt-2">
                {fm.origin && (<><dt>원작</dt><dd dangerouslySetInnerHTML={{__html: renderInline(fm.origin)}}/></>)}
                {fm.affiliation && (<><dt>소속</dt><dd dangerouslySetInnerHTML={{__html: renderInline(fm.affiliation)}}/></>)}
                {fm.first_appearance && (<><dt>첫 등장</dt><dd>{fm.first_appearance}</dd></>)}
                {aliases.length > 0 && (<><dt>이명</dt><dd dangerouslySetInnerHTML={{__html: aliases.map(renderInline).join(' · ')}}/></>)}
                {heriesArc && (<><dt className="author-only-label">소환 시점 <span className="author-only-badge">AUTHOR</span></dt><dd className="author-only-value" dangerouslySetInnerHTML={{__html: renderInline(heriesArc)}}/></>)}
              </dl>
            )}
          </aside>
        ) : <span/>}
        <article
          className="article article-wiki"
          dangerouslySetInnerHTML={{__html: data.bodyHtml}}
        />
      </div>
    </main>
  )
}
