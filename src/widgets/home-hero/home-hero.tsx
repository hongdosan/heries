import {Link} from 'react-router-dom'
import HERO_IMAGE from '../../shared/images/thumbnail-placeholder.webp?url'

const HERO_ALT = 'H-eries — 홍도산의 오리지널 웹 시리즈 컬렉션'

/**
 * 홈 페이지 히어로 영역 — 좌측 H-eries 멀티버스 컬렉션 hero 이미지 + 우측 부제 / 헤드라인 / about 링크.
 *
 * **H-eries 정체성**: 홍도산 작가의 작품 시리즈 서비스.
 * - 좌측 이미지 = `thumbnail-placeholder.webp` (사실은 H-eries 컬렉션 hero — heries 로고 + "Stories Beyond Worlds" 슬로건 포함)
 *   파일명이 placeholder 이지만 실제 = 사이트 hero 이미지. fallback 역할도 겸함 (use-img-fallback.ts).
 * - kicker = `ORIGINAL · WEB SERIES`
 * - h1 = `홍도산의 오리지널 웹 시리즈 컬렉션`
 * - about 링크
 *
 * **주의**: 특정 작품 cover (예: content/series/{slug}/thumbnails/cover.webp) hardcode 금지 — 컬렉션 정체성 훼손.
 */
export function HomeHero() {
  return (
    <header
      className="grid grid-cols-[1fr_3fr] gap-5 items-stretch p-5 mt-2 mb-6 bg-bg-soft border border-rule rounded-lg shadow-soft max-sm:grid-cols-1 max-sm:gap-4 max-sm:p-4">
      <div className="flex flex-col gap-2">
        <figure
          className="m-0 w-full aspect-video rounded-md overflow-hidden bg-bg-sunken">
          <img src={HERO_IMAGE} alt={HERO_ALT} loading="eager"
               className="block w-full h-full object-cover"/>
        </figure>
      </div>

      <div className="flex flex-col justify-center gap-2 min-h-0 overflow-hidden">
        <p
          className="m-0 w-full text-xs font-semibold tracking-[0.16em] uppercase text-fg-3 whitespace-nowrap overflow-hidden text-ellipsis">ORIGINAL
          · WEB SERIES</p>

        <h1 className="m-0 text-lg font-normal tracking-normal leading-[1.45] text-fg-3">
          홍도산의 오리지널 웹 시리즈 컬렉션
        </h1>

        <p className="m-0 text-sm">
          <Link to="/about"
                className="font-semibold border-b border-accent-ring pb-0.5 transition-[color,border-color] hover:border-accent-hover">H-eries
            가 무엇인가요? →</Link>
        </p>
      </div>
    </header>
  )
}
