import type {Meta, StoryObj} from '@storybook/react-vite'
import {MemoryRouter} from 'react-router-dom'
import {HeaderNav} from './header-nav'

const meta: Meta<typeof HeaderNav> = {
  title: 'organisms/헤더 내비 (HeaderNav)',
  component: HeaderNav,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '헤더 중앙/우측 nav — *시리즈* / *소개* 텍스트 링크. 활성 라우트 = text-fg + font-semibold. 모바일 (`sm` 미만) = hidden.',
      },
    },
  },
  decorators: [
    (Story) => <MemoryRouter><Story/></MemoryRouter>,
  ],
}
export default meta

type Story = StoryObj<typeof HeaderNav>

export const Default: Story = {
  name: '기본',
}

export const SeriesActive: Story = {
  name: '시리즈 활성',
  decorators: [
    (Story) => <MemoryRouter initialEntries={['/series']}><Story/></MemoryRouter>,
  ],
}

export const AboutActive: Story = {
  name: '소개 활성',
  decorators: [
    (Story) => <MemoryRouter initialEntries={['/about']}><Story/></MemoryRouter>,
  ],
}
