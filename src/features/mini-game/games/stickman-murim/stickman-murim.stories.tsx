import type {Meta, StoryObj} from '@storybook/react'
import {StickmanMurim} from './stickman-murim'

// 광살검 (stickman-murim 슬라이스) — 가로 진행 검술·장풍·이형환위 액션 시연.
// 시연 한계 = 실제 RAF 루프·키보드/포인터 입력은 storybook 환경에서도 동작하나
// (1) 시각 효과 (gradient·vignette·peril pulse) 는 환경 폰트·다크 모드에 영향
// (2) 가상 패드는 터치 환경에서만 자연스러움 — 데스크탑 마우스로도 동작은 함
// (3) Default 스토리는 idle 상태로 시작. AutoStart 스토리는 마운트 직후 자동 focus.
const meta: Meta<typeof StickmanMurim> = {
  title: 'features/mini-game/StickmanMurim',
  component: StickmanMurim,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{width: 'min(820px, 100%)', height: 480, padding: 'var(--s-4)'}}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof StickmanMurim>

// 시작 화면 (idle 오버레이 노출).
export const Default: Story = {}

// 마운트 직후 stage focus — 키보드 입력 즉시 가능.
export const AutoStart: Story = {
  args: {autoFocus: true},
}

// 좁은 박스 — 모바일 환경 fit 시연 (가상 패드 노출).
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{width: 320, height: 460, padding: 'var(--s-2)'}}>
        <Story />
      </div>
    ),
  ],
}
