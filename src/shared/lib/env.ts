/**
 * 작가 모드 (Author Mode) — 정책 #9 v2 (2026-05-14).
 *
 * **개념**: 동일한 dist 빌드 안에 작가 콘텐츠 (시놉시스, 캐릭터 H-eries 분기, 세계관 등) 가
 * 평문으로 포함되지만, 기본 화면에서는 runtime 으로 마스킹된다.
 * 작가가 키를 입력하면 sessionStorage flag 가 set 되어 마스킹이 해제된다.
 *
 * **흐름**:
 * 1. `/unlock` 페이지에서 작가가 키 입력 (또는 `?unlock=KEY` 쿼리)
 * 2. `verifyAuthorKey()` 가 `VITE_AUTHOR_KEY` 환경변수와 비교
 * 3. 일치하면 `setAuthorMode(true)` → sessionStorage `heries:author=1` set
 * 4. 같은 탭의 모든 컴포넌트는 `useAuthorMode()` hook 으로 자동 재 render
 * 5. 탭 닫으면 sessionStorage 자동 휘발 → 다음 방문 시 다시 잠금
 *
 * **보안 수준**: low — devtools 우회 가능 (능동 우회는 *독자 자기 책임*).
 * 키는 빌드 시점에 dist 에 포함되나 GitHub Secret + .env.local 로 git 노출 0.
 */

// sessionStorage 키 — heries:* prefix 컨벤션 (다른 앱 충돌 회피).
const AUTHOR_STORAGE_KEY = 'heries:author'

/**
 * 현재 작가 모드 활성 여부.
 *
 * sessionStorage 비활성 환경 (private mode, SSR 등) 에서는 false 반환.
 * useAuthorMode hook 이 본 함수를 호출 + 'storage'/'heries:author-mode-changed' 이벤트 구독.
 */
export function isAuthorMode(): boolean {
  try {
    return globalThis.sessionStorage?.getItem(AUTHOR_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * 작가 모드 set / unset.
 *
 * - `on=true`: sessionStorage flag set
 * - `on=false`: sessionStorage flag 제거 (사용자가 "잠그기" 누름)
 *
 * 같은 탭 안 다른 컴포넌트 (Header 의 AUTHOR 배지 등) 가 즉시 반응하도록
 * custom event `heries:author-mode-changed` 를 dispatch. 다른 탭은 native `storage` event 로 알림.
 */
export function setAuthorMode(on: boolean): void {
  try {
    if (on) {
      globalThis.sessionStorage?.setItem(AUTHOR_STORAGE_KEY, '1')
    } else {
      globalThis.sessionStorage?.removeItem(AUTHOR_STORAGE_KEY)
    }
    // 같은 탭 동기화 — storage event 는 다른 탭에서만 발화하므로 별도 custom event 필요.
    globalThis.dispatchEvent(new CustomEvent('heries:author-mode-changed'))
  } catch {
    // sessionStorage 비활성 환경 (SSR / private mode) — silent fail (UX 영향 작음).
  }
}

/**
 * 입력된 작가 키 검증.
 *
 * - 빌드 환경변수 `VITE_AUTHOR_KEY` 와 평문 비교
 * - 환경변수 미설정 시 작가 모드 진입 불가 (항상 false)
 *
 * **환경변수 설정**:
 * - 로컬: `.env.local` (gitignored, 또는 .private-config 서브모듈 안)
 * - 배포: GitHub Secret 으로 deploy.yml 에 주입
 *
 * **보안 한계**: 평문 비교 → timing attack 가능. 정책 #9 v2 에서 *허용* (low 보안 수준).
 */
export function verifyAuthorKey(input: string): boolean {
  const expected = import.meta.env['VITE_AUTHOR_KEY']
  if (!expected || typeof expected !== 'string') return false
  return input === expected
}

// Vite 가 제공하는 base URL (vite.config.ts 의 `base` 값).
// - production build: '/heries/' (GitHub Pages repo prefix)
// - dev: '/'
const BASE = import.meta.env.BASE_URL

/**
 * 상대 경로를 base URL prefix 가 적용된 절대 경로로 변환.
 *
 * **사용 예**:
 * ```ts
 * assetUrl('content/series.json')
 * // → production: '/heries/content/series.json'
 * // → dev:        '/content/series.json'
 * ```
 *
 * fetch / `<img src>` / `<link href>` 등 정적 자원 참조에 사용.
 */
export function assetUrl(rel: string): string {
  // 선행 `./` 또는 `/` 제거 (BASE 가 trailing slash 보장 → 중복 방지).
  const trimmed = rel.replace(/^\.?\//, '')
  return `${BASE}${trimmed}`
}
