import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Header } from '../widgets/header/index.js'
import { Footer } from '../widgets/footer/index.js'
import { HomePage } from '../pages/home/index.js'
import { AboutPage } from '../pages/about/index.js'
import { NoticePage } from '../pages/notice/index.js'
import { SeriesPage } from '../pages/series/index.js'
import { ChapterPage } from '../pages/chapter/index.js'
import { CharacterPage } from '../pages/character/index.js'
import { applyTheme, getTheme } from '../shared/lib/theme.js'

// Apply saved theme override before first paint to avoid flicker.
applyTheme(getTheme())

function App() {
  return (
    <HashRouter>
      <Header />
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
      <Footer />
    </HashRouter>
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
