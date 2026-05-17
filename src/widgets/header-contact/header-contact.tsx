// 작가 연락처 (공개) — naver 이메일. 정책 #13 의 예외 (공개 채널).
const CONTACT_USER = 'contact_hongdosan'
const CONTACT_DOMAIN = 'naver.com'

/**
 * 헤더 내 작가 연락처 위젯.
 *
 * - 데스크탑: "저작권 · 아이디어 문의" + 이메일 sub (우측 정렬, 2 행)
 * - 모바일: "문의" 만 (이메일 sub 숨김)
 *
 * `mailto:` 링크 — 호버 시 accent 색 + 미세한 hover bg.
 *
 * 표시 이메일 = `contact_hongdosan@naver.com` (정책 #13 예외 — 공개 채널이라 노출 허용).
 */
export function HeaderContact() {
  const mailto = `mailto:${CONTACT_USER}@${CONTACT_DOMAIN}`

  return (
    <a
      className="inline-flex flex-col items-end gap-px px-2 py-1 rounded-sm text-fg-2 leading-[1.2] whitespace-nowrap transition-[color,background-color] hover:text-accent hover:bg-accent-soft"
      href={mailto}
      aria-label={`저작권 문의 또는 아이디어 제보 — ${CONTACT_USER}@${CONTACT_DOMAIN}`}
    >
      <span className="font-semibold tracking-[0.02em] text-sm">
        <span className="max-sm:hidden">저작권 · 아이디어 문의</span>
        <span className="sm:hidden" aria-hidden="true">문의</span>
      </span>
      <span className="font-mono text-[11px] text-fg-3 tracking-[0.01em] max-sm:hidden" aria-hidden="true">
        {CONTACT_USER}<span>@</span>{CONTACT_DOMAIN}
      </span>
    </a>
  )
}
