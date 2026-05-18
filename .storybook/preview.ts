import type { Preview } from '@storybook/react-vite'
// 사이트 전역 토큰·base·typography·layout·utilities·author-mode·responsive
import '../src/shared/styles/tokens.css'
import '../src/shared/styles/tailwind.css'
import '../src/shared/styles/base.css'
import '../src/shared/styles/typography.css'
import '../src/shared/styles/layout.css'
import '../src/shared/styles/utilities.css'
import '../src/shared/styles/author-mode.css'
import '../src/shared/styles/responsive.css'
// 슬라이스별 css — stories.tsx 가 컴포넌트 직접 import 시 css 누락 방지.
// 사이트는 각 슬라이스 index.ts 가 자기 css 를 import 하지만, stories 가
// `./{slice}` (파일 직접) 패턴이면 index 우회 → preview 에서 보강.
// 마이그레이션 완료된 슬라이스 (Tailwind only) 는 본 import 에서 제외.
import '../src/features/mini-game/mini-game.css'
// chapter-toc / character-list / series-list = Tailwind 전환 완료 — page css 의존 X.

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        surface: { name: 'surface', value: '#ffffff' },
        sunken: { name: 'sunken', value: '#efefec' },
        dark: { name: 'dark', value: '#111114' }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'surface'
    }
  }
}

export default preview
