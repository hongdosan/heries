// © 2026 홍도산. All rights reserved. Original creator work.
import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * 전역 ErrorBoundary — React 19 Class Component (의존성 추가 0 정책 준수).
 *
 * 적용 위치: `app/main.tsx` 의 `<BrowserRouter>` 내부 최상위.
 * 페이지 렌더 도중 throw 된 예외를 catch 하여 fallback UI 로 격리한다.
 * (단, 비동기 fetch 예외는 본 boundary 가 catch 하지 못하며, 각 페이지의
 * `useAsync` 결과 `state.status === 'error'` 분기로 별도 처리한다.)
 *
 * fallback 분기:
 *   - dev (`import.meta.env.DEV`) = 에러 메시지 + stack trace + reload
 *   - production = generic "문제가 발생했습니다" + 홈으로 + reload
 *
 * 의존성 0 정책: `react-error-boundary` 등 외부 라이브러리 미사용.
 */
interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
  info: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, info: null }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // production 에서도 console 에 남겨 사용자의 브라우저 콘솔 / 디버그 시
    // 추적 가능. 외부 보고 채널은 없음 (의존성 0 정책).
    // eslint-disable-next-line no-console
    console.error('[H-eries] ErrorBoundary caught:', error, info)
    this.setState({ info })
  }

  handleReload = (): void => {
    window.location.reload()
  }

  handleHome = (): void => {
    // import.meta.env.BASE_URL 은 vite base 값 (production='/H-eries/', dev/author='/').
    // BrowserRouter basename 과 맞추어 홈으로 이동.
    window.location.assign(import.meta.env.BASE_URL)
  }

  render(): ReactNode {
    const { error, info } = this.state
    if (!error) return this.props.children

    const isDev = import.meta.env.DEV
    return (
      <main className="error-boundary" role="alert">
        <div className="error-boundary-card">
          <p className="error-boundary-eyebrow">ERROR</p>
          <h1 className="error-boundary-title">
            {isDev ? error.message : '문제가 발생했습니다'}
          </h1>
          {!isDev && (
            <p className="error-boundary-desc">
              페이지를 표시하는 도중 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해
              주세요.
            </p>
          )}
          <div className="error-boundary-actions">
            <button type="button" className="error-boundary-btn primary" onClick={this.handleReload}>
              다시 시도
            </button>
            <button type="button" className="error-boundary-btn" onClick={this.handleHome}>
              홈으로
            </button>
          </div>
          {isDev && error.stack && (
            <details className="error-boundary-detail" open>
              <summary>stack trace</summary>
              <pre>{error.stack}</pre>
              {info?.componentStack && (
                <>
                  <p className="error-boundary-detail-label">component stack</p>
                  <pre>{info.componentStack}</pre>
                </>
              )}
            </details>
          )}
        </div>
      </main>
    )
  }
}
