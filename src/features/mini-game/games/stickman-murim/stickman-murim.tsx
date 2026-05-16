import type {CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent,} from 'react'
import {memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import './stickman-murim.css'

// 스프라이트 — vite ?url import. 빌드 시 자동 hash + dist/assets/ 통합.
import SPRITE_HERO from '../../../../shared/images/mini-game/stickman-murim/hero.webp?url'
import SPRITE_HERO_ATTACK
  from '../../../../shared/images/mini-game/stickman-murim/hero-attack.webp?url'
import SPRITE_HERO_QI from '../../../../shared/images/mini-game/stickman-murim/hero-qi.webp?url'
import SPRITE_HERO_DASH from '../../../../shared/images/mini-game/stickman-murim/hero-dash.webp?url'
import SPRITE_ASSASSIN from '../../../../shared/images/mini-game/stickman-murim/assassin.webp?url'
import SPRITE_ELITE from '../../../../shared/images/mini-game/stickman-murim/elite.webp?url'
import SPRITE_IMPACT from '../../../../shared/images/mini-game/stickman-murim/impact.webp?url'
import SPRITE_IMPACT_ELITE
  from '../../../../shared/images/mini-game/stickman-murim/impact-elite.webp?url'
import SPRITE_DEATH from '../../../../shared/images/mini-game/stickman-murim/death.webp?url'
import SPRITE_GWANGSAL from '../../../../shared/images/mini-game/stickman-murim/gwangsal.webp?url'
// qi.webp 부재 — dash-burst.webp 가 plasma 잔상 결로 적합, 장풍에 임시 alias.
import SPRITE_QI from '../../../../shared/images/mini-game/stickman-murim/dash-burst.webp?url'

// ─────────────────────────────────────────────────────────────────
// 광살검 — 가로 진행 검술·장풍·이형환위 액션 (검기생존록과는 다른 결)
// 의존 0 (react 만). framer-motion / shadcn / tailwind 미사용.
// 좌표계 SSOT = WORLD_W × WORLD_H. CSS scale 로 fit.
// ─────────────────────────────────────────────────────────────────

// 월드 상수
const WORLD_W = 820
const WORLD_H = 460
const GROUND_Y = 358

// 플레이어 — 시각 크기 (사용자 명시 = 작게).
const PLAYER_W = 64
const PLAYER_H = 120
const PLAYER_SPEED = 3.8
const PLAYER_MAX_HP = 5
const PLAYER_IFRAME_MS = 700
const PLAYER_HURT_KNOCKBACK = 4.6

// 적 — 플레이어와 동일 박스 (사용자 명시).
const ENEMY_W = PLAYER_W
const ENEMY_H = PLAYER_H
const ENEMY_BASE_SPEED = 1.8
const ENEMY_ELITE_SPEED = 1.45
const ENEMY_SPEED_PER_LEVEL = 0.05
const ENEMY_ELITE_SPEED_PER_LEVEL = 0.04
const ENEMY_HP = 2
const ENEMY_ELITE_HP = 3
const ENEMY_ELITE_RATE_BASE = 0.08
const ENEMY_ELITE_RATE_PER_LEVEL = 0.012
const ENEMY_ELITE_RATE_MAX = 0.28
const ENEMY_HIT_STUN_MS = 200
const ENEMY_QI_STUN_MS = 160
const ENEMY_DESPAWN_PAD = 120

// 베기 (근접) — 플레이어 박스 중심 기준 좌우 대칭
const SLASH_COOLDOWN_MS = 200
const SLASH_FLASH_MS = 170
const SLASH_REACH = 130              // 박스 중심에서 도달 거리 (PLAYER 비례)
const SLASH_NEAR = 4
const SLASH_W = SLASH_REACH - SLASH_NEAR
const SLASH_H = 80
const SLASH_OFFSET_Y = 18
const SLASH_KNOCKBACK = 32

// 장풍 (원거리) — 단일 type
const QI_COOLDOWN_MS = 0           // 쿨타임 없음 (ki 비용으로 제어)
const QI_COST = 14
const QI_DAMAGE = 1                  // 1 데미지 / 관통 (적 다수 hit 가능)
const QI_W = 84
const QI_H = 36
const QI_SPEED = 16                  // 관통 + 빠른 속도
const QI_LIFE = 64
const QI_DESPAWN_PAD = 140
const QI_OFFSET_NEAR = 10            // 박스 중심에서 시작 거리
const QI_OFFSET_Y = 38

// 이형환위 — 발동 직후 3초 무적 (이형환위 / 도검불침). 내공 11 소모.
const DASH_COOLDOWN_MS = 0          // 쿨타임 없음 (ki 18 비용으로 제어)
const DASH_DURATION_MS = 260        // 시각 잔상 표시 길이
const DASH_DISTANCE = 138
const DASH_VX = 7.5
const DASH_IFRAME_MS = 3000         // 무적 3 초
const DASH_COST = 31                // 내공 소모 (사용자 명시)

// 적 spawn 곡선 — 사용자 *난이도 어려움* 정합 (완화)
const SPAWN_GAP_BASE = 1300
const SPAWN_GAP_PER_LEVEL = 60
const SPAWN_GAP_MIN = 450
const SPAWN_CAP_BASE = 3
const SPAWN_CAP_PER_LEVEL = 3
const SPAWN_CAP_MAX = 8

// 점수·콤보 — 레벨 도달 천천히 (난이도 ↓ 정합)
const SCORE_PER_LEVEL = 1200
const SCORE_PER_HIT = 90
const SCORE_PER_KILL = 90
const SCORE_PER_COMBO_5 = 20
const SCORE_QI_HIT = 70
const SCORE_QI_KILL = 120
const SCORE_TICK = 1
const KI_PER_HIT = 4
const KI_PER_KILL = 8
const KI_PER_WHIFF = 1
const KI_MAX = 234
const KI_GWANGSAL = 234             // 광살 = 게이지 가득 차면 발동
const KI_GWANGSAL_LOSS = 200        // 광살 발동 시 내공 감소 (잔여 34)
const KI_HURT_LOSS = 33             // 피격 시 내공 감소

// 파티클 / Hit-stop — count 줄임 (다중 적 시 paint 비용 ↓)
const PARTICLES_HIT = 3
const PARTICLES_QI_HIT = 5
const PARTICLES_KILL = 8
const PARTICLES_PLAYER_HURT = 6
const PARTICLES_CAP = 80          // 동시 파티클 상한 (cap 넘으면 오래된 것 drop)
const PARTICLE_LIFE_MS = 420
const PARTICLE_LIFE_JITTER_MIN = 0.65        // 파티클별 수명 = LIFE_MS × (MIN ~ MIN+RANGE)
const PARTICLE_LIFE_JITTER_RANGE = 0.7
const PARTICLE_VY_BIAS_RATIO = 0.45          // 상방 초기 속도 = speed × 본 비율 (튀어오름 보정)
const PARTICLE_SPEED_MIN = 60
const PARTICLE_SPEED_RANGE = 220
const PARTICLE_GRAVITY = 380
const PARTICLE_FRICTION = 0.92
const HITSTOP_HIT_MS = 36
const HITSTOP_KILL_MS = 72
const HITSTOP_PLAYER_HURT_MS = 100
const SCORE_TICK_RATE = 4         // 매 N frame 마다 1점 (60→15tick/s)

// 액션 타이밍 (ms / 비율)
const HURT_FLASH_MS = 200                    // 피격 깜빡임 표시 길이
const QI_CAST_POSE_MS = 240                  // 장풍 발사 자세 길이
const GWANGSAL_FX_MS = 450                   // 광살 풀스크린 sprite fade 길이 (CSS .sm-gwangsal-fx 와 일치)
const GWANGSAL_FX_CLEAR_MS = GWANGSAL_FX_MS + 10  // setTimeout clear 여유 (sprite fade 완전 종료 후 정리)
const GWANGSAL_HITSTOP_MS = 200              // 광살 발동 시 hit-stop
const DASH_PATH_PAD_RATIO = 0.3              // 이형환위 경로 양끝 padding = ENEMY_W × 본 비율
const ENEMY_KNOCKBACK_ON_DAMAGE = 42         // 적이 플레이어에 부딪힐 때 자기 후퇴 거리

// 임팩트·사망 이펙트 (sprite 기반)
const EFFECT_IMPACT_LIFE_MS = 220
const EFFECT_DEATH_LIFE_MS = 420
const EFFECT_IMPACT_SIZE = 72
const EFFECT_DEATH_SIZE = 100
const EFFECT_CAP = 24             // 동시 이펙트 상한

// 파티클 색상 — stickman-murim.css 의 --sm-* 토큰과 동일 hex 유지.
// string literal 은 CSS var 사용 불가 (inline style 의 background 에 직접 들어감).
// CSS 토큰 변경 시 본 상수도 동기화 필수.
const COLOR_HIT_NORMAL = '#67e8f9'   // see --sm-accent in stickman-murim.css
const COLOR_HIT_QI = '#fcd34d'       // see --sm-amber
const COLOR_KILL_NORMAL = '#fda4af'  // see --sm-danger
const COLOR_KILL_ELITE = '#f0abfc'   // see --sm-elite-bright
const COLOR_PLAYER_HURT = '#fda4af'  // see --sm-danger

// UX 타이밍
const JUDGE_FADE_MS = 420
const SHAKE_MS = 140
const SHAKE_KILL_MS = 220
const STAGE_FIT_MIN_W = 300
const STAGE_FIT_MIN_H = 420
const STAGE_FIT_DESKTOP_BREAK = 768
const STAGE_FIT_DESKTOP_PAD = 36
const STAGE_FIT_DESKTOP_MAX_SCALE = 1.25
const DT_BASE_MS = 16.67
const DT_MAX_MS = 32
const FRICTION = 0.82
const ENEMY_INTERSECT_PAD_X = 8
const ENEMY_INTERSECT_PAD_Y = 14
const PLAYER_BOUND_PAD = 18

// ─── 타입 ─────────────────────────────────────────────────────
interface Player {
  x: number
  y: number
  vx: number
  dir: 1 | -1
  hp: number
  invuln: number
  hurtFlash: number   // 피격 깜빡임 (이형환위 무적과 분리)
  attacking: number
  qiCasting: number   // 장풍 발사 자세 ms
  dashing: number
  slashCd: number
  qiCd: number
  dashCd: number
}

interface Enemy {
  id: number
  x: number
  y: number
  vx: number
  dir: 1 | -1
  hp: number
  maxHp: number
  elite: boolean
  hitStun: number
}

interface Wave {
  id: number
  x: number
  y: number
  w: number
  h: number
  vx: number
  life: number
  hitIds: ReadonlySet<number>   // 본 wave 가 이미 hit 한 적 (중복 차단)
}

type JudgeTone = 'cyan' | 'red' | 'amber' | 'violet' | 'stone'

interface Judge {
  id: number
  text: string
  tone: JudgeTone
}

interface KeysHeld {
  left: boolean
  right: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  color: string
  size: number
}

type EffectKind = 'impact' | 'impact-elite' | 'death'

interface Effect {
  id: number
  kind: EffectKind
  x: number
  y: number
  life: number
  max: number
  flipped: boolean      // 왼쪽 hit 시 sprite 좌우 반전
}

type Phase = 'idle' | 'playing' | 'over'

interface View {
  width: number
  height: number
  scale: number
  isDesktop: boolean
}

// ─── 유틸 ─────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : Math.min(v, hi)
}

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

let _idSeq = 1

function nextId(): number {
  _idSeq = (_idSeq + 1) & 0x7fffffff
  return _idSeq
}

function makePlayer(): Player {
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

function makeEnemy(level: number, side?: 'left' | 'right'): Enemy {
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

function spawnParticles(
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

function makeWave(x: number, y: number, dir: 1 | -1): Wave {
  return {
    id: nextId(),
    x,
    y,
    w: QI_W,
    h: QI_H,
    vx: dir * QI_SPEED,
    life: QI_LIFE,
    hitIds: new Set()
  }
}

type ActionKey = 'left' | 'right' | 'slash' | 'qi' | 'dash' | 'enter'

function actionOf(key: string, code: string): ActionKey | null {
  const k = key?.toLowerCase?.() ?? ''
  if (k === 'a' || code === 'KeyA' || k === 'arrowleft' || code === 'ArrowLeft') return 'left'
  if (k === 'd' || code === 'KeyD' || k === 'arrowright' || code === 'ArrowRight') return 'right'
  if (k === ' ' || code === 'Space') return 'slash'
  if (k === 'z' || code === 'KeyZ') return 'qi'
  if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') return 'dash'
  if (k === 'enter' || code === 'Enter') return 'enter'
  return null
}

// ─── 컴포넌트 ─────────────────────────────────────────────────
interface StickmanMurimProps {
  readonly autoFocus?: boolean
}

export function StickmanMurim({autoFocus = true}: StickmanMurimProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [player, setPlayer] = useState<Player>(makePlayer)
  const [enemies, setEnemies] = useState<readonly Enemy[]>([])
  const [waves, setWaves] = useState<readonly Wave[]>([])
  const [particles, setParticles] = useState<readonly Particle[]>([])
  const [effects, setEffects] = useState<readonly Effect[]>([])
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

  const stageRef = useRef<HTMLDivElement | null>(null)
  // 모바일 가상 패드 (좌측 영역 swipe) — 검기생존록 패턴 정합. 광살검은 1D (가로).
  const padActiveRef = useRef<{id: number; ox: number} | null>(null)
  const padBaseRef = useRef<HTMLDivElement | null>(null)
  const padDotRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const keysRef = useRef<KeysHeld>({left: false, right: false})
  const lastSpawnRef = useRef<number>(0)
  const hitStopUntilRef = useRef<number>(0)
  const scoreTickRef = useRef<number>(0)
  const timersRef = useRef<number[]>([])
  // 상태 ref — RAF loop 가 항상 최신 값 참조 (setState batch 영향 X).
  const stateRef = useRef({player, enemies, waves, phase, ki})

  useEffect(() => {
    stateRef.current = {player, enemies, waves, phase, ki}
  }, [player, enemies, waves, phase, ki])

  // ─── 스테이지 fit ──────────────────────────────────────────
  useLayoutEffect(() => {
    const fit = () => {
      const el = stageRef.current
      if (!el) return
      const parent = el.parentElement
      if (!parent) return
      const vw = Math.max(STAGE_FIT_MIN_W, parent.clientWidth)
      const vh = Math.max(STAGE_FIT_MIN_H, parent.clientHeight || globalThis.innerHeight - 200)
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
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      for (const id of timersRef.current) globalThis.clearTimeout(id)
      timersRef.current = []
    }
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
    setParticles((prev) => {
      const arr = [...prev]
      spawnParticles(arr, cx, cy, count, color, speedScale, sizeRange)
      return arr
    })
  }, [])

  const spawnEffect = useCallback((kind: EffectKind, cx: number, cy: number, dir: 1 | -1 = 1) => {
    const life = kind === 'death' ? EFFECT_DEATH_LIFE_MS : EFFECT_IMPACT_LIFE_MS
    setEffects((prev) => {
      const next: Effect[] = [...prev, {
        id: nextId(),
        kind,
        x: cx,
        y: cy,
        life,
        max: life,
        flipped: dir > 0
      }]
      return next.length > EFFECT_CAP ? next.slice(-EFFECT_CAP) : next
    })
  }, [])

  // 광살 — ki 200 (KI_GWANGSAL) 도달 시 자동 발동: 화면 위 모든 적 즉시 사망 + ki 0 + 점수 보너스
  useEffect(() => {
    if (ki < KI_GWANGSAL || phase !== 'playing') return
    const current = stateRef.current.enemies
    if (current.length === 0) {
      // 적 0 일 때도 ki 는 0 으로 리셋 (overflow 방지)
      setKi(0)
      return
    }
    for (const e of current) {
      setEffects((prev) => {
        const arr: Effect[] = [
          ...prev,
          {
            id: nextId(),
            kind: 'death',
            x: e.x + ENEMY_W / 2,
            y: e.y + ENEMY_H / 2,
            life: EFFECT_DEATH_LIFE_MS,
            max: EFFECT_DEATH_LIFE_MS,
            flipped: e.dir > 0,
          },
        ]
        return arr.length > EFFECT_CAP ? arr.slice(-EFFECT_CAP) : arr
      })
    }
    setScore((v) => v + current.length * SCORE_PER_KILL)
    setEnemies([])
    setKi((v) => Math.max(0, v - KI_GWANGSAL_LOSS))  // -200 (남은 34)
    setCombo((v) => v + current.length)
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
    setPlayer(makePlayer())
    setEnemies([makeEnemy(1, 'right')])
    setWaves([])
    setParticles([])
    setEffects([])
    setGwangsalFx(0)
    setScore(0)
    setCombo(0)
    setLevel(1)
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
    const s = stateRef.current
    if (s.phase !== 'playing') return
    const p = s.player
    if (p.invuln > 0) return
    triggerShake(true)
    hitStop(HITSTOP_PLAYER_HURT_MS)
    spawnBurst(p.x + PLAYER_W / 2, p.y + PLAYER_H / 2, PARTICLES_PLAYER_HURT, COLOR_PLAYER_HURT, 1.1, [3, 6])
    flashText('피격', 'red')
    setCombo(0)
    setKi((v) => Math.max(0, v - KI_HURT_LOSS))  // 피격 시 내공 30 감소
    setPlayer((prev) => {
      const nextHp = prev.hp - 1
      if (nextHp <= 0) {
        setPhase('over')
        return {...prev, hp: 0, invuln: 9999}
      }
      return {
        ...prev,
        hp: nextHp,
        invuln: PLAYER_IFRAME_MS,
        hurtFlash: HURT_FLASH_MS,
        vx: -prev.dir * PLAYER_HURT_KNOCKBACK
      }
    })
  }, [flashText, hitStop, spawnBurst, triggerShake])

  const slashAttack = useCallback(() => {
    const s = stateRef.current
    if (s.phase !== 'playing') return
    const p = s.player
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

    const nextEnemies: Enemy[] = []
    for (const enemy of s.enemies) {
      if (!rectsOverlap(attackBox.x, attackBox.y, attackBox.w, attackBox.h, enemy.x, enemy.y, ENEMY_W, ENEMY_H)) {
        nextEnemies.push(enemy)
        continue
      }
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
          elite: enemy.elite
        })
        continue
      }
      burstSpots.push({cx, cy, color: COLOR_HIT_NORMAL, kill: false, elite: enemy.elite})
      nextEnemies.push({
        ...enemy,
        hp: nextHp,
        x: enemy.x + p.dir * SLASH_KNOCKBACK,
        hitStun: ENEMY_HIT_STUN_MS
      })
    }
    setEnemies(nextEnemies)
    setPlayer((prev) => ({...prev, attacking: SLASH_FLASH_MS, slashCd: SLASH_COOLDOWN_MS}))

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
      setScore((v) => v + hitCount * SCORE_PER_HIT + killCount * SCORE_PER_KILL + Math.floor(combo / 5) * SCORE_PER_COMBO_5)
      setCombo((v) => v + hitCount)
      setKi((v) => clamp(v + hitCount * KI_PER_HIT + killCount * KI_PER_KILL, 0, KI_MAX))
      return
    }
    flashText('허공', 'stone')
    setCombo(0)
    setKi((v) => clamp(v + KI_PER_WHIFF, 0, KI_MAX))
  }, [combo, flashText, hitStop, spawnBurst, triggerShake])

  const qiAttack = useCallback(() => {
    const s = stateRef.current
    if (s.phase !== 'playing') return
    const p = s.player
    if (s.ki < QI_COST) {
      flashText('내공 부족', 'stone')
      return
    }
    const centerX = p.x + PLAYER_W / 2
    const startX = p.dir > 0 ? centerX + QI_OFFSET_NEAR : centerX - QI_OFFSET_NEAR - QI_W
    const startY = p.y + QI_OFFSET_Y
    setKi((v) => Math.max(0, v - QI_COST))
    setWaves((prev) => [...prev, makeWave(startX, startY, p.dir)])
    setPlayer((prev) => ({...prev, qiCd: QI_COOLDOWN_MS, qiCasting: QI_CAST_POSE_MS}))
    flashText('장풍', 'amber')
  }, [flashText])

  const dash = useCallback(() => {
    const s = stateRef.current
    if (s.phase !== 'playing') return
    const p = s.player
    if (s.ki < DASH_COST) {
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
    const survivors: Enemy[] = []
    const killed: Enemy[] = []
    for (const e of s.enemies) {
      if (e.x + ENEMY_W >= pathMin && e.x <= pathMax) killed.push(e)
      else survivors.push(e)
    }
    if (killed.length > 0) {
      setEnemies(survivors)
      setScore((v) => v + killed.length * SCORE_PER_KILL)
      setCombo((v) => v + killed.length)
      for (const e of killed) {
        spawnEffect('death', e.x + ENEMY_W / 2, e.y + ENEMY_H / 2, p.dir)
      }
      flashText(killed.length >= 2 ? '一閃' : '참섬', 'violet')
    }

    setPlayer((prev) => ({
      ...prev,
      x: endX,
      vx: prev.dir * DASH_VX,
      invuln: Math.max(prev.invuln, DASH_IFRAME_MS),
      dashing: DASH_DURATION_MS,
      dashCd: DASH_COOLDOWN_MS,
    }))
  }, [flashText, spawnEffect, triggerShake])

  // ─── 입력 ──────────────────────────────────────────────────
  const onKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    const action = actionOf(e.key, e.code)
    if (!action) return
    e.preventDefault()
    e.stopPropagation()
    if (action === 'left') keysRef.current.left = true
    if (action === 'right') keysRef.current.right = true
    if (action === 'enter') {
      if (stateRef.current.phase !== 'playing') reset()
      return
    }
    if (stateRef.current.phase !== 'playing') return
    if (action === 'slash') slashAttack()
    if (action === 'qi') qiAttack()
    if (action === 'dash') dash()
  }, [dash, qiAttack, reset, slashAttack])

  const onKeyUp = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    const action = actionOf(e.key, e.code)
    if (action === 'left') keysRef.current.left = false
    if (action === 'right') keysRef.current.right = false
  }, [])

  // ─── RAF loop ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') {
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
      // Hit-stop = simulation freeze (애니메이션·콤보 텍스트는 시각 유지).
      if (now < hitStopUntilRef.current) {
        frameRef.current = requestAnimationFrame(loop)
        return
      }
      const dt = Math.min(DT_MAX_MS, rawDt)
      const dtScale = dt / DT_BASE_MS

      const nextLevel = Math.floor(score / SCORE_PER_LEVEL) + 1
      if (nextLevel !== level) setLevel(nextLevel)

      // spawn
      const spawnGap = Math.max(SPAWN_GAP_MIN, SPAWN_GAP_BASE - nextLevel * SPAWN_GAP_PER_LEVEL)
      if (now - lastSpawnRef.current > spawnGap) {
        lastSpawnRef.current = now
        setEnemies((old) => {
          const cap = clamp(SPAWN_CAP_BASE + Math.floor(nextLevel / SPAWN_CAP_PER_LEVEL), SPAWN_CAP_BASE, SPAWN_CAP_MAX)
          if (old.length >= cap) return old
          return [...old, makeEnemy(nextLevel)]
        })
      }

      // player update
      setPlayer((p) => {
        let vx = p.vx * FRICTION
        let dir: 1 | -1 = p.dir
        let x = p.x
        const speed = PLAYER_SPEED * (dt / DT_BASE_MS)
        if (keysRef.current.left) {
          x -= speed
          dir = -1
        }
        if (keysRef.current.right) {
          x += speed
          dir = 1
        }
        x += vx * dtScale
        return {
          ...p,
          x: clamp(x, PLAYER_BOUND_PAD, WORLD_W - PLAYER_W - PLAYER_BOUND_PAD),
          vx,
          dir,
          invuln: Math.max(0, p.invuln - dt),
          hurtFlash: Math.max(0, p.hurtFlash - dt),
          attacking: Math.max(0, p.attacking - dt),
          qiCasting: Math.max(0, p.qiCasting - dt),
          dashing: Math.max(0, p.dashing - dt),
          slashCd: Math.max(0, p.slashCd - dt),
          qiCd: Math.max(0, p.qiCd - dt),
          dashCd: Math.max(0, p.dashCd - dt),
        }
      })

      // enemy update + 충돌
      setEnemies((prevEnemies) => {
        const p = stateRef.current.player
        const next: Enemy[] = []
        let damaged = false
        for (const enemy of prevEnemies) {
          const stun = Math.max(0, enemy.hitStun - dt)
          const chaseDir: 1 | -1 = p.x + PLAYER_W / 2 > enemy.x + ENEMY_W / 2 ? 1 : -1
          const speed = stun > 0 ? 0 : chaseDir * Math.abs(enemy.vx)
          const moved: Enemy = {
            ...enemy,
            x: enemy.x + speed * dtScale,
            dir: chaseDir,
            hitStun: stun
          }
          if (moved.x < -ENEMY_DESPAWN_PAD || moved.x > WORLD_W + ENEMY_DESPAWN_PAD) continue
          // 플레이어와 충돌
          if (
            rectsOverlap(
              moved.x, moved.y, ENEMY_W, ENEMY_H,
              p.x + ENEMY_INTERSECT_PAD_X, p.y + ENEMY_INTERSECT_PAD_Y,
              PLAYER_W - ENEMY_INTERSECT_PAD_X * 2, PLAYER_H - ENEMY_INTERSECT_PAD_Y - 4,
            )
            && p.invuln <= 0
          ) {
            damaged = true
            moved.x -= chaseDir * ENEMY_KNOCKBACK_ON_DAMAGE
          }
          next.push(moved)
        }
        if (damaged) requestAnimationFrame(takeDamage)
        return next
      })

      // wave update + 적 충돌
      setWaves((prevWaves) => {
        const currentEnemies = stateRef.current.enemies
        const nextWaves: Wave[] = []
        const damagedIds = new Set<number>()
        let hitCount = 0
        let killCount = 0
        const mutEnemies: Enemy[] = currentEnemies.map((e) => ({...e}))

        for (const wave of prevWaves) {
          const moved: Wave = {
            ...wave,
            x: wave.x + wave.vx * dtScale,
            life: wave.life - dtScale,
          }
          if (moved.life <= 0 || moved.x < -QI_DESPAWN_PAD || moved.x > WORLD_W + QI_DESPAWN_PAD) continue

          // 장풍 = 관통. 본 wave 가 이미 hit 한 적은 중복 X (hitIds per-wave).
          let movedHitIds: ReadonlySet<number> = moved.hitIds
          for (const enemy of mutEnemies) {
            if (enemy.hp <= 0 || movedHitIds.has(enemy.id)) continue
            if (!rectsOverlap(moved.x, moved.y, moved.w, moved.h, enemy.x, enemy.y + 10, ENEMY_W, ENEMY_H - 10)) continue
            hitCount += 1
            enemy.hp -= QI_DAMAGE
            enemy.hitStun = ENEMY_QI_STUN_MS
            // 장풍은 적을 밀어내지 않음 (사용자 명시) — knockback 0
            if (enemy.hp <= 0) killCount += 1
            damagedIds.add(enemy.id)          // 파티클 spawn 용 (frame 단위 누적)
            const nextSet = new Set(movedHitIds)
            nextSet.add(enemy.id)
            movedHitIds = nextSet
          }
          nextWaves.push({...moved, hitIds: movedHitIds})    // 수명 종료까지 유지, hit 누적
        }

        if (hitCount > 0) {
          setEnemies(mutEnemies.filter((e) => e.hp > 0))
          setScore((v) => v + hitCount * SCORE_QI_HIT + killCount * SCORE_QI_KILL)
          setCombo((v) => v + hitCount)
          // 장풍 자체로는 내공 회복 0 — 베기 적중·처치로만 내공 쌓이도록 (무한 장풍 방지).
          flashText(killCount > 0 ? '격파' : '명중', killCount > 0 ? 'violet' : 'amber')
          // 장풍 hit 파티클
          for (const id of damagedIds) {
            const e = currentEnemies.find((c) => c.id === id)
            if (!e) continue
            const dead = mutEnemies.find((c) => c.id === id)?.hp === 0
            const count = dead ? PARTICLES_KILL : PARTICLES_QI_HIT
            let color: string
            if (dead) {
              color = e.elite ? COLOR_KILL_ELITE : COLOR_KILL_NORMAL
            } else {
              color = COLOR_HIT_QI
            }
            setParticles((prev) => {
              const arr = [...prev]
              spawnParticles(arr, e.x + ENEMY_W / 2, e.y + ENEMY_H / 2, count, color, dead ? 1.4 : 1, dead ? [3, 7] : [2, 4])
              return arr
            })
          }
          if (killCount > 0) {
            hitStopUntilRef.current = performance.now() + HITSTOP_KILL_MS
            setShake(true)
            const sid = globalThis.setTimeout(() => setShake(false), SHAKE_KILL_MS)
            timersRef.current.push(sid)
          }
        }
        return nextWaves
      })

      // 이펙트 update — life decay 후 expired drop
      setEffects((prev) => {
        if (prev.length === 0) return prev
        const next: Effect[] = []
        for (const e of prev) {
          const life = e.life - dt
          if (life <= 0) continue
          next.push({...e, life})
        }
        return next
      })

      // 파티클 update + cap
      setParticles((prev) => {
        if (prev.length === 0) return prev
        const next: Particle[] = []
        const dtSec = dt / 1000
        for (const p of prev) {
          const life = p.life - dt
          if (life <= 0) continue
          next.push({
            ...p,
            x: p.x + p.vx * dtSec,
            y: p.y + p.vy * dtSec,
            vx: p.vx * PARTICLE_FRICTION,
            vy: p.vy * PARTICLE_FRICTION + PARTICLE_GRAVITY * dtSec,
            life,
          })
        }
        // 상한 초과 시 오래된 것 drop (배열 앞쪽 = 오래된 것 가정)
        return next.length > PARTICLES_CAP ? next.slice(-PARTICLES_CAP) : next
      })

      // 점수 tick — 매 frame X (4 frame 마다 = 15tick/s)
      scoreTickRef.current += 1
      if (scoreTickRef.current >= SCORE_TICK_RATE) {
        scoreTickRef.current = 0
        setScore((v) => v + SCORE_TICK)
      }
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [flashText, level, phase, score, takeDamage])

  // ─── 모바일 버튼 핸들러 ────────────────────────────────────
  const onPadDown = useCallback((kind: ActionKey) => (e: ReactPointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (kind === 'left') keysRef.current.left = true
    if (kind === 'right') keysRef.current.right = true
    if (stateRef.current.phase !== 'playing') return
    if (kind === 'slash') slashAttack()
    if (kind === 'qi') qiAttack()
    if (kind === 'dash') dash()
  }, [dash, qiAttack, slashAttack])

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
    if (stateRef.current.phase !== 'playing') return
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
  }, [stageRectToWorldX])

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
  const hpHearts = '●'.repeat(player.hp) + '○'.repeat(PLAYER_MAX_HP - player.hp)
  const qiReady = ki >= QI_COST
  // 이형환위 시각 게이지 — ki 잔량 / DASH_COST 비율 (0..1). DASH_COOLDOWN_MS = 0 라
  // 쿨다운 기반 비율은 의미 없음 (0 / 0 = NaN). ki 진행률이 *사용 가능까지의 거리* 를 더 정확히 표현.
  const dashCdFraction = clamp(1 - Math.min(ki, DASH_COST) / DASH_COST, 0, 1)
  const dashReady = ki >= DASH_COST

  return (
    <div className="mini-game-frame mini-game-frame--landscape sm-frame">
      <div
        ref={stageRef}
        className={'sm-stage' + (shake ? ' sm-shake' : '')}
        tabIndex={0}
        role="application"
        aria-label="광살검"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPointerDown={onStagePointerDown}
        onPointerMove={onStagePointerMove}
        onPointerUp={onStagePointerUp}
        onPointerCancel={onStagePointerUp}
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
              <div className="sm-hud-title">
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

          {/* 장풍 — sprite (dash-burst.webp 임시 alias). 좌측 발사 시 flip. */}
          {waves.map((wave) => (
            <div
              key={wave.id}
              className="sm-wave"
              style={{left: wave.x, top: wave.y, width: wave.w, height: wave.h}}
            >
              <img
                className="sm-sprite"
                src={SPRITE_QI}
                alt=""
                draggable={false}
                style={{transform: wave.vx < 0 ? 'scaleX(-1)' : undefined}}
              />
            </div>
          ))}

          {/* 적 */}
          {enemies.map((enemy) => (
            <EnemyView key={enemy.id} enemy={enemy}/>
          ))}

          {/* 이형환위 잔상·베기 호 div 모두 폐기 — sprite filter 만 시각 표현 (사용자 정합). */}

          {/* 파티클 — boxShadow 폐기 (paint 비용 큼). 색은 CSS background 만. */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="sm-particle"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                background: p.color,
                opacity: p.life / p.max,
              }}
            />
          ))}

          {/* 광살 풀스크린 sprite — ki 가득 차 발동 시 ~450ms */}
          {gwangsalFx > 0 && (
            <img
              className="sm-gwangsal-fx"
              src={SPRITE_GWANGSAL}
              alt=""
              draggable={false}
            />
          )}

          {/* 임팩트 / 사망 이펙트 — 사용자 제공 sprite */}
          {effects.map((e) => {
            let sprite: string
            if (e.kind === 'death') {
              sprite = SPRITE_DEATH
            } else if (e.kind === 'impact-elite') {
              sprite = SPRITE_IMPACT_ELITE
            } else {
              sprite = SPRITE_IMPACT
            }
            const size = e.kind === 'death' ? EFFECT_DEATH_SIZE : EFFECT_IMPACT_SIZE
            return (
              <img
                key={e.id}
                className="sm-effect"
                src={sprite}
                alt=""
                draggable={false}
                style={{
                  left: e.x - size / 2,
                  top: e.y - size / 2,
                  width: size,
                  height: size,
                  opacity: e.life / e.max,
                  transform: e.flipped ? 'scaleX(-1)' : undefined,
                }}
              />
            )
          })}

          {/* 플레이어 */}
          <StickmanView
            x={player.x}
            y={player.y}
            dir={player.dir}
            attacking={player.attacking > 0}
            qiCasting={player.qiCasting > 0}
            dashing={player.dashing > 0}
            hurt={player.hurtFlash > 0 && phase === 'playing'}
            invuln={player.invuln > 0 && phase === 'playing'}
          />

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
                <span>내공 — 100% 광살(전체 적) · 장풍 6% · 이형환위 13%</span>
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

        </div>
        {/* 모바일 가상 패드 (좌측 영역 swipe = 이동) — sm-world 밖 (scale 영향 X), sm-stage 자식 (좌표 stage rect 기준). */}
        {phase === 'playing' && !view.isDesktop && (
          <>
            <div ref={padBaseRef} className="sm-pad-base" aria-hidden="true" />
            <div ref={padDotRef} className="sm-pad-dot" aria-hidden="true" />
          </>
        )}
      </div>

      {/* 모바일 액션 버튼 (우측) — sm-frame 자식 (viewport 전체 우하단 정합). */}
      {phase === 'playing' && !view.isDesktop && (
        <div className="sm-pad">
          <div className="sm-pad-group">
            <button type="button" className="sm-pad-btn sm-pad-slash" aria-label="베기"
                    onPointerDown={onPadDown('slash')}>베기
            </button>
            <button
              type="button"
              className={'sm-pad-btn sm-pad-qi' + (qiReady ? '' : ' is-disabled')}
              aria-label="장풍"
              aria-disabled={!qiReady}
              disabled={!qiReady}
              onPointerDown={onPadDown('qi')}
            >장풍
            </button>
            <button
              type="button"
              className={'sm-pad-btn sm-pad-dash' + (dashReady ? '' : ' sm-pad-cd is-disabled')}
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

      {/* 시작 / 오버 오버레이 — sm-frame 자식 (viewport 전체 cover, scale 영향 X). */}
      {phase !== 'playing' && (
        <div className="sm-overlay">
          <div className="sm-overlay-card">
            <div className="sm-overlay-emoji" aria-hidden="true">🥋</div>
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
  )
}

// ─── 졸라맨 (hero sprite view) ───────────────────────────
interface StickmanViewProps {
  readonly x: number
  readonly y: number
  readonly dir: 1 | -1
  readonly attacking: boolean
  readonly qiCasting: boolean
  readonly dashing: boolean
  readonly hurt: boolean
  readonly invuln: boolean
}

// sprite src 우선순위: dashing > qiCasting > attacking > idle.
function pickHeroSprite(attacking: boolean, qiCasting: boolean, dashing: boolean): string {
  if (dashing) return SPRITE_HERO_DASH
  if (qiCasting) return SPRITE_HERO_QI
  if (attacking) return SPRITE_HERO_ATTACK
  return SPRITE_HERO
}

// 플레이어 = sprite img. 박스와 1:1. 좌측 향 시 scaleX(-1). overflow visible 로 slash arc/dash trail 박스 밖.
const StickmanView = memo(function StickmanView({
                                                  x,
                                                  y,
                                                  dir,
                                                  attacking,
                                                  qiCasting,
                                                  dashing,
                                                  hurt,
                                                  invuln,
                                                }: StickmanViewProps) {
  const isRight = dir > 0
  // 본체 + 상태 클래스 (CSS 가 sprite filter / opacity 결정).
  const classes = [
    'sm-stickman',
    hurt && 'sm-stickman-hurt',
    attacking && 'sm-stickman-attacking',
    dashing && 'sm-stickman-dashing',
    invuln && !hurt && 'sm-stickman-invuln',
  ].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      style={{
        transform: `translate(${x}px, ${y}px)${isRight ? '' : ' scaleX(-1)'}`,
        width: PLAYER_W,
        height: PLAYER_H,
      }}
    >
      <img
        className="sm-sprite"
        src={pickHeroSprite(attacking, qiCasting, dashing)}
        alt=""
        draggable={false}
        style={{transform: 'translateX(-50%)'}}
      />
    </div>
  )
})

// ─── 적 (sprite view) ───────────────────────────────────
interface EnemyViewProps {
  readonly enemy: Enemy
}

// 적 = sprite img (일반 = assassin, 정예 = elite). 박스와 1:1. 좌측 향 시 scaleX(-1).
const EnemyView = memo(function EnemyView({enemy}: EnemyViewProps) {
  const isRight = enemy.dir > 0
  const stunClass = enemy.hitStun > 0 ? ' sm-enemy-stun' : ''
  const eliteClass = enemy.elite ? ' sm-enemy-elite' : ''
  return (
    <div
      className={'sm-enemy' + stunClass + eliteClass}
      style={{
        transform: `translate(${enemy.x}px, ${enemy.y}px)${isRight ? '' : ' scaleX(-1)'}`,
        width: ENEMY_W,
        height: ENEMY_H,
      }}
    >
      <img
        className="sm-sprite"
        src={enemy.elite ? SPRITE_ELITE : SPRITE_ASSASSIN}
        alt=""
        draggable={false}
        style={{transform: 'translateX(-50%)'}}
      />
      {enemy.maxHp > 1 && (
        <div className="sm-enemy-hp">
          <div className="sm-enemy-hp-fill" style={{width: `${(enemy.hp / enemy.maxHp) * 100}%`}}/>
        </div>
      )}
    </div>
  )
})
