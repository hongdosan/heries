import {type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import SLASH_SPRITE from '../../../../shared/images/mini-game/swordsman-survival/slash.webp?url'
import IMPACT_ELITE_SPRITE from '../../../../shared/images/mini-game/swordsman-survival/impact-amber.webp?url'
import IMPACT_NORMAL_SPRITE from '../../../../shared/images/mini-game/swordsman-survival/impact-crimson.webp?url'
import {
  WORLD_W, WORLD_H,
  PLAYER_SIZE, PLAYER_SPEED, PLAYER_MAX_HP, PLAYER_IFRAME_MS,
  ENEMY_SIZE, ELITE_SIZE, ENEMY_BASE_SPEED, ENEMY_WAVE_INCREMENT, ENEMY_HP, ELITE_HP, SCORE_NORMAL, SCORE_ELITE,
  BULLET_SIZE, BULLET_SPEED, BULLET_LIFE, FIRE_COOLDOWN_FRAMES,
  WAVE_DURATION_FRAMES, SPAWN_BASE_FRAMES, SPAWN_MIN_FRAMES, SPAWN_WAVE_REDUCTION,
  ITEM_SIZE, ITEM_LIFE_FRAMES, ITEM_DROP_NORMAL, ITEM_DROP_ELITE, ITEM_SCORE_BONUS, ITEM_HP_HEAL,
  IMPACT_FADE_MS,
  SKILL_CD_FRAMES, SKILL_DURATION_FRAMES, SKILL_PUSH_RADIUS, SKILL_PUSH_STRENGTH,
  COLOR_HIT_NORMAL, COLOR_HIT_ELITE, COLOR_KILL_NORMAL, COLOR_KILL_ELITE, COLOR_PLAYER_HIT, COLOR_ITEM_HEART, COLOR_ITEM_GEM,
  PARTICLES_HIT_NORMAL, PARTICLES_HIT_ELITE, PARTICLES_KILL, PARTICLES_PLAYER_HIT, PARTICLES_ITEM_PICKUP, PARTICLES_SKILL_ACTIVATE,
  ITEM_BLINK_THRESHOLD_FRAMES, ITEM_BLINK_INTERVAL_FRAMES,
  PARTICLE_FRICTION, PARTICLE_LIFE_FRAMES, PARTICLE_SPEED_MIN, PARTICLE_SPEED_RANGE,
  SPAWN_JITTER_FRAMES,
  PLAYER_OPACITY_BLINK_INTERVAL, PLAYER_OPACITY_BLINK_DUTY,
  SKILL_RING_BASE_SCALE, SKILL_RING_SCALE_DELTA,
  ANNOUNCE_FADE_MS, FLASH_FADE_MS,
  DT_BASE_MS, DT_SCALE_MIN, DT_SCALE_MAX,
  RAW_HIT_PADDING_PX,
  BEST_KEY,
} from './constants.js'

// ─────────────────────────────────────────────────────────────────
// 검기생존록 — 무협 아이작풍 탄막 슈터 (H-eries 메인 페이지 미니 게임)
// 의존 0 (react 만). framer-motion / shadcn / tailwind 미사용.
// 게임 좌표계 SSOT = WORLD_W × WORLD_H. 박스 안에서 CSS scale 로 fit.
// 게임 튜닝 상수 SSOT = ./constants.ts (gwangsalgeom 정합).
// ─────────────────────────────────────────────────────────────────

// ─── 타입 ──────────────────────────────────────────────────────
interface Vec {
  x: number
  y: number
}

interface Player extends Vec {
  hp: number
  invuln: number
  fireCd: number
  facing: Vec
  skillCd: number      // 0 = 사용 가능
  skillActive: number  // > 0 = 발동 중 (남은 frame)
}

interface Enemy extends Vec {
  id: number
  hp: number
  size: number
  speed: number
  elite: boolean
}

type ItemKind = 'heart' | 'gem'

interface Item extends Vec {
  id: number
  kind: ItemKind
  life: number
}

interface Bullet extends Vec {
  id: number
  dx: number
  dy: number
  life: number
}

interface Particle extends Vec {
  id: number
  dx: number
  dy: number
  life: number
  max: number
  color: string
}

interface AttackFlash {
  id: number
  x: number
  y: number
  angle: number
}

interface Impact {
  id: number
  x: number
  y: number
  elite: boolean
}

interface InputState {
  // 정규화 이동 벡터 (-1 ~ 1) — 가상 패드 결과.
  mx: number
  my: number
  // 발사 신호 (이번 frame 안에서 step 이 소비).
  shoot: boolean
}

type Phase = 'idle' | 'playing' | 'over'

// ─── 유틸 ──────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : Math.min(v, hi)
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

let _idSeq = 1

function nextId(): number {
  _idSeq = (_idSeq + 1) & 0x7fffffff
  return _idSeq
}

function normalize(x: number, y: number): { x: number; y: number; len: number } {
  const len = Math.hypot(x, y)
  if (len < 0.0001) return {x: 0, y: 0, len: 0}
  return {x: x / len, y: y / len, len}
}

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

function makePlayer(): Player {
  return {
    x: WORLD_W / 2 - PLAYER_SIZE / 2,
    y: WORLD_H / 2 - PLAYER_SIZE / 2,
    hp: PLAYER_MAX_HP,
    invuln: 0,
    fireCd: 0,
    facing: {x: 0, y: -1},
    skillCd: 0,
    skillActive: 0,
  }
}

// 스킬 발동 — 가능 조건 검사 + 효과 적용 (반환 = 발동 여부).
// 효과 = SKILL_DURATION_FRAMES 동안 무적 + 반경 안 적 밀어내기 (즉시 1회).
function tryActivateSkill(p: Player, enemies: Enemy[], particles: Particle[]): boolean {
  if (p.skillCd > 0 || p.skillActive > 0) return false
  p.skillActive = SKILL_DURATION_FRAMES
  p.skillCd = SKILL_CD_FRAMES
  p.invuln = Math.max(p.invuln, SKILL_DURATION_FRAMES)
  const pcx = p.x + PLAYER_SIZE / 2
  const pcy = p.y + PLAYER_SIZE / 2
  for (const e of enemies) {
    const ecx = e.x + e.size / 2
    const ecy = e.y + e.size / 2
    const dx = ecx - pcx
    const dy = ecy - pcy
    const dist = Math.hypot(dx, dy)
    if (dist < SKILL_PUSH_RADIUS && dist > 0.001) {
      const n = normalize(dx, dy)
      e.x += n.x * SKILL_PUSH_STRENGTH
      e.y += n.y * SKILL_PUSH_STRENGTH
    }
  }
  spawnParticles(particles, pcx, pcy, COLOR_PLAYER_HIT, PARTICLES_SKILL_ACTIVATE)
  return true
}

function spawnEnemy(level: number): Enemy {
  // wave 1 = 엘리트 X, wave 2 부터 15% → 22% 점진
  const eliteChance = level >= 2 ? Math.min(0.15 + (level - 2) * 0.02, 0.25) : 0
  const elite = Math.random() < eliteChance
  const size = elite ? ELITE_SIZE : ENEMY_SIZE
  // 화면 가장자리에서 spawn
  const side = Math.floor(Math.random() * 4)
  let x: number
  let y: number
  if (side === 0) {
    x = rand(0, WORLD_W - size);
    y = -size
  } else if (side === 1) {
    x = WORLD_W;
    y = rand(0, WORLD_H - size)
  } else if (side === 2) {
    x = rand(0, WORLD_W - size);
    y = WORLD_H
  } else {
    x = -size;
    y = rand(0, WORLD_H - size)
  }
  return {
    id: nextId(),
    x, y,
    size,
    hp: elite ? ELITE_HP : ENEMY_HP,
    speed: ENEMY_BASE_SPEED + (level - 1) * ENEMY_WAVE_INCREMENT + (elite ? 0 : rand(-0.05, 0.1)),
    elite,
  }
}

function spawnItem(out: Item[], elite: boolean, x: number, y: number): void {
  const dropChance = elite ? ITEM_DROP_ELITE : ITEM_DROP_NORMAL
  if (Math.random() >= dropChance) return
  // elite 는 HP 회복 우선 (귀한 자원), 일반은 점수 보너스 우선
  const heartChance = elite ? 0.55 : 0.3
  const kind: ItemKind = Math.random() < heartChance ? 'heart' : 'gem'
  out.push({
    id: nextId(),
    x: x - ITEM_SIZE / 2,
    y: y - ITEM_SIZE / 2,
    kind,
    life: ITEM_LIFE_FRAMES,
  })
}

function computePlayerOpacity(invuln: number): string {
  if (invuln <= 0) return '1'
  return invuln % PLAYER_OPACITY_BLINK_INTERVAL < PLAYER_OPACITY_BLINK_DUTY ? '0.4' : '1'
}

// 아이템 픽업 효과 — pickup 결과에 따라 플레이어 상태 갱신 + 파티클 + 알림.
// 호출자가 hudDirtyRef / setAnnounce / scoreRef 갱신.
function applyItemEffect(
  kind: ItemKind,
  p: Player,
  particles: Particle[],
): { scoreBonus: number; announceText: string } {
  if (kind === 'heart') {
    p.hp = Math.min(PLAYER_MAX_HP, p.hp + ITEM_HP_HEAL)
    spawnParticles(particles, p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2, COLOR_ITEM_HEART, PARTICLES_ITEM_PICKUP)
    return {scoreBonus: 0, announceText: `+${ITEM_HP_HEAL} HP`}
  }
  // gem
  spawnParticles(particles, p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2, COLOR_ITEM_GEM, PARTICLES_ITEM_PICKUP)
  return {scoreBonus: ITEM_SCORE_BONUS, announceText: `+${ITEM_SCORE_BONUS}`}
}

// 아이템 표시 opacity (마지막 깜빡임 단계 처리). render 안 nested ternary 방지.
function computeItemOpacity(life: number): string {
  if (life >= ITEM_BLINK_THRESHOLD_FRAMES) return '1'
  return life % ITEM_BLINK_INTERVAL_FRAMES < ITEM_BLINK_INTERVAL_FRAMES / 2 ? '0.35' : '1'
}

// ─── step 분리 — pure helper 함수들 ────────────────────────
function readKeyboardMove(keys: Set<string>): { x: number; y: number; shoot: boolean } {
  let x = 0
  let y = 0
  if (keys.has('ArrowLeft')) x -= 1
  if (keys.has('ArrowRight')) x += 1
  if (keys.has('ArrowUp')) y -= 1
  if (keys.has('ArrowDown')) y += 1
  const shoot = keys.has(' ') || keys.has('Spacebar')
  return {x, y, shoot}
}

function combineMove(kx: number, ky: number, pad: InputState): { x: number; y: number } {
  if (kx !== 0 || ky !== 0) {
    const n = normalize(kx, ky)
    return {x: n.x, y: n.y}
  }
  if (Math.abs(pad.mx) > 0.05 || Math.abs(pad.my) > 0.05) {
    return {x: pad.mx, y: pad.my}
  }
  return {x: 0, y: 0}
}

function movePlayer(p: Player, mx: number, my: number, scale: number): void {
  if (mx !== 0 || my !== 0) {
    p.x += mx * PLAYER_SPEED * scale
    p.y += my * PLAYER_SPEED * scale
    const n = normalize(mx, my)
    p.facing.x = n.x
    p.facing.y = n.y
  }
  p.x = clamp(p.x, 0, WORLD_W - PLAYER_SIZE)
  p.y = clamp(p.y, 0, WORLD_H - PLAYER_SIZE)
}

function fireBullet(p: Player, bullets: Bullet[]): { dx: number; dy: number } {
  const dir = normalize(p.facing.x, p.facing.y)
  const dx = dir.len === 0 ? 0 : dir.x
  const dy = dir.len === 0 ? -1 : dir.y
  const cx = p.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2
  const cy = p.y + PLAYER_SIZE / 2 - BULLET_SIZE / 2
  bullets.push({
    id: nextId(),
    x: cx, y: cy,
    dx: dx * BULLET_SPEED,
    dy: dy * BULLET_SPEED,
    life: BULLET_LIFE,
  })
  p.fireCd = FIRE_COOLDOWN_FRAMES
  return {dx, dy}
}

function updateBullets(bullets: Bullet[], scale: number): void {
  const padding = RAW_HIT_PADDING_PX
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i]
    if (!b) continue
    b.x += b.dx * scale
    b.y += b.dy * scale
    b.life -= scale
    if (
      b.life <= 0 ||
      b.x < -padding || b.x > WORLD_W + padding ||
      b.y < -padding || b.y > WORLD_H + padding
    ) {
      bullets.splice(i, 1)
    }
  }
}

function chaseEnemies(enemies: Enemy[], p: Player, scale: number): void {
  for (const e of enemies) {
    const ecx = e.x + e.size / 2
    const ecy = e.y + e.size / 2
    const pcx = p.x + PLAYER_SIZE / 2
    const pcy = p.y + PLAYER_SIZE / 2
    const dir = normalize(pcx - ecx, pcy - ecy)
    e.x += dir.x * e.speed * scale
    e.y += dir.y * e.speed * scale
  }
}

// 총알 ↔ 적 충돌. 처치 시 점수 누적, hudDirty 마킹 + 아이템 drop 가능
// + impact sprite spawn (적 처치 시).
// 반환 = 누적 점수 증가량 + impact 큐 (호출자가 setImpacts 갱신).
function resolveBulletEnemyHits(
  bullets: Bullet[],
  enemies: Enemy[],
  particles: Particle[],
  items: Item[],
): { gained: number; dirty: boolean; impacts: Impact[] } {
  let gained = 0
  let dirty = false
  const impacts: Impact[] = []
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i]
    if (!e) continue
    const j = findHittingBullet(bullets, e)
    if (j < 0) continue
    bullets.splice(j, 1)
    e.hp -= 1
    spawnParticles(particles, e.x + e.size / 2, e.y + e.size / 2,
      e.elite ? COLOR_HIT_ELITE : COLOR_HIT_NORMAL,
      e.elite ? PARTICLES_HIT_ELITE : PARTICLES_HIT_NORMAL)
    if (e.hp <= 0) {
      gained += e.elite ? SCORE_ELITE : SCORE_NORMAL
      spawnParticles(particles, e.x + e.size / 2, e.y + e.size / 2,
        e.elite ? COLOR_KILL_ELITE : COLOR_KILL_NORMAL, PARTICLES_KILL)
      spawnItem(items, e.elite, e.x + e.size / 2, e.y + e.size / 2)
      impacts.push({
        id: nextId(),
        x: e.x + e.size / 2,
        y: e.y + e.size / 2,
        elite: e.elite,
      })
      dirty = true
      enemies.splice(i, 1)
    }
  }
  return {gained, dirty, impacts}
}

function findHittingBullet(bullets: Bullet[], e: Enemy): number {
  for (let j = bullets.length - 1; j >= 0; j--) {
    const b = bullets[j]
    if (!b) continue
    if (rectsOverlap(b.x, b.y, BULLET_SIZE, BULLET_SIZE, e.x, e.y, e.size, e.size)) {
      return j
    }
  }
  return -1
}

// 적 ↔ 플레이어 충돌. 무적·HP 변경 시 dirty 반환.
function resolvePlayerEnemyHits(p: Player, enemies: Enemy[], particles: Particle[]): boolean {
  if (p.invuln > 0) return false
  for (const e of enemies) {
    if (rectsOverlap(p.x, p.y, PLAYER_SIZE, PLAYER_SIZE, e.x, e.y, e.size, e.size)) {
      p.hp -= 1
      p.invuln = Math.round(PLAYER_IFRAME_MS / DT_BASE_MS)
      spawnParticles(particles, p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2, COLOR_PLAYER_HIT, PARTICLES_PLAYER_HIT)
      return true
    }
  }
  return false
}

// 아이템 진행 (수명만 감소, 정지). pickup 은 별도.
function updateItems(items: Item[], scale: number): void {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]
    if (!it) continue
    it.life -= scale
    if (it.life <= 0) items.splice(i, 1)
  }
}

// 플레이어 ↔ 아이템 pickup. 효과 발동 + 처리한 아이템 종류 반환.
function resolveItemPickup(p: Player, items: Item[]): ItemKind | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]
    if (!it) continue
    if (rectsOverlap(p.x, p.y, PLAYER_SIZE, PLAYER_SIZE, it.x, it.y, ITEM_SIZE, ITEM_SIZE)) {
      items.splice(i, 1)
      return it.kind
    }
  }
  return null
}

function updateParticles(particles: Particle[], scale: number): void {
  // 마찰 ^ scale 로 dt 보정 (frame 마다 누적 효과 동일).
  const friction = Math.pow(PARTICLE_FRICTION, scale)
  for (let i = particles.length - 1; i >= 0; i--) {
    const q = particles[i]
    if (!q) continue
    q.x += q.dx * scale
    q.y += q.dy * scale
    q.dx *= friction
    q.dy *= friction
    q.life -= scale
    if (q.life <= 0) particles.splice(i, 1)
  }
}

function spawnParticles(out: Particle[], x: number, y: number, color: string, n: number): void {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const s = PARTICLE_SPEED_MIN + Math.random() * PARTICLE_SPEED_RANGE
    out.push({
      id: nextId(),
      x, y,
      dx: Math.cos(a) * s,
      dy: Math.sin(a) * s,
      life: PARTICLE_LIFE_FRAMES,
      max: PARTICLE_LIFE_FRAMES,
      color,
    })
  }
}

// ─── best-score 보존 (localStorage) ──────────────────────
// BEST_KEY = './constants.js' 임포트

function readBestScore(): number {
  try {
    const v = globalThis.localStorage?.getItem(BEST_KEY)
    if (!v) return 0
    const n = Number(v)
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

function writeBestScore(n: number): void {
  try {
    globalThis.localStorage?.setItem(BEST_KEY, String(n))
  } catch {
    // localStorage 비활성 환경 — silent
  }
}

// ─── 컴포넌트 ──────────────────────────────────────────────────

export interface MiniGameProps {
  // 외부에서 강제 폭 지정 가능 (스토리북 등)
  readonly autoFocus?: boolean
}

export function MiniGame({autoFocus = false}: Readonly<MiniGameProps>) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState<number>(0)
  const [hpView, setHpView] = useState<number>(PLAYER_MAX_HP)
  const [wave, setWave] = useState<number>(1)
  const [bestScore, setBestScore] = useState<number>(() => readBestScore())
  const [skillReady, setSkillReady] = useState<boolean>(true)
  const [flash, setFlash] = useState<AttackFlash | null>(null)
  const [impacts, setImpacts] = useState<Impact[]>([])
  const [announce, setAnnounce] = useState<{
    id: number;
    text: string;
    kind: 'wave' | 'elite' | 'item'
  } | null>(null)

  // refs (게임 루프 상태 — 리렌더 방지)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<Player>(makePlayer())
  const enemiesRef = useRef<Enemy[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const particlesRef = useRef<Particle[]>([])
  const itemsRef = useRef<Item[]>([])
  const inputRef = useRef<InputState>({mx: 0, my: 0, shoot: false})
  const keysRef = useRef<Set<string>>(new Set())
  const frameRef = useRef<number>(0)
  const waveTimerRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const phaseRef = useRef<Phase>('idle')
  const scoreRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)

  // 렌더 동기화용 — rAF 안에서 setState 1회씩만 호출 (HUD 갱신)
  const hudDirtyRef = useRef<boolean>(false)
  const skillReadyRef = useRef<boolean>(true)
  // best-score 비교용 ref — setState callback 안 side effect 방지.
  // 초기값 = localStorage 읽기 1회 (state 와 동기화).
  const bestScoreRef = useRef<number>(readBestScore())

  // DOM 노드 ref — 렌더는 rAF 마다 transform 만 갱신 (React 재렌더 방지)
  const playerElRef = useRef<HTMLDivElement | null>(null)
  const skillRingRef = useRef<HTMLSpanElement | null>(null)
  const enemiesLayerRef = useRef<HTMLDivElement | null>(null)
  const bulletsLayerRef = useRef<HTMLDivElement | null>(null)
  const particlesLayerRef = useRef<HTMLDivElement | null>(null)
  const itemsLayerRef = useRef<HTMLDivElement | null>(null)
  const itemElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  const enemyElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  const bulletElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  const particleElMap = useRef<Map<number, HTMLDivElement>>(new Map())

  // ─── 박스 크기 → --mg-scale 동기화 ─────────────────────
  const frameRefEl = useRef<HTMLDivElement | null>(null)
  useLayoutEffect(() => {
    const frameEl = frameRefEl.current
    const stageEl = stageRef.current
    if (!frameEl || !stageEl) return
    const apply = (): void => {
      const rect = frameEl.getBoundingClientRect()
      if (rect.width <= 0) return
      const scale = rect.width / WORLD_W
      stageEl.style.setProperty('--mg-scale', String(scale))
    }
    apply()
    if (typeof ResizeObserver === 'undefined') {
      globalThis.addEventListener('resize', apply)
      return () => globalThis.removeEventListener('resize', apply)
    }
    const ro = new ResizeObserver(apply)
    ro.observe(frameEl)
    return () => ro.disconnect()
  }, [])

  // ─── 게임 리셋 ──────────────────────────────────────────
  const reset = useCallback((): void => {
    playerRef.current = makePlayer()
    // 기존 DOM 모두 제거
    enemyElMap.current.forEach((el) => el.remove())
    enemyElMap.current.clear()
    bulletElMap.current.forEach((el) => el.remove())
    bulletElMap.current.clear()
    particleElMap.current.forEach((el) => el.remove())
    particleElMap.current.clear()
    enemiesRef.current = []
    bulletsRef.current = []
    particlesRef.current = []
    itemElMap.current.forEach((el) => el.remove())
    itemElMap.current.clear()
    itemsRef.current = []
    frameRef.current = 0
    waveTimerRef.current = 0
    spawnTimerRef.current = 30
    scoreRef.current = 0
    setScore(0)
    setHpView(PLAYER_MAX_HP)
    setWave(1)
    setFlash(null)
    skillReadyRef.current = true
    setSkillReady(true)
    skillRequestRef.current = false
  }, [])

  const start = useCallback((): void => {
    reset()
    phaseRef.current = 'playing'
    setPhase('playing')
    // 시작 시 stage 자동 focus — 사용자가 시작 버튼 누른 직후 키보드 즉시 반응.
    globalThis.requestAnimationFrame(() => stageRef.current?.focus())
  }, [reset])

  // 키보드 입력은 stage div 에서 직접 처리 (onKeyDown / onKeyUp).
  // 글로벌 window 핸들러 방지 — 페이지 다른 UI (폼·링크) 영향 0.
  // stage 가 focus 받은 상태에서만 키 입력 응답 = a11y 정합.
  // PC 입력 = 방향키 (이동) + Space (발사) + Shift (스킬) + Enter (재시작). WASD 미사용.
  const isGameKey = useCallback((k: string): boolean => {
    return (
      k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight' ||
      k === ' ' || k === 'Spacebar' ||
      k === 'Shift' ||
      k === 'Enter'
    )
  }, [])

  // 스킬 사용 신호 (이번 frame 안에서 step 이 소비)
  const skillRequestRef = useRef<boolean>(false)
  const triggerSkill = useCallback(() => {
    if (phaseRef.current !== 'playing') return
    skillRequestRef.current = true
  }, [])

  const onStageKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (phaseRef.current !== 'playing') {
      if (e.key === 'Enter') {
        start()
        e.preventDefault()
      }
      return
    }
    if (isGameKey(e.key)) e.preventDefault()
    keysRef.current.add(e.key)
  }, [isGameKey, start])

  const onStageKeyUp = useCallback((e: ReactKeyboardEvent<HTMLDivElement>): void => {
    keysRef.current.delete(e.key)
  }, [])

  // 게임이 over 또는 idle 로 떨어지면 잔여 키 입력 상태 정리 (포커스 잃을 때 ghost key 방지).
  useEffect(() => {
    if (phase !== 'playing') keysRef.current.clear()
  }, [phase])

  // ─── 입력 — 가상 패드 (좌측 드래그 = 이동, 우측 탭 = 발사) ─
  // 박스 안 좌표 → 월드 좌표 변환은 stageRef 크기 사용
  const padActiveRef = useRef<{ id: number; ox: number; oy: number } | null>(null)
  const padDotRef = useRef<HTMLDivElement | null>(null)
  const padBaseRef = useRef<HTMLDivElement | null>(null)

  const stageRectToWorld = useCallback((clientX: number, clientY: number): Vec | null => {
    const stage = stageRef.current
    if (!stage) return null
    const rect = stage.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    const localX = ((clientX - rect.left) / rect.width) * WORLD_W
    const localY = ((clientY - rect.top) / rect.height) * WORLD_H
    return {x: localX, y: localY}
  }, [])

  const onStagePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    if (phaseRef.current !== 'playing') return
    const pt = stageRectToWorld(e.clientX, e.clientY)
    if (!pt) return
    const half = WORLD_W / 2
    if (pt.x < half) {
      // 좌측 = 가상 패드 시작
      padActiveRef.current = {id: e.pointerId, ox: pt.x, oy: pt.y}
      if (padBaseRef.current) {
        padBaseRef.current.style.left = `${pt.x}px`
        padBaseRef.current.style.top = `${pt.y}px`
        padBaseRef.current.style.opacity = '1'
      }
      if (padDotRef.current) {
        padDotRef.current.style.left = `${pt.x}px`
        padDotRef.current.style.top = `${pt.y}px`
        padDotRef.current.style.opacity = '1'
      }
    } else {
      // 우측 = 탭 발사 — 플레이어의 현재 facing 방향
      inputRef.current.shoot = true
    }
    // setPointerCapture 폐기 — 이전엔 e.target (동적 자식, 예: mg-enemy)
    // 에 capture 부여해 stuck 발생 가능. 본 게임은 stage 좌표만 사용하므로
    // capture 없이도 pointermove / up 이 bubbling 으로 도달.
  }, [stageRectToWorld])

  const onStagePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    if (phaseRef.current !== 'playing') return
    const pad = padActiveRef.current
    if (pad?.id !== e.pointerId) return
    const pt = stageRectToWorld(e.clientX, e.clientY)
    if (!pt) return
    const dx = pt.x - pad.ox
    const dy = pt.y - pad.oy
    const maxR = 40
    const n = normalize(dx, dy)
    const len = Math.min(n.len, maxR)
    inputRef.current.mx = n.x * (len / maxR)
    inputRef.current.my = n.y * (len / maxR)
    if (padDotRef.current) {
      padDotRef.current.style.left = `${pad.ox + n.x * len}px`
      padDotRef.current.style.top = `${pad.oy + n.y * len}px`
    }
  }, [stageRectToWorld])

  const releasePad = useCallback((pointerId: number | null): void => {
    const pad = padActiveRef.current
    if (pad && (pointerId == null || pad.id === pointerId)) {
      padActiveRef.current = null
      inputRef.current.mx = 0
      inputRef.current.my = 0
      if (padBaseRef.current) padBaseRef.current.style.opacity = '0'
      if (padDotRef.current) padDotRef.current.style.opacity = '0'
    }
  }, [])

  const onStagePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    releasePad(e.pointerId)
  }, [releasePad])

  // window 레벨 pointerup/cancel — pointer 가 stage 밖에서 release 시
  // stage 의 onPointerUp 이 발화 안 함 (setPointerCapture 폐기 후 정합).
  // padActive stuck 방지를 위해 window 레벨에서도 release.
  useEffect(() => {
    const handler = (e: PointerEvent): void => releasePad(e.pointerId)
    globalThis.addEventListener('pointerup', handler)
    globalThis.addEventListener('pointercancel', handler)
    return () => {
      globalThis.removeEventListener('pointerup', handler)
      globalThis.removeEventListener('pointercancel', handler)
    }
  }, [releasePad])

  // viewport 가시성 + focus — 둘 다 활성이어야 RAF 가동 (CPU 절감 + 사고 방지).
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
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

  // ─── 게임 루프 ──────────────────────────────────────────
  useEffect(() => {
    const shouldRun = phase === 'playing' && isVisible && isFocused
    if (!shouldRun) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    const tick = (t: number): void => {
      // dt scale = (실제 frame 간격) / (60fps 기준). 60fps 환경 = 1.0,
      // 30fps 환경 = ~2.0. 모바일/PC 속도 일관화. 큰 hitch (탭 백그라운드)
      // 는 DT_SCALE_MAX 로 clamp (catch-up 폭주 방지).
      const last = lastTickRef.current
      const dt = last > 0 ? t - last : DT_BASE_MS
      const scale = Math.min(DT_SCALE_MAX, Math.max(DT_SCALE_MIN, dt / DT_BASE_MS))
      lastTickRef.current = t

      step(scale)
      render()

      if (phaseRef.current === 'playing') {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }
    lastTickRef.current = 0
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // 의도적으로 phase/isVisible/isFocused 만 의존 — step/render 는 클로저 안에서 ref 기반
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isVisible, isFocused])

  // ─── 1 frame step — pure helper 함수 위임 (scale = dt 보정) ──
  const step = useCallback((scale: number): void => {
    frameRef.current += scale
    waveTimerRef.current += scale
    if (waveTimerRef.current >= WAVE_DURATION_FRAMES) {
      waveTimerRef.current = 0
      setWave((w) => {
        const next = w + 1
        setAnnounce({id: nextId(), text: `파상 ${next}`, kind: 'wave'})
        return next
      })
    }
    const currentWave = Math.max(1, Math.floor(frameRef.current / WAVE_DURATION_FRAMES) + 1)

    const p = playerRef.current
    if (p.invuln > 0) p.invuln -= scale
    if (p.fireCd > 0) p.fireCd -= scale
    if (p.skillCd > 0) p.skillCd -= scale
    if (p.skillActive > 0) p.skillActive -= scale

    // 입력 — 키보드 + 가상 패드
    const kb = readKeyboardMove(keysRef.current)
    if (kb.shoot) inputRef.current.shoot = true
    // Shift 키 또는 외부 버튼 = 스킬 신호 → 본 frame 에서 1회 발동 시도
    if (keysRef.current.has('Shift') || skillRequestRef.current) {
      skillRequestRef.current = false
      if (tryActivateSkill(p, enemiesRef.current, particlesRef.current)) {
        hudDirtyRef.current = true
      }
    }
    const inp = inputRef.current
    const mv = combineMove(kb.x, kb.y, inp)
    movePlayer(p, mv.x, mv.y, scale)

    // 발사
    if (inp.shoot && p.fireCd <= 0) {
      const aim = fireBullet(p, bulletsRef.current)
      setFlash({
        id: nextId(),
        x: p.x + PLAYER_SIZE / 2,
        y: p.y + PLAYER_SIZE / 2,
        angle: Math.atan2(aim.dy, aim.dx),
      })
    }
    inp.shoot = false

    // 적 spawn
    spawnTimerRef.current -= scale
    if (spawnTimerRef.current <= 0) {
      const enemy = spawnEnemy(currentWave)
      enemiesRef.current.push(enemy)
      if (enemy.elite) {
        setAnnounce({id: nextId(), text: '魔 등장', kind: 'elite'})
      }
      const base = Math.max(SPAWN_MIN_FRAMES, SPAWN_BASE_FRAMES - (currentWave - 1) * SPAWN_WAVE_REDUCTION)
      spawnTimerRef.current = base + Math.floor(rand(-SPAWN_JITTER_FRAMES, SPAWN_JITTER_FRAMES))
    }

    // 이동 + 충돌 + 아이템 + 파티클
    updateBullets(bulletsRef.current, scale)
    chaseEnemies(enemiesRef.current, p, scale)
    const hit = resolveBulletEnemyHits(bulletsRef.current, enemiesRef.current, particlesRef.current, itemsRef.current)
    scoreRef.current += hit.gained
    if (hit.dirty) hudDirtyRef.current = true
    if (hit.impacts.length > 0) {
      setImpacts((prev) => [...prev, ...hit.impacts])
    }
    if (resolvePlayerEnemyHits(p, enemiesRef.current, particlesRef.current)) {
      hudDirtyRef.current = true
    }
    updateItems(itemsRef.current, scale)
    const picked = resolveItemPickup(p, itemsRef.current)
    if (picked) {
      const effect = applyItemEffect(picked, p, particlesRef.current)
      scoreRef.current += effect.scoreBonus
      hudDirtyRef.current = true
      setAnnounce({id: nextId(), text: effect.announceText, kind: 'item'})
    }
    updateParticles(particlesRef.current, scale)

    // 사망 체크 — best-score 갱신 포함
    if (p.hp <= 0) {
      phaseRef.current = 'over'
      setPhase('over')
      setScore(scoreRef.current)
      setHpView(0)
      // setState callback 안 side effect 방지 (StrictMode 중복 호출 방지).
      const finalScore = scoreRef.current
      if (finalScore > bestScoreRef.current) {
        bestScoreRef.current = finalScore
        writeBestScore(finalScore)
        setBestScore(finalScore)
      }
    } else if (hudDirtyRef.current) {
      setScore(scoreRef.current)
      setHpView(p.hp)
      hudDirtyRef.current = false
    }
    // 스킬 ready 상태 변화만 HUD 갱신 (매 frame setState 방지)
    const nowReady = p.skillCd <= 0
    if (nowReady !== skillReadyRef.current) {
      skillReadyRef.current = nowReady
      setSkillReady(nowReady)
    }
  }, [])

  // ─── 렌더 (DOM 직접 갱신 — React 재렌더 방지) ─────────────
  const render = useCallback((): void => {
    // 플레이어
    const p = playerRef.current
    if (playerElRef.current) {
      playerElRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`
      playerElRef.current.style.opacity = computePlayerOpacity(p.invuln)
    }
    // 스킬 ring (skillActive > 0 일 때만 보임, 점진 fade out + expand)
    if (skillRingRef.current) {
      if (p.skillActive > 0) {
        const t = 1 - p.skillActive / SKILL_DURATION_FRAMES // 0 → 1
        skillRingRef.current.style.opacity = String(1 - t)
        skillRingRef.current.style.transform = `translate(-50%, -50%) scale(${SKILL_RING_BASE_SCALE + t * SKILL_RING_SCALE_DELTA})`
      } else {
        skillRingRef.current.style.opacity = '0'
      }
    }

    // 적
    syncEntityLayer(enemiesRef.current, enemyElMap.current, enemiesLayerRef.current, (e) => {
      const el = document.createElement('div')
      el.className = e.elite ? 'mg-enemy mg-enemy-elite' : 'mg-enemy'
      el.style.width = `${e.size}px`
      el.style.height = `${e.size}px`
      el.textContent = e.elite ? '魔' : '邪'
      return el
    }, (e, el) => {
      el.style.transform = `translate(${e.x}px, ${e.y}px)`
    })

    // 검기 (총알) — 진행 방향으로 회전, 꼬리 trail
    syncEntityLayer(bulletsRef.current, bulletElMap.current, bulletsLayerRef.current, () => {
      const el = document.createElement('div')
      el.className = 'mg-bullet'
      return el
    }, (b, el) => {
      const angle = Math.atan2(b.dy, b.dx)
      el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${angle}rad)`
    })

    // 아이템 (적보다 먼저 그려서 적이 위로 오게)
    syncEntityLayer(itemsRef.current, itemElMap.current, itemsLayerRef.current, (it) => {
      const el = document.createElement('div')
      el.className = `mg-item mg-item-${it.kind}`
      el.style.width = `${ITEM_SIZE}px`
      el.style.height = `${ITEM_SIZE}px`
      el.textContent = it.kind === 'heart' ? '❤' : '💎'
      return el
    }, (it, el) => {
      el.style.transform = `translate(${it.x}px, ${it.y}px)`
      el.style.opacity = computeItemOpacity(it.life)
    })

    // 파티클
    syncEntityLayer(particlesRef.current, particleElMap.current, particlesLayerRef.current, (q) => {
      const el = document.createElement('div')
      el.className = 'mg-particle'
      el.style.background = q.color
      return el
    }, (q, el) => {
      el.style.transform = `translate(${q.x}px, ${q.y}px)`
      el.style.opacity = `${q.life / q.max}`
    })
  }, [])

  // ─── 게임 시작 안내 — 키보드 Enter 핸들러 (idle / over 화면) ─
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  // autoFocus — 스토리북·외부 마운트 직후 자동 시작 옵션
  useEffect(() => {
    if (autoFocus && phase === 'idle') start()
  }, [autoFocus, phase, start])

  // 공격 플래시 자동 소멸 (CSS animation 끝나는 시점에 맞춰 unmount)
  useEffect(() => {
    if (!flash) return
    const t = globalThis.setTimeout(() => setFlash(null), FLASH_FADE_MS)
    return () => globalThis.clearTimeout(t)
  }, [flash])

  // impact sprite 자동 소멸 — 가장 오래된 것부터 IMPACT_FADE_MS 후 제거.
  useEffect(() => {
    if (impacts.length === 0) return
    const t = globalThis.setTimeout(() => {
      setImpacts((prev) => prev.slice(1))
    }, IMPACT_FADE_MS)
    return () => globalThis.clearTimeout(t)
  }, [impacts])

  // 알림 (wave / elite / item) 자동 소멸
  useEffect(() => {
    if (!announce) return
    const t = globalThis.setTimeout(() => setAnnounce(null), ANNOUNCE_FADE_MS)
    return () => globalThis.clearTimeout(t)
  }, [announce])

  // ─── 화면 ──────────────────────────────────────────────
  const hpFull = '❤️'.repeat(hpView)
  const hpEmpty = '🖤'.repeat(Math.max(0, PLAYER_MAX_HP - hpView))

  return (
    <div className="mini-game">
      <div className="mini-game-frame" ref={frameRefEl}>
        <div
          ref={stageRef}
          className="mini-game-stage"
          tabIndex={0}
          role="application"
          aria-label="검기생존록 — 미니 게임. 방향키 이동, Space 발사, Enter 재시작."
          onPointerDown={onStagePointerDown}
          onPointerMove={onStagePointerMove}
          onPointerUp={onStagePointerUp}
          onPointerCancel={onStagePointerUp}
          onKeyDown={onStageKeyDown}
          onKeyUp={onStageKeyUp}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            keysRef.current.clear()
          }}
        >
          {/* HUD */}
          <div className="mg-hud">
            <span className="mg-hud-score">점수 {score}</span>
            <span className="mg-hud-wave">파상 {wave}</span>
            <span className="mg-hud-hp" aria-label={`체력 ${hpView} / ${PLAYER_MAX_HP}`}>
              {hpFull}<span className="mg-hud-hp-empty">{hpEmpty}</span>
            </span>
          </div>

          {/* 스킬 버튼. 데스크탑 = Shift 키 대안, 모바일 = 주된 트리거.
              onClick 은 모바일에서 down→up 사이 손가락 미세 이동 시 cancel 됨.
              onPointerDown 으로 즉시 발동 + stopPropagation 으로 stage 발사 차단. */}
          {phase === 'playing' && (
            <button
              type="button"
              className={`mg-skill-btn${skillReady ? ' is-ready' : ''}`}
              aria-label={skillReady ? '스킬 검막 — 사용 가능' : '스킬 검막 — 충전 중'}
              onPointerDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
                triggerSkill()
              }}
              tabIndex={-1}
            >
              <span aria-hidden="true">⚔️</span>
            </button>
          )}

          {/* 플레이어 + 스킬 발동 ring */}
          <div
            ref={playerElRef}
            className="mg-player"
            style={{width: PLAYER_SIZE, height: PLAYER_SIZE}}
            aria-hidden="true"
          >
            <span className="mg-player-face">🥋</span>
            <span ref={skillRingRef} className="mg-skill-ring" aria-hidden="true"/>
          </div>

          {/* 엔티티 레이어 (DOM 직접 갱신) */}
          <div ref={itemsLayerRef} className="mg-layer" aria-hidden="true"/>
          <div ref={enemiesLayerRef} className="mg-layer" aria-hidden="true"/>
          <div ref={bulletsLayerRef} className="mg-layer" aria-hidden="true"/>
          <div ref={particlesLayerRef} className="mg-layer" aria-hidden="true"/>

          {/* 알림 (wave 진입 / elite spawn) */}
          {announce && (
            <div key={announce.id} className={`mg-announce mg-announce-${announce.kind}`}
                 aria-live="polite">
              {announce.text}
            </div>
          )}

          {/* 공격 시 검광 슬래시 (sprite mg-slash.webp).
              플레이어 facing 방향으로 회전 = CSS var --mg-flash-angle 로 전달
              (CSS animation 의 transform 안에서 rotate + scaleX 함께 적용). */}
          {flash && (
            <div
              key={flash.id}
              className="mg-flash"
              style={{
                left: flash.x,
                top: flash.y,
                backgroundImage: `url(${SLASH_SPRITE})`,
                ['--mg-flash-angle' as string]: `${flash.angle}rad`,
              }}
              aria-hidden="true"
            />
          )}

          {/* 적 처치 impact (sprite mg-impact-{amber|crimson}.webp) */}
          {impacts.map((it) => (
            <div
              key={it.id}
              className={`mg-impact ${it.elite ? 'mg-impact-elite' : 'mg-impact-normal'}`}
              style={{
                left: it.x,
                top: it.y,
                backgroundImage: `url(${it.elite ? IMPACT_ELITE_SPRITE : IMPACT_NORMAL_SPRITE})`,
              }}
              aria-hidden="true"
            />
          ))}

          {/* 가상 패드 표시 (모바일) */}
          <div ref={padBaseRef} className="mg-pad-base" aria-hidden="true"/>
          <div ref={padDotRef} className="mg-pad-dot" aria-hidden="true"/>

          {/* 오버레이 — idle */}
          {phase === 'idle' && (
            <div className="mg-overlay">
              <div className="mg-overlay-card">
                <h3 className="mg-title">검기생존록</h3>
                <p className="mg-sub">파상의 邪 와 魔 를 베고 살아남으라.</p>
                <ul className="mg-help">
                  <li>이동 — <b>방향키</b> · 좌측 드래그 (모바일)</li>
                  <li>발사 — <b>Space</b> · 우측 탭 (이동 방향)</li>
                  <li>스킬 검막 — <b>Shift</b> · ⚔️ (무적 + 적 밀어내기)</li>
                  <li>재시작 — <b>Enter</b></li>
                </ul>
                {bestScore > 0 && (
                  <p className="mg-best">최고 점수 <b>{bestScore}</b></p>
                )}
                <button
                  type="button"
                  className="mini-game-btn mini-game-btn-primary"
                  onClick={start}
                >시작
                </button>
              </div>
            </div>
          )}

          {/* 오버레이 — 일시정지 (focus 이탈 또는 viewport 밖) */}
          {phase === 'playing' && (!isFocused || !isVisible) && (
            <div className="mg-overlay mg-overlay-pause">
              <div className="mg-overlay-card">
                <p className="mg-paused-tag">일시정지</p>
                <p className="mg-sub">
                  {isVisible
                    ? '게임 영역을 다시 클릭하면 재개됩니다.'
                    : '게임 영역을 화면에 두면 자동 재개됩니다.'}
                </p>
                <button
                  type="button"
                  className="mini-game-btn mini-game-btn-primary"
                  onClick={() => stageRef.current?.focus()}
                >재개
                </button>
              </div>
            </div>
          )}

          {/* 오버레이 — over */}
          {phase === 'over' && (
            <div className="mg-overlay">
              <div className="mg-overlay-card">
                <h3 className="mg-title">생존 실패</h3>
                <p className="mg-sub">베어낸 邪魔 점수 <b>{score}</b> · 파상 <b>{wave}</b></p>
                {bestScore > 0 && (
                  <p className="mg-best">
                    최고 점수 <b>{bestScore}</b>
                    {score === bestScore && score > 0 && <span className="mg-best-new"> 신기록</span>}
                  </p>
                )}
                <button
                  type="button"
                  className="mini-game-btn mini-game-btn-primary"
                  onClick={start}
                >다시하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DOM 동기화 헬퍼 ────────────────────────────────────
function syncEntityLayer<T extends { id: number }>(
  list: T[],
  map: Map<number, HTMLDivElement>,
  layer: HTMLDivElement | null,
  create: (item: T) => HTMLDivElement,
  update: (item: T, el: HTMLDivElement) => void,
): void {
  if (!layer) return
  const alive = new Set<number>()
  for (const item of list) {
    alive.add(item.id)
    let el = map.get(item.id)
    if (!el) {
      el = create(item)
      map.set(item.id, el)
      layer.appendChild(el)
    }
    update(item, el)
  }
  // 죽은 것 제거
  for (const [id, el] of map) {
    if (!alive.has(id)) {
      el.remove()
      map.delete(id)
    }
  }
}
