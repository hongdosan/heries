<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 024 flex item width = var(--page-w)

## 적용 파일
- `src/widgets/book-reader/book-reader.css` `.book-content-paged > .book-page` flex/width → var(--page-w).
- `src/widgets/book-reader/book-reader.tsx` measure() 안 `void frame.offsetWidth` forced layout.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.
