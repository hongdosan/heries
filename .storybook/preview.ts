import type { Preview } from '@storybook/react'
import '../src/shared/styles/tokens.css'
import '../src/shared/styles/base.css'
import '../src/shared/styles/typography.css'
import '../src/shared/styles/layout.css'
import '../src/shared/styles/utilities.css'
import '../src/shared/styles/author-mode.css'
import '../src/shared/styles/responsive.css'

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
