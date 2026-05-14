import { useCallback, useEffect, useRef, useState } from 'react'
import { MiniGame } from './mini-game'

// floating 트리거 버튼 + native <dialog> 로 게임 호출.
// dialog 안에서만 MiniGame 마운트 → 닫을 때 unmount, 다시 열 때 idle 시작.
// best-score 는 localStorage 라 세션 보존.
export function MiniGameLauncher() {
  const [open, setOpen] = useState<boolean>(false)
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const openDialog = useCallback(() => {
    setOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setOpen(false)
  }, [])

  // open state ↔ dialog showModal / close 동기화 + body scroll lock.
  // 모바일에서 게임 가상 패드 드래그 시 page scroll 새는 현상 차단.
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    if (open && !dlg.open) {
      try { dlg.showModal() } catch { /* 일부 환경 fallback */ dlg.setAttribute('open', '') }
    } else if (!open && dlg.open) {
      dlg.close()
    }
  }, [open])

  // body scroll lock (모바일 드래그 시 화면 흔들림 차단).
  // dialog showModal() 자체로 inert 적용되지만 일부 모바일 브라우저는 body 스크롤 새는
  // 케이스가 있어 명시 lock + 차단. cleanup 으로 원상복구.
  useEffect(() => {
    if (!open) return
    const body = document.body
    const previousOverflow = body.style.overflow
    const previousTouchAction = body.style.touchAction
    body.style.overflow = 'hidden'
    body.style.touchAction = 'none'
    const blockTouch = (e: TouchEvent) => {
      if (e.target instanceof Node && dialogRef.current?.contains(e.target)) return
      e.preventDefault()
    }
    window.addEventListener('touchmove', blockTouch, { passive: false })
    return () => {
      body.style.overflow = previousOverflow
      body.style.touchAction = previousTouchAction
      window.removeEventListener('touchmove', blockTouch)
    }
  }, [open])

  // ESC / backdrop click 으로 닫혔을 때 React state 동기화.
  const onDialogClose = useCallback(() => {
    setOpen(false)
  }, [])

  // backdrop 클릭 (dialog 자체 클릭) = 닫기. 내부 콘텐츠 클릭은 e.target !== dialog 라 무시.
  const onDialogClick = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setOpen(false)
    }
  }, [])

  return (
    <>
      <button
        type="button"
        className="mini-game-launcher"
        aria-label="미니 게임 열기 — 검기생존록"
        onClick={openDialog}
      >
        <span className="mini-game-launcher-emoji" aria-hidden="true">🎮</span>
        <span className="mini-game-launcher-label">미니 게임</span>
      </button>

      <dialog
        ref={dialogRef}
        className="mini-game-dialog"
        onClose={onDialogClose}
        onClick={onDialogClick}
        aria-label="검기생존록 미니 게임"
      >
        <div className="mini-game-dialog-card">
          <header className="mini-game-dialog-head">
            <h2 className="mini-game-dialog-title">검기생존록</h2>
            <button
              type="button"
              className="mini-game-dialog-close"
              aria-label="닫기"
              onClick={closeDialog}
            >✕</button>
          </header>
          {open && (
            <div className="mini-game-dialog-body">
              <MiniGame autoFocus={false} />
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
