import {NavLink} from 'react-router-dom'

/**
 * 헤더 중앙/우측 nav — 시리즈 / 소개 짧은 링크.
 *
 * **디자인 정합** (2026-05-19): img.png 시안 — 헤더 우측 액션 좌측에 *시리즈* / *소개* 텍스트 링크.
 * 활성 라우트 = text-fg 진하게, 비활성 = text-fg-3.
 */
export function HeaderNav() {
  return (
    <nav aria-label="페이지 이동" className="hidden sm:flex items-center gap-5 text-sm">
      <NavLink
        to="/series"
        className={({isActive}) =>
          `transition-colors ${isActive ? 'text-fg font-semibold' : 'text-fg-3 hover:text-accent'}`
        }
      >시리즈</NavLink>
      <NavLink
        to="/about"
        className={({isActive}) =>
          `transition-colors ${isActive ? 'text-fg font-semibold' : 'text-fg-3 hover:text-accent'}`
        }
      >소개</NavLink>
    </nav>
  )
}
