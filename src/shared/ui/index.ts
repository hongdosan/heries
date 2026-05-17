// © 2026 홍도산. All rights reserved. Original creator work.
// shared/ui barrel — 슬라이스 외부에서 `from '../shared/ui'` 단일 import 가능.
// 단 슬라이스 격리 (FSD 정책 #4) = 본 barrel 은 개별 import 와 동치 (개별 슬라이스의 index.ts 가 Public API).
export { Button, type ButtonProps } from './button/index.js'
export { Empty, type EmptyProps } from './empty/index.js'
export { ErrorBoundary } from './error-boundary/index.js'
export { Loading, type LoadingProps } from './loading/index.js'
