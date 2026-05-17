import {useRef, useState, type FormEvent, type MouseEvent} from 'react'
import {useAuthorMode} from '../../shared/lib/use-author-mode.js'
import {setAuthorMode, verifyAuthorKey} from '../../shared/lib/env.js'
import {Button} from '../../shared/ui/button'

/**
 * 헤더 내 작가 모드 토글 위젯.
 *
 * **상태별 노출**:
 * - 잠금: `작가모드?` 버튼 (subtle pill)
 * - 활성: `AUTHOR` 배지 (warn 색)
 *
 * **모달**: native `<dialog>` + `showModal()` 사용 — 의존 0 정합.
 * focus trap / ESC 자동 닫힘 / backdrop modal 모두 브라우저 기본 제공.
 *
 * **잠긴 다이얼로그**: 스포일러 주의 + 본인 책임 문구 + 키 입력 + 잠금 해제.
 * **활성 다이얼로그**: 현재 노출 상태 안내 + 잠그기.
 *
 * `/unlock` 페이지는 `?unlock=KEY` 쿼리 진입 (북마크·자동화) 용으로 유지.
 */
export function AuthorModeToggle() {
  const isAuthor = useAuthorMode()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const open = () => {
    setInput('')
    setError(null)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input) {
      setError('키를 입력해 주세요.')
      return
    }
    if (verifyAuthorKey(input)) {
      setAuthorMode(true)
      setInput('')
      setError(null)
      close()
    } else {
      setError('키 불일치.')
    }
  }

  const onLock = () => {
    setAuthorMode(false)
    close()
  }

  // backdrop 클릭 = 닫기. dialog 자체 영역 click 만 닫고 내부 카드 click 은 유지.
  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close()
  }

  const buttonCls = isAuthor
    ? 'inline-block px-2 py-[2px] bg-warn-bg text-warn-fg border border-warn-rule rounded-pill text-[11px] font-bold tracking-[0.06em] uppercase transition-[background-color,transform] duration-150 hover:bg-warn-rule hover:-translate-y-px focus-visible:bg-warn-rule focus-visible:-translate-y-px cursor-pointer'
    : 'inline-block px-2 py-[2px] bg-bg-soft text-fg-3 border border-rule rounded-pill text-[11px] font-medium tracking-[0.04em] transition-[background-color,color,transform] duration-150 hover:bg-bg-sunken hover:text-fg-2 hover:-translate-y-px focus-visible:bg-bg-sunken focus-visible:-translate-y-px cursor-pointer'

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={buttonCls}
        aria-label={isAuthor ? '작가 모드 활성 — 클릭하여 관리' : '작가 모드 진입 다이얼로그 열기'}
        title={isAuthor ? '작가 모드 활성 — 클릭하여 관리' : '작가 모드'}
      >
        {isAuthor ? 'AUTHOR' : '작가모드?'}
      </button>

      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        className="p-0 border-0 bg-transparent max-w-[440px] w-[calc(100%-32px)] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        aria-labelledby="author-mode-dialog-title"
      >
        <div className="bg-surface border border-rule rounded-md p-5 flex flex-col gap-3 text-fg shadow-soft">
          {isAuthor ? (
            <>
              <h2 id="author-mode-dialog-title" className="m-0 text-xl font-bold">작가 모드 활성</h2>
              <p className="m-0 text-sm text-fg-2 leading-[1.6]">
                현재 시놉시스·세계관·연표·캐릭터 분기 등 <strong>스포일러 영역이 노출</strong>된 상태입니다.
                탭을 닫으면 자동으로 잠금 처리됩니다.
              </p>
              <div className="flex gap-2 flex-wrap mt-2 justify-end">
                <Button variant="secondary" onClick={close}>닫기</Button>
                <Button variant="primary" onClick={onLock}>잠그기</Button>
              </div>
            </>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
              <h2 id="author-mode-dialog-title" className="m-0 text-xl font-bold">작가 모드 진입</h2>
              <p className="m-0 p-3 px-4 border-l-[3px] border-l-warn-rule bg-warn-bg text-warn-fg text-sm rounded-r-md leading-[1.6]">
                <strong>주의 — 스포일러 노출</strong><br />
                작가 모드는 시놉시스·세계관·연표·캐릭터 분기 등 <strong>본 작품의 결말과 핵심 반전</strong>을
                포함한 모든 영역을 노출합니다.
              </p>
              <p className="m-0 text-xs text-fg-3 leading-[1.6]">
                본 모드 진입으로 인한 스포일러 노출은 <strong className="text-fg-2">전적으로 본인의 책임</strong>입니다.
                세션 한정 (탭 종료 시 자동 잠금).
              </p>
              <label htmlFor="author-mode-key" className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-3 mt-1">작가 키</label>
              <input
                id="author-mode-key"
                type="password"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (error) setError(null)
                }}
                autoComplete="off"
                spellCheck={false}
                autoFocus
                className="px-3 py-2 text-base font-mono bg-bg-soft text-fg border border-rule rounded-sm transition-[border-color,box-shadow] focus-visible:border-accent focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
              />
              {error && <p className="m-0 text-sm text-warn-fg" role="alert">{error}</p>}
              <div className="flex gap-2 flex-wrap mt-2 justify-end">
                <Button variant="secondary" type="button" onClick={close}>취소</Button>
                <Button variant="primary" type="submit">잠금 해제</Button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  )
}
