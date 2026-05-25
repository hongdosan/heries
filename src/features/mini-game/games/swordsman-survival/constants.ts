// © 2026 홍도산. All rights reserved. Original creator work.
// 검기생존록 (Swordsman Survival) 게임 상수 SSOT — 튜닝 값 50+ 종.
// 좌표계: WORLD_W × WORLD_H. 박스 안에서 CSS scale 로 fit (별도 viewport 변환).
// 사용처: swordsman-survival.tsx (main 컴포넌트 + 모듈 헬퍼). 순수 상수 — React/hook 무관.
// 자매 슬라이스 정합: ./gwangsalgeom/constants.ts 와 동일 구조.

// 월드 상수 (게임 SSOT 좌표계)
export const WORLD_W = 360
export const WORLD_H = 640

// 플레이어
export const PLAYER_SIZE = 30
export const PLAYER_SPEED = 3.2
export const PLAYER_MAX_HP = 3
export const PLAYER_IFRAME_MS = 900

// 적 — 초반 난이도 완화 (사용자 피드백 = 처음부터 너무 빠름)
export const ENEMY_SIZE = 28
export const ELITE_SIZE = 40
export const ENEMY_BASE_SPEED = 0.65    // 1.05 → 0.65 (38% 완화, 첫 wave 여유)
export const ENEMY_WAVE_INCREMENT = 0.12 // wave 별 +0.12 (이전 0.18 → 33% 완화)
export const ENEMY_HP = 1
export const ELITE_HP = 3
export const SCORE_NORMAL = 10
export const SCORE_ELITE = 45

// 총알
export const BULLET_SIZE = 10
export const BULLET_SPEED = 7.4
export const BULLET_LIFE = 72
export const FIRE_COOLDOWN_FRAMES = 12

// 파상 (wave) — 시간 진행에 따른 난이도 곡선
export const WAVE_DURATION_FRAMES = 60 * 22  // 약 22초/파상 (60fps 가정)
export const SPAWN_BASE_FRAMES = 110         // 70 → 110 (첫 wave spawn 간격 약 1.8s)
export const SPAWN_MIN_FRAMES = 20           // 최소 간격 18 → 20
export const SPAWN_WAVE_REDUCTION = 8        // wave 별 -8 frames

// 아이템 — 적 처치 시 확률 drop
export const ITEM_SIZE = 22
export const ITEM_LIFE_FRAMES = 60 * 8       // 8초 후 자동 소멸
export const ITEM_DROP_NORMAL = 0.08         // 일반 적 8% drop
export const ITEM_DROP_ELITE = 0.35          // 엘리트 적 35% drop
export const ITEM_SCORE_BONUS = 30
export const ITEM_HP_HEAL = 1

// 무협 액션 sprite — BASE_URL prefix 위해 assetUrl 헬퍼.
// JSX 의 inline style 에서 backgroundImage 로 적용.
// sprite 상수 = top of file vite ?url import 으로 대체됨.
export const IMPACT_FADE_MS = 280

// 스킬 — 검막 (Active, Shift / 상단 우측 버튼)
export const SKILL_CD_FRAMES = 60 * 8        // 8초 쿨다운
export const SKILL_DURATION_FRAMES = 60      // 1초 발동 (무적 + push)
export const SKILL_PUSH_RADIUS = 100         // 100px 반경
export const SKILL_PUSH_STRENGTH = 34        // 적 밀어내기 강도

// 파티클 색상 — 게임 톤 (모두 hex). CSS var 와 분리된 이유 = JS 안에서
// 동적 매개변수로 spawnParticles 에 전달. CSS 변수는 stylesheet 한정.
export const COLOR_HIT_NORMAL = '#fda4af'    // 일반 적 피격 파티클
export const COLOR_HIT_ELITE = '#f59e0b'     // 엘리트 적 피격 파티클
export const COLOR_KILL_NORMAL = '#fecaca'   // 일반 적 처치 폭발 파티클
export const COLOR_KILL_ELITE = '#fbbf24'    // 엘리트 적 처치 폭발 파티클
export const COLOR_PLAYER_HIT = '#7dd3fc'    // 플레이어 피격 파티클 (스킬 ring 색과 동일)
export const COLOR_ITEM_HEART = '#fca5a5'    // HP 회복 아이템 픽업 파티클
export const COLOR_ITEM_GEM = '#fde68a'      // 점수 아이템 픽업 파티클

// 파티클 개수 — 적 피격/처치 시 spawn 개수
export const PARTICLES_HIT_NORMAL = 5
export const PARTICLES_HIT_ELITE = 8
export const PARTICLES_KILL = 10
export const PARTICLES_PLAYER_HIT = 8
export const PARTICLES_ITEM_PICKUP = 12
export const PARTICLES_SKILL_ACTIVATE = 20

// 게임 진행 기타 임계
export const ITEM_BLINK_THRESHOLD_FRAMES = 120  // 마지막 2초 (60fps) 깜빡임
export const ITEM_BLINK_INTERVAL_FRAMES = 12    // 깜빡임 주기
export const PARTICLE_FRICTION = 0.92           // 파티클 마찰 계수 (frame 마다)
export const PARTICLE_LIFE_FRAMES = 28          // 파티클 수명
export const PARTICLE_SPEED_MIN = 1
export const PARTICLE_SPEED_RANGE = 2.6
export const SPAWN_JITTER_FRAMES = 8            // spawn 간격 랜덤 편차
export const PLAYER_OPACITY_BLINK_INTERVAL = 6  // 무적 시 깜빡임 주기 (frame)
export const PLAYER_OPACITY_BLINK_DUTY = 3      // 깜빡임 듀티
export const SKILL_RING_BASE_SCALE = 0.6
export const SKILL_RING_SCALE_DELTA = 1.6
export const ANNOUNCE_FADE_MS = 1100
export const FLASH_FADE_MS = 180
export const DT_BASE_MS = 16.67                 // 60fps 기준
export const DT_SCALE_MIN = 0.5
export const DT_SCALE_MAX = 2.5
export const RAW_HIT_PADDING_PX = 20            // 총알이 stage 밖으로 나가는 임계

// best-score localStorage 키
export const BEST_KEY = 'heries:mini-game:best-score'
