import {Link} from 'react-router-dom'
import {fetchSeriesIndex} from '../../shared/lib/manifest.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {SeriesList} from '../../widgets/series-list/index.js'

const HERO_IMAGE = './content/_shared/thumbnail-placeholder.webp'
const HERO_ALT =
  'heries — 여러 우주의 주인공이 한 무대에서 만나는 비상업적 크로스오버 팬픽 컬렉션'

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
          <p className="home-hero-eyebrow">CROSSOVER · FANFICTION · WEB SERIES</p>

          <h1 className="home-hero-title">
            여러 우주의 주인공이 한 무대에서 만나는<br/>
            비상업적 크로스오버 팬픽 컬렉션.
          </h1>

          <p className="home-hero-cta">
            <Link to="/about">heries 가 무엇인가요? →</Link>
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
