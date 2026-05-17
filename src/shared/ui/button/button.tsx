// © 2026 홍도산. All rights reserved. Original creator work.
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn.js'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  readonly children: ReactNode
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
}

const BASE = 'inline-flex items-center justify-center font-semibold rounded-md border transition-colors cursor-pointer no-underline disabled:opacity-50 disabled:cursor-not-allowed'

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

// active 시각 = inline style 로 강제 (Tailwind utility 가 HMR/purge 케이스에서 미적용되는 안전망).
// var(--accent) 직접 참조 → 다크 모드 자동 (tokens.css [data-theme=dark] var override).
const VARIANT: Record<ButtonVariant, string> = {
  primary: 'text-white border-transparent hover:opacity-90',
  secondary: 'bg-surface text-fg-2 border-rule hover:text-accent hover:border-accent',
  ghost: 'bg-transparent text-fg-2 border-transparent hover:bg-bg-soft hover:text-accent',
}

/**
 * shadcn/ui 패턴의 시맨틱 버튼 — variant + size 조합. cn() helper 로 외부 className 병합.
 *
 * Usage:
 *   <Button variant="primary">잠금 해제</Button>
 *   <Button variant="secondary" size="sm" onClick={...}>취소</Button>
 *   <Button variant="ghost" disabled>비활성</Button>
 */
export function Button({ children, variant = 'secondary', size = 'md', className, style, ...rest }: ButtonProps) {
  const isPrimary = variant === 'primary'
  return (
    <button
      type="button"
      className={cn(BASE, SIZE[size], VARIANT[variant], className)}
      style={isPrimary ? { backgroundColor: 'var(--accent)', ...style } : style}
      {...rest}
    >
      {children}
    </button>
  )
}
