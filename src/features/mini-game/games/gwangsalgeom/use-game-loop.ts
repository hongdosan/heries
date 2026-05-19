import {useEffect, type Dispatch, type RefObject, type SetStateAction} from 'react'
import {
  ENEMY_W, ENEMY_H,
  SCORE_PER_LEVEL, SCORE_QI_HIT, SCORE_QI_KILL, SCORE_TICK,
  PARTICLES_QI_HIT, PARTICLES_KILL,
  HITSTOP_KILL_MS, SCORE_TICK_RATE,
  COLOR_HIT_QI, COLOR_KILL_NORMAL, COLOR_KILL_ELITE,
  SHAKE_KILL_MS,
  DT_BASE_MS, DT_MAX_MS,
} from './constants.js'
import type {Effect, Enemy, KeysHeld, Particle, Phase, Player, Wave} from './types.js'
import {spawnParticles} from './lib.js'
import {
  computeSpawnGap, spliceDeadEnemies, stepEffects, stepEnemies, stepParticles, stepPlayer, stepWaves, trySpawnEnemy,
} from './step.js'

interface UseGameLoopOptions {
  readonly phase: Phase
  readonly isVisible: boolean
  readonly isFocused: boolean
  readonly hitStopUntilRef: RefObject<number>
  readonly lastSpawnRef: RefObject<number>
  readonly frameRef: RefObject<number | null>
  readonly keysRef: RefObject<KeysHeld>
  readonly scoreTickRef: RefObject<number>
  readonly timersRef: RefObject<Array<ReturnType<typeof globalThis.setTimeout>>>
  // entity ref (mutable in-place) — Step 3b-1 전환.
  readonly playerRef: RefObject<Player>
  readonly enemiesRef: RefObject<Enemy[]>
  readonly wavesRef: RefObject<Wave[]>
  readonly particlesRef: RefObject<Particle[]>
  readonly effectsRef: RefObject<Effect[]>
  // score·combo·level ref — RAF tick 안 변경은 ref 만 갱신 + hudDirtyRef.current=true.
  // setState 는 renderFrame 가 frame-end 에 batch (검기생존록 hudDirtyRef 패턴).
  readonly scoreRef: RefObject<number>
  readonly comboRef: RefObject<number>
  readonly levelRef: RefObject<number>
  readonly hudDirtyRef: RefObject<boolean>
  // shake 는 짧은 toggle (kill 시) — 트로틀 가치 X, 직접 setState 유지.
  readonly setShake: Dispatch<SetStateAction<boolean>>
  readonly renderFrame: () => void      // frame-end 1회 호출 — entity ref 변경을 DOM 직접 갱신 (React 우회)
  readonly takeDamage: () => void
  readonly flashText: (text: string, tone?: 'cyan' | 'amber' | 'violet' | 'red' | 'stone') => void
}

/**
 * 광살검 RAF 시뮬레이션 hook.
 *
 * - phase==='playing' + isVisible + isFocused 동시 활성 시만 RAF 시작 (CPU 절감 + 사고 방지).
 * - hit-stop (`hitStopUntilRef`) 활성 시 simulation freeze, visual 은 그대로 유지.
 * - dt clamp = DT_MAX_MS — 탭 비활성 복귀 시 거대 dt 로 시뮬레이션 튀는 것 방지.
 * - 매 frame: spawn → player → enemy 충돌 → wave (장풍) 충돌 → effect/particle decay → score tick → renderFrame.
 * - 시뮬레이션 = entity ref-mutable (step.ts pure 함수 위임), frame 당 alloc ~0.
 * - 렌더 = renderFrame() = DOM 직접 갱신 (render.ts syncEntityLayer). React reconciliation 우회.
 * - score·level 은 ref 화로 deps 제외 — 점수 변동마다 RAF 재구독 차단.
 */
export function useGameLoop(opts: UseGameLoopOptions): void {
  const {
    phase, isVisible, isFocused,
    hitStopUntilRef, lastSpawnRef, frameRef, keysRef, scoreTickRef, timersRef,
    playerRef, enemiesRef, wavesRef, particlesRef, effectsRef,
    scoreRef, comboRef, levelRef, hudDirtyRef,
    setShake,
    renderFrame, takeDamage, flashText,
  } = opts

  useEffect(() => {
    const shouldRun = phase === 'playing' && isVisible && isFocused
    if (!shouldRun) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      return
    }
    let prev = performance.now()
    const loop = (now: number) => {
      const rawDt = now - prev
      prev = now
      if (now < hitStopUntilRef.current) {
        frameRef.current = requestAnimationFrame(loop)
        return
      }
      const dt = Math.min(DT_MAX_MS, rawDt)
      const dtScale = dt / DT_BASE_MS

      const nextLevel = Math.floor(scoreRef.current / SCORE_PER_LEVEL) + 1
      if (nextLevel !== levelRef.current) {
        levelRef.current = nextLevel
        hudDirtyRef.current = true
      }

      // spawn
      if (now - lastSpawnRef.current > computeSpawnGap(nextLevel)) {
        lastSpawnRef.current = now
        trySpawnEnemy(enemiesRef.current, nextLevel)
      }

      // player
      stepPlayer(playerRef.current, keysRef.current, dt, dtScale)

      // enemy + 충돌
      const {damaged} = stepEnemies(enemiesRef.current, playerRef.current, dt, dtScale)
      // 동기 호출 — RAF 큐 (1 frame 지연) 폐기. 지연 시 invuln=0 인 채로 다음 frame 충돌 → 이중 데미지 위험.
      if (damaged) takeDamage()

      // wave + 적 hit
      const {hitCount, killCount, damagedIds, deadEnemyIds} = stepWaves(wavesRef.current, enemiesRef.current, dtScale)
      if (hitCount > 0) {
        // 파티클 spawn — hit 위치
        for (const id of damagedIds) {
          const e = enemiesRef.current.find((c) => c.id === id)
          if (!e) continue
          const dead = deadEnemyIds.has(id)
          const count = dead ? PARTICLES_KILL : PARTICLES_QI_HIT
          let color: string
          if (dead) {
            color = e.elite ? COLOR_KILL_ELITE : COLOR_KILL_NORMAL
          } else {
            color = COLOR_HIT_QI
          }
          spawnParticles(particlesRef.current, e.x + ENEMY_W / 2, e.y + ENEMY_H / 2, count, color, dead ? 1.4 : 1, dead ? [3, 7] : [2, 4])
        }
        spliceDeadEnemies(enemiesRef.current)
        scoreRef.current += hitCount * SCORE_QI_HIT + killCount * SCORE_QI_KILL
        comboRef.current += hitCount
        hudDirtyRef.current = true
        flashText(killCount > 0 ? '격파' : '명중', killCount > 0 ? 'violet' : 'amber')
        if (killCount > 0) {
          hitStopUntilRef.current = performance.now() + HITSTOP_KILL_MS
          setShake(true)
          const sid = globalThis.setTimeout(() => setShake(false), SHAKE_KILL_MS)
          timersRef.current.push(sid)
        }
      }

      // effect / particle
      stepEffects(effectsRef.current, dt)
      stepParticles(particlesRef.current, dt)

      // 점수 tick — 4 frame 마다 (15 tick/s). ref 만 갱신 → dirty mark.
      scoreTickRef.current += 1
      if (scoreTickRef.current >= SCORE_TICK_RATE) {
        scoreTickRef.current = 0
        scoreRef.current += SCORE_TICK
        hudDirtyRef.current = true
      }

      // DOM 직접 갱신 (검기생존록 정합) — frame 당 React commit 0
      renderFrame()

      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    // setter (5) / ref (모두) 는 React 가 stable identity 보장 → deps 명시 X.
    // score·level 은 ref 화로 deps 제외 — 점수 변동마다 RAF 재구독 차단.
    // 실 의존 = phase·isVisible·isFocused (loop on/off) + 콜백 3 (identity 변경 감지).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isVisible, isFocused, takeDamage, flashText, renderFrame])
}
