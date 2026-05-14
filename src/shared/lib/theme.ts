// Manual theme override with system-auto fallback.
// Stored in localStorage. Applied via data-theme attribute on <html>.
// CSS uses :root[data-theme="dark"] / [data-theme="light"] overrides on top
// of @media (prefers-color-scheme: dark).

export type Theme = 'light' | 'dark' | 'auto'
export const THEMES: ReadonlyArray<Theme> = ['auto', 'light', 'dark']

// localStorage 키 prefix 일관성: heries:<feature> 소문자
const STORAGE_KEY = 'heries:theme'

export function getTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    // localStorage may be unavailable (SSR, private mode)
  }
  return 'auto'
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

export function setTheme(theme: Theme): void {
  try {
    if (theme === 'auto') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore storage failure; in-memory toggle still works
  }
  applyTheme(theme)
}

export function nextTheme(current: Theme): Theme {
  const i = THEMES.indexOf(current)
  return THEMES[(i + 1) % THEMES.length] ?? 'auto'
}
