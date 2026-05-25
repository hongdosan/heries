<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Regression — 터치 swipe 개선 회귀 보존 (R4)

## 보존 대상 (변경 0)
- 키보드 네비 (←/→/Home/End/PageUp/PageDown).
- 데스크탑 마우스 drag (`onMouseDown/Up/Leave` + `finishDrag`).
- 페이지 spread 정렬 (`scrollLeft` 측정 + 재정렬).
- TOC dialog, progress, header 동작.
- `book-frame` overflow:hidden + column-flow.

## 자동 검증
- `npm run typecheck` ✓
- `npm run lint` ✓

## 수동 검증 (사용자)
- [ ] 데스크탑 마우스 drag 페이지 넘김 = 그대로.
- [ ] 데스크탑 키보드 ←/→ = 그대로.
- [ ] 모바일 (또는 dev tools mobile emulation):
  - [ ] 좌→우 swipe → 이전 페이지.
  - [ ] 우→좌 swipe → 다음 페이지.
  - [ ] 살짝 사선 swipe (45° 가까이) → 정상 인식.
  - [ ] 세로 swipe → 페이지 넘김 X (브라우저 처리).
  - [ ] swipe 중 화면 자체 흔들림 X.
  - [ ] 핀치 줌 동작 (`pinch-zoom` 보존 확인).

## 비-회귀 (의도된 변경)
- 모바일 swipe 시 브라우저 기본 가로 스크롤 차단 (의도).
- 임계 완화로 더 다양한 사선 swipe 인식 (의도).
