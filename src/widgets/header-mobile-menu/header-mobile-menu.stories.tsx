import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {MemoryRouter} from 'react-router-dom'
import {HeaderMobileMenu} from './header-mobile-menu'

const meta: Meta<typeof HeaderMobileMenu> = {
  title: 'organisms/모바일 메뉴 (HeaderMobileMenu)',
  component: HeaderMobileMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '햄버거 버튼 (Lucide menu SVG, sm 미만 노출) + native `<dialog>` 시트. 시트 안 *시리즈* / *소개* NavLink + close 버튼 (X SVG). 라우트 변경 자동 close.',
      },
    },
    viewport: {defaultViewport: 'mobile1'},
  },
  decorators: [
    (Story) => <MemoryRouter><Story/></MemoryRouter>,
  ],
}
export default meta

type Story = StoryObj<typeof HeaderMobileMenu>

export const Default: Story = {
  name: '기본 (햄버거 버튼)',
}

export const OpenedSheet: Story = {
  name: '시트 열림 (시리즈 + 소개)',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {name: /메뉴 열기/i})
    await userEvent.click(button)
    const dialog = document.querySelector('dialog')
    await expect(dialog).not.toBeNull()
    const title = document.querySelector('#header-mobile-menu-title')
    await expect(title?.textContent).toBe('메뉴')
  },
}
