<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Handoff — 003-book-reader-skip-series-cover

## 결과
- `chapter.tsx` — `seriesThumbSrc` + `coverSeriesHtml` 변수·HTML 제거. `fullBodyHtml` 합성에서 `coverSeriesHtml` 제거. 주석 갱신.
- `book-reader.stories.tsx` — `SAMPLE_BODY_HTML` 의 `__cover_series__` 블록 제거. 주석 추가.
- 약 -15 LOC.

## 검증
- `npm run typecheck` ✓
- `npm run lint` ✓
- 수동 검증 (사용자) — `npm run dev` → 챕터 진입 시 첫 페이지 = EP 표기 + 챕터 thumbnail + 챕터 제목 (시리즈 cover 페이지 없음).

## 회귀
- `.book-cover-series-page` / `.book-cover-series` / `.book-cover-series-sub` CSS 클래스는 보존 — 다른 위치 재사용 가능성. dead code 정리는 별도 사이클.
- manifest.json `thumbnail` 보존 (시리즈 리스트·홈 노출).

## Constitution 정합
- R1 (spec) ✓
- R2 (plan) ✓
- R3 (verification pass) ✓
- R4 (regression checklist) ✓
- R6 strict ✓

## 다음
- 사용자 commit (메모리: 에이전트 commit X — 다만 SDD 사이클 데모이고 작은 변경. 사용자 결정).
- merge `--no-ff` develop 후 feature 브랜치 삭제.
