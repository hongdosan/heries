import { useEffect, useState } from 'react'
import { isAuthorMode } from './env.js'

/**
 * 작가 모드 활성 여부 React state 동기화 hook.
 *
 * **이벤트 구독**:
 * - `heries:author-mode-changed` (custom event) — 같은 탭의 setAuthorMode 호출 시 dispatch
 * - `storage` (native event) — 다른 탭에서 sessionStorage 변경 시 자동 발화
 *
 * **사용처**:
 * - Header 의 AUTHOR 배지 (작가 모드 표시)
 * - CharacterList (주인공 외 카드 Link 화)
 * - SeriesPage (작가 전용 탭 표시)
 * - UnlockPage (현재 상태 안내)
 *
 * useEffect 안 mount/unmount 시 이벤트 listener add/remove.
 */
export function useAuthorMode(): boolean {
  const [on, setOn] = useState<boolean>(() => isAuthorMode())

  useEffect(() => {
    const sync = (): void => setOn(isAuthorMode())
    globalThis.addEventListener('heries:author-mode-changed', sync)
    globalThis.addEventListener('storage', sync)
    return () => {
      globalThis.removeEventListener('heries:author-mode-changed', sync)
      globalThis.removeEventListener('storage', sync)
    }
  }, [])

  return on
}
