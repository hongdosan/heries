import type { Preview } from '@storybook/react'
// 사이트 전역 토큰·base·typography·layout·utilities·author-mode·responsive
import '../src/shared/styles/tokens.css'
import '../src/shared/styles/base.css'
import '../src/shared/styles/typography.css'
import '../src/shared/styles/layout.css'
import '../src/shared/styles/utilities.css'
import '../src/shared/styles/author-mode.css'
import '../src/shared/styles/responsive.css'
// 슬라이스별 css — stories.tsx 가 컴포넌트 직접 import 시 css 누락 회피.
// 사이트는 각 슬라이스 index.ts 가 자기 css 를 import 하지만, stories 가
// `./{slice}` (파일 직접) 패턴이면 index 우회 → preview 에서 보강.
import '../src/widgets/header/header.css'
import '../src/widgets/footer/footer.css'
import '../src/shared/ui/error-boundary/error-boundary.css'
import '../src/features/mini-game/mini-game.css'
// chapter-toc / character-list / series-list 의 룰은 page 슬라이스 css
// 에 정의돼있어 storybook 시연 시 함께 import.
import '../src/pages/home/home.css'
import '../src/pages/series/series.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#ffffff' },
        { name: 'sunken', value: '#efefec' },
        { name: 'dark', value: '#111114' },
      ],
    },
  },
}

export default preview
