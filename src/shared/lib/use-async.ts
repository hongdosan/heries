import { useEffect, useState } from 'react'

/**
 * 비동기 데이터 로딩 상태.
 * - `loading`: fetch 진행 중
 * - `error`: 실패 (Error 객체 포함)
 * - `success`: 성공 (data 포함)
 *
 * 사용처에서 `status` 분기로 render → loading 스피너 / 오류 메시지 / 실제 데이터 표시.
 */
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

/**
 * 비동기 함수 (fetch 등) 를 React 컴포넌트 안에서 안전하게 호출하는 hook.
 *
 * **race condition 방지**:
 * - 라우트 변경 / 컴포넌트 unmount / deps 변경 시 이전 fetch 자동 cancel (AbortController)
 * - cancel 된 fetch 의 결과는 무시 (state 갱신 X) — 화면 깜빡임 / stale data 방지
 *
 * **사용 예**:
 * ```ts
 * const state = useAsync(async (signal) => {
 *   const res = await fetch('/api/data', { signal })
 *   return res.json()
 * }, [])
 * if (state.status === 'loading') return <Loading />
 * if (state.status === 'error') return <Empty>{state.error.message}</Empty>
 * return <Article data={state.data} />
 * ```
 *
 * @param fn  옵셔널 `AbortSignal` 받는 async 함수. signal 을 fetch 에 전달하면 cancel 효과 ↑.
 * @param deps  effect 의존 배열. 변경 시 이전 fetch cancel + 새 fetch 시작.
 */
export function useAsync<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown>,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })

  useEffect(() => {
    // 각 effect 실행마다 새 AbortController 생성 — cleanup 시 fetch cancel.
    const ctrl = new AbortController()
    setState({ status: 'loading' })

    fn(ctrl.signal)
      .then((data) => {
        // cancel 된 fetch 의 결과는 무시 (이미 새 fetch 진행 중).
        if (!ctrl.signal.aborted) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        // cancel 또는 AbortError 는 정상 흐름 → state 갱신 X.
        if (ctrl.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({
          status: 'error',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      })

    // cleanup: 이전 fetch cancel (다음 effect 또는 unmount 시).
    return () => ctrl.abort()
    // fn 은 closure 라 deps 에 매번 새 reference. 호출처가 deps 로 의도 통제.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
