import { useEffect, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

// fn 은 옵셔널 AbortSignal 을 받는다. fetch 가 signal 을 받으면 라우트 변경/
// unmount 시 in-flight 요청이 즉시 abort 된다. 호출처가 signal 을 무시해도
// AbortError catch + signal.aborted 체크로 race 결과는 안전하게 무시된다.
export function useAsync<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown>,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    fn(ctrl.signal)
      .then((data) => {
        if (!ctrl.signal.aborted) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({
          status: 'error',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
