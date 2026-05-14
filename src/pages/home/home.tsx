import {Link} from 'react-router-dom'
import {assetUrl} from '../../shared/lib/env.js'
import {fetchSeriesIndex} from '../../shared/lib/manifest.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {SeriesList} from '../../widgets/series-list'
import {MiniGameLauncher} from '../../features/mini-game'

const HERO_IMAGE = assetUrl('content/_shared/images/thumbnail-placeholder.webp')
const HERO_ALT = 'H-eries — 작가(홍도산) 의 오리지널 웹 시리즈 컬렉션'

export function HomePage() {
  useDocumentTitle('')
  const state = useAsync(() => fetchSeriesIndex(), [])

  return (
    <main className="page-home">
      <header className="home-hero">
        <div className="home-hero-figure-col">
          <figure className="home-hero-figure">
            <img src={HERO_IMAGE} alt={HERO_ALT} loading="eager"/>
          </figure>
        </div>

        <div className="home-hero-text">
          <p className="home-hero-eyebrow">ORIGINAL · WEB SERIES</p>

          <h1 className="home-hero-title">
            작가(홍도산) 의 오리지널 웹 시리즈 컬렉션.
          </h1>

          <p className="home-hero-cta">
            <Link to="/about">H-eries 가 무엇인가요? →</Link>
          </p>
        </div>
      </header>

      <MiniGameLauncher/>

      <h2>작품 목록</h2>
      {state.status === 'loading' && <p className="loading">불러오는 중…</p>}
      {state.status === 'error' && <p className="empty">오류: {state.error.message}</p>}
      {state.status === 'success' && <SeriesList items={state.data.series}/>}
    </main>
  )
}
