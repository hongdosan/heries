<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 020 모바일 JS 본문 분할

## 적용 파일
- `src/widgets/book-reader/book-reader.tsx`:
  - `useLayoutEffect` import 이미 있음.
  - `isMobile` state (matchMedia + change listener).
  - `mobilePages: readonly string[] | null` state.
  - reset effect (bodyHtml / fontSize / fontFamily / isMobile 변경 시 mobilePages = null).
  - 측정 + 분할 `useLayoutEffect` (isMobile + mobilePages === null 일 때만):
    - cover / section-cover / book-end-cta 의 height / break-after 임시 무력화.
    - 직계 자식 순회 + section-body 안 자식 재귀 측정.
    - chunks 직렬화 + `setMobilePages`.
  - conditional render: `isMobile && mobilePages` 면 `.book-content-paged` + `.book-page` map, 아니면 기존 `dangerouslySetInnerHTML`.
  - frame className conditional `book-frame-paged`.
- `src/widgets/book-reader/book-reader.css`:
  - 모바일 `.book-content:not(.book-content-paged) { column-count: 1 }` — 측정 단계.
  - `.book-frame-paged { overflow-x: auto; scroll-snap-type: x mandatory }`.
  - `.book-content-paged { flex-direction: row; height: 100% }` + `.book-page { flex: 0 0 100%; height: 100%; overflow: hidden }`.
  - `.book-frame { min-height: 360px }` (500 → 360, 다만 frame 직접 보강).
- `src/pages/chapter/chapter.tsx`:
  - book container `max-sm:min-h-[500px]` → `max-sm:min-h-[600px]`.
- `specs/020-mobile-js-page-split/spec.md` — SSOT.

## 작업 순서
1. CSS — 측정 단계 / 분할 단계 selector 분리.
2. tsx — isMobile / mobilePages state + measurement layoutEffect + conditional render.
3. min-height 600 (book container) + 360 (frame).
4. typecheck + lint.

## 검증 (사용자)
- 모바일 실기기 / PC 좁힘 = N/N 페이지 (1/1 회귀 X).
- 좌/우 swipe / 키보드 / 페이지 카운트.
- 글자 크기 / 폰트 변경 시 재분할.
- 데스크탑 = 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 = isMobile false → 기존 CSS columns 모드 그대로 → 영향 0.
- JS pagination = 변경 0 (scrollLeft 그대로).
