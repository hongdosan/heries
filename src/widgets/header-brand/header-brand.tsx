import {Link} from 'react-router-dom'
import markUrl from '../../shared/images/heries-mark.webp?url'

/**
 * 헤더 좌측 브랜드 영역 — 마크 + 사이트 로고 + 부제.
 *
 * - 마크 (`heries-mark.webp`) = 좌측 28px 썸네일 (홈 Link 안 inline, hover 시 scale)
 * - 로고 (`H-eries`) = 홈으로 가는 Link (모든 페이지에서 동일)
 * - 부제 (`오리지널 웹 시리즈 컬렉션`) = 데스크탑만 노출 (모바일 숨김으로 헤더 공간 확보)
 */
export function HeaderBrand() {
  return (
    <div className="flex flex-row items-center gap-2 leading-[1.1]">
      <Link to="/" className="inline-flex items-center gap-2 text-fg no-underline group">
        <img
          src={markUrl}
          alt=""
          width={28}
          height={28}
          className="w-7 h-7 shrink-0 select-none transition-transform duration-200 group-hover:scale-105"
        />
        <span className="text-xl font-bold tracking-[-0.02em]">H-eries</span>
      </Link>
      <p className="text-xs text-fg-3 m-0 font-sans max-xs:hidden">오리지널 웹 시리즈 컬렉션</p>
    </div>
  )
}
