import {Link} from 'react-router-dom'

/**
 * 헤더 좌측 브랜드 영역 — 사이트 로고 + 부제.
 *
 * - 로고 (`H-eries`) = 홈으로 가는 Link (모든 페이지에서 동일)
 * - 부제 (`오리지널 웹 시리즈 컬렉션`) = 데스크탑만 노출 (모바일 숨김으로 헤더 공간 확보)
 */
export function HeaderBrand() {
  return (
    <div className="flex flex-col gap-0.1 leading-[1.1]">
      <Link to="/" className="text-xl font-bold tracking-[-0.02em] text-fg">H-eries</Link>
      <p className="text-xs text-fg-3 m-0 font-normal max-sm:hidden">오리지널 웹 시리즈 컬렉션</p>
    </div>
  )
}
