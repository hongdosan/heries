import {Link} from 'react-router-dom'
import markUrl from '../../shared/images/heries-mark.webp?url'

/**
 * 헤더 좌측 브랜드 영역 — 마크 + 사이트 로고 + 부제.
 *
 * **시각 트릭**: 마크가 "H" 자리에 위치 ("[mark]eries" 가 "Heries" 처럼 보이게).
 * - 정렬 = `items-baseline` + img `self-baseline` (텍스트 base 라인에 마크 bottom 일치)
 * - 마크 크기 18px (text-xl ≈ 20px 의 cap-height 근사)
 * - aria-label `H-eries 홈` 으로 스크린리더 의미 보존
 *
 * 부제 = 모바일·데스크탑 모두 노출, 좌측 정렬.
 */
export function HeaderBrand() {
  return (
    <div className="flex flex-col items-start gap-0 leading-[1.05]">
      <Link to="/" className="inline-flex items-baseline gap-0.5 text-fg no-underline group"
            aria-label="H-eries 홈">
        <img
          src={markUrl}
          alt=""
          width={20}
          height={20}
          className="w-5 h-5 shrink-0 select-none self-baseline transition-transform duration-200 group-hover:scale-105"
        />
        <span className="text-xl font-bold tracking-[-0.02em]" aria-hidden>eries</span>
      </Link>
      <p className="text-[10px] text-fg-3 m-0 font-serif">오리지널 웹 시리즈 컬렉션</p>
    </div>
  )
}
