<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 015 모바일 frame 높이 + 흔들림 해소

## 적용 파일
- `src/pages/chapter/chapter.tsx`:
  - `MAIN_CLS`: `items-center` → `items-stretch sm:items-center` (모바일 stretch).
  - book container div: `max-sm:flex max-sm:flex-col`.
  - BookReader wrapper div: `max-sm:flex-1 max-sm:min-h-0 max-sm:flex max-sm:flex-col`.
- `src/widgets/book-reader/book-reader.tsx`:
  - `<section>`: `max-sm:flex-1 max-sm:min-h-0 max-sm:flex max-sm:flex-col`.
  - `.book-frame` div: `max-sm:flex-1 max-sm:min-h-0`.
- `src/widgets/book-reader/book-reader.css` — 모바일 selector:
  - `.book-frame` `height: 100% + max-height: none + overflow-x: auto + overflow-y: hidden + scroll-snap-type: x proximity`.
  - `.book-content` `height: 100% + align-items: stretch`.
  - `.book-content > *` `height: 100% + min-height: 0 + overflow-x: hidden + overflow-y: auto`.

## 작업 순서
1. CSS 변경 (위).
2. typecheck + lint.

## 검증 (사용자)
- 모바일 실기기 / dev tools mobile emulation → 챕터 §1 진입.
- frame height = viewport 85% (header / progress bar 영역 확보).
- 가로 swipe = 부드러움 (jitter X).
- 페이지 안 본문 세로 스크롤 가능.
- 우측 잘림 없음 (014 유지).
- 데스크탑 (>640px) 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 (>640px) = CSS columns 패턴 그대로 → 영향 0.
- JS pagination = `frame.clientWidth` 변경 0.
- 014 의 우측 잘림 해소 (`--page-w` + useLayoutEffect) 유지.
