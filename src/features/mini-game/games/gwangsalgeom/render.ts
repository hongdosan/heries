// © 2026 홍도산. All rights reserved. Original creator work.
// 광살검 entity DOM 직접 렌더 — React 외부, RAF tick 마다 호출.
// 검기생존록 syncEntityLayer 패턴 정합. React reconciliation 우회 (frame 당 commit 0).

import {
  ENEMY_W, ENEMY_H,
  EFFECT_IMPACT_SIZE, EFFECT_DEATH_SIZE,
} from './constants.js'
import type {Effect, Enemy, Particle, Player, Wave} from './types.js'

// SPRITE_HERO 는 외부 노출 — gwangsalgeom.tsx JSX 가 player img 초기 src 로 사용 (broken icon 회피).
import SPRITE_HERO from '../../../../shared/images/mini-game/stickman-murim/hero.webp?url'
export {SPRITE_HERO}
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
// qi.webp 부재 — dash-burst.webp 가 plasma 잔상 결로 적합, 장풍에 임시 alias.
import SPRITE_QI from '../../../../shared/images/mini-game/stickman-murim/dash-burst.webp?url'

type HeroSpriteKind = 'idle' | 'attack' | 'qi' | 'dash'

// sprite src 우선순위: dashing > qiCasting > attacking > idle.
function pickHeroSpriteKind(p: Player): HeroSpriteKind {
  if (p.dashing > 0) return 'dash'
  if (p.qiCasting > 0) return 'qi'
  if (p.attacking > 0) return 'attack'
  return 'idle'
}

const HERO_SPRITE_BY_KIND: Record<HeroSpriteKind, string> = {
  idle: SPRITE_HERO,
  attack: SPRITE_HERO_ATTACK,
  qi: SPRITE_HERO_QI,
  dash: SPRITE_HERO_DASH,
}

/**
 * 검기생존록 정합 syncEntityLayer.
 * - alive id 추적 → 신규 entity create + append, 기존 entity update, 죽은 entity remove.
 * - layer null 시 no-op (마운트 직전 안전).
 * - frame 당 alloc = (신규 entity 수만큼 element). 평소 0.
 */
export function syncEntityLayer<T extends {id: number}>(
  list: readonly T[],
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
  for (const [id, el] of map) {
    if (!alive.has(id)) {
      el.remove()
      map.delete(id)
    }
  }
}

// ─── 개별 entity create / update 헬퍼 ─────────────────────

// createPlayerEl 폐기 — JSX 가 outer div + 자식 img 정적 생성 (gwangsalgeom.tsx). updatePlayerEl 만 사용.

/** 플레이어 갱신 — sprite swap + transform + 상태 class. phase==='playing' 외에는 hurt/invuln class X. */
export function updatePlayerEl(el: HTMLDivElement, p: Player, phasePlaying: boolean): void {
  const isRight = p.dir > 0
  el.style.transform = `translate(${p.x}px, ${p.y}px)${isRight ? '' : ' scaleX(-1)'}`
  // class 토글 — DOMTokenList 직접 (string concat alloc 회피).
  const cl = el.classList
  cl.toggle('sm-stickman-hurt', p.hurtFlash > 0 && phasePlaying)
  cl.toggle('sm-stickman-attacking', p.attacking > 0)
  cl.toggle('sm-stickman-dashing', p.dashing > 0)
  cl.toggle('sm-stickman-invuln', p.invuln > 0 && !(p.hurtFlash > 0) && phasePlaying)
  // sprite swap — kind 캐시 (dataset). dev/hash 없는 환경에서도 견고. 변경 시만 .src 쓰기.
  const img = el.firstElementChild as HTMLImageElement | null
  if (img) {
    const kind = pickHeroSpriteKind(p)
    if (el.dataset['sprite'] !== kind) {
      el.dataset['sprite'] = kind
      img.src = HERO_SPRITE_BY_KIND[kind]
    }
  }
}

export function createEnemyEl(e: Enemy): HTMLDivElement {
  const el = document.createElement('div')
  el.className = e.elite ? 'sm-enemy sm-enemy-elite' : 'sm-enemy'
  el.style.width = `${ENEMY_W}px`
  el.style.height = `${ENEMY_H}px`
  const img = document.createElement('img')
  img.className = 'sm-sprite'
  img.draggable = false
  img.alt = ''
  img.src = e.elite ? SPRITE_ELITE : SPRITE_ASSASSIN
  img.style.transform = 'translateX(-50%)'
  el.appendChild(img)
  if (e.maxHp > 1) {
    const hp = document.createElement('div')
    hp.className = 'sm-enemy-hp'
    const fill = document.createElement('div')
    fill.className = 'sm-enemy-hp-fill'
    fill.style.width = '100%'
    hp.appendChild(fill)
    el.appendChild(hp)
  }
  return el
}

export function updateEnemyEl(e: Enemy, el: HTMLDivElement): void {
  const isRight = e.dir > 0
  el.style.transform = `translate(${e.x}px, ${e.y}px)${isRight ? '' : ' scaleX(-1)'}`
  el.classList.toggle('sm-enemy-stun', e.hitStun > 0)
  if (e.maxHp > 1) {
    const hp = el.lastElementChild as HTMLDivElement | null
    const fill = hp?.firstElementChild as HTMLDivElement | null
    if (fill) fill.style.width = `${(e.hp / e.maxHp) * 100}%`
  }
}

export function createWaveEl(): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'sm-wave'
  const img = document.createElement('img')
  img.className = 'sm-sprite'
  img.draggable = false
  img.alt = ''
  img.src = SPRITE_QI
  el.appendChild(img)
  return el
}

export function updateWaveEl(w: Wave, el: HTMLDivElement): void {
  el.style.left = `${w.x}px`
  el.style.top = `${w.y}px`
  el.style.width = `${w.w}px`
  el.style.height = `${w.h}px`
  const img = el.firstElementChild as HTMLImageElement | null
  if (img) img.style.transform = w.vx < 0 ? 'scaleX(-1)' : ''
}

export function createParticleEl(p: Particle): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'sm-particle'
  el.style.width = `${p.size}px`
  el.style.height = `${p.size}px`
  el.style.background = p.color
  return el
}

export function updateParticleEl(p: Particle, el: HTMLDivElement): void {
  el.style.left = `${p.x}px`
  el.style.top = `${p.y}px`
  el.style.opacity = `${p.life / p.max}`
}

function pickEffectSprite(kind: Effect['kind']): string {
  if (kind === 'death') return SPRITE_DEATH
  if (kind === 'impact-elite') return SPRITE_IMPACT_ELITE
  return SPRITE_IMPACT
}

export function createEffectEl(e: Effect): HTMLDivElement {
  // img element 를 layer 에 직접 append. div wrapper 없이 img 만 (DOM 노드 절감).
  // 단 syncEntityLayer 가 HTMLDivElement 타입이라 div wrapper 유지 (interface 통일).
  const el = document.createElement('div')
  el.className = 'sm-effect'
  const img = document.createElement('img')
  img.className = 'sm-sprite'
  img.draggable = false
  img.alt = ''
  img.src = pickEffectSprite(e.kind)
  el.appendChild(img)
  return el
}

export function updateEffectEl(e: Effect, el: HTMLDivElement): void {
  const size = e.kind === 'death' ? EFFECT_DEATH_SIZE : EFFECT_IMPACT_SIZE
  el.style.left = `${e.x - size / 2}px`
  el.style.top = `${e.y - size / 2}px`
  el.style.width = `${size}px`
  el.style.height = `${size}px`
  el.style.opacity = `${e.life / e.max}`
  el.style.transform = e.flipped ? 'scaleX(-1)' : ''
}
