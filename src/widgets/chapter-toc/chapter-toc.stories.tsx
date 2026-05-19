import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { ChapterToc } from './chapter-toc'
import type {ChapterIndex} from '../../entities/chapter'

const meta: Meta<typeof ChapterToc> = {
  title: 'organisms/챕터 목차 (ChapterToc)',
  component: ChapterToc,
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

type Story = StoryObj<typeof ChapterToc>

const sampleChapters: ChapterIndex[] = [
  { episode: 1, slug: 'ep-01', title: '프롤로그', published: '2026-05-14' },
  { episode: 2, slug: 'ep-02', title: '두 번째 한 합', published: '2026-05-16' },
  { episode: 3, slug: 'ep-03', title: '첫 격돌', published: '2026-05-18' },
]

export const Empty: Story = {
  args: { slug: 'sample', chapters: [] },
}

export const ThreeChapters: Story = {
  args: { slug: 'sample', chapters: sampleChapters },
}

export const SingleChapter: Story = {
  args: { slug: 'sample', chapters: [sampleChapters[0]!] },
}
