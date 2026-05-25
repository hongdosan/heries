<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Regression — 시리즈 cover 제거 회귀 보존 (R4)

## 보존 대상 (변경 0)
- 챕터 cover 페이지 (`book-cover-chapter-page`) — EP 표기 + 챕터 제목 + 챕터 thumbnail 그대로.
- 본문 §1, §2, ... 절 표지 (`section-cover`) 동작 그대로.
- TOC, progress, header, mobile menu — 모두 영향 없음.
- 시리즈 리스트 페이지 (`/series/clash-of-multiverses`) — manifest.json `thumbnail` 사용, 그대로.
- 홈 페이지 시리즈 cover 노출 — 그대로.

## 자동 검증
- `npm run typecheck` ✓
- `npm run lint` ✓

## 수동 검증 (사용자)
- [ ] `npm run dev` → 챕터 1 진입 → 첫 페이지 = "EP 01" + "한별 단지의 밤" + ep-01 thumbnail.
- [ ] 두 번째 페이지부터 본문 §1 진입.
- [ ] 시리즈 리스트 페이지 정상 = 시리즈 표지 보임.
- [ ] 다른 챕터 동일 동작 (현재는 ep-01만 있음).

## 비-회귀 (의도된 변경)
- 첫 페이지가 시리즈 cover → 챕터 cover 로 변경.
- 페이지 수 = 1장 줄어듦.
