import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import './gwangsalgeom.css'
import {
  COLOR_HIT_NORMAL,
  COLOR_KILL_ELITE,
  COLOR_KILL_NORMAL,
  COLOR_PLAYER_HURT,
  DASH_COOLDOWN_MS,
  DASH_COST,
  DASH_DISTANCE,
  DASH_DURATION_MS,
  DASH_IFRAME_MS,
  DASH_PATH_PAD_RATIO,
  DASH_VX,
  EFFECT_CAP,
  EFFECT_DEATH_LIFE_MS,
  EFFECT_IMPACT_LIFE_MS,
  ENEMY_H,
  ENEMY_HIT_STUN_MS,
  ENEMY_W,
  GROUND_Y,
  GWANGSAL_FX_CLEAR_MS,
  GWANGSAL_FX_MS,
  GWANGSAL_HITSTOP_MS,
  HITSTOP_HIT_MS,
  HITSTOP_KILL_MS,
  HITSTOP_PLAYER_HURT_MS,
  HURT_FLASH_MS,
  JUDGE_FADE_MS,
  KI_GWANGSAL,
  KI_GWANGSAL_LOSS,
  KI_HURT_LOSS,
  KI_MAX,
  KI_PER_HIT,
  KI_PER_KILL,
  KI_PER_WHIFF,
  PARTICLES_HIT,
  PARTICLES_KILL,
  PARTICLES_PLAYER_HURT,
  PLAYER_BOUND_PAD,
  PLAYER_H,
  PLAYER_HURT_KNOCKBACK,
  PLAYER_IFRAME_MS,
  PLAYER_MAX_HP,
  PLAYER_W,
  QI_CAST_POSE_MS,
  QI_COOLDOWN_MS,
  QI_COST,
  QI_OFFSET_NEAR,
  QI_OFFSET_Y,
  QI_W,
  SCORE_PER_COMBO_5,
  SCORE_PER_HIT,
  SCORE_PER_KILL,
  SHAKE_KILL_MS,
  SHAKE_MS,
  SLASH_COOLDOWN_MS,
  SLASH_FLASH_MS,
  SLASH_H,
  SLASH_KNOCKBACK,
  SLASH_NEAR,
  SLASH_OFFSET_Y,
  SLASH_REACH,
  SLASH_W,
  STAGE_FIT_DESKTOP_BREAK,
  STAGE_FIT_DESKTOP_MAX_SCALE,
  STAGE_FIT_DESKTOP_PAD,
  WORLD_H,
  WORLD_W,
} from './constants.js'
import type {
  ActionKey,
  Effect,
  EffectKind,
  Enemy,
  Judge,
  JudgeTone,
  KeysHeld,
  Particle,
  Phase,
  Player,
  View,
  Wave,
} from './types.js'
import {
  actionOf,
  clamp,
  makeEnemy,
  makePlayer,
  makeWave,
  nextId,
  rectsOverlap,
  spawnParticles
} from './lib.js'
import {useGameLoop} from './use-game-loop.js'
import {
  createEffectEl,
  createEnemyEl,
  createParticleEl,
  createWaveEl,
  SPRITE_HERO,
  syncEntityLayer,
  updateEffectEl,
  updateEnemyEl,
  updateParticleEl,
  updatePlayerEl,
  updateWaveEl,
} from './render.js'

// 스프라이트 — vite ?url import. 빌드 시 자동 hash + dist/assets/ 통합.
// entity sprite import 는 render.ts 로 이동. 풀스크린 광살 fx 만 JSX 단일 element 라 유지.
import SPRITE_GWANGSAL from '../../../../shared/images/mini-game/stickman-murim/gwangsal.webp?url'

// ─────────────────────────────────────────────────────────────────
// 광살검 — 가로 진행 검술·장풍·이형환위 액션 (검기생존록과는 다른 결)
// 의존 0 (react 만). framer-motion / shadcn / tailwind 미사용.
// 좌표계 SSOT = WORLD_W × WORLD_H. CSS scale 로 fit.
// ─────────────────────────────────────────────────────────────────


// ─── 컴포넌트 ─────────────────────────────────────────────────
interface GwangsalgeomProps {
  readonly autoFocus?: boolean
}

export function Gwangsalgeom({autoFocus = true}: GwangsalgeomProps) {
  // ─── HUD state — React 재렌더로 표시되는 값만 ──────────────
  const [phase, setPhase] = useState<Phase>('idle')
  const [gwangsalFx, setGwangsalFx] = useState<number>(0)   // 광살 발동 시 풀스크린 sprite ms
  const [score, setScore] = useState<number>(0)
  const [combo, setCombo] = useState<number>(0)
  const [level, setLevel] = useState<number>(1)
  const [ki, setKi] = useState<number>(0)
  const [judge, setJudge] = useState<Judge | null>(null)
  const [shake, setShake] = useState<boolean>(false)
  const [view, setView] = useState<View>({
    width: WORLD_W,
    height: WORLD_H,
    scale: 1,
    isDesktop: false
  })
  // viewport 가시성 + focus — 둘 다 활성이어야 RAF 가동 (CPU 절감 + 사고 방지). 검기생존록 정합.
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  // ─── DOM ref ───────────────────────────────────────────────
  const stageRef = useRef<HTMLDivElement | null>(null)
  const padActiveRef = useRef<{ id: number; ox: number } | null>(null)
  const padBaseRef = useRef<HTMLDivElement | null>(null)
  const padDotRef = useRef<HTMLDivElement | null>(null)
  // entity layer container — render() 가 createElement + appendChild 로 채움.
  const playerElRef = useRef<HTMLDivElement | null>(null)
  const waveLayerRef = useRef<HTMLDivElement | null>(null)
  const enemyLayerRef = useRef<HTMLDivElement | null>(null)
  const particleLayerRef = useRef<HTMLDivElement | null>(null)
  const effectLayerRef = useRef<HTMLDivElement | null>(null)
  // id → DOM 매핑 (syncEntityLayer 가 사용). frame 간 element 재사용.
  const waveElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  const enemyElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  const particleElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  const effectElMap = useRef<Map<number, HTMLDivElement>>(new Map())

  // ─── 시뮬레이션 ref (mutable, frame 당 alloc ~0) — 검기생존록 정합 ──
  const playerRef = useRef<Player>(makePlayer())
  const enemiesRef = useRef<Enemy[]>([])
  const wavesRef = useRef<Wave[]>([])
  const particlesRef = useRef<Particle[]>([])
  const effectsRef = useRef<Effect[]>([])

  // ─── 보조 ref ─────────────────────────────────────────────
  const frameRef = useRef<number | null>(null)
  const keysRef = useRef<KeysHeld>({left: false, right: false})
  const lastSpawnRef = useRef<number>(0)
  const hitStopUntilRef = useRef<number>(0)
  const scoreTickRef = useRef<number>(0)
  const timersRef = useRef<number[]>([])
  // score·combo·level 동기 ref — RAF deps 에서 제외 (재구독 차단). setState 호출 옆에서 .current 동기 갱신.
  const scoreRef = useRef<number>(0)
  const comboRef = useRef<number>(0)
  const levelRef = useRef<number>(1)
  // HUD dirty flag — RAF tick 안 변경 시 mark, frame-end 에 setState 1회 batch (검기생존록 정합).
  const hudDirtyRef = useRef<boolean>(false)

  // ─── render — DOM 직접 갱신 + HUD batch (검기생존록 정합) ──
  // RAF tick 끝에 호출. entity = DOM 직접, HUD = dirty 시 1회 setState (batch).
  const renderFrame = useCallback(() => {
    if (playerElRef.current) updatePlayerEl(playerElRef.current, playerRef.current, phaseRef.current === 'playing')
    syncEntityLayer(wavesRef.current, waveElMap.current, waveLayerRef.current, createWaveEl, updateWaveEl)
    syncEntityLayer(enemiesRef.current, enemyElMap.current, enemyLayerRef.current, createEnemyEl, updateEnemyEl)
    syncEntityLayer(particlesRef.current, particleElMap.current, particleLayerRef.current, createParticleEl, updateParticleEl)
    syncEntityLayer(effectsRef.current, effectElMap.current, effectLayerRef.current, createEffectEl, updateEffectEl)
    if (hudDirtyRef.current) {
      hudDirtyRef.current = false
      setScore(scoreRef.current)
      setCombo(comboRef.current)
      setLevel(levelRef.current)
    }
  }, [])

  // phase 동기 ref — renderFrame 안에서 sm-stickman-hurt class 가 phase==='playing' 일 때만 적용되게.
  // 초기값 'idle' = phase state 초기값과 동일 (line ~56). 변경 시 두 곳 동시 갱신.
  const phaseRef = useRef<Phase>('idle')
  useEffect(() => {
    phaseRef.current = phase
    // RAF 가 phase!=='playing' 일 때 안 돌아 — 첫 마운트·idle/over 화면에서 player 위치/sprite 갱신 위해 1회 호출.
    renderFrame()
  }, [phase, renderFrame])

  // ─── 스테이지 fit ──────────────────────────────────────────
  // ResizeObserver 미사용 — 광살검은 가로형(820×460)이라 stage size 가
  // sm-frame content size 결정 → ResizeObserver 가 그 변경을 감지 →
  // 다시 fit() → 무한 축소 루프 야기. globalThis resize/orientationchange 만 사용.
  useLayoutEffect(() => {
    const fit = () => {
      const el = stageRef.current
      if (!el) return
      const parent = el.parentElement
      if (!parent) return
      // 사용자 의도 "무조건 fit". MIN 강제 폐기 — viewport 짧으면 그만큼 작아짐.
      // rect 0 시 skip (마운트 직전).
      const vw = parent.clientWidth
      const vh = parent.clientHeight
      if (vw <= 0 || vh <= 0) return
      const isDesktop = vw >= STAGE_FIT_DESKTOP_BREAK
      const scale = isDesktop
        ? Math.min((vw - STAGE_FIT_DESKTOP_PAD) / WORLD_W, (vh - STAGE_FIT_DESKTOP_PAD) / WORLD_H, STAGE_FIT_DESKTOP_MAX_SCALE)
        : Math.min(vw / WORLD_W, vh / WORLD_H)
      setView({width: WORLD_W * scale, height: WORLD_H * scale, scale, isDesktop})
    }
    fit()
    globalThis.addEventListener('resize', fit)
    globalThis.addEventListener('orientationchange', fit)
    return () => {
      globalThis.removeEventListener('resize', fit)
      globalThis.removeEventListener('orientationchange', fit)
    }
  }, [])

  // ─── 클린업 ────────────────────────────────────────────────
  // unmount 시점 살아있는 RAF id·timer 취소 — ref.current 직접 사용이 정답.
  // local capture 는 unmount 직전 갱신된 RAF id 를 놓침.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      for (const id of timersRef.current) globalThis.clearTimeout(id)
      timersRef.current = []
    }
  }, [])

  // ─── viewport 가시성 감시 ─────────────────────────────────
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setIsVisible(entry.isIntersecting)
      },
      {threshold: 0.1},
    )
    io.observe(stage)
    return () => io.disconnect()
  }, [])

  // ─── 헬퍼 ──────────────────────────────────────────────────
  const flashText = useCallback((text: string, tone: JudgeTone = 'cyan') => {
    setJudge({id: nextId(), text, tone})
    const id = globalThis.setTimeout(() => setJudge(null), JUDGE_FADE_MS)
    timersRef.current.push(id)
  }, [])

  const triggerShake = useCallback((heavy = false) => {
    setShake(true)
    const id = globalThis.setTimeout(() => setShake(false), heavy ? SHAKE_KILL_MS : SHAKE_MS)
    timersRef.current.push(id)
  }, [])

  const hitStop = useCallback((ms: number) => {
    hitStopUntilRef.current = performance.now() + ms
  }, [])

  const spawnBurst = useCallback((
    cx: number, cy: number, count: number, color: string, speedScale = 1, sizeRange?: [number, number],
  ) => {
    spawnParticles(particlesRef.current, cx, cy, count, color, speedScale, sizeRange)
  }, [])

  const spawnEffect = useCallback((kind: EffectKind, cx: number, cy: number, dir: 1 | -1 = 1) => {
    const life = kind === 'death' ? EFFECT_DEATH_LIFE_MS : EFFECT_IMPACT_LIFE_MS
    effectsRef.current.push({
      id: nextId(),
      kind,
      x: cx,
      y: cy,
      life,
      max: life,
      flipped: dir > 0,
    })
    if (effectsRef.current.length > EFFECT_CAP) {
      effectsRef.current.splice(0, effectsRef.current.length - EFFECT_CAP)
    }
  }, [])

  // 광살 — ki 200 (KI_GWANGSAL) 도달 시 자동 발동: 화면 위 모든 적 즉시 사망 + ki 0 + 점수 보너스
  useEffect(() => {
    if (ki < KI_GWANGSAL || phase !== 'playing') return
    const current = enemiesRef.current
    if (current.length === 0) {
      // 적 0 일 때도 ki 는 0 으로 리셋 (overflow 방지)
      setKi(0)
      return
    }
    for (const e of current) {
      effectsRef.current.push({
        id: nextId(),
        kind: 'death',
        x: e.x + ENEMY_W / 2,
        y: e.y + ENEMY_H / 2,
        life: EFFECT_DEATH_LIFE_MS,
        max: EFFECT_DEATH_LIFE_MS,
        flipped: e.dir > 0,
      })
    }
    if (effectsRef.current.length > EFFECT_CAP) {
      effectsRef.current.splice(0, effectsRef.current.length - EFFECT_CAP)
    }
    const killedCount = current.length
    scoreRef.current += killedCount * SCORE_PER_KILL
    setScore(scoreRef.current)
    enemiesRef.current.length = 0
    setKi((v) => Math.max(0, v - KI_GWANGSAL_LOSS))  // -200 (남은 34)
    comboRef.current += killedCount
    setCombo(comboRef.current)
    setGwangsalFx(GWANGSAL_FX_MS)
    const gid = globalThis.setTimeout(() => setGwangsalFx(0), GWANGSAL_FX_CLEAR_MS)
    timersRef.current.push(gid)
    hitStopUntilRef.current = performance.now() + GWANGSAL_HITSTOP_MS
    setShake(true)
    const sid = globalThis.setTimeout(() => setShake(false), SHAKE_KILL_MS)
    timersRef.current.push(sid)
    flashText('광살', 'violet')
  }, [flashText, ki, phase])

  const reset = useCallback(() => {
    setPhase('playing')
    playerRef.current = makePlayer()
    enemiesRef.current = [makeEnemy(1, 'right')]
    wavesRef.current = []
    particlesRef.current = []
    effectsRef.current = []
    setGwangsalFx(0)
    scoreRef.current = 0
    setScore(0)
    comboRef.current = 0
    setCombo(0)
    levelRef.current = 1
    setLevel(1)
    hudDirtyRef.current = false
    setKi(0)
    setJudge(null)
    lastSpawnRef.current = performance.now()
    hitStopUntilRef.current = 0
    keysRef.current = {left: false, right: false}
    // dash 등 키 입력은 stage 가 focus 받아야 동작. 시작 직후 강제 focus.
    const focusId = globalThis.setTimeout(() => stageRef.current?.focus(), 0)
    timersRef.current.push(focusId)
  }, [])

  // ─── 액션 ──────────────────────────────────────────────────
  const takeDamage = useCallback(() => {
    const p = playerRef.current
    if (phase !== 'playing') return
    if (p.invuln > 0) return
    triggerShake(true)
    hitStop(HITSTOP_PLAYER_HURT_MS)
    spawnBurst(p.x + PLAYER_W / 2, p.y + PLAYER_H / 2, PARTICLES_PLAYER_HURT, COLOR_PLAYER_HURT, 1.1, [3, 6])
    flashText('피격', 'red')
    comboRef.current = 0
    setCombo(0)
    setKi((v) => Math.max(0, v - KI_HURT_LOSS))  // 피격 시 내공 30 감소
    const nextHp = p.hp - 1
    if (nextHp <= 0) {
      p.hp = 0
      p.invuln = 9999
      setPhase('over')
    } else {
      p.hp = nextHp
      p.invuln = PLAYER_IFRAME_MS
      p.hurtFlash = HURT_FLASH_MS
      p.vx = -p.dir * PLAYER_HURT_KNOCKBACK
    }
  }, [flashText, hitStop, phase, spawnBurst, triggerShake])

  const slashAttack = useCallback(() => {
    if (phase !== 'playing') return
    const p = playerRef.current
    if (p.slashCd > 0) return

    const centerX = p.x + PLAYER_W / 2
    const attackBox = {
      x: p.dir > 0 ? centerX + SLASH_NEAR : centerX - SLASH_REACH,
      y: p.y + SLASH_OFFSET_Y,
      w: SLASH_W,
      h: SLASH_H,
    }
    let hitCount = 0
    let killCount = 0
    const burstSpots: Array<{
      cx: number;
      cy: number;
      color: string;
      kill: boolean;
      elite: boolean
    }> = []

    // 적 list in-place mutate — hit 적 hp 감소, kill 시 splice.
    for (let i = enemiesRef.current.length - 1; i >= 0; i -= 1) {
      const enemy = enemiesRef.current[i]!
      if (!rectsOverlap(attackBox.x, attackBox.y, attackBox.w, attackBox.h, enemy.x, enemy.y, ENEMY_W, ENEMY_H)) continue
      hitCount += 1
      const nextHp = enemy.hp - 1
      const cx = enemy.x + ENEMY_W / 2
      const cy = enemy.y + ENEMY_H / 2
      if (nextHp <= 0) {
        killCount += 1
        burstSpots.push({
          cx,
          cy,
          color: enemy.elite ? COLOR_KILL_ELITE : COLOR_KILL_NORMAL,
          kill: true,
          elite: enemy.elite,
        })
        enemiesRef.current.splice(i, 1)
        continue
      }
      burstSpots.push({cx, cy, color: COLOR_HIT_NORMAL, kill: false, elite: enemy.elite})
      enemy.hp = nextHp
      enemy.x += p.dir * SLASH_KNOCKBACK
      enemy.hitStun = ENEMY_HIT_STUN_MS
    }
    p.attacking = SLASH_FLASH_MS
    p.slashCd = SLASH_COOLDOWN_MS

    for (const spot of burstSpots) {
      spawnBurst(spot.cx, spot.cy, spot.kill ? PARTICLES_KILL : PARTICLES_HIT, spot.color, spot.kill ? 1.4 : 1, spot.kill ? [3, 7] : [2, 4])
      // 이펙트 = hit 위치에 impact (정예 = impact-elite), kill 시 death 추가
      spawnEffect(spot.elite ? 'impact-elite' : 'impact', spot.cx, spot.cy, p.dir)
      if (spot.kill) spawnEffect('death', spot.cx, spot.cy, p.dir)
    }

    if (hitCount > 0) {
      triggerShake(killCount > 0)
      hitStop(killCount > 0 ? HITSTOP_KILL_MS : HITSTOP_HIT_MS)
      flashText(killCount >= 2 || hitCount >= 2 ? '연참' : '참격', hitCount >= 2 ? 'violet' : 'cyan')
      scoreRef.current += hitCount * SCORE_PER_HIT + killCount * SCORE_PER_KILL + Math.floor(comboRef.current / 5) * SCORE_PER_COMBO_5
      setScore(scoreRef.current)
      comboRef.current += hitCount
      setCombo(comboRef.current)
      setKi((v) => clamp(v + hitCount * KI_PER_HIT + killCount * KI_PER_KILL, 0, KI_MAX))
      return
    }
    flashText('허공', 'stone')
    comboRef.current = 0
    setCombo(0)
    setKi((v) => clamp(v + KI_PER_WHIFF, 0, KI_MAX))
  }, [flashText, hitStop, phase, spawnBurst, spawnEffect, triggerShake])

  const qiAttack = useCallback(() => {
    if (phase !== 'playing') return
    const p = playerRef.current
    if (ki < QI_COST) {
      flashText('내공 부족', 'stone')
      return
    }
    const centerX = p.x + PLAYER_W / 2
    const startX = p.dir > 0 ? centerX + QI_OFFSET_NEAR : centerX - QI_OFFSET_NEAR - QI_W
    const startY = p.y + QI_OFFSET_Y
    setKi((v) => Math.max(0, v - QI_COST))
    wavesRef.current.push(makeWave(startX, startY, p.dir))
    p.qiCd = QI_COOLDOWN_MS
    p.qiCasting = QI_CAST_POSE_MS
    flashText('장풍', 'amber')
  }, [flashText, ki, phase])

  const dash = useCallback(() => {
    if (phase !== 'playing') return
    const p = playerRef.current
    if (ki < DASH_COST) {
      flashText('내공 부족', 'stone')
      return
    }
    triggerShake()
    flashText('이형환위', 'cyan')
    setKi((v) => Math.max(0, v - DASH_COST))

    // 이형환위 경로 = [start, end] (player 좌표). 본 구간 안 적은 즉시 처치.
    const startX = p.x
    const endX = clamp(p.x + p.dir * DASH_DISTANCE, PLAYER_BOUND_PAD, WORLD_W - PLAYER_W - PLAYER_BOUND_PAD)
    const pathMin = Math.min(startX, endX) - ENEMY_W * DASH_PATH_PAD_RATIO
    const pathMax = Math.max(startX, endX) + PLAYER_W + ENEMY_W * DASH_PATH_PAD_RATIO
    // 적 list in-place mutate — 경로 안 적 splice + death effect.
    const killed: Enemy[] = []
    for (let i = enemiesRef.current.length - 1; i >= 0; i -= 1) {
      const e = enemiesRef.current[i]!
      if (e.x + ENEMY_W >= pathMin && e.x <= pathMax) {
        killed.push(e)
        enemiesRef.current.splice(i, 1)
      }
    }
    if (killed.length > 0) {
      scoreRef.current += killed.length * SCORE_PER_KILL
      setScore(scoreRef.current)
      comboRef.current += killed.length
      setCombo(comboRef.current)
      for (const e of killed) {
        spawnEffect('death', e.x + ENEMY_W / 2, e.y + ENEMY_H / 2, p.dir)
      }
      flashText(killed.length >= 2 ? '一閃' : '참섬', 'violet')
    }

    p.x = endX
    p.vx = p.dir * DASH_VX
    p.invuln = Math.max(p.invuln, DASH_IFRAME_MS)
    p.dashing = DASH_DURATION_MS
    p.dashCd = DASH_COOLDOWN_MS
  }, [flashText, ki, phase, spawnEffect, triggerShake])

  // ─── 입력 ──────────────────────────────────────────────────
  const onKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    const action = actionOf(e.key, e.code)
    if (!action) return
    e.preventDefault()
    e.stopPropagation()
    if (action === 'left') keysRef.current.left = true
    if (action === 'right') keysRef.current.right = true
    if (action === 'enter') {
      if (phase !== 'playing') reset()
      return
    }
    if (phase !== 'playing') return
    if (action === 'slash') slashAttack()
    if (action === 'qi') qiAttack()
    if (action === 'dash') dash()
  }, [dash, phase, qiAttack, reset, slashAttack])

  const onKeyUp = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    const action = actionOf(e.key, e.code)
    if (action === 'left') keysRef.current.left = false
    if (action === 'right') keysRef.current.right = false
  }, [])

  // ─── RAF loop ──────────────────────────────────────────────
  useGameLoop({
    phase, isVisible, isFocused,
    hitStopUntilRef, lastSpawnRef, frameRef, keysRef, scoreTickRef, timersRef,
    playerRef, enemiesRef, wavesRef, particlesRef, effectsRef,
    scoreRef, comboRef, levelRef, hudDirtyRef,
    setShake,
    renderFrame, takeDamage, flashText,
  })

  // ─── 모바일 버튼 핸들러 ────────────────────────────────────
  const onPadDown = useCallback((kind: ActionKey) => (e: ReactPointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (kind === 'left') keysRef.current.left = true
    if (kind === 'right') keysRef.current.right = true
    if (phase !== 'playing') return
    if (kind === 'slash') slashAttack()
    if (kind === 'qi') qiAttack()
    if (kind === 'dash') dash()
  }, [dash, phase, qiAttack, slashAttack])

  // onPadUp 폐기 — 좌측 [←][→] 버튼이 가상 패드 swipe 로 대체됨.
  // 우측 액션 버튼 (베기/장풍/이형환위) 은 *탭* 만 — release 추적 불필요.

  // ─── 모바일 가상 패드 (좌측 영역 swipe = 이동, 우측 영역 = 우측 버튼이 처리) ─
  // 검기생존록 패턴 정합. 광살검은 1D (가로) — dx 부호 + threshold 로 left/right.
  const PAD_DEAD_ZONE_PX = 14   // 시작점 ±14 안 = 정지
  const PAD_MAX_R_PX = 56       // dot 시각 이동 한도

  const stageRectToWorldX = useCallback((clientX: number): number | null => {
    const stage = stageRef.current
    if (!stage) return null
    const rect = stage.getBoundingClientRect()
    if (rect.width <= 0) return null
    return ((clientX - rect.left) / rect.width) * WORLD_W
  }, [])

  const onStagePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (phase !== 'playing') return
    const x = stageRectToWorldX(e.clientX)
    if (x == null) return
    if (x >= WORLD_W / 2) return  // 우측 = 버튼이 처리. 좌측 영역만 가상 패드.
    padActiveRef.current = {id: e.pointerId, ox: x}
    const stage = stageRef.current
    const rect = stage?.getBoundingClientRect()
    if (rect && padBaseRef.current && padDotRef.current) {
      const localX = e.clientX - rect.left
      const localY = e.clientY - rect.top
      padBaseRef.current.style.left = `${localX}px`
      padBaseRef.current.style.top = `${localY}px`
      padBaseRef.current.style.opacity = '1'
      padDotRef.current.style.left = `${localX}px`
      padDotRef.current.style.top = `${localY}px`
      padDotRef.current.style.opacity = '1'
    }
  }, [phase, stageRectToWorldX])

  const onStagePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const pad = padActiveRef.current
    if (!pad || pad.id !== e.pointerId) return
    const x = stageRectToWorldX(e.clientX)
    if (x == null) return
    const dx = x - pad.ox  // WORLD 좌표 dx
    if (dx > PAD_DEAD_ZONE_PX) {
      keysRef.current.right = true
      keysRef.current.left = false
    } else if (dx < -PAD_DEAD_ZONE_PX) {
      keysRef.current.left = true
      keysRef.current.right = false
    } else {
      keysRef.current.left = false
      keysRef.current.right = false
    }
    // dot 위치 (시각만, 좌우 한도 PAD_MAX_R_PX)
    if (padDotRef.current && padBaseRef.current) {
      const rect = stageRef.current?.getBoundingClientRect()
      if (rect) {
        const clamped = Math.max(-PAD_MAX_R_PX, Math.min(PAD_MAX_R_PX, e.clientX - (rect.left + parseFloat(padBaseRef.current.style.left || '0'))))
        padDotRef.current.style.left = `${parseFloat(padBaseRef.current.style.left || '0') + clamped}px`
      }
    }
  }, [stageRectToWorldX])

  const onStagePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const pad = padActiveRef.current
    if (!pad || pad.id !== e.pointerId) return
    padActiveRef.current = null
    keysRef.current.left = false
    keysRef.current.right = false
    if (padBaseRef.current) padBaseRef.current.style.opacity = '0'
    if (padDotRef.current) padDotRef.current.style.opacity = '0'
  }, [])

  // ─── 렌더 ─────────────────────────────────────────────────
  // entity 5종 (player/enemies/waves/particles/effects) 은 DOM 직접 갱신 (render.ts).
  // 본 JSX 는 HUD·layer container·오버레이만 — frame 당 React commit 0.
  const player = playerRef.current
  const hpHearts = '●'.repeat(player.hp) + '○'.repeat(PLAYER_MAX_HP - player.hp)
  // 이형환위 시각 게이지 — ki 잔량 / DASH_COST 비율 (0..1). DASH_COOLDOWN_MS = 0 라
  // 쿨다운 기반 비율은 의미 없음 (0 / 0 = NaN). ki 진행률이 *사용 가능까지의 거리* 를 더 정확히 표현.
  const dashCdFraction = clamp(1 - Math.min(ki, DASH_COST) / DASH_COST, 0, 1)
  const dashReady = ki >= DASH_COST
  const qiReady = ki >= QI_COST

  return (
    <div className="mini-game-frame mini-game-frame--landscape sm-frame">
      <div
        ref={stageRef}
        className={`sm-stage${shake ? ' sm-shake' : ''}`}
        tabIndex={0}
        role="application"
        aria-label="광살검"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPointerDown={onStagePointerDown}
        onPointerMove={onStagePointerMove}
        onPointerUp={onStagePointerUp}
        onPointerCancel={onStagePointerUp}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onContextMenu={(e) => e.preventDefault()}
        style={{width: view.width, height: view.height}}
        autoFocus={autoFocus}
      >
        <div
          className="sm-world"
          style={{transform: `scale(${view.scale})`}}
          data-level={Math.min(level, 9)}
        >
          {/* 배경 */}
          <div className="sm-bg"/>
          <div className="sm-ground" style={{top: GROUND_Y, height: WORLD_H - GROUND_Y}}/>
          <div className="sm-ground-line" style={{top: GROUND_Y}}/>

          {/* HUD */}
          <header className="sm-hud-top">
            <div className="sm-hud-card">
              <div>
                <div className="sm-hud-eyebrow">狂殺劍</div>
                <div className="sm-hud-name">광살검</div>
              </div>
              <div className="sm-hud-meta">
                <div>점수 <b className="sm-meta-score">{score}</b></div>
                <div>위험도 <b className="sm-meta-level">{level}</b></div>
                <div className="sm-meta-hp">{hpHearts}</div>
              </div>
            </div>
          </header>

          <div className="sm-hint">
            {view.isDesktop ? '방향키 이동 · Space 베기 · Shift 이형환위 · Z 장풍' : '좌우 이동 · 베기 · 이형환위 · 장풍'}
          </div>

          {/* entity layer — render.ts 가 createElement + appendChild 로 채움 (React reconciliation 우회) */}
          <div ref={waveLayerRef} className="sm-layer" aria-hidden="true"/>
          <div ref={enemyLayerRef} className="sm-layer" aria-hidden="true"/>
          <div ref={particleLayerRef} className="sm-layer" aria-hidden="true"/>
          <div ref={effectLayerRef} className="sm-layer" aria-hidden="true"/>

          {/* 광살 풀스크린 sprite — ki 가득 차 발동 시 ~450ms (단일 element, React JSX 유지) */}
          {gwangsalFx > 0 && (
            <img
              className="sm-gwangsal-fx"
              src={SPRITE_GWANGSAL}
              alt=""
              draggable={false}
            />
          )}

          {/* 플레이어 — render.ts updatePlayerEl 가 transform·sprite·class 매 frame 갱신.
              JSX 는 outer div + 자식 img 만 정적 생성, sprite src 초기값 = SPRITE_HERO (첫 paint broken icon 회피). */}
          <div
            ref={playerElRef}
            className="sm-stickman"
            aria-hidden="true"
            style={{width: PLAYER_W, height: PLAYER_H}}
          >
            <img
              className="sm-sprite"
              src={SPRITE_HERO}
              alt=""
              draggable={false}
              style={{transform: 'translateX(-50%)'}}
            />
          </div>

          {/* 판정 텍스트 */}
          {judge && (
            <div key={judge.id} className={`sm-judge sm-judge-${judge.tone}`}>
              {judge.text}
            </div>
          )}

          {/* 하단 HUD */}
          <footer className="sm-hud-bottom">
            <div className="sm-hud-card">
              <div className="sm-hud-bottom-labels">
                <span>COMBO</span>
                <span>내공 — 100% 광살(자동) · 장풍 6% · 이형환위 13%</span>
              </div>
              <div className="sm-hud-bottom-values">
                <div className="sm-combo">{combo}</div>
                <div className="sm-ki-percent">{Math.floor((ki / KI_MAX) * 100)}%</div>
              </div>
              <div className="sm-ki-bar">
                <div className="sm-ki-bar-fill" style={{width: `${(ki / KI_MAX) * 100}%`}}/>
              </div>
            </div>
          </footer>

          {/* 모바일 액션 버튼 (우측) */}
          {phase === 'playing' && !view.isDesktop && (
            <div className="sm-pad">
              <div className="sm-pad-group">
                <button type="button" className="sm-pad-btn sm-pad-slash" aria-label="베기"
                        onPointerDown={onPadDown('slash')}>베기
                </button>
                <button
                  type="button"
                  className={`sm-pad-btn sm-pad-qi${qiReady ? '' : ' is-disabled'}`}
                  aria-label="장풍"
                  aria-disabled={!qiReady}
                  disabled={!qiReady}
                  onPointerDown={onPadDown('qi')}
                >장풍
                </button>
                <button
                  type="button"
                  className={`sm-pad-btn sm-pad-dash${dashReady ? '' : ' sm-pad-cd is-disabled'}`}
                  aria-label="이형환위"
                  aria-disabled={!dashReady}
                  disabled={!dashReady}
                  onPointerDown={onPadDown('dash')}
                  style={{'--sm-cd': dashCdFraction} as CSSProperties}
                >이형환위
                </button>
              </div>
            </div>
          )}

          {/* 일시정지 오버레이 — playing + viewport/focus 잃음 (검기생존록 정합) */}
          {phase === 'playing' && (!isFocused || !isVisible) && (
            <div className="sm-overlay">
              <div className="sm-overlay-card">
                <div className="sm-overlay-emoji" aria-hidden="true">⏸</div>
                <h1 className="sm-overlay-title">일시정지</h1>
                <p className="sm-overlay-desc">
                  {isVisible
                    ? '게임 영역을 다시 클릭하면 재개됩니다.'
                    : '게임 영역을 화면에 두면 자동 재개됩니다.'}
                </p>
                <button
                  type="button"
                  className="sm-overlay-btn"
                  onClick={() => stageRef.current?.focus()}
                >재개
                </button>
              </div>
            </div>
          )}

          {/* 시작 / 오버 오버레이 */}
          {phase !== 'playing' && (
            <div className="sm-overlay">
              <div className="sm-overlay-card">
                <div className="sm-overlay-emoji" aria-hidden="true">🥷</div>
                <h1 className="sm-overlay-title">광살검</h1>
                <p className="sm-overlay-desc">
                  {phase === 'over'
                    ? `협객이 쓰러졌다. 강호로 다시 나서라.`
                    : '몰려오는 자객을 무찔러라.'}
                </p>
                <p className="sm-overlay-desc">{`점수: ${score}`}</p>
                <button type="button" className="sm-overlay-btn" onClick={reset}>
                  {phase === 'over' ? `다시 강호로` : '강호 입장'}
                </button>
                <p className="sm-overlay-keys"> 방향키 이동 · Space 베기 · Shift 이형환위 · Z 장풍</p>
              </div>
            </div>
          )}
        </div>
        {/* 모바일 가상 패드 — sm-world 밖 (transform: scale 영향 X), sm-stage 자식. */}
        {phase === 'playing' && !view.isDesktop && (
          <>
            <div ref={padBaseRef} className="sm-pad-base" aria-hidden="true"/>
            <div ref={padDotRef} className="sm-pad-dot" aria-hidden="true"/>
          </>
        )}
      </div>
    </div>
  )
}

// StickmanView / EnemyView / pickHeroSprite 폐기 — render.ts 로 이동 (Step 3b-2).
// 모든 entity (player / enemies / waves / particles / effects) = DOM 직접 갱신.
