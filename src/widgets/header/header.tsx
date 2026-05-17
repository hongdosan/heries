import {useState} from 'react'
import {Link} from 'react-router-dom'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import {getTheme, nextTheme, setTheme, type Theme} from '../../shared/lib/theme.js'

const CONTACT_USER = 'contact_hongdosan'
const CONTACT_DOMAIN = 'naver.com'

const THEME_GLYPH: Record<Theme, string> = {
  auto: '◐',
  light: '○',
  dark: '●',
}

const THEME_LABEL: Record<Theme, string> = {
  auto: '시스템',
  light: '라이트',
  dark: '다크',
}

export function Header() {
  const mailto = `mailto:${CONTACT_USER}@${CONTACT_DOMAIN}`
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const isAuthor = useAuthorMode()
  const cycleTheme = () => {
    const next = nextTheme(theme)
    setTheme(next)
    setThemeState(next)
  }

  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[10px] backdrop-saturate-[1.8] border-b border-rule">
      <div className="max-w-page mx-auto px-[clamp(16px,4vw,32px)] py-3 flex items-center justify-between gap-4 min-h-[clamp(52px,6vh,64px)] sm:min-h-[clamp(48px,6vh,56px)]">
        <div className="flex flex-col gap-[2px] leading-[1.1]">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-[-0.02em] text-fg">H-eries</Link>
            {isAuthor && (
              <Link
                to="/unlock"
                className="inline-block ml-2 px-2 py-[2px] bg-warn-bg text-warn-fg border border-warn-rule rounded-pill text-[11px] font-bold tracking-[0.06em] uppercase no-underline transition-[background-color,transform] duration-150 hover:bg-warn-rule hover:-translate-y-px focus-visible:bg-warn-rule focus-visible:-translate-y-px"
                title="작가 모드 — 클릭하여 잠금 관리"
              >AUTHOR</Link>
            )}
          </div>
          <p className="text-xs text-fg-3 m-0 font-normal max-sm:hidden">오리지널 웹 시리즈 컬렉션</p>
        </div>
        <div className="inline-flex items-center gap-4 sm:gap-2">
          <a
            className="inline-flex flex-col items-end gap-px text-fg-2 leading-[1.2] transition-colors whitespace-nowrap py-1 hover:text-accent"
            href={mailto}
            aria-label={`저작권 문의 또는 아이디어 제보 — ${CONTACT_USER}@${CONTACT_DOMAIN}`}
          >
            <span className="font-semibold tracking-[0.02em] text-sm">
              <span className="max-sm:hidden">저작권 · 아이디어 문의</span>
              <span className="sm:hidden" aria-hidden="true">문의</span>
            </span>
            <span className="font-mono text-[11px] text-fg-3 tracking-[0.01em] max-sm:hidden" aria-hidden="true">
              {CONTACT_USER}<span>@</span>{CONTACT_DOMAIN}
            </span>
          </a>

          <button
            type="button"
            className="inline-flex items-baseline gap-2 px-2 py-1 text-fg-3 text-sm rounded-sm transition-[color,background] hover:text-accent hover:bg-accent-soft"
            onClick={cycleTheme}
            aria-label={`테마: ${THEME_LABEL[theme]} (눌러서 전환)`}
            title={`테마 — 현재: ${THEME_LABEL[theme]}`}
          >
            <span className="text-base leading-none" aria-hidden="true">{THEME_GLYPH[theme]}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
