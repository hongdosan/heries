import type {Meta, StoryObj} from '@storybook/react'
import {HeaderActions} from './header-actions'
import {setAuthorMode} from '../../shared/lib/env.js'

const meta: Meta<typeof HeaderActions> = {
  title: 'widgets/헤더 액션 그룹',
  component: HeaderActions,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'AuthorMode + Contact + Theme 3 토글 그룹 wrapper. 미니멀 (배경/border 없음, gap-1, items-center).',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof HeaderActions>

export const Locked: Story = {
  name: '잠금 상태 (기본)',
  decorators: [
    (Story) => {
      setAuthorMode(false)
      return <Story />
    },
  ],
}

export const AuthorMode: Story = {
  name: '작가 모드 활성',
  decorators: [
    (Story) => {
      setAuthorMode(true)
      return <Story />
    },
  ],
}

export const InDarkBackground: Story = {
  name: '다크 배경',
  parameters: {
    backgrounds: {default: 'dark'},
  },
  decorators: [
    (Story) => {
      setAuthorMode(false)
      return <Story />
    },
  ],
}
