import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './header'

const meta: Meta<typeof Header> = {
  title: 'widgets/헤더',
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {}

export const InDarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const InSunkenBackground: Story = {
  parameters: {
    backgrounds: { default: 'sunken' },
  },
}
