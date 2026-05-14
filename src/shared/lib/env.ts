// 작가 모드 = sessionStorage `heries:author=1` flag (정책 #9 v2).
// 키 검증 통과 시 set, 탭 닫으면 자동 잠금. 외부에서 변경 시 'storage' event 로 동기.
const AUTHOR_STORAGE_KEY = 'heries:author'

export function isAuthorMode(): boolean {
  try {
    return globalThis.sessionStorage?.getItem(AUTHOR_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setAuthorMode(on: boolean): void {
  try {
    if (on) {
      globalThis.sessionStorage?.setItem(AUTHOR_STORAGE_KEY, '1')
    } else {
      globalThis.sessionStorage?.removeItem(AUTHOR_STORAGE_KEY)
    }
    // 같은 탭 안 다른 컴포넌트에 알림 (storage event 는 다른 탭에만 발화).
    globalThis.dispatchEvent(new CustomEvent('heries:author-mode-changed'))
  } catch {
    // sessionStorage 비활성 환경 (SSR / private mode) — silent.
  }
}

// 작가 모드 키 검증. 빌드 환경변수 VITE_AUTHOR_KEY 와 평문 비교.
// 환경변수 미설정 시 = 작가 모드 진입 불가 (false 반환).
export function verifyAuthorKey(input: string): boolean {
  const expected = import.meta.env['VITE_AUTHOR_KEY']
  if (!expected || typeof expected !== 'string') return false
  return input === expected
}

const BASE = import.meta.env.BASE_URL

export function assetUrl(rel: string): string {
  const trimmed = rel.replace(/^\.?\//, '')
  return `${BASE}${trimmed}`
}
