import {Link} from 'react-router-dom'

/**
 * 홈 페이지 히어로 영역 — 큰 헤드라인 + 부제 + CTA.
 *
 * **디자인 정합** (2026-05-19 시안 img.png):
 * - 캡션 = `H-ERIES · MULTI-VERSE COLLECTION` (작은 tracking)
 * - 큰 헤드라인 (2 줄 한국어 — *서로 다른 세계가 / 하나의 상상으로 연결됩니다.*)
 * - 본문 2줄 = 컬렉션 소개 + 자작 명시
 * - CTA = *시리즈 보러 가기 →* (검정 둥근 버튼, /series 로)
 * - 보조 = *H-eries 소개* (텍스트 링크)
 *
 * **여백 강조** — img.png 정합. 헤드라인 ~6vw 큰 글씨, 모바일은 축소.
 */
export function HomeHero() {
  return (
    <section className="py-[clamp(48px,10vh,128px)]">
      <p className="m-0 mb-6 text-xs sm:text-sm font-medium tracking-[0.24em] uppercase text-fg-3">
        H-eries · Multi-verse Collection
      </p>

      <h1 className="m-0 mb-8 text-[clamp(36px,6vw,72px)] font-bold leading-[1.2] tracking-[-0.02em] text-fg break-keep">
        서로 다른 세계가<br/>
        하나의 상상으로 연결됩니다.
      </h1>

      <div className="flex flex-col gap-1 mb-10 text-fg-2 text-base sm:text-md leading-[1.6] break-keep">
        <p className="m-0">홍도산이 직접 빚어낸 오리지널 웹 시리즈 컬렉션.</p>
        <p className="m-0">등장인물·세계관·능력 체계 모두 작가 본인의 창작입니다.</p>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <Link
          to="/series"
          className="inline-flex items-center gap-2 px-6 py-3 bg-fg text-bg rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5 hover:bg-accent hover:text-accent-fg"
        >
          시리즈 보러 가기
          <span aria-hidden="true">→</span>
        </Link>

        <Link
          to="/about"
          className="text-sm text-fg-3 underline-offset-4 hover:underline hover:text-accent transition-colors"
        >
          H-eries 소개
        </Link>
      </div>
    </section>
  )
}
