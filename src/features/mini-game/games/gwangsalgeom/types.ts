// © 2026 홍도산. All rights reserved. Original creator work.
// 광살검 (Gwangsalgeom) 게임 데이터 모델 타입 정의.
// 게임 상태 / 엔티티 / UX 분류 — 12 종.
// 컴포넌트 props (GwangsalgeomProps / StickmanViewProps / EnemyViewProps) 는 gwangsalgeom.tsx 본 파일 안 (SoC 정합).

export interface Player {
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

export interface Enemy {
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

export interface Wave {
  id: number
  x: number
  y: number
  w: number
  h: number
  vx: number
  life: number
  hitIds: Set<number>           // 본 wave 가 이미 hit 한 적 (중복 차단). in-place .add (per-hit Set alloc 회피)
}

export type JudgeTone = 'cyan' | 'red' | 'amber' | 'violet' | 'stone'

export interface Judge {
  id: number
  text: string
  tone: JudgeTone
}

export interface KeysHeld {
  left: boolean
  right: boolean
}

export interface Particle {
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

export type EffectKind = 'impact' | 'impact-elite' | 'death'

export interface Effect {
  id: number
  kind: EffectKind
  x: number
  y: number
  life: number
  max: number
  flipped: boolean      // 왼쪽 hit 시 sprite 좌우 반전
}

export type Phase = 'idle' | 'playing' | 'over'

export interface View {
  width: number
  height: number
  scale: number
  isDesktop: boolean
}

export type ActionKey = 'left' | 'right' | 'slash' | 'qi' | 'dash' | 'enter'
