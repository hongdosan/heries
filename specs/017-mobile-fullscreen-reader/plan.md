<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 017 모바일 fullscreen reader

## 적용 파일
- `src/pages/chapter/chapter.tsx`:
  - `MAIN_CLS` 끝에 `max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:bg-bg max-sm:max-w-none max-sm:m-0 max-sm:p-0 max-sm:min-h-0 max-sm:items-stretch` 추가.
  - book container `className` 에 `max-sm:max-w-none max-sm:h-full max-sm:rounded-none max-sm:border-0 max-sm:shadow-none` 추가.
- `specs/017-mobile-fullscreen-reader/spec.md` — SSOT.

## 작업 순서
1. MAIN_CLS + book container utility 추가.
2. typecheck + lint.

## 검증 (사용자)
- 모바일 실기기 / PC 브라우저 ≤640px 좁힘 → 챕터 진입.
- 책 reader = viewport 풀 fullscreen (사이트 header/footer 덮음).
- frame fit = 드래그/스크롤 X.
- 닫기 = 작품 제목 탭 (BookHeader Link).
- 데스크탑 (>640px) = 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 (>640px) = 영향 0.
- JS pagination = 변경 0.
- BookHeader / BookProgressBar / BookToc = 변경 0.
