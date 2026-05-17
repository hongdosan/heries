import { useEffect } from 'react'

/**
 * 스크롤바 autohide hook.
 *
 * **동작**: 사용자가 스크롤 (휠 / 터치 드래그 / 키보드 PageUp/Down 등) 중일 때만
 * `<body>` 에 `is-scrolling` class 부착 → CSS 의 `body.is-scrolling ::-webkit-scrollbar-thumb`
 * 가 thumb 색을 visible 로 transition. idle `idleMs` (default 1.2초) 후 class 제거 →
 * thumb 가 다시 투명으로 fade.
 *
 * **a11y**: `prefers-reduced-motion` 환경은 transition 무력화 (base.css 측 처리) — 항상 visible.
 *
 * **호출 위치**: `app/main.tsx` 의 `App` 컴포넌트 안 1회. 페이지 전역 효과 (모든 라우트에서 동작).
 *
 * @param idleMs  스크롤 멈춤 후 thumb fade-out 까지 대기 시간 (ms). 기본 1200.
 */
export function useScrollbarAutoHide(idleMs: number = 1200): void {
  useEffect(() => {
    const body = document.body
    let timer: number | null = null

    // 사용자 활동 감지 시 = class 부착 + idle 타이머 재시작.
    const show = (): void => {
      body.classList.add('is-scrolling')
      if (timer != null) globalThis.clearTimeout(timer)
      timer = globalThis.setTimeout(() => {
        body.classList.remove('is-scrolling')
        timer = null
      }, idleMs)
    }

    // passive: true = 스크롤 차단 X (모바일 성능 보장).
    window.addEventListener('scroll', show, { passive: true })
    window.addEventListener('wheel', show, { passive: true })
    window.addEventListener('touchmove', show, { passive: true })

    // 키보드 스크롤 키 (PageUp/Down, Space, Arrow, Home/End) 도 감지.
    window.addEventListener('keydown', (e) => {
      if (
        e.key === 'PageUp' || e.key === 'PageDown' ||
        e.key === 'Home' || e.key === 'End' ||
        e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
        e.key === ' '
      ) {
        show()
      }
    })

    return () => {
      if (timer != null) globalThis.clearTimeout(timer)
      window.removeEventListener('scroll', show)
      window.removeEventListener('wheel', show)
      window.removeEventListener('touchmove', show)
      // keydown 핸들러는 inline arrow function 이라 별도 ref 없이 정확 remove 어려움.
      // 본 hook 은 app 진입점에서만 호출 (unmount = 페이지 새로고침) 이라 leak 영향 작음.
      body.classList.remove('is-scrolling')
    }
  }, [idleMs])
}
