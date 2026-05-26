<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 023 jitter + 1/1 디버그

## 적용 파일
- `src/widgets/book-reader/book-reader.css` `.book-frame.book-frame-paged { scroll-snap-type: none }`.
- `src/widgets/book-reader/book-reader.tsx`:
  - `goToPage` `behavior: 'smooth'` → `'auto'`.
  - `onScroll` raf throttle.
  - 측정 layoutEffect 안 raf 측정.
  - frame `data-mobile / data-chunks / data-total` attribute.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 = isMobile false → 영향 0.
- JS pagination = behavior auto 만 변경 (smooth → auto = UX 즉시 jump, jitter X).
