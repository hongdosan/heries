<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Survey — 북리더 시리즈 cover 페이지 현 상태

## 대상
`src/pages/chapter/chapter.tsx` (book-reader 본문 합성). `src/widgets/book-reader/` (렌더링).

## 현 상태
- 북리더가 챕터 진입 시 첫 페이지 = **시리즈 cover** (`book-cover-series-page` = 작품 표지 + "차원 격돌" 제목 + 시리즈 thumbnail), 두 번째 페이지 = **챕터 cover** (`book-cover-chapter-page` = "EP 01" + 챕터 제목 + 챕터 thumbnail), 세 번째부터 본문 §1, §2, ...
- 합성 위치 = `chapter.tsx` L113~123 (`seriesThumbSrc`, `coverSeriesHtml`) + L124~130 (`coverChapterHtml`) + L202 `fullBodyHtml = (coverSeriesHtml + coverChapterHtml + transformedBody + endHtml)`.
- CSS 정합 = `book-reader.css` 의 `.book-cover` 클래스 (페이지 단위 column).
- 스토리북 = `book-reader.stories.tsx` 도 동일 구조 (시리즈 + 챕터 cover) 보여줌.

## 자매 슬라이스 / 정합 비교
- 첫 페이지 = 시리즈 표지가 *모든 챕터마다 반복* — 사용자 경험상 군더더기. 매 챕터 진입 시 같은 페이지 1장 넘기는 손가락 운동만.
- 챕터별 표지가 본문 진입 직전 = 이미 충분히 *작품 식별*.

## 영향 범위
- 코드: `chapter.tsx` 약 10 LOC 변경 (`seriesThumbSrc` + `coverSeriesHtml` 변수 + L202 합성에서 제거).
- 스토리북: `book-reader.stories.tsx` 시리즈 cover 노출 부분 동일 패턴 제거 권장 (스토리 정합).
- CSS: `.book-cover-series-page` 클래스 → 더 이상 사용 안 됨. 다만 즉시 삭제는 비추 — 작품 표지(`/series/...` 페이지)에서 동일 클래스 재사용 가능성. **삭제 보류 (사용 위치 grep으로 확인)**.
- 런타임 동작: 첫 페이지 = 챕터 cover (EP 01 + 챕터 thumbnail + 챕터 제목).
- 번들 크기: 거의 영향 없음.
- 회귀 위험: 첫 페이지 전환 (시리즈 → 챕터). 다른 동작 무변경.

## 작가/콘텐츠 영향
- 0건. manifest.json `thumbnail` (시리즈 표지) 그대로. *시리즈 리스트* 페이지 등 다른 위치는 그대로 노출.

## 메모리 룰 정합
- `feedback_sibling_slice_alignment.md` — book-reader 슬라이스 단일이라 mismatch 없음.
- `feedback_code_review_conventions.md` — 사용자 명시 요청 변경, 자동 적용 정합.
