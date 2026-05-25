<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — swordsman-survival 상수 추출 (constants.ts 분리)

## 무엇을
`swordsman-survival.tsx` 의 인라인 게임 튜닝 상수 약 50종을 동일 슬라이스의 `constants.ts` 파일로 추출.

## 왜
1. **자매 슬라이스 정합** — 같은 `games/` 디렉토리 아래 `gwangsalgeom` 은 `constants.ts` SSOT 패턴. swordsman-survival 만 인라인 → 정합 위반(메모리 룰).
2. **튜닝 가시성** — 50+ 상수가 본체 컴포넌트와 섞여 있어 찾기 어려움. 별도 파일이면 한 곳에서 밸런스 조정.
3. **모듈 책임 분리** — `tsx` = JSX 렌더 + hook 흐름, `ts` = 순수 상수. SoC 강화.

## 사용자 가치
- 작가/개발자(본인) 가 게임 밸런스 튜닝 시 1개 파일만 열면 됨. 본체 파일 1258 LOC 스크롤 불필요.

## 범위 (스코프 인)
- 인라인 `const` 50종 (라인 13~98) + `BEST_KEY` (라인 515) → `constants.ts` 로 이동.
- 모두 `export const` 로 변경.
- `swordsman-survival.tsx` 는 `import { ... } from './constants.js'` 로 참조.

## 범위 외 (스코프 아웃)
- 게임 로직·렌더·step 분리(gwangsalgeom 처럼 `step.ts` / `render.ts` 추출): 본 spec 외. 별도 후속.
- 상수 값 변경, 게임 밸런스 조정: 0건. 값은 일체 보존.
- `BEST_KEY` 외의 모듈 스코프 식별자(예: `MAX_RAW_BULLETS` 등): 본 사이클 범위 → 모두 포함.

## 비기능
- TS strict 통과(`npm run typecheck`).
- ESLint 통과(`npm run lint`).
- 게임 동작 회귀 0건 (regression.md 참조).
