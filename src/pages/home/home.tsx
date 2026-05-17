import {Link} from 'react-router-dom'
import {fetchSeriesIndex} from '../../shared/lib/manifest.js'
import {useAsync} from '../../shared/lib/use-async.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {SeriesList} from '../../widgets/series-list'
import {MiniGameLauncher} from '../../features/mini-game'
import {Empty} from '../../shared/ui/empty'
import {Loading} from '../../shared/ui/loading'
import HERO_IMAGE from '../../shared/images/thumbnail-placeholder.webp?url'
const HERO_ALT = 'H-eries — 작가(홍도산) 의 오리지널 웹 시리즈 컬렉션'

export function HomePage() {
  useDocumentTitle('')
  const state = useAsync(() => fetchSeriesIndex(), [])

  return (
    <main className="flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9">
      <header className="grid grid-cols-[1fr_3fr] gap-5 items-stretch pt-6 pb-7 max-sm:grid-cols-1 max-sm:gap-4">
        <div className="flex flex-col gap-2">
          <figure className="m-0 w-full aspect-[16/9] rounded-lg overflow-hidden bg-bg-soft shadow-soft">
            <img src={HERO_IMAGE} alt={HERO_ALT} loading="eager" className="block w-full h-full object-cover" />
          </figure>
        </div>

        <div className="flex flex-col justify-center gap-2 min-h-0 overflow-hidden">
          <p className="m-0 w-full text-xs font-semibold tracking-[0.16em] uppercase text-fg-3 whitespace-nowrap overflow-hidden text-ellipsis">ORIGINAL · WEB SERIES</p>

          <h1 className="m-0 text-lg font-normal tracking-normal leading-[1.45] text-fg-3">
            작가(홍도산) 의 오리지널 웹 시리즈 컬렉션.
          </h1>

          <p className="m-0 text-sm">
            <Link to="/about" className="font-semibold border-b border-accent-ring pb-[2px] transition-[color,border-color] hover:border-accent-hover">H-eries 가 무엇인가요? →</Link>
          </p>
        </div>
      </header>

      <MiniGameLauncher/>

      <h2>작품 목록</h2>
      {state.status === 'loading' && <Loading />}
      {state.status === 'error' && <Empty>오류: {state.error.message}</Empty>}
      {state.status === 'success' && <SeriesList items={state.data.series}/>}
    </main>
  )
}
