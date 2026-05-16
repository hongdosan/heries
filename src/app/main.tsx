import {StrictMode, type ReactNode} from 'react'
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
import {HomePage} from '../pages/home'
import {AboutPage} from '../pages/about'
import {NoticePage} from '../pages/notice'
import {SeriesPage} from '../pages/series'
import {ChapterPage} from '../pages/chapter'
import {CharacterPage} from '../pages/character'
import {UnlockPage} from '../pages/unlock'
import {NotFoundPage} from '../pages/not-found'
import {applyTheme, getTheme} from '../shared/lib/theme.js'
import {useScrollbarAutoHide} from '../shared/lib/use-scrollbar-autohide.js'
import {ErrorBoundary} from '../shared/ui/error-boundary'

// Apply saved theme override before first paint to avoid flicker.
applyTheme(getTheme())

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
      <a href="#main" className="skip-link">본문으로 건너뛰기</a>
      <Header/>
      <ErrorBoundary>
        <div id="main"/>
        <RouteTransition>
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
