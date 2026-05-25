import type {HTMLAttributes} from 'react'
import {Link} from 'react-router-dom'
import {cn} from '../../shared/lib/cn.js'
import HERO_IMAGE from '../../shared/images/thumbnail-placeholder.webp?url'

const HERO_ALT = 'H-eries — 홍도산의 오리지널 웹 시리즈 컬렉션'

/**
 * 홈 페이지 히어로 영역 — 큰 헤드라인 + 부제 + CTA + 컬렉션 hero 이미지 (배경).
 *
 * **디자인 정합** (2026-05-19 시안 ep-01-1.webp + 사용자 명시 배경 이미지):
 * - `thumbnail-placeholder.webp` (= H-eries 컬렉션 hero) = section 배경 (우측 mask gradient, 가독성)
 * - 텍스트 = 좌측 (relative z-10) — 큰 헤드라인 + 부제 + CTA
 *
 * **여백 강조** — 헤드라인 ~5.5vw 큰 글씨, 모바일은 축소.
 */
export type HomeHeroProps = HTMLAttributes<HTMLElement>

export function HomeHero({className, ...rest}: HomeHeroProps) {
  return (
    <section
      className={cn('relative py-[clamp(48px,10vh,128px)] overflow-hidden', className)} {...rest}>
      {/* 배경 이미지 — 우측 절반 fade-in, 좌측은 bg 색 (텍스트 가독성).
          mask-image gradient 로 우측 → 좌측 fade.
          aria-hidden 장식 이미지 (alt 무관). */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        loading="eager"
        className="absolute inset-y-0 right-0 h-full w-[min(100vw,1000px)] object-cover object-center opacity-30 pointer-events-none rounded-lg mask-[linear-gradient(to_left,black,transparent_85%)] [-webkit-mask-image:linear-gradient(to_left,black,transparent_85%)]"
      />
      {/* sr-only 본 이미지 의미 (screen reader) */}
      <span className="sr-only">{HERO_ALT}</span>

      <div className="relative z-10 max-w-[min(100%,720px)]">
        <p
          className="m-0 mb-6 text-xs sm:text-sm font-medium tracking-[0.24em] uppercase text-fg-3">
          H-eries · Multi-verse Collection
        </p>

        <h1
          className="m-0 mb-8 text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.2] tracking-[-0.02em] text-fg break-keep">
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
    </section>
  )
}
