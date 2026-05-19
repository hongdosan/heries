import type {Meta, StoryObj} from '@storybook/react-vite'
import {MemoryRouter} from 'react-router-dom'
import {HeaderBrand} from './header-brand'

const meta: Meta<typeof HeaderBrand> = {
  title: 'molecules/헤더 브랜드 (HeaderBrand)',
  component: HeaderBrand,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'heries-mark.webp 마크 (Vite ?url import) + H-eries 로고 + 부제. 마크가 "H" 자리에 위치하는 시각 트릭 ([mark]eries = Heries). aria-label "H-eries 홈" 으로 스크린리더 의미 보존.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof HeaderBrand>

export const Default: Story = {
  name: '기본 (마크 + 로고 + 부제)',
}

export const InDarkBackground: Story = {
  name: '다크 배경',
  globals: {
    backgrounds: {
      value: "dark"
    }
  },
}

export const InSunkenBackground: Story = {
  name: 'sunken 배경',
  globals: {
    backgrounds: {
      value: "sunken"
    }
  },
}
