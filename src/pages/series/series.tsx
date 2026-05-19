import {type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, lazy, Suspense} from 'react'
import {Link, useParams, useSearchParams} from 'react-router-dom'
import type {SeriesManifest} from '../../entities/series'
import {loadSeries} from './api/load-series.js'
import {assetUrl} from '../../shared/lib/env.js'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {Empty, Loading} from '../../shared/ui'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'
import {ChapterToc} from '../../widgets/chapter-toc'
import {CharacterList} from '../../widgets/character-list'

// 게임 슬라이스 = 80+ KB. 사용자가 메뉴를 안 누르면 fetch X.
const MiniGameLauncher = lazy(() =>
  import('../../features/mini-game').then((m) => ({default: m.MiniGameLauncher})),
)

type Tab = 'overview' | 'chapters' | 'characters' | 'author'
const TABS: ReadonlySet<Tab> = new Set(['overview', 'chapters', 'characters', 'author'])

const AUTHOR_NAME = '홍도산'
const MAIN_CLS = 'flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9'

/**
 * 작품 상세 페이지 (`/series/:slug`).
 *
 * **디자인 정합** (2026-05-19 시안 img_2.png):
 * - Breadcrumb (H-eries / 시리즈 / 작품명)
 * - 헤더 = 좌측 16:9 thumbnail + 우측 메타 (캡션 / 제목 / 카테고리 / 메타 표 / CTA 2종)
 * - CTA = *1화부터 읽기* (검정 둥근) + *최신화로* (보조)
 * - 탭 nav (개요 / 챕터 / 등장인물 / 작가 — 작가는 author mode 만)
 * - 개요 탭 = 2 컬럼 (SYNOPSIS 좌 2/3 + LORE NOTES 우 1/3) + CAST + LATEST
 */
export function SeriesPage() {
  const {slug = ''} = useParams<{ slug: string }>()
  const isAuthor = useAuthorMode()
  // deps 에 isAuthor 포함 — 작가 모드 토글 시 re-fetch 트리거 (스포일러 마스킹 즉시 반영).
  const state = useAsync(() => loadSeries(slug), [slug, isAuthor])
  const cover = useImgFallback()
  const [searchParams, setSearchParams] = useSearchParams()
  useDocumentTitle(state.status === 'success' ? state.data.manifest.title : '')

  const rawTab = searchParams.get('tab') as Tab | null
  const tab: Tab = rawTab && TABS.has(rawTab) ? rawTab : 'overview'
  const setTab = (next: Tab) => {
    if (next === 'overview') setSearchParams({}, {replace: false})
    else setSearchParams({tab: next}, {replace: false})
  }

  if (state.status === 'loading') return <main className={MAIN_CLS}><Loading/></main>
  if (state.status === 'error') return <main className={MAIN_CLS}>
    <Empty>오류: {state.error.message}</Empty></main>

  const {manifest, bodyHtml} = state.data
  const chapterCount = manifest.chapters.length
  const characterCount = manifest.characters.length

  let coverSrc: string | null
  if (!manifest.thumbnail || cover.fatal) coverSrc = null
  else if (cover.error) coverSrc = PLACEHOLDER_THUMB
  else coverSrc = assetUrl(`content/series/${slug}/${manifest.thumbnail}`)

  return (
    <main className={MAIN_CLS}>
      <nav className="breadcrumb" aria-label="경로">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to="/series">시리즈</Link><span className="sep">/</span>
        <span>{manifest.title}</span>
      </nav>

      <SeriesHeader slug={slug} manifest={manifest} coverSrc={coverSrc} onError={cover.onError}/>

      <TabNav tab={tab} setTab={setTab} chapterCount={chapterCount} characterCount={characterCount} isAuthor={isAuthor}/>

      {tab === 'overview' && (
        <OverviewPanel slug={slug} manifest={manifest} bodyHtml={bodyHtml} setTab={setTab}/>
      )}
      {tab === 'chapters' && (
        <div role="tabpanel" id="panel-chapters" aria-labelledby="tab-chapters">
          <ChapterToc slug={slug} chapters={manifest.chapters}/>
        </div>
      )}
      {tab === 'characters' && (
        <div role="tabpanel" id="panel-characters" aria-labelledby="tab-characters">
          <CharactersSpoilerAlert/>
          <CharacterList slug={slug} characters={manifest.characters}/>
        </div>
      )}
      {tab === 'author' && isAuthor && <AuthorPanel slug={slug}/>}

      <Suspense fallback={null}>
        <MiniGameLauncher/>
      </Suspense>
    </main>
  )
}

// ─── 헤더 (시안 정합) ─────────────────────────────────────

function SeriesHeader({
  slug, manifest, coverSrc, onError,
}: Readonly<{
  slug: string
  manifest: SeriesManifest
  coverSrc: string | null
  onError: () => void
}>) {
  const ongoing = manifest.status === '연재 중'
  const recent = latestPublished(manifest)
  const firstEp = manifest.chapters[0]?.episode
  const latestEp = manifest.chapters.at(-1)?.episode

  return (
    <header className="pt-2 pb-8 mb-6 grid grid-cols-[1fr_1fr] gap-10 items-start max-md:grid-cols-1 max-md:gap-6">
      {coverSrc ? (
        <div className="aspect-video rounded-md overflow-hidden bg-bg-soft border border-rule">
          <img src={coverSrc} alt="" loading="eager" onError={onError} className="w-full h-full object-cover block"/>
        </div>
      ) : (
        <div className="aspect-video rounded-md bg-[linear-gradient(135deg,var(--bg-soft),var(--bg-sunken))] border border-rule"/>
      )}

      <div className="flex flex-col gap-5 min-w-0">
        <p className="m-0 text-xs sm:text-sm font-medium tracking-[0.24em] uppercase text-fg-3">
          Series 01 · Multi-verse Collection
        </p>
        <h1 className="m-0 text-[clamp(32px,4.5vw,52px)] font-bold tracking-[-0.02em] leading-[1.1]">
          {manifest.title}
        </h1>
        {manifest.categories && manifest.categories.length > 0 && (
          <p className="m-0 text-sm text-fg-3">
            {manifest.categories.join(' · ')}
          </p>
        )}

        <dl className="m-0 grid grid-cols-[max-content_1fr] gap-y-2 gap-x-6 text-sm border-t border-rule pt-4 [&>dt]:text-fg-3 [&>dd]:m-0 [&>dd]:text-fg-2 [&>dd]:text-right [&>dd]:tabular-nums">
          <dt>상태</dt>
          <dd className="inline-flex items-center justify-end gap-1.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${ongoing ? 'bg-emerald-500' : 'bg-fg-4'}`} aria-hidden/>
            <span>{manifest.status}</span>
          </dd>

          <dt>총 회 수</dt>
          <dd>{manifest.chapters.length}화 {ongoing ? '/ 진행 중' : '완결'}</dd>

          {recent && (
            <>
              <dt>최근 업데이트</dt>
              <dd><time dateTime={recent}>{recent}</time></dd>
            </>
          )}

          <dt>작가</dt>
          <dd>{AUTHOR_NAME}</dd>
        </dl>

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {typeof firstEp === 'number' && (
            <Link
              to={`/series/${slug}/chapter/${firstEp}`}
              style={{background: 'var(--cta-bg)', color: 'var(--cta-fg)'}}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-[transform,background] hover:-translate-y-0.5 hover:[background:var(--cta-bg-hover)]"
            >
              <span>1화부터 읽기</span>
              <span aria-hidden>→</span>
            </Link>
          )}
          {typeof latestEp === 'number' && latestEp !== firstEp && (
            <Link
              to={`/series/${slug}/chapter/${latestEp}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border border-rule text-fg-2 transition-[transform,background,border-color] hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              최신화로
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── 탭 nav ──────────────────────────────────────────────

function TabNav({
  tab, setTab, chapterCount, characterCount, isAuthor,
}: Readonly<{
  tab: Tab
  setTab: (next: Tab) => void
  chapterCount: number
  characterCount: number
  isAuthor: boolean
}>) {
  const tabBtnCls = 'px-4 py-3 text-md font-medium -mb-px transition-[color,border-color] cursor-pointer hover:text-fg-2'
  const tabBtnStyle = (active: boolean): CSSProperties =>
    active
      ? {color: 'var(--accent)', borderBottom: '2px solid var(--accent)', fontWeight: 600}
      : {color: 'var(--fg-3)', borderBottom: '2px solid transparent'}

  // WAI-ARIA tabs pattern — Arrow Left/Right + Home/End 키보드 네비.
  // roving tabindex (active = 0, 나머지 = -1) + focus 직접 이동 + setTab.
  const tabs: Tab[] = isAuthor ? ['overview', 'chapters', 'characters', 'author'] : ['overview', 'chapters', 'characters']
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const key = e.key
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return
    e.preventDefault()
    const idx = tabs.indexOf(tab)
    const nextIdx =
      key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length
      : key === 'ArrowRight' ? (idx + 1) % tabs.length
      : key === 'Home' ? 0
      : tabs.length - 1
    const nextTab = tabs[nextIdx]
    if (!nextTab) return
    setTab(nextTab)
    requestAnimationFrame(() => document.getElementById(`tab-${nextTab}`)?.focus())
  }

  return (
    <div className="flex gap-2 border-b border-rule mb-8 relative flex-wrap" role="tablist" aria-label="시리즈 섹션"
         onKeyDown={onKey}>
      <button role="tab" id="tab-overview" aria-controls="panel-overview"
              aria-selected={tab === 'overview'} tabIndex={tab === 'overview' ? 0 : -1} className={tabBtnCls}
              style={tabBtnStyle(tab === 'overview')}
              onClick={() => setTab('overview')}>개요
      </button>
      <button role="tab" id="tab-chapters" aria-controls="panel-chapters"
              aria-selected={tab === 'chapters'} tabIndex={tab === 'chapters' ? 0 : -1} className={tabBtnCls}
              style={tabBtnStyle(tab === 'chapters')}
              onClick={() => setTab('chapters')}>
        챕터<span className="text-xs ml-2 tabular-nums"
                style={{color: tab === 'chapters' ? 'var(--accent)' : 'var(--fg-4)'}}>{chapterCount}</span>
      </button>
      <button role="tab" id="tab-characters" aria-controls="panel-characters"
              aria-selected={tab === 'characters'} tabIndex={tab === 'characters' ? 0 : -1} className={tabBtnCls}
              style={tabBtnStyle(tab === 'characters')}
              onClick={() => setTab('characters')}>
        등장인물<span className="text-xs ml-2 tabular-nums"
                  style={{color: tab === 'characters' ? 'var(--accent)' : 'var(--fg-4)'}}>{characterCount}</span>
      </button>
      {isAuthor && (
        <button role="tab" id="tab-author" aria-controls="panel-author"
                aria-selected={tab === 'author'} tabIndex={tab === 'author' ? 0 : -1} className={tabBtnCls}
                style={tabBtnStyle(tab === 'author')}
                onClick={() => setTab('author')}>
          작가 전용<span className="author-only-badge">AUTHOR</span>
        </button>
      )}
    </div>
  )
}

// ─── 개요 탭 (2 컬럼 + CAST + LATEST) ─────────────────────

function OverviewPanel({
  slug, manifest, bodyHtml, setTab,
}: Readonly<{
  slug: string
  manifest: SeriesManifest
  bodyHtml: string
  setTab: (next: Tab) => void
}>) {
  return (
    <section role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className="flex flex-col gap-12">
      <div className="grid grid-cols-[2fr_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-8">
        <article>
          <h2 className="m-0 mb-4 text-xs font-medium tracking-[0.24em] uppercase text-fg-3">Synopsis</h2>
          <div className="article article-wiki" dangerouslySetInnerHTML={{__html: bodyHtml}}/>
        </article>

        {manifest.loreNotes && manifest.loreNotes.length > 0 && (
          <aside>
            <h2 className="m-0 mb-4 text-xs font-medium tracking-[0.24em] uppercase text-fg-3">Lore Notes</h2>
            <dl className="m-0 flex flex-col gap-5 [&>div]:border-t [&>div]:border-rule [&>div]:pt-4">
              {manifest.loreNotes.map((note) => (
                <div key={note.term}>
                  <dt className="font-semibold text-fg mb-1.5">{note.term}</dt>
                  <dd className="m-0 text-sm text-fg-2 leading-[1.55] break-keep">{note.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>

      <CastSection slug={slug} characters={manifest.characters} setTab={setTab}/>

      <LatestChaptersSection slug={slug} chapters={manifest.chapters} setTab={setTab}/>
    </section>
  )
}

// ─── CAST 핵심 인물 ──────────────────────────────────────

const FOLDER_LABEL: Record<string, string> = {
  '1-protagonist': 'PROTAGONIST',
  '2-major-supporting': '주연',
  '3-antagonist': '빌런',
  '4-minor': '단역',
}

function CastSection({
  slug, characters, setTab,
}: Readonly<{
  slug: string
  characters: SeriesManifest['characters']
  setTab: (next: Tab) => void
}>) {
  // 핵심 = 1-protagonist + 2-major-supporting 우선, 폴더 정렬 순.
  const top = [...characters]
    .filter((c) => c.folder === '1-protagonist' || c.folder === '2-major-supporting')
    .slice(0, 3)

  if (top.length === 0) return null

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4 gap-4">
        <div>
          <h2 className="m-0 mb-1 text-xs font-medium tracking-[0.24em] uppercase text-fg-3">Cast</h2>
          <h2 className="m-0 text-xl font-semibold">핵심 인물</h2>
        </div>
        <button
          type="button"
          onClick={() => setTab('characters')}
          className="text-sm text-fg-3 hover:text-accent transition-colors cursor-pointer"
        >
          등장인물 전체 <span aria-hidden>→</span>
        </button>
      </div>

      <p className="m-0 mb-5 text-xs text-warn-fg bg-warn-bg border-l-[3px] border-l-warn-rule px-3 py-2 rounded-r-md">
        등장인물 정보는 본 작품의 전개와 관련된 스포일러를 포함할 수 있습니다.
      </p>

      <ul className="m-0 p-0 list-none flex flex-col">
        {top.map((c) => (
          <li key={c.id} className="border-t border-rule first:border-t-0">
            <Link
              to={`/series/${slug}/character/${c.id}`}
              className="grid grid-cols-[44px_1fr] gap-4 items-start py-4 group hover:bg-bg-soft -mx-2 px-2 rounded-md transition-colors"
            >
              <div
                aria-hidden
                className="w-11 h-11 rounded-full bg-bg-soft border border-rule flex items-center justify-center text-fg-3 font-semibold tabular-nums"
              >
                {c.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <span className="text-md font-semibold text-fg group-hover:text-accent transition-colors">{c.name}</span>
                  <span className="text-xs font-mono tracking-[0.12em] text-fg-4">{FOLDER_LABEL[c.folder] ?? c.folder}</span>
                </div>
                {c.summary && (
                  <p className="m-0 text-sm text-fg-2 leading-[1.55] break-keep">{c.summary}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── LATEST 최근 챕터 ────────────────────────────────────

function LatestChaptersSection({
  slug, chapters, setTab,
}: Readonly<{
  slug: string
  chapters: SeriesManifest['chapters']
  setTab: (next: Tab) => void
}>) {
  const sorted = [...chapters].sort((a, b) => b.episode - a.episode)
  const top = sorted.slice(0, 3)
  if (top.length === 0) return null
  const newestPub = top[0]!.published

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4 gap-4">
        <div>
          <h2 className="m-0 mb-1 text-xs font-medium tracking-[0.24em] uppercase text-fg-3">Latest</h2>
          <h2 className="m-0 text-xl font-semibold">최근 챕터</h2>
        </div>
        <button
          type="button"
          onClick={() => setTab('chapters')}
          className="text-sm text-fg-3 hover:text-accent transition-colors cursor-pointer"
        >
          챕터 전체 <span aria-hidden>→</span>
        </button>
      </div>

      <ul className="m-0 p-0 list-none flex flex-col">
        {top.map((c) => {
          const isNew = c.published === newestPub
          const dateLabel = /^\d{4}-\d{2}-\d{2}$/.test(c.published) ? c.published.slice(5).replace('-', '.') : c.published
          return (
            <li key={c.episode} className="border-t border-rule first:border-t-0">
              <Link
                to={`/series/${slug}/chapter/${c.episode}`}
                className="grid grid-cols-[max-content_1fr_max-content] gap-5 items-baseline py-4 -mx-2 px-2 rounded-md hover:bg-bg-soft transition-colors group"
              >
                <span className="font-mono text-sm font-semibold tracking-[0.12em] text-accent">EP&nbsp;{String(c.episode).padStart(2, '0')}</span>
                <span className="text-md text-fg group-hover:text-accent transition-colors min-w-0 truncate">{c.title}</span>
                <span className="text-xs text-fg-3 tabular-nums flex items-baseline gap-2">
                  <time dateTime={c.published}>{dateLabel}</time>
                  {isNew && <span className="text-accent font-semibold tracking-[0.1em]">· NEW</span>}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ─── 작가 전용 (보존) ─────────────────────────────────────

function AuthorPanel({slug}: Readonly<{slug: string}>) {
  return (
    <section role="tabpanel" id="panel-author" aria-labelledby="tab-author" className="mt-5">
      <p className="m-0 mb-5 p-3 px-4 border-l-[3px] border-l-warn-rule bg-bg-soft text-fg-2 text-sm rounded-r-md">
        본 탭은 <span className="author-only-badge">AUTHOR</span> 모드 빌드에서만 노출되는
        작가 전용 자료 인덱스입니다. 시놉시스·세계관·연표·용어집·캐릭터 카드의 <em className="text-accent not-italic">H-eries
        분기</em> 절은 reader 빌드에서 마스킹되므로, 본 탭에서 한곳에 모아 추적합니다.
      </p>
      <ul className="list-disc pl-6 m-0 mb-5 text-sm leading-[1.8] text-fg-2 [&_strong]:text-fg [&_strong]:font-semibold [&_code]:bg-code-bg [&_code]:py-px [&_code]:px-1.5 [&_code]:rounded-sm [&_code]:font-mono [&_code]:text-[0.88em] [&_em]:text-accent [&_em]:not-italic">
        <li><strong>시놉시스</strong> — 개요 탭의 <em>## 시놉시스</em> 절</li>
        <li><strong>세계관</strong> — <code>content/series/{slug}/worldbuilding/</code></li>
        <li><strong>연표</strong> — <code>content/series/{slug}/timeline/</code></li>
        <li><strong>용어집</strong> — <code>content/series/{slug}/glossary/</code></li>
        <li><strong>캐릭터 H-eries 분기</strong> — 각 캐릭터 페이지의 <em>## H-eries 분기 ~</em> 절 + frontmatter <code>heries_arc</code></li>
      </ul>
    </section>
  )
}

// ─── 등장인물 탭 스포 alert ──────────────────────────────

function CharactersSpoilerAlert() {
  return (
    <p className="m-0 mb-6 text-sm text-warn-fg bg-warn-bg border-l-[3px] border-l-warn-rule px-4 py-3 rounded-r-md">
      <strong>주의</strong> · 등장인물 정보는 본 작품의 전개와 관련된 <em className="not-italic font-semibold">스포일러</em>를 포함할 수 있습니다.
    </p>
  )
}

// ─── helpers ─────────────────────────────────────────────

function latestPublished(manifest: SeriesManifest): string | undefined {
  const dates = manifest.chapters
    .map((c) => c.published)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort((a, b) => a.localeCompare(b))
  return dates.at(-1)
}
