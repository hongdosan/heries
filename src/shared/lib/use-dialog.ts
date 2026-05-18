import {useRef, type MouseEvent, type RefObject} from 'react'

/**
 * native `<dialog>` 제어 hook — open / close / backdrop click 통합.
 *
 * **사용 예** (`AuthorModeToggle` / `HeaderContact` 등 다이얼로그 widget):
 * ```tsx
 * const {dialogRef, open, close, onBackdropClick} = useDialog(() => {
 *   // open 직전 reset 콜백 (input 초기화 등)
 * })
 *
 * return (
 *   <>
 *     <button onClick={open}>열기</button>
 *     <dialog ref={dialogRef} onClick={onBackdropClick} ...>
 *       <button onClick={close}>닫기</button>
 *     </dialog>
 *   </>
 * )
 * ```
 *
 * **backdrop click** = `<dialog>` 자체 영역 click 시 close (내부 카드 click 은 유지).
 * **showModal()** = focus trap / ESC 자동 닫기 / backdrop modal 브라우저 기본.
 */
export interface UseDialogReturn {
  dialogRef: RefObject<HTMLDialogElement | null>
  open: () => void
  close: () => void
  onBackdropClick: (e: MouseEvent<HTMLDialogElement>) => void
}

export function useDialog(beforeOpen?: () => void): UseDialogReturn {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const open = (): void => {
    beforeOpen?.()
    dialogRef.current?.showModal()
  }

  const close = (): void => {
    dialogRef.current?.close()
  }

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>): void => {
    if (e.target === dialogRef.current) close()
  }

  return {dialogRef, open, close, onBackdropClick}
}
