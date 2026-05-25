<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 북리더 터치 swipe 개선 실행

## 접근
3 layer 동시 적용:
1. **CSS** `touch-action: pan-y` — 브라우저에게 *가로는 우리가, 세로는 브라우저* 분리. pinch-zoom 보존.
2. **passive:false touchmove listener** — `preventDefault` 가 실제로 작동하도록 React synthetic 우회 + useEffect + native addEventListener.
3. **임계 완화** — `dy * 1.5` → `dy * 1.0` (정사각 영역까지 가로 인정).

## 단계
1. `book-reader.css` — `.book-reader-root` (또는 section) 에 `touch-action: pan-y` 추가. CSS 클래스 식별 = section element에 `book-reader-root` 클래스 추가.
2. `book-reader.tsx`:
   - section ref 추가 (`rootRef = useRef<HTMLElement>(null)`).
   - useEffect로 `rootRef.current.addEventListener('touchmove', handler, {passive: false})` 등록.
   - touchmove handler: axis lock — 첫 움직임에서 dx vs dy 비교 → 가로 우세면 `preventDefault()` + 가로 swipe 모드 lock. 세로 우세면 그대로 두기 (브라우저 스크롤).
   - `finishDrag` 임계 `1.5` → `1.0`.
3. `npm run typecheck` pass.
4. `npm run lint` pass.

## 검증 (R3)
- `npm run typecheck && npm run lint` pass.
- (수동) 모바일 (또는 dev tools mobile emulation):
  - 좌→우 / 우→좌 swipe 가 페이지 넘김. 화면 자체 움직임 0.
  - 살짝 사선 swipe도 인식.
  - 세로 swipe = 페이지 안 세로 스크롤 (있다면) 또는 무동작.

## 위험 / 완화
- **위험 1**: `touch-action: pan-y` 가 일부 브라우저에서 핀치 줌 막음. **완화**: `pan-y pinch-zoom` 으로 명시.
- **위험 2**: passive:false listener 가 다른 페이지 전체 영향. **완화**: rootRef 범위로 한정.
- **위험 3**: axis lock 잘못 판정 시 (시작 한 점에서 즉시 결정) 사용자 의도 X 방향 선택. **완화**: 시작 직후 5~10px 이동 후 axis 판정.

## Constitution 정합
- R1 ✓ / R2 ✓ / R3 = typecheck+lint / R4 = regression / R6 strict ✓
