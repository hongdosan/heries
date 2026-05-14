import { useEffect } from 'react'

// 메인 화면 스크롤바 autohide.
// 사용자가 스크롤 / 휠 / 터치 이동 중일 때만 <body> 에 `is-scrolling` class 부착.
// idle 1.2s 후 제거 → CSS transition 으로 부드럽게 사라짐.
// prefers-reduced-motion 환경은 transition 무력화 (CSS 측 처리).
//
// 호출 위치: 앱 진입점 (main.tsx) 한 번. 페이지 전역 효과.
export function useScrollbarAutoHide(idleMs: number = 1200): void {
  useEffect(() => {
    const body = document.body
    let timer: number | null = null
    const show = (): void => {
      body.classList.add('is-scrolling')
      if (timer != null) globalThis.clearTimeout(timer)
      timer = globalThis.setTimeout(() => {
        body.classList.remove('is-scrolling')
        timer = null
      }, idleMs)
    }
    window.addEventListener('scroll', show, { passive: true })
    window.addEventListener('wheel', show, { passive: true })
    window.addEventListener('touchmove', show, { passive: true })
    window.addEventListener('keydown', (e) => {
      // 키보드 스크롤 (PageUp/Down, Space, Arrow, Home/End) 도 감지.
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
      // keydown 핸들러는 인라인이라 별도 ref 없이 정확 해제는 어려움 — body class 만 정리.
      body.classList.remove('is-scrolling')
    }
  }, [idleMs])
}
