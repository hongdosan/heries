// © 2026 홍도산. All rights reserved. Original creator work.
// 광살검 (Gwangsalgeom) 게임 상수 SSOT — 튜닝 값 50+ 종.
// 좌표계: WORLD_W × WORLD_H. CSS scale 로 fit (별도 viewport 변환).
// 사용처: gwangsalgeom.tsx (main + view 컴포넌트들). 순수 상수 — React/hook 무관.

// 월드 상수
export const WORLD_W = 820
export const WORLD_H = 460
export const GROUND_Y = 358

// 플레이어 — 시각 크기 (사용자 명시 = 작게).
export const PLAYER_W = 64
export const PLAYER_H = 120
export const PLAYER_SPEED = 3.8
export const PLAYER_MAX_HP = 5
export const PLAYER_IFRAME_MS = 700
export const PLAYER_HURT_KNOCKBACK = 4.6

// 적 — 플레이어와 동일 박스 (사용자 명시).
export const ENEMY_W = PLAYER_W
export const ENEMY_H = PLAYER_H
export const ENEMY_BASE_SPEED = 1.8
export const ENEMY_ELITE_SPEED = 1.45
export const ENEMY_SPEED_PER_LEVEL = 0.05
export const ENEMY_ELITE_SPEED_PER_LEVEL = 0.04
export const ENEMY_HP = 2
export const ENEMY_ELITE_HP = 3
export const ENEMY_ELITE_RATE_BASE = 0.08
export const ENEMY_ELITE_RATE_PER_LEVEL = 0.012
export const ENEMY_ELITE_RATE_MAX = 0.28
export const ENEMY_HIT_STUN_MS = 200
export const ENEMY_QI_STUN_MS = 160
export const ENEMY_DESPAWN_PAD = 120

// 베기 (근접) — 플레이어 박스 중심 기준 좌우 대칭
export const SLASH_COOLDOWN_MS = 200
export const SLASH_FLASH_MS = 170
export const SLASH_REACH = 130              // 박스 중심에서 도달 거리 (PLAYER 비례)
export const SLASH_NEAR = 4
export const SLASH_W = SLASH_REACH - SLASH_NEAR
export const SLASH_H = 80
export const SLASH_OFFSET_Y = 18
export const SLASH_KNOCKBACK = 32

// 장풍 (원거리) — 단일 type
export const QI_COOLDOWN_MS = 0           // 쿨타임 없음 (ki 비용으로 제어)
export const QI_COST = 14
export const QI_DAMAGE = 1                  // 1 데미지 / 관통 (적 다수 hit 가능)
export const QI_W = 84
export const QI_H = 36
export const QI_SPEED = 16                  // 관통 + 빠른 속도
export const QI_LIFE = 64
export const QI_DESPAWN_PAD = 140
export const QI_OFFSET_NEAR = 10            // 박스 중심에서 시작 거리
export const QI_OFFSET_Y = 38

// 이형환위 — 발동 직후 3초 무적 (이형환위 / 도검불침). 내공 11 소모.
export const DASH_COOLDOWN_MS = 0          // 쿨타임 없음 (ki 18 비용으로 제어)
export const DASH_DURATION_MS = 260        // 시각 잔상 표시 길이
export const DASH_DISTANCE = 138
export const DASH_VX = 7.5
export const DASH_IFRAME_MS = 3000         // 무적 3 초
export const DASH_COST = 31                // 내공 소모 (사용자 명시)

// 적 spawn 곡선 — 사용자 *난이도 어려움* 정합 (완화)
export const SPAWN_GAP_BASE = 1300
export const SPAWN_GAP_PER_LEVEL = 60
export const SPAWN_GAP_MIN = 450
export const SPAWN_CAP_BASE = 3
export const SPAWN_CAP_PER_LEVEL = 3
export const SPAWN_CAP_MAX = 8

// 점수·콤보 — 레벨 도달 천천히 (난이도 ↓ 정합)
export const SCORE_PER_LEVEL = 1200
export const SCORE_PER_HIT = 90
export const SCORE_PER_KILL = 90
export const SCORE_PER_COMBO_5 = 20
export const SCORE_QI_HIT = 70
export const SCORE_QI_KILL = 120
export const SCORE_TICK = 1
export const KI_PER_HIT = 4
export const KI_PER_KILL = 8
export const KI_PER_WHIFF = 1
export const KI_MAX = 234
export const KI_GWANGSAL = 234             // 광살 = 게이지 가득 차면 발동
export const KI_GWANGSAL_LOSS = 200        // 광살 발동 시 내공 감소 (잔여 34)
export const KI_HURT_LOSS = 33             // 피격 시 내공 감소

// 파티클 / Hit-stop — count 줄임 (다중 적 시 paint 비용 ↓)
export const PARTICLES_HIT = 3
export const PARTICLES_QI_HIT = 5
export const PARTICLES_KILL = 8
export const PARTICLES_PLAYER_HURT = 6
export const PARTICLES_CAP = 80          // 동시 파티클 상한 (cap 넘으면 오래된 것 drop)
export const PARTICLE_LIFE_MS = 420
export const PARTICLE_LIFE_JITTER_MIN = 0.65        // 파티클별 수명 = LIFE_MS × (MIN ~ MIN+RANGE)
export const PARTICLE_LIFE_JITTER_RANGE = 0.7
export const PARTICLE_VY_BIAS_RATIO = 0.45          // 상방 초기 속도 = speed × 본 비율 (튀어오름 보정)
export const PARTICLE_SPEED_MIN = 60
export const PARTICLE_SPEED_RANGE = 220
export const PARTICLE_GRAVITY = 380
export const PARTICLE_FRICTION = 0.92
export const HITSTOP_HIT_MS = 36
export const HITSTOP_KILL_MS = 72
export const HITSTOP_PLAYER_HURT_MS = 100
export const SCORE_TICK_RATE = 4         // 매 N frame 마다 1점 (60→15tick/s)

// 액션 타이밍 (ms / 비율)
export const HURT_FLASH_MS = 200                    // 피격 깜빡임 표시 길이
export const QI_CAST_POSE_MS = 240                  // 장풍 발사 자세 길이
export const GWANGSAL_FX_MS = 450                   // 광살 풀스크린 sprite fade 길이 (CSS .sm-gwangsal-fx 와 일치)
export const GWANGSAL_FX_CLEAR_MS = GWANGSAL_FX_MS + 10  // setTimeout clear 여유 (sprite fade 완전 종료 후 정리)
export const GWANGSAL_HITSTOP_MS = 200              // 광살 발동 시 hit-stop
export const DASH_PATH_PAD_RATIO = 0.3              // 이형환위 경로 양끝 padding = ENEMY_W × 본 비율
export const ENEMY_KNOCKBACK_ON_DAMAGE = 42         // 적이 플레이어에 부딪힐 때 자기 후퇴 거리

// 임팩트·사망 이펙트 (sprite 기반)
export const EFFECT_IMPACT_LIFE_MS = 220
export const EFFECT_DEATH_LIFE_MS = 420
export const EFFECT_IMPACT_SIZE = 72
export const EFFECT_DEATH_SIZE = 100
export const EFFECT_CAP = 24             // 동시 이펙트 상한

// 파티클 색상 — gwangsalgeom.css 의 --sm-* 토큰과 동일 hex 유지 (sm prefix = stickman-murim 시절 잔존, 호환 보존).
// string literal 은 CSS var 사용 불가 (inline style 의 background 에 직접 들어감).
// CSS 토큰 변경 시 본 상수도 동기화 필수.
export const COLOR_HIT_NORMAL = '#67e8f9'   // see --sm-accent in gwangsalgeom.css
export const COLOR_HIT_QI = '#fcd34d'       // see --sm-amber
export const COLOR_KILL_NORMAL = '#fda4af'  // see --sm-danger
export const COLOR_KILL_ELITE = '#f0abfc'   // see --sm-elite-bright
export const COLOR_PLAYER_HURT = '#fda4af'  // see --sm-danger

// UX 타이밍
export const JUDGE_FADE_MS = 420
export const SHAKE_MS = 140
export const SHAKE_KILL_MS = 220
export const STAGE_FIT_DESKTOP_BREAK = 768
export const STAGE_FIT_DESKTOP_PAD = 36
export const STAGE_FIT_DESKTOP_MAX_SCALE = 1.25
export const DT_BASE_MS = 16.67
export const DT_MAX_MS = 32
export const FRICTION = 0.82
export const ENEMY_INTERSECT_PAD_X = 8
export const ENEMY_INTERSECT_PAD_Y = 14
export const PLAYER_BOUND_PAD = 18
