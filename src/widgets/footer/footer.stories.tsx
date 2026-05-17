import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './footer'

const meta: Meta<typeof Footer> = {
  title: 'widgets/푸터',
  component: Footer,
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

type Story = StoryObj<typeof Footer>

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
