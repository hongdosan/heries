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

  return (
    <main className="page-unlock">
      <nav className="breadcrumb">
        <Link to="/">H-eries</Link>
        <span className="sep">/</span>
        <span>작가 모드</span>
      </nav>

      <h1>작가 모드</h1>

      {authored ? (
        <section className="unlock-status">
          <p>현재 <span className="author-only-badge">AUTHOR</span> 모드 활성 상태. 탭을 닫으면 자동 잠금.</p>
          <div className="unlock-actions">
            <Link to="/" className="unlock-btn unlock-btn-primary">홈으로</Link>
            <button type="button" className="unlock-btn" onClick={onLock}>잠그기</button>
          </div>
        </section>
      ) : (
        <form className="unlock-form" onSubmit={onSubmit} noValidate>
          <p className="unlock-desc">
            작가 키를 입력하면 시놉시스·세계관·연표·캐릭터 분기 등 스포일러 영역이 노출됩니다.
            세션 한정 (탭 종료 시 자동 잠금).
          </p>
          <label htmlFor="unlock-key" className="unlock-label">작가 키</label>
          <input
            id="unlock-key"
            type="password"
            className="unlock-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(null)
            }}
            autoComplete="off"
            autoFocus
            spellCheck={false}
          />
          {error && <p className="unlock-error" role="alert">{error}</p>}
          <div className="unlock-actions">
            <button type="submit" className="unlock-btn unlock-btn-primary">잠금 해제</button>
            <Link to="/" className="unlock-btn">취소</Link>
          </div>
        </form>
      )}
    </main>
  )
}
