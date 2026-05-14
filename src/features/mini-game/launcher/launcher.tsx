import { useCallback, useEffect, useRef, useState } from 'react'
import { MINI_GAMES, findGame } from '../catalog.js'

// floating 트리거 버튼 + native <dialog> 로 게임 호출.
// dialog 안에서 catalog 의 선택된 게임 컴포넌트 마운트 (close 시 unmount).
// 게임 1 개 = dialog 즉시 그 게임. 게임 N 개 = 선택 화면 → 게임 마운트.
// best-score 등 게임 상태는 각 게임 컴포넌트가 자체 관리 (localStorage).
export function MiniGameLauncher() {
  const [open, setOpen] = useState<boolean>(false)
  // 선택된 게임 id. catalog 1 entry 면 자동 선택. N entry 면 사용자 선택.
  const [selectedId, setSelectedId] = useState<string | null>(
    MINI_GAMES.length === 1 ? MINI_GAMES[0]?.id ?? null : null,
  )
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const openDialog = useCallback(() => {
    setOpen(true)
    // 게임 1 개 = 항상 그 게임으로 자동 선택.
    if (MINI_GAMES.length === 1) {
      setSelectedId(MINI_GAMES[0]?.id ?? null)
    } else {
      // N 개 = 매번 선택 화면부터.
      setSelectedId(null)
    }
  }, [])

  const closeDialog = useCallback(() => {
    setOpen(false)
  }, [])

  // open state ↔ dialog showModal / close 동기화.
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    if (open && !dlg.open) {
      try { dlg.showModal() } catch { dlg.setAttribute('open', '') }
    } else if (!open && dlg.open) {
      dlg.close()
    }
  }, [open])

  // body scroll lock (모바일 드래그 시 화면 흔들림 차단).
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
    globalThis.addEventListener('touchmove', blockTouch, { passive: false })
    return () => {
      body.style.overflow = previousOverflow
      body.style.touchAction = previousTouchAction
      globalThis.removeEventListener('touchmove', blockTouch)
    }
  }, [open])

  const onDialogClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onDialogClick = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setOpen(false)
    }
  }, [])

  const selected = selectedId ? findGame(selectedId) : null
  const dialogTitle = selected?.title ?? '미니 게임'

  // launcher 버튼 표시 — 게임 1 개 = 그 게임 emoji + 제목, N 개 = 일반 라벨.
  const launcherEmoji = MINI_GAMES.length === 1 ? MINI_GAMES[0]?.emoji ?? '🎮' : '🎮'
  const launcherLabel = MINI_GAMES.length === 1 ? MINI_GAMES[0]?.title ?? '미니 게임' : '미니 게임'

  return (
    <>
      <button
        type="button"
        className="mini-game-launcher"
        aria-label={`미니 게임 열기 — ${launcherLabel}`}
        onClick={openDialog}
      >
        <span className="mini-game-launcher-emoji" aria-hidden="true">{launcherEmoji}</span>
        <span className="mini-game-launcher-label">{launcherLabel}</span>
      </button>

      <dialog
        ref={dialogRef}
        className="mini-game-dialog"
        onClose={onDialogClose}
        onClick={onDialogClick}
        aria-label={`${dialogTitle} 미니 게임`}
      >
        <div className="mini-game-dialog-card">
          <header className="mini-game-dialog-head">
            <h2 className="mini-game-dialog-title">{dialogTitle}</h2>
            <button
              type="button"
              className="mini-game-dialog-close"
              aria-label="닫기"
              onClick={closeDialog}
            >✕</button>
          </header>
          {open && selected && (
            <div className="mini-game-dialog-body">
              <selected.component autoFocus={false} />
            </div>
          )}
          {open && !selected && (
            <div className="mini-game-dialog-body mini-game-select">
              <ul className="mini-game-select-list">
                {MINI_GAMES.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      className="mini-game-select-card"
                      onClick={() => setSelectedId(g.id)}
                    >
                      <span className="mini-game-select-emoji" aria-hidden="true">{g.emoji}</span>
                      <span className="mini-game-select-title">{g.title}</span>
                      {g.description && (
                        <span className="mini-game-select-desc">{g.description}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
