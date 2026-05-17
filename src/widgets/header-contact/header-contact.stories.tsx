import type {Meta, StoryObj} from '@storybook/react'
import {HeaderContact} from './header-contact'

const meta: Meta<typeof HeaderContact> = {
  title: 'widgets/작가 문의',
  component: HeaderContact,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '메일 SVG 버튼 + 다이얼로그 확인창 (안내 + 이메일 표시 + Copy/Check SVG 토글 + 메일 보내기). 즉시 mailto 트리거 X (실수 클릭 보호).',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof HeaderContact>

export const Default: Story = {
  name: '기본 (버튼)',
}

export const InDarkBackground: Story = {
  name: '다크 배경',
  parameters: {
    backgrounds: {default: 'dark'},
  },
}

export const InSunkenBackground: Story = {
  name: 'sunken 배경',
  parameters: {
    backgrounds: {default: 'sunken'},
  },
}
