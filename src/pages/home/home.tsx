import {lazy, Suspense} from 'react'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {HomeHero} from '../../widgets/home-hero'

// 게임 슬라이스 = 80+ KB. 사용자가 메뉴를 안 누르면 fetch X (route-based split).
const MiniGameLauncher = lazy(() =>
  import('../../features/mini-game').then((m) => ({default: m.MiniGameLauncher})),
)

/**
 * 홈 페이지 (`/`) — Hero CTA 중심.
 *
 * **디자인 정합** (2026-05-19 시안 ep-01-1.webp): 큰 헤드라인 + 부제 + *시리즈 보러 가기* CTA.
 * 작품 목록 = `/series` 페이지로 분리 (ep-01-4.webp 시안 정합).
 */
export function HomePage() {
  useDocumentTitle('')

  return (
    <main className="flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9">
      <HomeHero/>

      <Suspense fallback={null}>
        <MiniGameLauncher/>
      </Suspense>
    </main>
  )
}
