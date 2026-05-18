import type {Meta, StoryObj} from '@storybook/react-vite'
import {ChapterOutline} from './chapter-outline'

const meta: Meta<typeof ChapterOutline> = {
  title: 'pages/chapter/ChapterOutline',
  component: ChapterOutline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '챕터 본문 안 h2 anchor 자동 추출 목차. 2 절 미만이면 렌더 X. `<details>` collapsible.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof ChapterOutline>

const sampleBody = (sections: string[]): string =>
  sections.map((s, i) => `<h2 id="${i + 1}-${s}">${i + 1}. ${s}</h2><p>본문 ${s} ...</p>`).join('\n')

export const FourSections: Story = {
  name: '4 절 (ep-04 자대 정합)',
  args: {bodyHtml: sampleBody(['수료', '자대 도착', '동기', '첫 출동 명령'])},
}

export const TwoSections: Story = {
  name: '2 절 (최소 렌더 임계)',
  args: {bodyHtml: sampleBody(['프롤로그', '에필로그'])},
}

export const SingleSection: Story = {
  name: '1 절 (렌더 X — null 반환)',
  args: {bodyHtml: sampleBody(['단일 절'])},
}
