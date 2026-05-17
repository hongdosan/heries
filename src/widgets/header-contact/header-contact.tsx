import {useRef, useState, type MouseEvent} from 'react'
import {Button} from '../../shared/ui/button'

// 작가 연락처 (공개) — naver 이메일. 정책 #13 의 예외 (공개 채널).
const CONTACT_USER = 'contact_hongdosan'
const CONTACT_DOMAIN = 'naver.com'
const CONTACT_EMAIL = `${CONTACT_USER}@${CONTACT_DOMAIN}`

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * 헤더 내 작가 문의 토글 위젯.
 *
 * **버튼**: 메일 SVG 아이콘만 노출 (다른 토글과 동일 패턴).
 * 클릭 시 native `<dialog>` 확인창 — 즉시 mailto: 트리거 X (실수 클릭 보호).
 *
 * **다이얼로그**:
 * - 안내 (저작권/아이디어/오타 등)
 * - 이메일 표시 + 복사 버튼 (navigator.clipboard, 2초 "복사됨" 표시)
 * - "메일 보내기" — 기본 메일 클라이언트 열기
 *
 * `HeaderActions` 안에서 author / theme 와 함께 segmented-control 그룹화.
 */
export function HeaderContact() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [copied, setCopied] = useState(false)

  const open = () => {
    setCopied(false)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close()
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      globalThis.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API 비활성 (http / 권한 거부) — 사용자가 직접 복사 가능하니 silent.
    }
  }

  const onSendMail = () => {
    globalThis.location.href = `mailto:${CONTACT_EMAIL}`
    close()
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center justify-center px-2 py-1 text-fg-3 rounded-sm transition-[color,background] hover:text-accent hover:bg-accent-soft cursor-pointer"
        aria-label="작가 문의 다이얼로그 열기"
        title="작가 문의"
      >
        <MailIcon />
      </button>

      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        className="fixed inset-0 m-auto p-0 border-0 bg-transparent max-w-[440px] w-[calc(100%-32px)] max-h-[calc(100dvh-32px)] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        aria-labelledby="header-contact-dialog-title"
      >
        <div className="bg-surface border border-rule rounded-md p-5 flex flex-col gap-3 text-fg shadow-soft">
          <h2 id="header-contact-dialog-title" className="m-0 text-xl font-bold">작가에게 문의</h2>
          <p className="m-0 text-sm text-fg-2 leading-[1.6]">
            저작권 문의·아이디어 제보·오타 신고 등 자유롭게 메일 부탁드립니다.
            <br />
            "메일 보내기" 클릭 시 기본 메일 클라이언트가 열립니다.
          </p>
          <div className="flex items-center gap-2 p-3 bg-bg-soft border border-rule rounded-sm">
            <code className="font-mono text-sm text-fg flex-1 [overflow-wrap:anywhere]">{CONTACT_EMAIL}</code>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center justify-center text-fg-3 p-1.5 rounded-sm transition-[color,background-color] hover:text-accent hover:bg-accent-soft cursor-pointer"
              aria-label={copied ? '이메일 주소 복사됨' : '이메일 주소 복사'}
              title={copied ? '복사됨' : '복사'}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2 justify-end">
            <Button variant="secondary" onClick={close}>닫기</Button>
            <Button variant="primary" onClick={onSendMail}>메일 보내기</Button>
          </div>
        </div>
      </dialog>
    </>
  )
}
