import {useState} from 'react'
import {getTheme, nextTheme, setTheme, type Theme} from '../../shared/lib/theme.js'

/**
 * 헤더 내 테마 순환 토글 위젯.
 *
 * 클릭 시 `auto → light → dark → auto` 순환. localStorage 영속 + DOM
 * `<html data-theme="...">` 즉시 반영 (theme.ts 의 setTheme 책임).
 *
 * **아이콘** (Lucide-style SVG, 의존 0 정합):
 * - auto: monitor (시스템)
 * - light: sun (라이트)
 * - dark: moon (다크)
 *
 * unicode 글리프 (◐○●) 사용 시 폰트 metric 으로 박스 안 위쪽에 떠 보이는 이슈 발생 →
 * SVG 로 교체해 다른 헤더 액션 (Lock/Mail) 과 정렬·크기 모두 통일.
 */
const MonitorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
)

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const THEME_ICON: Record<Theme, () => React.JSX.Element> = {
  auto: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
}

const THEME_LABEL: Record<Theme, string> = {
  auto: '시스템',
  light: '라이트',
  dark: '다크',
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

  const cycle = () => {
    const next = nextTheme(theme)
    setTheme(next)
    setThemeState(next)
  }

  const Icon = THEME_ICON[theme]

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center px-2 py-1 text-fg-3 rounded-sm transition-[color,background] hover:text-accent hover:bg-accent-soft cursor-pointer"
      onClick={cycle}
      aria-label={`테마: ${THEME_LABEL[theme]} (눌러서 전환)`}
      title={`테마 — 현재: ${THEME_LABEL[theme]}`}
    >
      <Icon />
    </button>
  )
}
