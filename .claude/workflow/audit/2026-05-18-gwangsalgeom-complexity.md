<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# Audit — gwangsalgeom (광살검) 코드 복잡도

**작성**: 2026-05-18 자율 사이클
**대상**: `src/features/mini-game/games/gwangsalgeom/gwangsalgeom.tsx` (1369 줄)
**상태**: **보고만 — 직접 수정 X** (사용자 결정 대기, 시각/메커닉 회귀 risk)

## 요약

단일 컴포넌트 안에 게임 로직 / 상태 / 입력 / 렌더가 모두 응집되어 있어 cognitive complexity 가 높음. **분리 시 게임 메커닉 변경 risk 없는** 안전한 추출 항목 5 개 식별.

- 라인 수: **1369 줄**
- 메인 컴포넌트 `Gwangsalgeom`: **920 줄** (line 372~1289)
- 상수: 50+ 개 (튜닝 값)
- React hooks 호출: **47 회** (useState 14 / useRef 9 / useEffect 5 / useLayoutEffect 1 / useCallback 17 / memo 2)
- useCallback 핸들러 17 개 (다수 50~76 줄)

## 구조 분석

### 상수 그룹 (line 27~250)
세계관 (`WORLD_W/H` `GROUND_Y`) / 플레이어 / 적 / 슬래시 / 기 / 대시 / 점수 / 콤보 / 카메라 등 50+ 개 튜닝 값. 모두 module-level `const`.

### 타입 정의 (line ~200~250)
`Player` `Enemy` `Wave` `Particle` `Effect` `Phase` `View` `Judge` `JudgeTone` `ActionKey` `KeysHeld` `EffectKind` 12 종.

### 순수 함수 (line 254~370)
`clamp` `rectsOverlap` `nextId` `makePlayer` `makeEnemy` `spawnParticles` `makeWave` `actionOf` — 컴포넌트 외부 module-level. React 영향 0 (React Compiler `'infer'` 모드라 무시됨).

### 메인 컴포넌트 (line 372~1289, 920 줄)
- state 14 개 (`phase` `player` `enemies` `waves` `particles` `effects` `gwangsalFx` `score` `combo` `level` `ki` `judge` `shake` `view`)
- ref 9 개 (DOM refs + 패드/키/프레임/타이머 등)
- effect 5 개 (line 407 / 415 / 442 / 494 / 743) — 가장 큰 = game loop
- useCallback 17 개:
  - 간단 (10 줄 이하): `flashText` `triggerShake` `hitStop` `spawnBurst` `spawnEffect` `stageRectToWorldX`
  - 큰 (30~76 줄): `slashAttack` (76) `qiAttack` `dash` `takeDamage` `reset` `onPadDown` `onStagePointerMove`

### 렌더 sub-컴포넌트 (line 1289 이후)
`pickHeroSprite` + `StickmanView` (memo) + `EnemyView` (memo). **이미 분리됨 ✓** — 본 audit 의 분리 대상 X.

## 분리 권장 (안전 — 메커닉 변경 0)

5 파일 분할로 메인 컴포넌트 920 → 300 줄 이내 가능.

### 1. `constants.ts` (예상 100 줄)
- 모든 module-level 상수 (라인 27~250)
- 그룹 주석: `// 세계`, `// 플레이어`, `// 적`, `// 슬래시`, `// 기`, `// 대시`, `// 점수·콤보`, `// 카메라`
- import 단순화: `import * as C from './constants.js'` (혹은 named import 그룹)

### 2. `types.ts` (예상 80 줄)
- 12 종 인터페이스/타입 (`Player`, `Enemy`, `Wave`, `Particle`, `Effect`, `Phase`, `View`, `Judge`, `JudgeTone`, `ActionKey`, `KeysHeld`, `EffectKind`)

### 3. `lib.ts` (예상 200 줄)
- 순수 함수 8 종 (`clamp`, `rectsOverlap`, `nextId`, `makePlayer`, `makeEnemy`, `spawnParticles`, `makeWave`, `actionOf`)
- `pickHeroSprite` 도 함께 (현재 line 1289, 순수 함수)

### 4. `use-game-loop.ts` (예상 250 줄, custom hook)
- 메인 useEffect (game loop) + 관련 ref (frameRef / lastSpawnRef / scoreTickRef / hitStopUntilRef / stateRef)
- 입력: state + setters + refs (인자)
- 반환: cleanup
- 게임 메커닉 (적 spawn / 충돌 / 점수 등) 모두 본 hook 안 — 변경 0

### 5. `use-input.ts` (예상 150 줄, custom hook)
- 키보드 (`onKeyDown` / `onKeyUp` + effect line 743)
- 패드 (`onPadDown` + ref 관리)
- 스테이지 포인터 (`onStagePointerDown/Move/Up` + `stageRectToWorldX`)
- 반환: handler 객체 (`{onKeyDown, onKeyUp, onPadDown, onStagePointer*}`)

### 메인 컴포넌트 잔존 (예상 280~300 줄)
- state 선언
- 액션 callback (`slashAttack` / `qiAttack` / `dash` / `takeDamage` / `reset`)
- useGameLoop / useInput 호출
- JSX 렌더 (stage / overlay / pad / HUD)

## 위험도 평가

| 항목                | risk | 사유                                                  |
|-------------------|------|-----------------------------------------------------|
| 게임 메커닉 변경         | **0** | 순수 분리만 — 상수/타입/함수/effect 본문 이동 only                |
| 시각 회귀             | **0** | CSS/JSX 변경 X                                       |
| React Compiler 정합 | 낮음   | `'infer'` 모드 — hook 분리는 PascalCase + use prefix 안전 |
| TypeScript 타입 추론  | 낮음   | named import 추가만, 타입 시그니처 변경 X                     |
| 디버깅 / 신규 기능 추가 난이도 | **↓ (개선)** | 파일별 책임 명확 + jump-to-symbol 빨라짐                    |

## 검증 (분리 후 권장)

1. `npm run validate` — TS + lint + build 통과
2. `npm run build-storybook` — storybook 정합
3. **수동 시연** — 사용자가 검기생존록 게임 실제 플레이 (적 spawn / 슬래시 / 기 / 대시 / 점수 / 콤보 / 게임 오버) 모두 정상 동작
4. 분리 전후 dist 번들 크기 비교 — gzip 차이 ≤ ±0.5 KB 예상

## 권장 사이클

**Phase 1** (가장 안전): `constants.ts` + `types.ts` + `lib.ts` 3 파일 추출. 메인 컴포넌트는 import 추가만. 720 → 480 줄.

**Phase 2** (중간): `use-game-loop.ts` 추출. 가장 큰 useEffect 본문 이동. 480 → 280 줄.

**Phase 3** (선택): `use-input.ts` 추출. 입력 핸들러 통합. 280 → 200 줄.

각 Phase 후 사용자 시연 + 다음 Phase 결정. 한 번에 전부 적용 X — Phase 별 commit 분리.

## 비-권장

- 액션 callback (`slashAttack` 등) 의 별도 파일 분리는 X. 본문 안에서 state setter 와 직접 결합되어 있어 hook 추출 시 prop drilling 증가. 메인 안에 두는 게 가독성·디버깅 모두 우수.
- pure 함수 외 추가 추출은 risk 증가.

## 결론

**현재 단일 컴포넌트 1369 줄 = 동작은 안정**. 다만 신규 기능 추가 / 디버깅 시 cognitive load 큼. Phase 1 (constants/types/lib 추출) 만 적용해도 **메인 920 → 480 줄** 로 60% 감소 + 게임 코드 진입점 단순화. **사용자 결정 시 진입 권장**.
