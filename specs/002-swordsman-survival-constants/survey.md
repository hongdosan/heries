<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Survey — swordsman-survival 상수 인라인 (현 상태)

## 대상
`src/features/mini-game/games/swordsman-survival/swordsman-survival.tsx` (1258 LOC)

## 현 상태
- 게임 튜닝 상수 **약 50종**이 파일 상단(라인 13~98) + 모듈 스코프(라인 515 `BEST_KEY`) 에 `const` 로 인라인.
- 카테고리: 월드/플레이어/적/총알/파상/아이템/파티클 색·개수·물리/스킬/UI 페이드 등.
- 컴포넌트 본체(라인 100~1258) 가 이들 상수를 다수 참조.

## 자매 슬라이스 비교 — gwangsalgeom
`src/features/mini-game/games/gwangsalgeom/` 디렉토리:
- `constants.ts` — 모든 튜닝 상수 SSOT (50+ 종).
- `gwangsalgeom.tsx` (main) + `step.ts` / `render.ts` / `lib.ts` / `use-game-loop.ts` / `types.ts` — 분리된 모듈.
- `index.ts` — Public API.

→ **자매 슬라이스 정합 어긋남.** swordsman-survival 만 인라인 패턴, gwangsalgeom 은 분리 SSOT 패턴.

## 영향 범위
- 컴파일/타입: 영향 없음 (이름·값·타입 보존).
- 런타임 동작: 영향 없음 (값 보존, import 만 변경).
- 번들 크기: 미미한 증가 가능 (별도 모듈 1개). tree-shaking 으로 영향 0.
- HMR: 상수만 변경 시 컴포넌트 재마운트 → 기존과 동일.
- 스토리북: `swordsman-survival.stories.tsx` 영향 없음 (컴포넌트 prop 변경 X).

## 작가/콘텐츠 영향
- 0건. 코드 구조만 변경, 게임 로직·밸런스·UI 미변경.

## 메모리 룰 정합
- `feedback_sibling_slice_alignment.md` — 자매 슬라이스 정합은 절대. 베스트 프랙티스(gwangsalgeom 패턴) 쪽으로 통일.
- `feedback_code_review_conventions.md` — 패턴 mismatch 발견 시 *보류 권장* X → 자동 적용.
