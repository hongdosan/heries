<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Handoff — 004-book-reader-touch-improvements

## 결과
1. **`book-reader.css`** — `.book-reader-root` 에 `touch-action: pan-y pinch-zoom` 추가. 가로 swipe = JS, 세로 스크롤·핀치 줌 = 브라우저 분리.
2. **`book-reader.tsx`** — 3 변경:
   - section 에 `rootRef` + `book-reader-root` 클래스.
   - passive:false `touchmove` 네이티브 listener (useEffect). axis lock (5px 임계) — 가로 우세 시 `preventDefault()`.
   - `finishDrag` 임계 `Math.abs(dy) * 1.5` → `Math.abs(dy)` 완화 (45° 사선까지 인정).

## 검증
- `npm run typecheck` ✓
- `npm run lint` ✓
- **수동 (사용자 모바일)**:
  - [ ] 가로 swipe 자연 (화면 자체 움직임 0).
  - [ ] 살짝 사선 swipe 인식.
  - [ ] 세로 swipe = 페이지 넘김 안 됨.
  - [ ] 핀치 줌 정상.

## 회귀
- 데스크탑 마우스 drag, 키보드 네비, TOC, progress = 영향 0.

## Constitution
R1·R2·R3·R4·R6 strict ✓.

## 다음
- 사용자 모바일 검증 후 develop merge → main 태그 → ep-02 진입.
