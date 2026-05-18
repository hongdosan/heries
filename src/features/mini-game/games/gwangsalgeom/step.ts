// © 2026 홍도산. All rights reserved. Original creator work.
// 광살검 RAF 시뮬레이션 step 함수 — module-level pure (in-place mutate).
// 호출처 = use-game-loop.ts. ref-mutable 패턴 (Step 3b-1) — frame 당 alloc ~0.
// 검기생존록 정합: step 함수가 entity array 를 직접 mutate, 호출처는 setRenderTick 1회로 React 재렌더 트리거.

import {
  WORLD_W,
  PLAYER_W, PLAYER_H, PLAYER_SPEED, PLAYER_BOUND_PAD,
  ENEMY_W, ENEMY_H,
  ENEMY_QI_STUN_MS, ENEMY_DESPAWN_PAD, ENEMY_INTERSECT_PAD_X, ENEMY_INTERSECT_PAD_Y, ENEMY_KNOCKBACK_ON_DAMAGE,
  QI_DAMAGE, QI_DESPAWN_PAD,
  SPAWN_GAP_BASE, SPAWN_GAP_PER_LEVEL, SPAWN_GAP_MIN, SPAWN_CAP_BASE, SPAWN_CAP_PER_LEVEL, SPAWN_CAP_MAX,
  PARTICLES_CAP, PARTICLE_GRAVITY, PARTICLE_FRICTION,
  DT_BASE_MS, FRICTION,
} from './constants.js'
import type {Effect, Enemy, KeysHeld, Particle, Player, Wave} from './types.js'
import {clamp, makeEnemy, rectsOverlap} from './lib.js'

/**
 * spawn cadence 판정. now-lastSpawn 이 level 별 gap 초과 시 신규 적 1 마리 push (cap 초과 시 skip).
 * in-place mutate. 호출처가 lastSpawn 갱신 책임.
 */
export function trySpawnEnemy(enemies: Enemy[], level: number): void {
  const cap = clamp(SPAWN_CAP_BASE + Math.floor(level / SPAWN_CAP_PER_LEVEL), SPAWN_CAP_BASE, SPAWN_CAP_MAX)
  if (enemies.length >= cap) return
  enemies.push(makeEnemy(level))
}

/** level 별 spawn gap (ms). 클수록 spawn 간격 김. */
export function computeSpawnGap(level: number): number {
  return Math.max(SPAWN_GAP_MIN, SPAWN_GAP_BASE - level * SPAWN_GAP_PER_LEVEL)
}

/**
 * 플레이어 1 frame 갱신 (in-place mutate).
 * 좌/우 키 → 속도·방향. friction 적용. cd·타이머 감소.
 */
export function stepPlayer(p: Player, keys: KeysHeld, dt: number, dtScale: number): void {
  const vx = p.vx * FRICTION
  let dir: 1 | -1 = p.dir
  let x = p.x
  const speed = PLAYER_SPEED * (dt / DT_BASE_MS)
  if (keys.left) {
    x -= speed
    dir = -1
  }
  if (keys.right) {
    x += speed
    dir = 1
  }
  x += vx * dtScale
  p.x = clamp(x, PLAYER_BOUND_PAD, WORLD_W - PLAYER_W - PLAYER_BOUND_PAD)
  p.vx = vx
  p.dir = dir
  p.invuln = Math.max(0, p.invuln - dt)
  p.hurtFlash = Math.max(0, p.hurtFlash - dt)
  p.attacking = Math.max(0, p.attacking - dt)
  p.qiCasting = Math.max(0, p.qiCasting - dt)
  p.dashing = Math.max(0, p.dashing - dt)
  p.slashCd = Math.max(0, p.slashCd - dt)
  p.qiCd = Math.max(0, p.qiCd - dt)
  p.dashCd = Math.max(0, p.dashCd - dt)
}

export interface EnemiesStepResult {
  readonly damaged: boolean
}

/**
 * 적 list 1 frame 갱신 (in-place mutate) + 플레이어 충돌.
 * - hitStun 감쇠 + 정지/추적 속도 갱신
 * - despawn 좌우 경계 밖 (in-place splice)
 * - 플레이어와 AABB 충돌 → damaged=true + knockback
 */
export function stepEnemies(
  enemies: Enemy[],
  p: Player,
  dt: number,
  dtScale: number,
): EnemiesStepResult {
  let damaged = false
  // 뒤에서 앞으로 — splice 시 인덱스 보존
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i]!
    const stun = Math.max(0, enemy.hitStun - dt)
    const chaseDir: 1 | -1 = p.x + PLAYER_W / 2 > enemy.x + ENEMY_W / 2 ? 1 : -1
    const speed = stun > 0 ? 0 : chaseDir * Math.abs(enemy.vx)
    enemy.x += speed * dtScale
    enemy.dir = chaseDir
    enemy.hitStun = stun
    if (enemy.x < -ENEMY_DESPAWN_PAD || enemy.x > WORLD_W + ENEMY_DESPAWN_PAD) {
      enemies.splice(i, 1)
      continue
    }
    if (
      rectsOverlap(
        enemy.x, enemy.y, ENEMY_W, ENEMY_H,
        p.x + ENEMY_INTERSECT_PAD_X, p.y + ENEMY_INTERSECT_PAD_Y,
        PLAYER_W - ENEMY_INTERSECT_PAD_X * 2, PLAYER_H - ENEMY_INTERSECT_PAD_Y - 4,
      )
      && p.invuln <= 0
    ) {
      damaged = true
      enemy.x -= chaseDir * ENEMY_KNOCKBACK_ON_DAMAGE
    }
  }
  return {damaged}
}

export interface WavesStepResult {
  readonly hitCount: number
  readonly killCount: number
  readonly damagedIds: ReadonlySet<number>   // 본 frame hit 적 id (파티클 spawn 용)
  readonly deadEnemyIds: ReadonlySet<number> // 본 frame 죽은 적 id (kill 파티클 분기용)
}

/**
 * wave (장풍) list 1 frame 갱신 (in-place mutate) + 적 hit 해소 (enemies 도 in-place mutate).
 * - life decay, 화면 밖 splice
 * - 관통 = wave.hitIds 로 중복 차단 (per-wave)
 * - hit 시 enemy.hp 감소 + ENEMY_QI_STUN_MS 적용. hp<=0 적은 in-place splice 까지 호출처에서.
 * - knockback 0 (사용자 명시 — 장풍은 적 안 밀어냄)
 */
export function stepWaves(
  waves: Wave[],
  enemies: Enemy[],
  dtScale: number,
): WavesStepResult {
  const damagedIds = new Set<number>()
  const deadEnemyIds = new Set<number>()
  let hitCount = 0
  let killCount = 0

  for (let i = waves.length - 1; i >= 0; i -= 1) {
    const wave = waves[i]!
    wave.x += wave.vx * dtScale
    wave.life -= dtScale
    if (wave.life <= 0 || wave.x < -QI_DESPAWN_PAD || wave.x > WORLD_W + QI_DESPAWN_PAD) {
      waves.splice(i, 1)
      continue
    }

    // 관통 — wave.hitIds in-place .add (per-hit Set alloc 회피).
    for (const enemy of enemies) {
      if (enemy.hp <= 0 || wave.hitIds.has(enemy.id)) continue
      if (!rectsOverlap(wave.x, wave.y, wave.w, wave.h, enemy.x, enemy.y + 10, ENEMY_W, ENEMY_H - 10)) continue
      hitCount += 1
      enemy.hp -= QI_DAMAGE
      enemy.hitStun = ENEMY_QI_STUN_MS
      if (enemy.hp <= 0) {
        killCount += 1
        deadEnemyIds.add(enemy.id)
      }
      damagedIds.add(enemy.id)
      wave.hitIds.add(enemy.id)
    }
  }
  return {hitCount, killCount, damagedIds, deadEnemyIds}
}

/** 죽은 적 in-place splice (장풍 hit 후 호출처에서 사용). */
export function spliceDeadEnemies(enemies: Enemy[]): void {
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    if (enemies[i]!.hp <= 0) enemies.splice(i, 1)
  }
}

/** 이펙트 list 1 frame 갱신 (in-place). life 감쇠 후 만료 splice. */
export function stepEffects(effects: Effect[], dt: number): void {
  for (let i = effects.length - 1; i >= 0; i -= 1) {
    const e = effects[i]!
    e.life -= dt
    if (e.life <= 0) effects.splice(i, 1)
  }
}

/**
 * 파티클 list 1 frame 갱신 (in-place). 위치·속도 적분, 중력/friction, life 감쇠.
 * cap 초과 시 앞쪽 (오래된 것) 단번에 drop.
 */
export function stepParticles(particles: Particle[], dt: number): void {
  const dtSec = dt / 1000
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i]!
    p.life -= dt
    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }
    p.x += p.vx * dtSec
    p.y += p.vy * dtSec
    p.vx *= PARTICLE_FRICTION
    p.vy = p.vy * PARTICLE_FRICTION + PARTICLE_GRAVITY * dtSec
  }
  if (particles.length > PARTICLES_CAP) {
    particles.splice(0, particles.length - PARTICLES_CAP)
  }
}
