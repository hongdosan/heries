<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 022 conditional key 강제

## 적용 파일
- `src/widgets/book-reader/book-reader.tsx` conditional render 두 div 에 `key="paged"` / `key="single"`.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 = isMobile false → 항상 `key="single"` → 영향 0.
- JS pagination 로직 변경 0.
