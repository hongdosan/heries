<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 북리더 모바일 터치 swipe 개선

## 무엇을
모바일 핸드폰에서 북리더 페이지 넘김 시:
1. *화면 자체가 움직이는* 브라우저 기본 동작 차단.
2. 손가락 움직임에 *실시간 시각 피드백* (선택 — 1차는 간소화).
3. 자연 사선 swipe도 정상 인식 (임계 완화).

## 왜
사용자 명시 — "핸드폰에서는 터치로 드래그해서 페이지 넘길 때, 화면 자체가 움직여서 그런지 모르겠는데, 페이지 넘김이 부드럽거나 자연스럽지 못함. 먹통일 때도 간헐적으로 나타나고."

## 사용자 가치
- 핸드폰 독자가 자연스럽게 페이지 넘김. 화면 진동·먹통 해소.

## 범위 (스코프 인)
- `book-reader.tsx` 터치 handler 보강:
  - `onTouchMove` 추가 (axis lock + horizontal 인식 시 `preventDefault`).
  - passive:false 등록을 위해 useEffect + 네이티브 `addEventListener` 패턴.
- `book-reader.css` `book-reader` 또는 `book-frame` 에 `touch-action: pan-y pinch-zoom` 추가 (가로 swipe = 본인 처리, 세로 스크롤은 브라우저).
- 임계 완화 — `Math.abs(dx) < Math.abs(dy) * 1.5` → `Math.abs(dx) < Math.abs(dy) * 1.0` (관대화). 60px 최소 이동은 유지.

## 범위 외 (1차)
- 손가락 따라 실시간 transform translateX 피드백 = **별도 사이클**. 1차는 *화면 안 움직임 + 자연 사선 인식*만.
- 데스크탑 마우스 drag 동작은 그대로 (영향 0).
- 키보드 네비, TOC, progress 동작은 그대로.

## 비기능
- TS strict 통과 (`npm run typecheck`).
- ESLint 통과 (`npm run lint`).
- 회귀 0건 (regression.md 참조).
