import type {Meta, StoryObj} from '@storybook/react-vite'
import {MemoryRouter} from 'react-router-dom'
import {HomeHero} from './home-hero'

const meta: Meta<typeof HomeHero> = {
  title: 'organisms/홈 히어로 (HomeHero)',
  component: HomeHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '홈 페이지 히어로 — *H-eries · Multi-verse Collection* 캡션 + 큰 헤드라인 *서로 다른 세계가 / 하나의 상상으로 연결됩니다.* + 부제 2줄 + *시리즈 보러 가기* CTA (검정 둥근 버튼) + *H-eries 소개* 보조 링크. 헤드라인 = clamp(36px, 6vw, 72px).',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-page mx-auto px-[clamp(16px,4vw,32px)]">
          <Story/>
        </div>
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof HomeHero>

export const Default: Story = {
  name: '기본',
}

export const InDarkBackground: Story = {
  name: '다크 배경',
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
}
