import type {HTMLAttributes} from 'react'
import {NavLink} from 'react-router-dom'
import {cn} from '../../shared/lib/cn.js'

/**
 * 헤더 중앙/우측 nav — 시리즈 / 소개 짧은 링크.
 *
 * **디자인 정합** (2026-05-19): ep-01-1.webp 시안 — 헤더 우측 액션 좌측에 *시리즈* / *소개* 텍스트 링크.
 * 활성 라우트 = text-fg 진하게, 비활성 = text-fg-3.
 */
// focus-visible underline = 헤더의 반투명 backdrop 위에서 outline 가시성이 약할 수 있어 보조 강조 (a11y MAJOR 정합, 2026-05-19).
const navLinkCls = ({isActive}: { isActive: boolean }) =>
  `transition-colors focus-visible:underline focus-visible:underline-offset-4 focus-visible:decoration-2 ${
    isActive ? 'text-fg font-semibold' : 'text-fg-3 hover:text-accent'
  }`

export type HeaderNavProps = HTMLAttributes<HTMLElement>

export function HeaderNav({className, ...rest}: HeaderNavProps) {
  return (
    <nav aria-label="페이지 이동"
         className={cn('hidden sm:flex items-center gap-5 text-sm', className)} {...rest}>
      <NavLink to="/series" className={navLinkCls}>시리즈</NavLink>
      <NavLink to="/about" className={navLinkCls}>소개</NavLink>
    </nav>
  )
}
