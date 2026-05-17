import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { SeriesList } from './series-list'
import type { SeriesIndex } from '../../shared/lib/types'

const meta: Meta<typeof SeriesList> = {
  title: 'widgets/시리즈 목록 (SeriesList)',
  component: SeriesList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 'var(--w-page, 960px)', padding: 'var(--s-4)' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SeriesList>

const sampleItems: SeriesIndex[] = [
  {
    slug: 'sample-a',
    title: '샘플 시리즈 A',
    status: '연재 중',
    started: '2026-05-14',
  },
  {
    slug: 'sample-b',
    title: '샘플 시리즈 B',
    status: 'tba',
  },
]

export const Empty: Story = {
  args: { items: [] },
}

export const Single: Story = {
  args: { items: [sampleItems[0]!] },
}

export const Multiple: Story = {
  args: { items: sampleItems },
}
