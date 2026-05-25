<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 008 핫픽스

## 단계
1. `book-reader.css` `.book-reader-root` 룰 제거 (주석으로 변경 이력 보존).
2. `book-reader.tsx`:
   - `passive:false touchmove` useEffect 블록 제거.
   - `axisLockRef`·`rootRef` 변수 제거.
   - `onTouchStart`/`onTouchEnd` SDD 004 이전 단순 형태로 복원.
   - section 의 `ref={rootRef}` + `book-reader-root` 클래스 제거.
   - 임계 (`dy * 1.0`) 유지.
3. typecheck + lint pass.
4. develop → release → main + tag v0.5.2.
