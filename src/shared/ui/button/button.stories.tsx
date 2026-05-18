// © 2026 홍도산. All rights reserved. Original creator work.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'shared/ui/버튼 (Button)',
  component: Button,
  args: { children: '버튼' },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary', children: '잠금 해제' } }
export const Secondary: Story = { args: { variant: 'secondary', children: '취소' } }
export const Ghost: Story = { args: { variant: 'ghost', children: '메뉴' } }
export const Small: Story = { args: { variant: 'primary', size: 'sm', children: '작게' } }
export const Disabled: Story = { args: { variant: 'primary', disabled: true, children: '비활성' } }
