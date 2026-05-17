import type { Meta, StoryObj } from '@storybook/react'
import { MiniGame } from './swordsman-survival'

// 검기생존록 — swordsman-survival 슬라이스 시연.
// 시연 한계 = 실제 RAF 루프·키보드/포인터 입력은 storybook 환경에서도 동작하나
// (1) 시각 효과(sprite·gradient) 는 환경 폰트·다크 모드에 영향
// (2) 가상 패드는 터치 환경에서만 자연스러움 — 데스크탑 마우스로도 동작은 함
// (3) Default 스토리는 idle 상태로 시작. AutoStart 스토리는 마운트 직후 시작.
const meta: Meta<typeof MiniGame> = {
  title: 'features/mini-game/검기생존록',
  component: MiniGame,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(360px, 100%)', height: 640, padding: 'var(--s-4)' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MiniGame>

// 시작 화면 (idle 오버레이 노출).
export const Default: Story = {}

// 마운트 직후 자동 시작 — 게임 화면 시연.
export const AutoStart: Story = {
  args: { autoFocus: true },
}

// 좁은 박스 — 모바일 환경 fit 시연.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 280, padding: 'var(--s-2)' }}>
        <Story />
      </div>
    ),
  ],
}

// 어두운 배경 — 다크모드 환경 시연.
export const DarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
