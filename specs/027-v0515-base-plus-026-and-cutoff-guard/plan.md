<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 027 v0.5.15 + 026 + cut-off guard

## 적용 파일
- `src/widgets/book-reader/book-reader.tsx` — v0.5.15 복원 + measure useLayoutEffect 에 raf 추가.
- `src/widgets/book-reader/book-reader.css` — v0.5.15 복원 + `.book-page` overflow hidden → overflow-y: auto.
- `src/pages/chapter/chapter.tsx` — v0.5.15 복원 (그대로).

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.
