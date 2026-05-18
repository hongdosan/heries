// © 2026 홍도산. All rights reserved. Original creator work.
// 광살검 (Gwangsalgeom) 순수 유틸 — module-level 함수 8 종.
// React Compiler `'infer'` 모드라 본 함수들은 자동 컴파일 제외 (안전).
// Sprite 의존 함수 (pickHeroSprite) 는 sprite import 가까이 본 파일 외부 (gwangsalgeom.tsx) 보존.

import {
  WORLD_W, GROUND_Y, PLAYER_W, PLAYER_H, PLAYER_MAX_HP,
  ENEMY_H, ENEMY_HP, ENEMY_ELITE_HP, ENEMY_BASE_SPEED, ENEMY_ELITE_SPEED,
  ENEMY_SPEED_PER_LEVEL, ENEMY_ELITE_SPEED_PER_LEVEL,
  ENEMY_ELITE_RATE_BASE, ENEMY_ELITE_RATE_PER_LEVEL, ENEMY_ELITE_RATE_MAX,
  QI_W, QI_H, QI_SPEED, QI_LIFE,
  PARTICLE_SPEED_MIN, PARTICLE_SPEED_RANGE, PARTICLE_LIFE_MS,
  PARTICLE_LIFE_JITTER_MIN, PARTICLE_LIFE_JITTER_RANGE, PARTICLE_VY_BIAS_RATIO,
} from './constants.js'
import type {ActionKey, Enemy, Particle, Player, Wave} from './types.js'

/** 값을 [lo, hi] 범위로 제한. */
export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : Math.min(v, hi)
}

/** AABB 충돌 검사. true = 두 사각형 겹침. */
export function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

// id 시퀀스 — module-level 카운터 (Enemy/Wave/Particle/Effect 공통).
// 31-bit mask 로 wrap (overflow 차단). 게임 1 회 세션 내 충돌 가능성 0.
let _idSeq = 1

/** 다음 unique id 반환. */
export function nextId(): number {
  _idSeq = (_idSeq + 1) & 0x7fffffff
  return _idSeq
}

/** 게임 시작 시 플레이어 초기 상태 생성. */
export function makePlayer(): Player {
  return {
    x: WORLD_W / 2 - PLAYER_W / 2,
    y: GROUND_Y - PLAYER_H,
    vx: 0,
    dir: 1,
    hp: PLAYER_MAX_HP,
    invuln: 0,
    hurtFlash: 0,
    attacking: 0,
    qiCasting: 0,
    dashing: 0,
    slashCd: 0,
    qiCd: 0,
    dashCd: 0,
  }
}

/** 적 한 명 spawn. side 미지정 시 좌/우 random. level 에 따라 속도·엘리트 확률 상승. */
export function makeEnemy(level: number, side?: 'left' | 'right'): Enemy {
  const useSide: 'left' | 'right' = side ?? (Math.random() > 0.5 ? 'right' : 'left')
  const elite = Math.random() < Math.min(
    ENEMY_ELITE_RATE_BASE + level * ENEMY_ELITE_RATE_PER_LEVEL,
    ENEMY_ELITE_RATE_MAX,
  )
  const x = useSide === 'right' ? WORLD_W + 60 : -90
  const dir: 1 | -1 = useSide === 'right' ? -1 : 1
  const baseSpeed = elite
    ? ENEMY_ELITE_SPEED + level * ENEMY_ELITE_SPEED_PER_LEVEL
    : ENEMY_BASE_SPEED + level * ENEMY_SPEED_PER_LEVEL
  return {
    id: nextId(),
    x,
    y: GROUND_Y - ENEMY_H,
    vx: dir * baseSpeed,
    dir,
    hp: elite ? ENEMY_ELITE_HP : ENEMY_HP,
    maxHp: elite ? ENEMY_ELITE_HP : ENEMY_HP,
    elite,
    hitStun: 0,
  }
}

/**
 * 파티클 다수 spawn (in-place mutate out 배열).
 * 각 파티클 = random angle + random speed (jitter 적용) + 상방 bias.
 * 호출처 = 적 hit / kill / 플레이어 hurt 등.
 */
export function spawnParticles(
  out: Particle[],
  cx: number,
  cy: number,
  count: number,
  color: string,
  speedScale = 1,
  sizeRange: [number, number] = [2, 5],
): void {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const speed = (PARTICLE_SPEED_MIN + Math.random() * PARTICLE_SPEED_RANGE) * speedScale
    const life = PARTICLE_LIFE_MS * (PARTICLE_LIFE_JITTER_MIN + Math.random() * PARTICLE_LIFE_JITTER_RANGE)
    out.push({
      id: nextId(),
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - speed * PARTICLE_VY_BIAS_RATIO,
      life,
      max: life,
      color,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    })
  }
}

/** 장풍 wave (탄환) 한 개 생성. dir = 진행 방향 (1 = 우 / -1 = 좌). */
export function makeWave(x: number, y: number, dir: 1 | -1): Wave {
  return {
    id: nextId(),
    x,
    y,
    w: QI_W,
    h: QI_H,
    vx: dir * QI_SPEED,
    life: QI_LIFE,
    hitIds: new Set(),
  }
}

/**
 * 키보드 input → ActionKey 매핑.
 * - 좌/우: A/D + 화살표
 * - 베기: Space
 * - 장풍: Z
 * - 이형환위: Shift
 * - 시작/재시작: Enter
 */
export function actionOf(key: string, code: string): ActionKey | null {
  const k = key?.toLowerCase?.() ?? ''
  if (k === 'a' || code === 'KeyA' || k === 'arrowleft' || code === 'ArrowLeft') return 'left'
  if (k === 'd' || code === 'KeyD' || k === 'arrowright' || code === 'ArrowRight') return 'right'
  if (k === ' ' || code === 'Space') return 'slash'
  if (k === 'z' || code === 'KeyZ') return 'qi'
  if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') return 'dash'
  if (k === 'enter' || code === 'Enter') return 'enter'
  return null
}
