<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 018 모바일 CSS columns 복원

## 적용 파일
- `src/widgets/book-reader/book-reader.css` 모바일 `@media (max-width: 640px)` selector 전체 재작성:
  - `.book-frame { height: 100% + overflow: hidden + min-height: 0 + max-height: none + -webkit-overflow-scrolling: touch }`.
  - `.book-frame::before { display: none }`.
  - `.book-content { column-count: 1 !important }`.
  - 011~016 의 flex 패턴 모두 제거.
- spec.md SSOT.

## 작업 순서
1. CSS 모바일 selector 재작성.
2. typecheck + lint.

## 검증 (사용자)
- 모바일 실기기 / PC ≤640px → 챕터 진입.
- 본문 자동 페이지 분할, 세로 드래그 X.
- 좌/우 swipe + 키보드 + 페이지 카운트 정상.
- 데스크탑 = 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- iOS Safari 구버전 (17 미만) = column-fill: auto 미지원 → cut-off 가능 — 사용자 검증 후 SDD 019 JS 분할 고려.
- 데스크탑 = 영향 0.
- JS pagination = 변경 0.
