import {type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState} from 'react'
import {findGame, MINI_GAMES} from '../catalog.js'

// floating 트리거 + native <dialog>.
// 흐름: 트리거 → 게임 선택 화면 → 카드 클릭 → 게임 마운트 → ← 메뉴 → 선택 화면 ...
// 1 entry 든 N entry 든 일관 UX (사용자가 "미니 게임 컬렉션" 인식).
// best-score 등 게임 상태는 각 게임 컴포넌트가 자체 관리 (localStorage).
export function MiniGameLauncher() {
  const [open, setOpen] = useState<boolean>(false)
  // null = 선택 화면 표시. id = 해당 게임 마운트.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const openDialog = useCallback(() => {
    setOpen(true)
    setSelectedId(null) // 매번 선택 화면부터 시작
  }, [])

  const closeDialog = useCallback(() => {
    setOpen(false)
  }, [])

  const backToMenu = useCallback(() => {
    setSelectedId(null)
  }, [])

  // open state ↔ dialog showModal / close 동기화.
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    if (open && !dlg.open) {
      try {
        dlg.showModal()
      } catch {
        dlg.setAttribute('open', '')
      }
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
    globalThis.addEventListener('touchmove', blockTouch, {passive: false})
    return () => {
      body.style.overflow = previousOverflow
      body.style.touchAction = previousTouchAction
      globalThis.removeEventListener('touchmove', blockTouch)
    }
  }, [open])

  const onDialogClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onDialogClick = useCallback((e: ReactMouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setOpen(false)
    }
  }, [])

  const selected = selectedId ? findGame(selectedId) : null
  const dialogTitle = selected?.title ?? '미니 게임'

  return (
    <>
      <button
        type="button"
        className="fixed right-[clamp(12px,3vw,32px)] bottom-[clamp(12px,4vw,32px)] z-[80] inline-flex items-center gap-2 py-2 pr-4 pl-3 rounded-pill text-sm font-bold tracking-[0.02em] border-0 shadow-soft transition-[transform,box-shadow,background-color] cursor-pointer text-white hover:-translate-y-0.5 max-sm:p-3"
        style={{ backgroundColor: 'var(--accent)' }}
        aria-label="미니 게임 열기"
        onClick={openDialog}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
      >
        <span className="text-base leading-none max-sm:text-md" aria-hidden="true">🎮</span>
        <span className="max-sm:hidden">미니 게임</span>
      </button>

      <dialog
        ref={dialogRef}
        className="mini-game-dialog"
        onClose={onDialogClose}
        onClick={onDialogClick}
        aria-label="미니 게임"
      >
        <div className="mini-game-dialog-card">
          <header className="flex items-center justify-between gap-3 py-3 px-4 border-b border-rule bg-bg-soft max-sm:py-0.5 max-sm:px-2 max-sm:min-h-9">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {selected && (
                <button
                  type="button"
                  className="shrink-0 inline-flex items-center gap-1 py-1 px-3 border border-rule rounded-pill bg-surface text-fg-2 text-xs font-semibold cursor-pointer transition-[background,color,border-color] hover:bg-bg-sunken hover:text-fg hover:border-accent-ring touch-manipulation [-webkit-tap-highlight-color:transparent] max-[640px]:py-0.5 max-[640px]:px-2 max-[640px]:text-xs"
                  aria-label="메뉴로 돌아가기"
                  onClick={backToMenu}
                >← 메뉴</button>
              )}
              <h2 className="m-0 text-md font-bold text-fg overflow-hidden text-ellipsis whitespace-nowrap max-sm:text-sm">{dialogTitle}</h2>
            </div>
            <button
              type="button"
              className="rounded-pill border-0 bg-transparent text-fg-3 cursor-pointer transition-[background,color] hover:bg-bg-sunken hover:text-fg touch-manipulation [-webkit-tap-highlight-color:transparent] w-[clamp(36px,5vw,44px)] h-[clamp(36px,5vw,44px)] text-md max-[640px]:w-7 max-[640px]:h-7 max-[640px]:text-sm"
              aria-label="닫기"
              onClick={closeDialog}
            >✕</button>
          </header>

          {/* 게임 선택 화면 — selected 없을 때 항상 표시 */}
          {open && !selected && (
            <div className="mini-game-dialog-body mini-game-select">
              <p className="mini-game-select-intro">
                {MINI_GAMES.length === 1
                  ? '게임을 골라 시작하세요. '
                  : `${MINI_GAMES.length} 개의 게임 중 하나를 골라 시작하세요. `}
                (PC 환경 권장)
              </p>
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

          {/* 선택된 게임 마운트 */}
          {open && selected && (
            <div className="mini-game-dialog-body">
              <selected.component autoFocus={true}/>
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
