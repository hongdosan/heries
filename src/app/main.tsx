import {lazy, StrictMode, Suspense, type ReactNode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom'
import '../shared/styles/tokens.css'
import '../shared/styles/tailwind.css'
import '../shared/styles/base.css'
import '../shared/styles/typography.css'
import '../shared/styles/layout.css'
import '../shared/styles/utilities.css'
import '../shared/styles/author-mode.css'
import '../shared/styles/responsive.css'
import {Header} from '../widgets/header'
import {Footer} from '../widgets/footer'
// Home = 초기 진입 (eager). 그 외 page = route 별 chunk 분리 (lazy).
import {HomePage} from '../pages/home'
import {Loading} from '../shared/ui/loading'
const AboutPage = lazy(() => import('../pages/about').then((m) => ({default: m.AboutPage})))
const NoticePage = lazy(() => import('../pages/notice').then((m) => ({default: m.NoticePage})))
const SeriesPage = lazy(() => import('../pages/series').then((m) => ({default: m.SeriesPage})))
const ChapterPage = lazy(() => import('../pages/chapter').then((m) => ({default: m.ChapterPage})))
const CharacterPage = lazy(() => import('../pages/character').then((m) => ({default: m.CharacterPage})))
const UnlockPage = lazy(() => import('../pages/unlock').then((m) => ({default: m.UnlockPage})))
const NotFoundPage = lazy(() => import('../pages/not-found').then((m) => ({default: m.NotFoundPage})))
import {useScrollbarAutoHide} from '../shared/lib/use-scrollbar-autohide.js'
import {ErrorBoundary} from '../shared/ui/error-boundary'

// Theme 적용은 index.html 의 inline script 에서 first-paint 전 처리 (FOUC 차단).
// React Compiler 'all' 모드 = 컴파일된 utility 함수 (applyTheme 등) 가 useMemoCache hook 호출 →
// module top-level 호출 시 React tree 밖이라 fail. 따라서 React 진입 전 호출은 inline script.

// `import.meta.env.BASE_URL` 은 vite.config.ts 의 `base` 값을 그대로 노출
// (reader production = '/heries/' — GitHub repo prefix / author build = '/' /
// dev = '/'). BrowserRouter 의 basename 은 trailing slash 가 없어야 하므로
// 제거 — 결과: reader production='/heries', author/dev=''.
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '')

// 라우트 변경 시 fade-in transition wrapper. useLocation.key 변경 → div remount
// → CSS animation 재실행. prefers-reduced-motion 환경은 animation 무력화 (responsive.css).
function RouteTransition({children}: Readonly<{ children: ReactNode }>) {
  const location = useLocation()
  return (
    <div key={location.key} className="route-transition">
      {children}
    </div>
  )
}

function App() {
  useScrollbarAutoHide()
  return (
    <BrowserRouter basename={BASENAME}>
      <a
        href="#main"
        className="absolute top-0 left-0 py-2 px-4 text-sm font-semibold rounded-br-sm -translate-y-full z-[100] focus:translate-y-0 focus:outline focus:outline-2 focus:outline-accent-ring focus:outline-offset-2"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' }}
      >본문으로 건너뛰기</a>
      <Header/>
      <ErrorBoundary>
        <div id="main"/>
        <RouteTransition>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<ErrorBoundary><HomePage/></ErrorBoundary>}/>
              <Route path="/about" element={<ErrorBoundary><AboutPage/></ErrorBoundary>}/>
              <Route path="/notice" element={<ErrorBoundary><NoticePage/></ErrorBoundary>}/>
              <Route path="/unlock" element={<ErrorBoundary><UnlockPage/></ErrorBoundary>}/>
              <Route path="/series/:slug" element={<ErrorBoundary><SeriesPage/></ErrorBoundary>}/>
              <Route path="/series/:slug/chapter/:episode"
                     element={<ErrorBoundary><ChapterPage/></ErrorBoundary>}/>
              <Route path="/series/:slug/character/:id"
                     element={<ErrorBoundary><CharacterPage/></ErrorBoundary>}/>
              <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
          </Suspense>
        </RouteTransition>
      </ErrorBoundary>
      <Footer/>
    </BrowserRouter>
  )
}

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App/>
    </StrictMode>,
  )
}
