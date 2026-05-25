<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 북리더 시리즈 cover 페이지 제거

## 무엇을
북리더가 챕터 진입 시 첫 페이지로 노출하던 **시리즈 cover 페이지**(`book-cover-series-page`) 제거. 첫 페이지 = **챕터 cover 페이지**부터.

## 왜
- 매 챕터 진입 시 같은 시리즈 표지가 *반복 노출* — 사용자 경험 군더더기.
- 챕터별 thumbnail + EP 표기로 *작품 식별*은 이미 충분.
- 사용자 명시 요청 (2026-05-25): "현재 북리더에서 첫장의 첫 페이지에 차원 격돌 썸네일이 들어가는데, 이건 제거하고 해당 챕터 썸네일을 시작으로 하는게 나을 듯."

## 사용자 가치
- 챕터 진입 → 첫 페이지가 곧 챕터 표지 → 한 번에 본문 흐름 진입.

## 범위 (스코프 인)
- `chapter.tsx` 의 `seriesThumbSrc` 계산 제거.
- `chapter.tsx` 의 `coverSeriesHtml` 변수 + HTML literal 제거.
- `chapter.tsx` 의 `fullBodyHtml` 합성에서 `coverSeriesHtml` 제외.
- `book-reader.stories.tsx` 시리즈 cover 부분 동일 제거 (스토리북 정합).

## 범위 외
- `.book-cover-series-page` / `.book-cover-series` 등 CSS 클래스 자체는 보존 (시리즈 리스트·홈 등 다른 위치 재사용 가능성). 클래스 미사용 확인 + 정리는 별도 사이클.
- `book-reader` widget 의 다른 동작 (TOC, 페이지 전환, progress 등) 변경 없음.
- manifest.json `thumbnail` 필드 보존 (시리즈 리스트에서 사용).

## 비기능
- TS strict 통과 (`npm run typecheck`).
- ESLint 통과 (`npm run lint`).
- 동작 회귀 0건 (regression.md 참조).
