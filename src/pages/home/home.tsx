import {Link} from 'react-router-dom'
import {assetUrl} from '../../shared/lib/env.js'
import {fetchSeriesIndex} from '../../shared/lib/manifest.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {SeriesList} from '../../widgets/series-list'

const HERO_IMAGE = assetUrl('content/_shared/thumbnail-placeholder.webp')
const HERO_ALT =
  'H-eries — 작가(홍도산) 의 오리지널 다중/평행 세계 웹 시리즈'

export function HomePage() {
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
          <p className="home-hero-eyebrow">MULTIVERSE · ORIGINAL · WEB SERIES</p>

          <h1 className="home-hero-title">
            여러 우주의 주인공이 한 무대에서 부딪히는<br/>
            작가(홍도산) 의 오리지널 다중/평행 세계 시리즈.
          </h1>

          <p className="home-hero-cta">
            <Link to="/about">H-eries 가 무엇인가요? →</Link>
          </p>
        </div>
      </header>
      <h2>작품 목록</h2>
      {state.status === 'loading' && <p className="loading">불러오는 중…</p>}
      {state.status === 'error' && <p className="empty">오류: {state.error.message}</p>}
      {state.status === 'success' && <SeriesList items={state.data.series}/>}
    </main>
  )
}
