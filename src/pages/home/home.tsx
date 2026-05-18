import {lazy, Suspense} from 'react'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {HomeHero} from '../../widgets/home-hero'
import {SeriesSection} from '../../widgets/series-section'

// 게임 슬라이스 = 80+ KB. 사용자가 메뉴를 안 누르면 fetch X (route-based split).
const MiniGameLauncher = lazy(() =>
  import('../../features/mini-game').then((m) => ({default: m.MiniGameLauncher})),
)

export function HomePage() {
  useDocumentTitle('')

  return (
    <main className="flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9">
      <HomeHero/>

      <Suspense fallback={null}>
        <MiniGameLauncher/>
      </Suspense>

      <SeriesSection/>
    </main>
  )
}
