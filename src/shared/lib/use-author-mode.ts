import { useEffect, useState } from 'react'
import { isAuthorMode } from './env.js'

// React state 동기화. sessionStorage 변경 (verifyAuthorKey 통과 / 다른 탭) 시
// 본 hook 가 listen 해 UI 재렌더. 같은 탭 안 변경은 custom event
// `heries:author-mode-changed` (setAuthorMode 가 dispatch), 다른 탭은 native
// `storage` event.
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
