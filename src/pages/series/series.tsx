import type {CSSProperties} from 'react'
import {Link, useParams, useSearchParams} from 'react-router-dom'
import {loadSeries} from '../../entities/series'
import {assetUrl} from '../../shared/lib/env.js'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {Empty} from '../../shared/ui/empty'
import {Loading} from '../../shared/ui/loading'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'
import {ChapterToc} from '../../widgets/chapter-toc'
import {CharacterList} from '../../widgets/character-list'
import {lazy, Suspense} from 'react'
// 게임 슬라이스 = 80+ KB. 사용자가 메뉴를 안 누르면 fetch X.
const MiniGameLauncher = lazy(() =>
  import('../../features/mini-game').then((m) => ({default: m.MiniGameLauncher})),
)

type Tab = 'overview' | 'chapters' | 'characters' | 'author'
const TABS: ReadonlyArray<Tab> = ['overview', 'chapters', 'characters', 'author']

export function SeriesPage() {
  const {slug = ''} = useParams<{ slug: string }>()
  const state = useAsync(() => loadSeries(slug), [slug])
  const cover = useImgFallback()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthor = useAuthorMode()
  useDocumentTitle(state.status === 'success' ? state.data.manifest.title : '')

  const rawTab = searchParams.get('tab') as Tab | null
  const tab: Tab = rawTab && TABS.includes(rawTab) ? rawTab : 'overview'
  const setTab = (next: Tab) => {
    if (next === 'overview') setSearchParams({}, {replace: false})
    else setSearchParams({tab: next}, {replace: false})
  }

  const mainCls = 'flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9'
  if (state.status === 'loading') return <main className={mainCls}><Loading /></main>
  if (state.status === 'error') return <main className={mainCls}><Empty>오류: {state.error.message}</Empty></main>

  const {manifest, bodyHtml} = state.data
  const chapterCount = manifest.chapters.length
  const characterCount = manifest.characters.length
  const coverSrc = !manifest.thumbnail || cover.fatal
    ? null
    : cover.error
      ? PLACEHOLDER_THUMB
      : assetUrl(`content/series/${slug}/${manifest.thumbnail}`)

  const tabBtnCls = 'px-4 py-3 text-md font-medium -mb-px transition-[color,border-color] cursor-pointer hover:text-fg-2'
  // active = inline style (CSS var 직접 참조 → 다크 모드 자동 + Tailwind purge/HMR 영향 0).
  const tabBtnStyle = (active: boolean): CSSProperties =>
    active
      ? { color: 'var(--accent)', borderBottom: '2px solid var(--accent)', fontWeight: 600 }
      : { color: 'var(--fg-3)', borderBottom: '2px solid transparent' }

  return (
    <main className={mainCls}>
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <span>{manifest.title}</span>
      </nav>

      <header
        className={
          coverSrc
            ? 'pt-2 pb-6 border-b border-rule mb-6 grid grid-cols-[clamp(220px,24vw,320px)_1fr] items-end gap-6 max-sm:grid-cols-1 max-sm:items-stretch'
            : 'pt-2 pb-6 border-b border-rule mb-6 flex items-baseline gap-4 flex-wrap'
        }
      >
        {coverSrc && (
          <div className="aspect-[16/9] rounded-md overflow-hidden bg-bg-soft border border-rule max-sm:max-w-full">
            <img src={coverSrc} alt="" loading="eager" onError={cover.onError} className="w-full h-full object-cover block" />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <h1 className="m-0">{manifest.title}</h1>
          <div className="flex items-center gap-3 text-sm text-fg-3">
            <span className="inline-block py-[3px] px-[10px] bg-accent-soft text-accent rounded-pill text-xs font-semibold tracking-[0.04em]">{manifest.status}</span>
            {manifest.started && /^\d{4}-\d{2}-\d{2}$/.test(manifest.started) && (
              <time dateTime={manifest.started}>시작 {manifest.started}</time>
            )}
          </div>
        </div>
      </header>

      <div className="flex gap-2 border-b border-rule mb-6 relative flex-wrap" role="tablist" aria-label="시리즈 섹션">
        <button role="tab" aria-selected={tab === 'overview'} className={tabBtnCls} style={tabBtnStyle(tab === 'overview')}
                onClick={() => setTab('overview')}>개요
        </button>
        <button role="tab" aria-selected={tab === 'chapters'} className={tabBtnCls} style={tabBtnStyle(tab === 'chapters')}
                onClick={() => setTab('chapters')}>
          챕터<span className="text-xs ml-2 tabular-nums" style={{ color: tab === 'chapters' ? 'var(--accent)' : 'var(--fg-4)' }}>{chapterCount}</span>
        </button>
        <button role="tab" aria-selected={tab === 'characters'} className={tabBtnCls} style={tabBtnStyle(tab === 'characters')}
                onClick={() => setTab('characters')}>
          등장인물<span className="text-xs ml-2 tabular-nums" style={{ color: tab === 'characters' ? 'var(--accent)' : 'var(--fg-4)' }}>{characterCount}</span>
        </button>
        {isAuthor && (
          <button role="tab" aria-selected={tab === 'author'} className={tabBtnCls} style={tabBtnStyle(tab === 'author')}
                  onClick={() => setTab('author')}>
            작가 전용<span className="author-only-badge">AUTHOR</span>
          </button>
        )}
      </div>

      {tab === 'overview' && (
        <article className="article article-wiki" dangerouslySetInnerHTML={{__html: bodyHtml}}/>
      )}
      {tab === 'chapters' && (
        <ChapterToc slug={slug} chapters={manifest.chapters}/>
      )}
      {tab === 'characters' && (
        <CharacterList slug={slug} characters={manifest.characters}/>
      )}
      {tab === 'author' && isAuthor && (
        <section className="mt-5">
          <p className="m-0 mb-5 p-3 px-4 border-l-[3px] border-l-warn-rule bg-bg-soft text-fg-2 text-sm rounded-r-md">
            본 탭은 <span className="author-only-badge">AUTHOR</span> 모드 빌드에서만 노출되는
            작가 전용 자료 인덱스입니다. 시놉시스·세계관·연표·용어집·캐릭터 카드의 <em className="text-accent not-italic">H-eries 분기</em> 절은 reader 빌드에서 마스킹되므로, 본 탭에서 한곳에 모아 추적합니다.
          </p>
          <ul className="list-disc pl-6 m-0 mb-5 text-sm leading-[1.8] text-fg-2 [&_strong]:text-fg [&_strong]:font-semibold [&_code]:bg-code-bg [&_code]:py-px [&_code]:px-1.5 [&_code]:rounded-sm [&_code]:font-mono [&_code]:text-[0.88em] [&_em]:text-accent [&_em]:not-italic">
            <li><strong>시놉시스</strong> — 개요 탭의 <em>## 시놉시스</em> 절</li>
            <li><strong>세계관</strong> — <code>content/series/{slug}/worldbuilding/</code></li>
            <li><strong>연표</strong> — <code>content/series/{slug}/timeline/</code></li>
            <li><strong>용어집</strong> — <code>content/series/{slug}/glossary/</code></li>
            <li><strong>캐릭터 H-eries 분기</strong> — 각 캐릭터 페이지의 <em>## H-eries 분기 ~</em> 절 + frontmatter <code>heries_arc</code></li>
          </ul>
        </section>
      )}
      <Suspense fallback={null}>
        <MiniGameLauncher/>
      </Suspense>
    </main>
  )
}
