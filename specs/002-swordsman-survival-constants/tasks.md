<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Tasks — 상수 추출

- [ ] T1: `constants.ts` 생성, 저작권 고지 + 헤더 주석 + 카테고리별 `export const` 50종.
- [ ] T2: `swordsman-survival.tsx` 상단 인라인 const (라인 13~98) 일괄 제거.
- [ ] T3: `swordsman-survival.tsx` 라인 515 `BEST_KEY` 제거.
- [ ] T4: `swordsman-survival.tsx` 상단에 `import { ... } from './constants.js'` 추가.
- [ ] T5: `grep -nE '^const ' swordsman-survival.tsx` 잔존 0 확인.
- [ ] T6: `npm run typecheck` pass.
- [ ] T7: `npm run lint` pass.
- [ ] T8: handoff.md 작성 → CURRENT.md 갱신.
