import type { Meta, StoryObj } from '@storybook/react-vite'
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
  globals: {
    backgrounds: {
      value: "dark"
    }
  },
}

export const InSunkenBackground: Story = {
  globals: {
    backgrounds: {
      value: "sunken"
    }
  },
}
