// © 2026 홍도산. All rights reserved. Original creator work.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorBoundary } from './error-boundary'

/**
 * `ErrorBoundary` 는 React 19 Class Component 로, 자식 트리에서 throw 된 동기 예외를
 * catch 하여 fallback UI 로 격리한다.
 *
 * fallback 분기:
 *   - dev (`import.meta.env.DEV === true`) → 에러 메시지 + stack + componentStack
 *   - production (`import.meta.env.DEV === false`) → generic "문제가 발생했습니다"
 *
 * Storybook dev 서버는 항상 `DEV=true` 이므로, production fallback 케이스는 동일한
 * 마크업을 직접 정적 렌더해 시연한다 (실제 컴포넌트 동작과 1:1 매칭되도록 CSS 클래스
 * 동기화 유지).
 */
const meta: Meta<typeof ErrorBoundary> = {
  title: 'shared/ui/에러 경계 (ErrorBoundary)',
  component: ErrorBoundary,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof ErrorBoundary>

const Throw = ({ message }: { message: string }): never => {
  throw new Error(message)
}

/** 정상 children — fallback 미발동, 자식이 그대로 렌더된다. */
export const Normal: Story = {
  args: {
    children: (
      <main style={{ padding: 'var(--s-6)' }}>
        <p>모든 것이 정상입니다.</p>
      </main>
    ),
  },
}

/**
 * Dev fallback — 의도된 throw 로 fallback UI 발동.
 * Storybook 은 dev 환경이므로 error.message + stack + component stack 이 노출된다.
 */
export const DevFallback: Story = {
  args: {
    children: <Throw message="의도적 예외 — dev fallback 시연" />,
  },
}

/**
 * Production fallback — 정적 시연.
 * Storybook 환경에서는 `import.meta.env.DEV` 를 false 로 강제할 방법이 없어,
 * `ErrorBoundary` 의 production 분기 마크업을 동일 클래스명으로 직접 렌더한다.
 * 실제 컴포넌트와 CSS·구조를 1:1 동기화해 마크업 변경 시 본 스토리도 함께 갱신.
 */
export const ProductionFallback: Story = {
  render: () => (
    <main className="error-boundary" role="alert">
      <div className="error-boundary-card">
        <p className="error-boundary-eyebrow">ERROR</p>
        <h1 className="error-boundary-title">문제가 발생했습니다</h1>
        <p className="error-boundary-desc">
          페이지를 표시하는 도중 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해
          주세요.
        </p>
        <div className="error-boundary-actions">
          <button type="button" className="error-boundary-btn primary">
            다시 시도
          </button>
          <button type="button" className="error-boundary-btn">
            홈으로
          </button>
        </div>
      </div>
    </main>
  ),
}
