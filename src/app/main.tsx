import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from '../widgets/header'
import { Footer } from '../widgets/footer'
import { HomePage } from '../pages/home'
import { AboutPage } from '../pages/about'
import { NoticePage } from '../pages/notice'
import { SeriesPage } from '../pages/series'
import { ChapterPage } from '../pages/chapter'
import { CharacterPage } from '../pages/character'
import { applyTheme, getTheme } from '../shared/lib/theme.js'
import { ErrorBoundary } from '../shared/ui/error-boundary'

// Apply saved theme override before first paint to avoid flicker.
applyTheme(getTheme())

// `import.meta.env.BASE_URL` 은 vite.config.ts 의 `base` 값을 그대로 노출
// (production = '/H-eries/', dev = '/'). BrowserRouter 의 basename 은
// trailing slash 가 없어야 하므로 제거 — 결과: production='/H-eries', dev=''.
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Header />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/series/:slug" element={<SeriesPage />} />
          <Route path="/series/:slug/chapter/:episode" element={<ChapterPage />} />
          <Route path="/series/:slug/character/:id" element={<CharacterPage />} />
          <Route
            path="*"
            element={
              <main>
                <p className="empty">페이지를 찾을 수 없습니다.</p>
              </main>
            }
          />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </BrowserRouter>
  )
}

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
