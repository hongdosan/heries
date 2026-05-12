import {useState} from 'react'
import {Link} from 'react-router-dom'
import {IS_AUTHOR_MODE} from '../../shared/lib/env.js'
import {getTheme, nextTheme, setTheme, type Theme} from '../../shared/lib/theme.js'

// 연락처 = 작가(hong) 의 사이드 프로젝트 통합 문의 메일.
const CONTACT_USER = 'contact_hongdosan'
const CONTACT_DOMAIN = 'naver.com'

const THEME_GLYPH: Record<Theme, string> = {
  auto: '◐',
  light: '○',
  dark: '●',
}

export function Header() {
  const mailto = `mailto:${CONTACT_USER}@${CONTACT_DOMAIN}`
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const cycleTheme = () => {
    const next = nextTheme(theme)
    setTheme(next)
    setThemeState(next)
  }

  return (
    <header className="site-header">
      <div className="site-header-row">
        <div className="brand">
          <div className="brand-row">
            <Link to="/" className="brand-link">heries</Link>
            {IS_AUTHOR_MODE && <span className="author-badge" title="작가 모드">AUTHOR</span>}
          </div>
          <p className="meta">비상업적 크로스팬픽 웹 시리즈</p>
        </div>
        <div className="site-header-actions">
          <a
            className="header-contact"
            href={mailto}
            aria-label={`원작 권리자 저작권 문의 또는 아이디어 제보 — ${CONTACT_USER}@${CONTACT_DOMAIN}`}
          >
            <span className="header-contact-label">
              <span className="header-contact-label-full">저작권 · 아이디어 문의</span>
              <span className="header-contact-label-short" aria-hidden="true">문의</span>
            </span>
            <span className="header-contact-mail" aria-hidden="true">
              {CONTACT_USER}<span>@</span>{CONTACT_DOMAIN}
            </span>
          </a>

          <button
            type="button"
            className="theme-toggle"
            onClick={cycleTheme}
          >
            <span className="theme-toggle-glyph" aria-hidden="true">{THEME_GLYPH[theme]}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
