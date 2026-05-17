import {useState} from 'react'
import {getTheme, nextTheme, setTheme, type Theme} from '../../shared/lib/theme.js'

/**
 * 헤더 내 테마 순환 토글 위젯.
 *
 * 클릭 시 `auto → light → dark → auto` 순환. localStorage 영속 + DOM
 * `<html data-theme="...">` 즉시 반영 (theme.ts 의 setTheme 책임).
 *
 * **글리프**: ◐ (auto) / ○ (light) / ● (dark) — 현재 상태 시각 표시.
 * aria-label / title 은 한글 라벨 ("시스템" / "라이트" / "다크").
 */
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

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

  const cycle = () => {
    const next = nextTheme(theme)
    setTheme(next)
    setThemeState(next)
  }

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center px-2 py-1 text-fg-3 rounded-sm transition-[color,background] hover:text-accent hover:bg-accent-soft cursor-pointer"
      onClick={cycle}
      aria-label={`테마: ${THEME_LABEL[theme]} (눌러서 전환)`}
      title={`테마 — 현재: ${THEME_LABEL[theme]}`}
    >
      <span className="text-lg leading-none" aria-hidden="true">{THEME_GLYPH[theme]}</span>
    </button>
  )
}
