// © 2026 홍도산. All rights reserved. Original creator work.
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn.js'

export interface LoadingProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  readonly children?: ReactNode
}

/**
 * 로딩 안내 (fetch in-flight 등). ITCSS layer 5 (Objects) 의 시맨틱 패턴을 컴포넌트 추출.
 *
 * **a11y**: `role="status" + aria-live="polite"` — screen reader 가 loading 상태 인지.
 * polite = focus 빼앗지 않고 사용자에게 알림 (fetch 완료 시 다음 콘텐츠 update 도 자동).
 * (사용처에서 `role` / `aria-live` 를 override 하면 그것이 우선 — spread 가 className 뒤에 오므로.)
 *
 * Usage:
 *   <Loading />                          // default: "불러오는 중…"
 *   <Loading>이미지 압축 중…</Loading>
 *   <Loading className="mt-4" id="ld-1">{message}</Loading>
 */
export function Loading({ children = '불러오는 중…', className, ...rest }: LoadingProps) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn('text-fg-3 text-center py-8 px-0 text-sm', className)}
      {...rest}
    >
      {children}
    </p>
  )
}
