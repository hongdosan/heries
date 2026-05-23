<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Handoff — 002-swordsman-survival-constants

## 결과 (실행 완료)
- `constants.ts` 신규 생성 (110 LOC, 50+ export const).
- `swordsman-survival.tsx` 인라인 const 51개(라인 13~98 + 라인 515 BEST_KEY) 제거 + `import { ... } from './constants.js'` 추가.
- 헤더 주석에 자매 슬라이스 SSOT 명시.

## 검증
- `npm run typecheck` ✓ (오류 0)
- `npm run lint` ✓ (오류 0)
- 인라인 `const` 잔존 grep ✓ (0건)
- pre-commit 게이트 직접 실행 → R1/R2/R3 통과, exit 0 (strict)

## 회귀
- 상수 값·이름·타입 전부 보존 → 게임 로직 변경 0건.
- 수동 확인 권장 (사용자): `npm run dev` 후 1 라운드 플레이.

## Constitution 정합
- R1 (spec) ✓
- R2 (plan) ✓
- R3 (verification pass) ✓
- R4 (regression checklist) ✓
- R6 (strict) ✓ — 자동 승격 시그널 없으나 핀 적용
- R7 (sync-check) — H-eries 미적용

## 다음
- 사용자 commit (메모리 룰: 에이전트 commit X). 권장 메시지:
  ```
  refactor(mini-game): swordsman-survival 상수를 constants.ts로 분리

  자매 슬라이스(gwangsalgeom) 정합. 본체 -90 LOC, SSOT 1곳.
  값·이름·동작 전부 보존(R4). spec/plan/regression = specs/002-swordsman-survival-constants/.
  ```
- merge `--no-ff` develop 후 feature 브랜치 삭제.

## SDD 사이클 흐름 검증 (학습 목적)
- ✅ Survey → 자매 슬라이스 mismatch 정확히 포착
- ✅ Spec → 스코프 in/out 명확
- ✅ Plan → 단계·검증·위험·완화 분리
- ✅ Tasks → 8 항목 추적
- ✅ Regression → 보존 대상 + 자동 검증 + 수동 단계
- ✅ Implement → 1회 추출 + import 갱신
- ✅ Verify → typecheck/lint/grep 모두 pass
- ✅ Pre-commit hook → strict 통과 (실 게이트 동작 확인)
