// © 2026 홍도산. All rights reserved. Original creator work.
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn.js'

export interface EmptyProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  readonly children: ReactNode
}

/**
 * 비어있음 / 오류 / 부재 안내. ITCSS layer 5 (Objects) 의 시맨틱 패턴을 컴포넌트 추출.
 *
 * Usage:
 *   <Empty>아직 등록된 항목이 없습니다.</Empty>
 *   <Empty className="mt-4">오류: {error.message}</Empty>
 *   <Empty id="err-msg" aria-live="polite">{error.message}</Empty>
 */
export function Empty({ children, className, ...rest }: EmptyProps) {
  return (
    <p
      className={cn(
        'text-center text-fg-3 py-7 px-4 border border-dashed border-rule rounded-md bg-bg-soft text-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  )
}
