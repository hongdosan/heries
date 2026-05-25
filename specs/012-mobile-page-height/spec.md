<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 012 모바일 페이지 짤림 해소

## 보고
v0.5.5 (SDD 011 flex row + scroll-snap) 적용 후 모바일 페이지 전환 = 정상 작동. 다만 사용자 보고 — *짤려서 나옴* (페이지 안 본문이 cut-off).

## 근본 원인
- `BOOK_FRAME_STYLE` (inline) `height: clamp(420px, 58vh, 560px)` + `overflow: hidden` → 모바일 frame = 약 580px 높이 한정.
- SDD 011 flex item `height: 100%` + `overflow-y: auto` → 페이지 안 본문이 frame 580px 초과 시 *세로 스크롤* 의도. 다만 iOS Safari 에서 *scroll-snap-type x mandatory* + 자식 *overflow-y: auto* 충돌로 세로 터치 스크롤 무시 → 본문 짤림.

## 핫픽스
- frame `height: auto + max-height: none + min-height: 100vh + overflow-y: visible` — 본문 흐름에 맞춰 자연 확장.
- flex item `height: auto + min-height: 100vh + overflow: visible` — 페이지 자체가 길어짐.
- 결과: 모바일 = 가로 swipe 페이지 전환 + 페이지 자체가 본문 길이만큼 늘어남 → 전체 페이지를 *세로 스크롤* 로 자연 흐름.
- scroll-snap-type 유지 — 페이지 경계 snap.

## 검증
- 모바일 캐시 강제 새로고침 → 챕터 진입.
- cover → 좌 swipe → §1 페이지 (긴 본문이면 세로 스크롤 자연).
- 페이지 안 본문 cut-off 없음.
- 데스크탑 영향 0.
