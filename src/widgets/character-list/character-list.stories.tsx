import type {Meta, StoryObj} from '@storybook/react-vite'
import {MemoryRouter} from 'react-router-dom'
import {CharacterList} from './character-list'
import type {CharacterIndex} from '../../entities/character'

const meta: Meta<typeof CharacterList> = {
  title: 'widgets/등장인물 목록 (CharacterList)',
  component: CharacterList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{maxWidth: 'var(--w-reader, 720px)', padding: 'var(--s-4)'}}>
          <Story/>
        </div>
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof CharacterList>

const sampleCharacters: CharacterIndex[] = [
  {id: 'protag', folder: '1-protagonist', name: '주인공 A', summary: '한 줄 소개 — 죽은 자를 권속으로.'},
  {id: 'support-1', folder: '2-major-supporting', name: '주연 가', summary: '한 줄 소개 — 검을 다루는 동료.'},
  {id: 'support-2', folder: '2-major-supporting', name: '주연 나'},
  {id: 'villain', folder: '3-antagonist', name: '안타고니스트', summary: '한 줄 소개 — 차원을 열어젖힌 자.'},
  {id: 'cameo-1', folder: '4-minor', name: '카메오 1'},
]

export const Empty: Story = {
  args: {slug: 'sample', characters: []},
}

export const ProtagonistOnly: Story = {
  args: {slug: 'sample', characters: [sampleCharacters[0]!]},
}

export const FullRoster: Story = {
  args: {slug: 'sample', characters: sampleCharacters},
}
