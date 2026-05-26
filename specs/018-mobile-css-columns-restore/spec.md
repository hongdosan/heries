<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 018 모바일 CSS columns 패턴 복원 (자동 페이지 분할)

## 보고 / 의사결정
사용자 보고 (017 fullscreen reader 후):
> 너무좋은데 계속 높이를 벗어나면 드래그가 생기네. 다음 페이지로 넘어가는게 아니라?

= 페이지 안 본문이 frame 초과 시 *세로 드래그* (= 015 `overflow-y: auto`). 사용자 의도 = *데스크탑 CSS columns 처럼 자동 다음 페이지 분할*.

## 근본 + 해결
- 011~016 의 *flex row + flex item overflow-y: auto* 패턴 = 페이지 안 세로 스크롤 = 드래그. 폐기.
- 017 fullscreen reader 안에서 frame height = viewport 풀 fixed (drag X 환경 ✓).
- *데스크탑 CSS columns 패턴 그대로* + `column-count: 1` (모바일 1 page) → `column-fill: auto` + content > height = *자동 column 추가* → JS scrollLeft pagination.

## 변경
- `book-reader.css @media (max-width: 640px)`:
  - `.book-frame { height: 100% + overflow: hidden }` (가로 JS scrollLeft + 세로 hidden).
  - `.book-content { column-count: 1 !important }` (데스크탑 inline `columnCount: 2 + columnFill: auto + columnGap: 0 + height: 100%` 그대로 두고 count 만 override).
  - 011~016 flex 패턴 (`flex-direction: row`, `width: max-content`, `flex: 0 0 var(--page-w)`, `overflow-y: auto` 등) 모두 제거.
- chapter.tsx fullscreen layout (017) 유지.
- `--page-w` JS setProperty (014) = 무해, 유지.

## 트레이드오프
- iOS Safari 17+ `column-fill: auto` 지원 가정. 미지원 환경 = 본문 cut-off 또는 1 column 안 압축 (이전 011 보고). 사용자 검증 필수.
- 페이지 안 본문 길어도 자동 분할 → 드래그 X.
- 데스크탑 = `column-count: 2` 그대로 → 영향 0.

## 검증 (사용자)
- 모바일 / PC 좁힘 (≤640px) → 챕터 §1 진입.
- 페이지 안 본문 길어도 *세로 드래그 없음*, *좌/우 swipe 로 다음 페이지*.
- N/N indicator = §갯수 + 본문 자동 분할 + cover/end 합산.
- 우측 잘림 없음.
- 데스크탑 (>640px) 영향 0.

## 회귀 리스크
- iOS Safari 구버전 (17 미만) — column-fill: auto 미지원 → cut-off 가능. 발생 시 SDD 019 = JS 본문 분할 패턴 (큰 작업).
