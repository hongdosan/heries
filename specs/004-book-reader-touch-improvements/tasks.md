<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Tasks — 터치 swipe 개선

- [ ] T1: `book-reader.css` `.book-reader-root` 에 `touch-action: pan-y pinch-zoom` 추가.
- [ ] T2: `book-reader.tsx` section 에 `book-reader-root` 클래스 + `rootRef` 추가.
- [ ] T3: useEffect 로 passive:false touchmove listener 등록.
- [ ] T4: touchmove handler — axis lock (5px 임계) + 가로 우세 시 `preventDefault`.
- [ ] T5: `finishDrag` 임계 `1.5` → `1.0` 완화.
- [ ] T6: `npm run typecheck` pass.
- [ ] T7: `npm run lint` pass.
- [ ] T8: handoff.md 작성.
