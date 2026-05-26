<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 019 모바일 작은 viewport min-height 가드

## 적용 파일
- `src/pages/chapter/chapter.tsx`:
  - `MAIN_CLS` 끝에 `max-sm:overflow-y-auto` 추가.
  - book container 에 `max-sm:min-h-[500px]` 추가.
- `src/widgets/book-reader/book-reader.css` 모바일 `.book-frame` `min-height: 0 !important` → `min-height: 300px !important`.
- spec.md SSOT.

## 작업 순서
1. utility 추가 + CSS min-height 변경.
2. typecheck + lint.

## 검증 (사용자)
- PC 브라우저 세로 매우 줄임 → fullscreen 안 세로 스크롤 + 겹침 X.
- 정상 viewport = 자동 페이지 분할 + 드래그 X (017+018 효과 유지).
- 데스크탑 = 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 영향 0.
- JS pagination 변경 0.
