import {Link} from 'react-router-dom'
import {AuthorModeToggle} from '../author-mode-toggle'
import {ThemeToggle} from '../theme-toggle'

const CONTACT_USER = 'contact_hongdosan'
const CONTACT_DOMAIN = 'naver.com'

export function Header() {
  const mailto = `mailto:${CONTACT_USER}@${CONTACT_DOMAIN}`

  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[10px] backdrop-saturate-[1.8] border-b border-rule">
      <div className="max-w-page mx-auto px-[clamp(16px,4vw,32px)] py-3 flex items-center justify-between gap-4 min-h-[clamp(52px,6vh,64px)] sm:min-h-[clamp(48px,6vh,56px)]">
        <div className="flex flex-col gap-0.5 leading-[1.1]">
          <Link to="/" className="text-xl font-bold tracking-[-0.02em] text-fg">H-eries</Link>
          <p className="text-xs text-fg-3 m-0 font-normal max-sm:hidden">오리지널 웹 시리즈 컬렉션</p>
        </div>
        <div className="inline-flex items-center gap-4 sm:gap-2">
          <AuthorModeToggle />
          <ThemeToggle />
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
        </div>
      </div>
    </header>
  )
}
