import type {Meta, StoryObj} from '@storybook/react'
import {expect, userEvent, within} from '@storybook/test'
import {AuthorModeToggle} from './author-mode-toggle'
import {setAuthorMode} from '../../shared/lib/env.js'

const meta: Meta<typeof AuthorModeToggle> = {
  title: 'widgets/작가 모드 토글',
  component: AuthorModeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '헤더 자물쇠 SVG 아이콘 + native `<dialog>` 모달. 잠긴 상태 = 스포일러 주의 + 본인 책임 + 키 입력 (눈 토글). 활성 상태 = 노출 안내 + 잠그기.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof AuthorModeToggle>

export const Locked: Story = {
  name: '잠금 상태 (기본)',
  decorators: [
    (Story) => {
      setAuthorMode(false)
      return <Story />
    },
  ],
}

export const Unlocked: Story = {
  name: '활성 상태 (AUTHOR 모드)',
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

export const OpenedDialog: Story = {
  name: '다이얼로그 열림 (잠금 → 키 입력 폼)',
  decorators: [
    (Story) => {
      setAuthorMode(false)
      return <Story />
    },
  ],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {name: /작가 모드 진입/i})
    await userEvent.click(button)
    // native <dialog> 는 body 직접 렌더 — document 에서 검색
    const dialog = document.querySelector('dialog')
    await expect(dialog).not.toBeNull()
    const title = document.querySelector('#author-mode-dialog-title')
    await expect(title?.textContent).toBe('작가 모드 진입')
    const input = document.querySelector('#author-mode-key')
    await expect(input).not.toBeNull()
  },
}
