<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 021 measure() dep 에 mobilePages 추가

## 적용 파일
- `src/widgets/book-reader/book-reader.tsx` measure useLayoutEffect dep 1 줄.
- spec.md SSOT.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 영향 0 (isMobile false 시 mobilePages 항상 null → dep 변경 X).
- JS pagination 로직 변경 0.
