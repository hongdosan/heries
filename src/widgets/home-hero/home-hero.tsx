import {Link} from 'react-router-dom'
import HERO_IMAGE from '../../shared/images/thumbnail-placeholder.webp?url'

const HERO_ALT = 'H-eries — 홍도산의 오리지널 웹 시리즈 컬렉션'

/**
 * 홈 페이지 히어로 영역 — 큰 헤드라인 + 부제 + CTA + 컬렉션 hero 이미지.
 *
 * **디자인 정합** (2026-05-19 시안 img.png + 사용자 명시 이미지 회복):
 * - 좌측 = 캡션 + 큰 헤드라인 + 부제 + CTA + 보조 링크
 * - 우측 = `thumbnail-placeholder.webp` (= H-eries 컬렉션 hero 이미지) — desktop only.
 *   모바일 (`< md`) = 텍스트 stack (이미지 헤드라인 위로).
 *
 * **여백 강조** — 헤드라인 ~6vw 큰 글씨, 모바일은 축소.
 */
export function HomeHero() {
  return (
    <section className="grid grid-cols-[1fr_auto] gap-12 items-center py-[clamp(48px,10vh,128px)] max-md:grid-cols-1 max-md:gap-8">
      <div className="min-w-0 order-2 max-md:order-2">
        <p className="m-0 mb-6 text-xs sm:text-sm font-medium tracking-[0.24em] uppercase text-fg-3">
          H-eries · Multi-verse Collection
        </p>

        <h1
          className="m-0 mb-8 text-[clamp(36px,5.5vw,64px)] font-bold leading-[1.2] tracking-[-0.02em] text-fg break-keep">
          서로 다른 세계가<br/>
          하나의 상상으로 연결됩니다.
        </h1>

        <div
          className="flex flex-col gap-1 mb-10 text-fg-2 text-base sm:text-md leading-[1.6] break-keep">
          <p className="m-0">홍도산이 직접 빚어낸 오리지널 웹 시리즈 컬렉션.</p>
          <p className="m-0">등장인물·세계관·능력 체계 모두 작가 본인의 창작입니다.</p>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <Link
            to="/series"
            style={{background: 'var(--cta-bg)', color: 'var(--cta-fg)'}}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-[transform,background] hover:-translate-y-0.5 hover:[background:var(--cta-bg-hover)]"
          >
            <span>H-eries 보러 가기</span>
            <span aria-hidden="true">→</span>
          </Link>

          <Link
            to="/about"
            className="text-sm text-fg-3 underline-offset-4 hover:underline hover:text-accent transition-colors"
          >
            H-eries 소개
          </Link>
        </div>
      </div>

      <figure
        className="m-0 w-[clamp(220px,28vw,360px)] aspect-square rounded-lg overflow-hidden bg-bg-soft border border-rule shadow-soft order-1 max-md:order-1 max-md:w-full max-md:max-w-[400px] max-md:aspect-video max-md:mx-auto">
        <img
          src={HERO_IMAGE}
          alt={HERO_ALT}
          loading="eager"
          className="block w-full h-full object-cover"
        />
      </figure>
    </section>
  )
}
