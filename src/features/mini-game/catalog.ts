import type { ComponentType } from 'react'

// 미니 게임 카탈로그 — SSOT.
// 새 게임 추가 = 본 배열에 1 entry + games/{slug}/ 폴더만 추가.
// launcher 가 본 배열을 기반으로 게임 목록 / 선택 UI / dialog 마운트 결정.

export interface MiniGameDefinition {
  /** URL-safe slug. catalog 안 중복 X. */
  readonly id: string
  /** 사용자에게 보일 게임 제목. dialog 헤더에 노출. */
  readonly title: string
  /** 게임 한 줄 설명. launcher 선택 화면 (게임 ≥ 2 일 때) 에 노출. */
  readonly description?: string
  /** 트리거 / 카드 emoji. */
  readonly emoji: string
  /** 게임 본체 컴포넌트. autoFocus 등 prop 은 자유. */
  readonly component: ComponentType<{ readonly autoFocus?: boolean }>
}

// 동적 import 방지 = 카탈로그 자체가 SSOT. 새 게임 추가 시 import 1줄 +
// 배열 1 entry. launcher 는 본 배열만 알고 게임 내부는 모름 (FSD 정합).
import { SwordsmanSurvival } from './games/swordsman-survival'

export const MINI_GAMES: ReadonlyArray<MiniGameDefinition> = [
  {
    id: 'swordsman-survival',
    title: '검기생존록',
    description: '파상의 邪 와 魔 를 베고 살아남으라.',
    emoji: '⚔️',
    component: SwordsmanSurvival,
  },
]

export function findGame(id: string): MiniGameDefinition | undefined {
  return MINI_GAMES.find((g) => g.id === id)
}
