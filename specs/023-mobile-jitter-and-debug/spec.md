<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 023 모바일 jitter 해소 + 1/1 자율 디버그

## 보고 (v0.5.13 후)
1. 페이지 넘김 시마다 흔들림 — `scroll-snap-type: x proximity` 도 잔존.
2. 모바일 1/1 회귀 — 022 key 강제 후에도 잔존. 자율 디버그 + fix 시도 명시.

## 핫픽스 (다중 가설)

### jitter 해소
- `scroll-snap-type: x proximity` → `none`. drag/swipe 후 명시 `goToPage` 가 페이지 정렬 보장 → snap 불필요.
- `goToPage` `behavior: 'smooth'` → `'auto'`. smooth scroll 중 매 frame `onScroll → setPage → re-render` 이 jitter 원인. 즉시 jump → jitter X.
- `onScroll` raf throttle — scroll 중 setPage 매 frame 1 회 만.

### 1/1 자율 디버그 + fix
- 측정 layoutEffect 안 `requestAnimationFrame` 으로 측정 지연 — iOS Safari layoutEffect 시점 flex layout 미완료 케이스 대비. raf = next paint frame → layout 완료 보장 → 측정 정확.
- `if (chunks.length > 0) setMobilePages(chunks)` — 0 chunk 케이스 (측정 fail) 시 null 유지 → single 모드 fallback.
- frame `data-mobile` / `data-chunks` / `data-total` attribute — dev tools elements 패널에서 isMobile / chunks 갯수 / measure 결과 확인 가능 (자율 진단 일시).

## 검증 (사용자)
- 페이지 전환 jitter X (즉시 jump).
- 모바일 N/N 페이지 (혹은 data-chunks 로 진단).
