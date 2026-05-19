// © 2026 홍도산. All rights reserved. Original creator work.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty } from './empty'

const meta: Meta<typeof Empty> = {
  title: 'atoms/빈 상태 (Empty)',
  component: Empty,
}
export default meta

type Story = StoryObj<typeof Empty>

export const Default: Story = {
  args: { children: '아직 등록된 항목이 없습니다.' },
}

export const Error: Story = {
  args: { children: '오류: 데이터를 불러올 수 없습니다.' },
}

export const Long: Story = {
  args: {
    children: '본 시리즈는 아직 등록된 챕터가 없습니다. 작품 진행에 따라 챕터가 순차적으로 추가됩니다. 작가가 직접 발행 시점을 결정합니다.',
  },
}
