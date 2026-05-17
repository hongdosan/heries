// © 2026 홍도산. All rights reserved. Original creator work.
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '../button/index.js'

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
  override state: ErrorBoundaryState = { error: null, info: null }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // production 에서도 console 에 남겨 사용자의 브라우저 콘솔 / 디버그 시
    // 추적 가능. 외부 보고 채널은 없음 (의존성 0 정책).
     
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

  override render(): ReactNode {
    const { error, info } = this.state
    if (!error) return this.props.children

    const isDev = import.meta.env.DEV
    return (
      <main className="flex-1 w-full max-w-reader mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9" role="alert">
        <div className="bg-bg-soft border border-rule border-l-[3px] border-l-warn-rule rounded-md p-5 px-6">
          <p className="m-0 mb-2 font-mono text-xs font-semibold tracking-[0.18em] text-warn-fg uppercase">ERROR</p>
          <h1 className="m-0 mb-3 text-2xl font-bold tracking-[-0.02em] text-fg break-keep">
            {isDev ? error.message : '문제가 발생했습니다'}
          </h1>
          {!isDev && (
            <p className="m-0 mb-4 text-sm text-fg-3 leading-[1.7] break-keep">
              페이지를 표시하는 도중 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해 주세요.
            </p>
          )}
          <div className="inline-flex flex-wrap gap-2 mt-2">
            <Button variant="primary" onClick={this.handleReload}>다시 시도</Button>
            <Button variant="secondary" onClick={this.handleHome}>홈으로</Button>
          </div>
          {isDev && error.stack && (
            <details className="mt-5 p-3 px-4 bg-bg-sunken border border-rule rounded-sm text-xs" open>
              <summary className="cursor-pointer font-mono font-semibold text-fg-3 tracking-wider uppercase">stack trace</summary>
              <pre className="mt-3 p-3 bg-bg border border-rule rounded-sm overflow-x-auto font-mono text-[11px] leading-relaxed text-fg-2 whitespace-pre-wrap break-all">{error.stack}</pre>
              {info?.componentStack && (
                <>
                  <p className="mt-3 font-mono text-xs font-semibold text-fg-3 tracking-wider uppercase">component stack</p>
                  <pre className="mt-3 p-3 bg-bg border border-rule rounded-sm overflow-x-auto font-mono text-[11px] leading-relaxed text-fg-2 whitespace-pre-wrap break-all">{info.componentStack}</pre>
                </>
              )}
            </details>
          )}
        </div>
      </main>
    )
  }
}
