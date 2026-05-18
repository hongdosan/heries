import type {Meta, StoryObj} from '@storybook/react-vite'
import {ThemeToggle} from './theme-toggle'
import {setTheme} from '../../shared/lib/theme.js'

const meta: Meta<typeof ThemeToggle> = {
  title: 'widgets/테마 토글',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '클릭 시 `auto → light → dark` 순환. Lucide-style SVG (monitor/sun/moon) 18px stroke 2. localStorage 영속 + DOM data-theme 즉시 반영.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof ThemeToggle>

export const Auto: Story = {
  name: 'auto (시스템 — monitor)',
  decorators: [
    (Story) => {
      setTheme('auto')
      return <Story />
    },
  ],
}

export const Light: Story = {
  name: 'light (sun)',
  decorators: [
    (Story) => {
      setTheme('light')
      return <Story />
    },
  ],
}

export const Dark: Story = {
  name: 'dark (moon)',
  decorators: [
    (Story) => {
      setTheme('dark')
      return <Story />
    },
  ],
}
