<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — post-merge codestyle 정합

## 무엇을
사용자 IDE 자동 정렬 + 시안 ref 갱신 (003·004 사이클 후 누적). src/* tsx 6 파일 자동 정렬 commit.

## 변경 파일
- `src/widgets/book-reader/book-reader.tsx` — 시안 ref 갱신 (ep-01-3 → ep-01-4) + JSX 줄바꿈 정렬.
- `src/pages/home/home.tsx`, `src/pages/series-list/series-list.tsx`, `src/pages/series/series.tsx` — IDE 자동 정렬.
- `src/widgets/header-nav/header-nav.tsx`, `src/widgets/home-hero/home-hero.tsx` — IDE 자동 정렬.

## 왜
- 사용자 IDE 작업 정합 정리.
- v0.5.0 머지 전 코드 트리 정합.

## 범위
- 동작 변경 0건 (자동 정렬만).
- TS strict / lint pass.
