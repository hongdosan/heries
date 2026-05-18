import type {Meta, StoryObj} from '@storybook/react-vite'
import {MemoryRouter} from 'react-router-dom'
import {LockedCharacterCard} from './locked-character-card'

const meta: Meta<typeof LockedCharacterCard> = {
  title: 'pages/character/LockedCharacterCard',
  component: LockedCharacterCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story/>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '작가 모드 OFF reader 가 비-주인공 카드 진입 시 노출되는 잠긴 페이지. 등장인물 목록으로 / 작가 모드 잠금 해제 2 CTA.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof LockedCharacterCard>

const MAIN_CLS = 'flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9'

export const Supporting: Story = {
  name: '주연 (우선아)',
  args: {
    slug: 'clash-of-multiverses',
    manifestTitle: '차원 격돌',
    folderLabel: '주연',
    mainClassName: MAIN_CLS,
  },
}

export const Antagonist: Story = {
  name: '빌런·멘토',
  args: {
    slug: 'clash-of-multiverses',
    manifestTitle: '차원 격돌',
    folderLabel: '빌런·멘토',
    mainClassName: MAIN_CLS,
  },
}

export const Minor: Story = {
  name: '단역·카메오',
  args: {
    slug: 'clash-of-multiverses',
    manifestTitle: '차원 격돌',
    folderLabel: '단역·카메오',
    mainClassName: MAIN_CLS,
  },
}
