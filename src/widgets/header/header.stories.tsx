import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './header'

const meta: Meta<typeof Header> = {
  title: 'organisms/헤더 (Header)',
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
