<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 014 모바일 한 페이지 모드 scrollbar 너비 우측 잘림

## 보고
v0.5.7 (SDD 013, `overflow-wrap: break-word`) 적용 후에도 *데스크탑 브라우저 창 좁힘 (≤640px → 모바일 미디어쿼리 발동)* 에서 동일 우측 잘림 잔존. 사용자 보고.

## 근본 원인
- 모바일 selector: `.book-content > * { width: 100vw }`.
- `100vw` = viewport width *including vertical scrollbar* (CSS 사양). 데스크탑 Chrome / Firefox 의 vertical scrollbar 너비 (~15px) 만큼 flex item 이 *실제 content area* 초과.
- 결과: flex item width > frame.clientWidth → frame 가로 스크롤 시 우측 ~15px 영역이 viewport 밖으로 밀려 잘림.
- 013 의 `overflow-wrap: break-word` 는 line wrap 만 해결하고 flex item 자체 너비는 그대로.

## 핫픽스
- JS `measure()` 안에서 `frame.style.setProperty('--page-w', '${frame.clientWidth}px')` — scrollbar 제외 실제 content area.
- CSS: `.book-content > * { flex: 0 0 var(--page-w, 100vw); width/max-width 동일 }` — JS 측정값 사용. fallback 100vw 는 초기 paint.
- `measure()` 는 mount / resize / bodyHtml 변경 시 자동 호출 — 동기화 자동.

## 검증 (사용자)
- 데스크탑 브라우저 창 640px 이하로 좁히기 → 챕터 §1 진입.
- 본문 우측 잘림 없음.
- 가로 페이지 전환 + 페이지 카운트 (N/N) 정상.
- 모바일 실기기 동일.

## 회귀 X
- 데스크탑 (>640px) = CSS columns 패턴 그대로, flex selector 발동 X.
- JS pagination 로직 = `frame.clientWidth` 그대로 사용 (변경 0).

## v0.5.8 후속 보완 (사용자 보고 — 잔존 잘림)
- 근본: `useEffect` = paint *후* 실행 → 첫 paint 시 `--page-w` 미설정 → CSS fallback `100vw` 적용.
  부모 container = `max-w-500 + mx-auto + chapter MAIN_CLS px-clamp(8,2vw,16px)` 라 frame width <
  viewport 너비. 100vw fallback 이 부모 container 초과 → 우측 잘림.
- 수정: `useEffect` → `useLayoutEffect` (paint 전 동기 측정). 첫 paint 부터 정확한 px 적용.
- CSS fallback `100vw` → `100%` — useLayoutEffect 가 set 하기 직전 1 tick 또는 SSR 환경 대비
  (Vite SPA 라 실 영향 0, 다만 100% = 부모 의존 → 100vw 보다 안전).
- Vite SPA = SSR 없음 → useLayoutEffect warning 무관.
