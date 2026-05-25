<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 010 핫픽스: 모바일 column 페이지네이션 정상화

## 보고
v0.5.2 핫픽스 (008) 적용 후에도 사용자 모바일 환경에서 책 본문이 *챕터 cover 한 장만* 보이고 페이지 전환이 안 됨. 즉 008 = SDD 004 touch 부분만 revert 했고 *근본 CSS column 동작*은 그대로.

## 근본 원인 (코드 기반)
`book-reader.css:34` `@media (max-width: 640px) { .book-content { column-count: 1 !important; } }` —
- `column-count: 1` 은 *column 1 개만* 생성. 본문은 그 column 안에 세로 stack.
- 결과: `frame.scrollWidth ≈ frame.clientWidth` → JS `total = Math.ceil(scrollWidth / clientWidth) = 1` → 페이지 1 개로 인식.

## 핫픽스
`column-count` 대신 **`column-width: 100%` + `column-fill: auto`** 사용:
- `column-width: 100%` = 한 column 너비 = parent width.
- `column-fill: auto` = 본문이 column 끝 도달 시 *다음 column 자동 생성* (가로 흐름).
- 결과: 모바일에서도 *N 가로 column* → `scrollWidth = N × clientWidth` → JS pagination 정상.

## 검증 (수동, 사용자)
- `npm run dev` → 모바일 (또는 dev tools mobile emulation) → 챕터 진입.
- 챕터 cover → §1 → §2 → ... 가로 swipe·키보드로 페이지 전환 확인.
- 본문이 여러 column 에 자연 분할 확인.

## 회귀 X
- 데스크탑 (>640px) = 영향 0 (기존 `columnCount: 2` 유지).
- TOC·progress·header·키보드 = 영향 0.
