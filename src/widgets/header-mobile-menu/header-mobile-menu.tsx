import {useEffect, useState} from 'react'
import {NavLink, useLocation} from 'react-router-dom'
import {useDialog} from '../../shared/lib/use-dialog.js'

// 햄버거 SVG (Lucide menu pattern).
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

// X close SVG.
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

/**
 * 모바일 헤더 메뉴 (sm 미만 전용).
 *
 * **디자인**: 햄버거 버튼 → native `<dialog>` 시트 (상단 슬라이드). 시트 안 *시리즈* / *소개* NavLink.
 * **자동 닫힘**: 라우트 변경 (NavLink 클릭) 시 본 컴포넌트가 useLocation 으로 감지 → close.
 */
export function HeaderMobileMenu() {
  const {dialogRef, open, close, onBackdropClick} = useDialog()
  const location = useLocation()
  const [openedPath, setOpenedPath] = useState<string | null>(null)

  // 라우트 변경 감지 — open 시점 path 저장 후 변경되면 close.
  // imperative dialog.close() 호출은 render 외부 (effect) 에서 — render purity 정합.
  useEffect(() => {
    if (openedPath !== null && openedPath !== location.pathname) {
      setOpenedPath(null)
      close()
    }
  }, [location.pathname, openedPath, close])

  const handleOpen = () => {
    setOpenedPath(location.pathname)
    open()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="sm:hidden inline-flex items-center justify-center px-2 py-1 text-fg-3 rounded-sm transition-[color,background] hover:text-accent hover:bg-accent-soft cursor-pointer"
        aria-label="메뉴 열기"
        title="메뉴"
      >
        <MenuIcon/>
      </button>

      {/* native dialog backdrop click = W3C 표준 패턴 */}
      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        className="fixed inset-0 m-auto p-0 border-0 bg-transparent max-w-[320px] w-[calc(100%-32px)] max-h-[calc(100dvh-32px)] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        aria-labelledby="header-mobile-menu-title"
      >
        <div className="bg-surface border border-rule rounded-md p-5 flex flex-col gap-4 text-fg shadow-soft">
          <div className="flex items-center justify-between">
            <h2 id="header-mobile-menu-title" className="m-0 text-md font-bold tracking-tight">메뉴</h2>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center justify-center p-1.5 text-fg-3 rounded-sm transition-[color,background] hover:text-accent hover:bg-accent-soft cursor-pointer"
              aria-label="메뉴 닫기"
            ><CloseIcon/></button>
          </div>

          <nav className="flex flex-col gap-1" aria-label="페이지 이동">
            <NavLink
              to="/series"
              className={({isActive}) =>
                `block px-3 py-2.5 rounded-sm transition-colors ${isActive ? 'text-fg bg-bg-soft font-semibold' : 'text-fg-2 hover:text-accent hover:bg-bg-soft'}`
              }
            >시리즈</NavLink>
            <NavLink
              to="/about"
              className={({isActive}) =>
                `block px-3 py-2.5 rounded-sm transition-colors ${isActive ? 'text-fg bg-bg-soft font-semibold' : 'text-fg-2 hover:text-accent hover:bg-bg-soft'}`
              }
            >소개</NavLink>
          </nav>
        </div>
      </dialog>
    </>
  )
}
