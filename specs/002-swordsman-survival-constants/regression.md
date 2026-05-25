<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Regression — 기존 동작 보존 체크리스트 (R4)

## 보존 대상 (변경 0)
- 게임 시작 시 wave 1 spawn 간격 (`SPAWN_BASE_FRAMES = 110`).
- 플레이어 HP / iframe (`PLAYER_MAX_HP = 3`, `PLAYER_IFRAME_MS = 900`).
- 적 속도 곡선 (`ENEMY_BASE_SPEED = 0.65` + `ENEMY_WAVE_INCREMENT = 0.12`).
- 엘리트 drop 확률 (`ITEM_DROP_ELITE = 0.35`).
- 검막 스킬 쿨다운/지속 (`SKILL_CD_FRAMES = 60 * 8`, `SKILL_DURATION_FRAMES = 60`).
- 파티클 색·개수 — 일반/엘리트 피격·처치·플레이어 피격·아이템 픽업.
- 최고 점수 localStorage 키 (`BEST_KEY = 'heries:mini-game:best-score'`).

## 자동 검증
- `npm run typecheck`: 타입 오류 0.
- `npm run lint`: 경고/오류 0.

## 수동 검증 (작가 모드 진입 후)
- [ ] `npm run dev` → `/` → 미니 게임 영역 진입.
- [ ] 1 라운드 플레이 (~30초): 플레이어 이동·발사·피격·스킬·아이템 드롭 동작 확인.
- [ ] 게임 오버 후 best score localStorage 키 저장 확인.

## 비-회귀 (의도된 변경)
- swordsman-survival.tsx 본체 LOC 약 -90 LOC (50 상수 + 카테고리 주석 이동).
- `constants.ts` 신규 ~110 LOC.
- 모듈 그래프: tsx → constants.ts (단방향 의존, gwangsalgeom 동일).
