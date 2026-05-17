import {useEffect, useState, type FormEvent} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {isAuthorMode, setAuthorMode, verifyAuthorKey} from '../../shared/lib/env.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'

// 작가 모드 진입 페이지. 정책 #9 v2 (2026-05-14).
// - 폼: 작가 키 입력 → verifyAuthorKey 검증 통과 시 sessionStorage 플래그 set.
// - 쿼리 (?unlock=KEY): 자동 검증. 통과 시 즉시 set + URL 정리. 실패 시 폼 표시 + 에러.
// - 이미 작가 모드면 짧은 안내 + 홈 링크 + 잠금 버튼.
//
// 보안 책임: VITE_AUTHOR_KEY 는 환경변수로만 주입 (CLAUDE.md #13). 빌드 산출물
// 내 평문 key 노출은 reader 자신의 책임 (devtools 분석 = 지손해).
export function UnlockPage() {
  useDocumentTitle('작가 모드')
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [authored, setAuthored] = useState<boolean>(() => isAuthorMode())

  useEffect(() => {
    const queryKey = params.get('unlock')
    if (!queryKey) return
    if (verifyAuthorKey(queryKey)) {
      setAuthorMode(true)
      setAuthored(true)
      setError(null)
    } else {
      setError('쿼리 키 불일치. 폼으로 다시 시도해 주세요.')
    }
    const next = new URLSearchParams(params)
    next.delete('unlock')
    setParams(next, {replace: true})
  }, [params, setParams])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input) {
      setError('키를 입력해 주세요.')
      return
    }
    if (verifyAuthorKey(input)) {
      setAuthorMode(true)
      setAuthored(true)
      setError(null)
      setInput('')
      navigate('/', {replace: true})
    } else {
      setError('키 불일치.')
    }
  }

  const onLock = () => {
    setAuthorMode(false)
    setAuthored(false)
  }

  const btnBase = 'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md border transition-colors cursor-pointer no-underline'
  const btnPrimary = `${btnBase} bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover`
  const btnSecondary = `${btnBase} bg-surface text-fg-2 border-rule hover:text-accent hover:border-accent`

  return (
    <main className="max-w-[480px] mx-auto pt-5 px-4 pb-7">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link>
        <span className="sep">/</span>
        <span>작가 모드</span>
      </nav>

      <h1 className="mt-4 mb-5">작가 모드</h1>

      {authored ? (
        <section className="flex flex-col gap-4 p-4 bg-bg-soft border border-rule rounded-md">
          <p className="m-0 text-fg-2">현재 <span className="author-only-badge">AUTHOR</span> 모드 활성 상태. 탭을 닫으면 자동 잠금.</p>
          <div className="flex gap-2 flex-wrap mt-2">
            <Link to="/" className={btnPrimary}>홈으로</Link>
            <button type="button" className={btnSecondary} onClick={onLock}>잠그기</button>
          </div>
        </section>
      ) : (
        <form className="flex flex-col gap-3 p-4 bg-bg-soft border border-rule rounded-md" onSubmit={onSubmit} noValidate>
          <p className="m-0 text-sm text-fg-3 leading-[1.6]">
            작가 키를 입력하면 시놉시스·세계관·연표·캐릭터 분기 등 스포일러 영역이 노출됩니다.
            세션 한정 (탭 종료 시 자동 잠금).
          </p>
          <label htmlFor="unlock-key" className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-3">작가 키</label>
          <input
            id="unlock-key"
            type="password"
            className="px-3 py-2 text-base font-mono bg-surface text-fg border border-rule rounded-sm transition-[border-color,box-shadow] focus-visible:border-accent focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(null)
            }}
            autoComplete="off"
            autoFocus
            spellCheck={false}
          />
          {error && <p className="m-0 text-sm text-warn-fg" role="alert">{error}</p>}
          <div className="flex gap-2 flex-wrap mt-2">
            <button type="submit" className={btnPrimary}>잠금 해제</button>
            <Link to="/" className={btnSecondary}>취소</Link>
          </div>
        </form>
      )}
    </main>
  )
}
