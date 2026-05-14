import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { CharacterList } from './character-list'
import type { CharacterIndex } from '../../shared/lib/types'

const meta: Meta<typeof CharacterList> = {
  title: 'widgets/CharacterList',
  component: CharacterList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 'var(--w-reader, 720px)', padding: 'var(--s-4)' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof CharacterList>

const sampleCharacters: CharacterIndex[] = [
  { id: 'protag', folder: '1-protagonist', name: '주인공 A' },
  { id: 'support-1', folder: '2-major-supporting', name: '주연 가' },
  { id: 'support-2', folder: '2-major-supporting', name: '주연 나' },
  { id: 'villain', folder: '3-antagonist', name: '안타고니스트' },
  { id: 'cameo-1', folder: '4-minor', name: '카메오 1' },
]

export const Empty: Story = {
  args: { slug: 'sample', characters: [] },
}

export const ProtagonistOnly: Story = {
  args: { slug: 'sample', characters: [sampleCharacters[0]!] },
}

export const FullRoster: Story = {
  args: { slug: 'sample', characters: sampleCharacters },
}
