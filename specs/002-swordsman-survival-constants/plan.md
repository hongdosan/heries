<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 상수 추출 실행 계획

## 접근
gwangsalgeom 의 `constants.ts` 형식과 헤더·카테고리 주석 구조 동일하게 유지. 한 번에 모든 상수 이동(부분 이동 X — 일관성).

## 파일 구조 (after)
```
src/features/mini-game/games/swordsman-survival/
├── constants.ts            ← 신규 (50+ export const)
├── index.ts                ← 유지
├── swordsman-survival.tsx  ← 인라인 const 50종 제거, import 추가
└── swordsman-survival.stories.tsx ← 유지
```

## constants.ts 구조
```ts
// © 2026 홍도산. All rights reserved. Original creator work.
// 검기생존록 게임 상수 SSOT. (카테고리별 그룹)
// 좌표계: WORLD_W × WORLD_H. ...

// 월드 상수
export const WORLD_W = 360
export const WORLD_H = 640

// 플레이어
export const PLAYER_SIZE = 30
...
```

## swordsman-survival.tsx 변경
- 라인 13~98 + 라인 515 의 `const` 선언 50개 제거.
- 상단에 `import { ... } from './constants.js'` 추가 (categorized 정렬, 한 줄 또는 다중 줄).
- 컴포넌트 본체 코드 무변경.
- 헤더 주석(라인 6~10) 유지.

## 검증 (R3)
- `npm run typecheck` pass.
- `npm run lint` pass.
- (수동) `npm run dev` → 게임 1 라운드 플레이 → 행동·밸런스·스킬·아이템 동일 확인.

## 위험 / 완화
- **위험 1**: 식별자 누락 시 ReferenceError. **완화**: 라인 13~98 모든 `^const` 매칭 grep + 라인 515 BEST_KEY 명시. 추출 후 grep 으로 인라인 잔존 0건 확인.
- **위험 2**: 컴포넌트 내부 스코프 const 변수도 매칭해 잘못 이동. **완화**: 모듈 스코프(들여쓰기 없는 라인) 만 대상. 검사 = `grep -E '^const ' .../*.tsx`.
- **위험 3**: import 경로 오타. **완화**: ESLint `no-restricted-imports` + TS resolution 자동 검출.

## Constitution 정합
- R1 ✓ (spec.md 비자명)
- R2 ✓ (본 plan)
- R3: 검증 = `npm run typecheck && npm run lint` (CLAUDE.md `SDD_TEST_CMD`)
- R4: 기존 코드 변경 → regression.md 동반(별도 파일).
- R6: 변경은 dev 도구·리팩토링 — production 시그널 없음. strict 핀 적용.
