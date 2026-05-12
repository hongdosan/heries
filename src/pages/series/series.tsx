import {Link, useParams, useSearchParams} from 'react-router-dom'
import {loadSeries} from '../../entities/series'
import {assetUrl} from '../../shared/lib/env.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {PLACEHOLDER_THUMB, useImgFallback} from '../../shared/lib/use-img-fallback.js'
import {ChapterToc} from '../../widgets/chapter-toc'
import {CharacterList} from '../../widgets/character-list'

type Tab = 'overview' | 'chapters' | 'characters'
const TABS: ReadonlyArray<Tab> = ['overview', 'chapters', 'characters']

export function SeriesPage() {
  const {slug = ''} = useParams<{ slug: string }>()
  const state = useAsync(() => loadSeries(slug), [slug])
  const cover = useImgFallback()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawTab = searchParams.get('tab') as Tab | null
  const tab: Tab = rawTab && TABS.includes(rawTab) ? rawTab : 'overview'
  const setTab = (next: Tab) => {
    if (next === 'overview') setSearchParams({}, {replace: false})
    else setSearchParams({tab: next}, {replace: false})
  }

  if (state.status === 'loading') return <main className="page-series"><p className="loading">불러오는
    중…</p></main>
  if (state.status === 'error') return <main className="page-series"><p
    className="empty">오류: {state.error.message}</p></main>

  const {manifest, bodyHtml} = state.data
  const chapterCount = manifest.chapters.length
  const characterCount = manifest.characters.length
  const coverSrc = !manifest.thumbnail || cover.fatal
    ? null
    : cover.error
      ? PLACEHOLDER_THUMB
      : assetUrl(`content/series/${slug}/${manifest.thumbnail}`)

  return (
    <main className="page-series">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <span>{manifest.title}</span>
      </nav>

      <header className={`series-hero${coverSrc ? ' has-cover' : ''}`}>
        {coverSrc && (
          <div className="series-cover">
            <img src={coverSrc} alt="" loading="eager" onError={cover.onError}/>
          </div>
        )}
        <div className="series-hero-text">
          <h1>{manifest.title}</h1>
          <div className="meta-row">
            <span className="status-pill">{manifest.status}</span>
            {manifest.started && <time dateTime={manifest.started}>시작 {manifest.started}</time>}
          </div>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="시리즈 섹션">
        <button role="tab" aria-selected={tab === 'overview'} className="tab-btn"
                onClick={() => setTab('overview')}>개요
        </button>
        <button role="tab" aria-selected={tab === 'chapters'} className="tab-btn"
                onClick={() => setTab('chapters')}>
          챕터<span className="tab-count">{chapterCount}</span>
        </button>
        <button role="tab" aria-selected={tab === 'characters'} className="tab-btn"
                onClick={() => setTab('characters')}>
          등장인물<span className="tab-count">{characterCount}</span>
        </button>
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
    </main>
  )
}
