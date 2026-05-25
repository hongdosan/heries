// © 2026 홍도산. All rights reserved. Original creator work.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loading } from './loading'

const meta: Meta<typeof Loading> = {
  title: 'atoms/로딩 (Loading)',
  component: Loading,
}
export default meta

type Story = StoryObj<typeof Loading>

export const Default: Story = {}

export const Custom: Story = {
  args: { children: '이미지 압축 중…' },
}

export const ShortLabel: Story = {
  args: { children: '잠시만…' },
}
