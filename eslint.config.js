// ESLint 9 flat config — React 19 + TypeScript + React Compiler.
// 본 프로젝트는 *dev 도구* 만 (런타임 의존 0 정책 유지).
// 주 목적 = react-compiler 호환 규칙 검증 + react-hooks 규칙 + 기본 TS 규칙.
//
// 실행: npm run lint
// 자동 정정 가능 룰: npm run lint -- --fix

import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

// NOTE: eslint-plugin-react-compiler (rc) = 2026-05 시점에 zod-validation-error
// 호환성 버그로 ESLint 실행 자체 실패. 안정 버전 출시 시 재도입.
// babel-plugin-react-compiler 는 정상 작동 — RC 코드 변환은 영향 0.

export default [
  {
    // 검사 범위 — src/ 만. content/·scripts/·dist/ 등 제외.
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        globalThis: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        HTMLDialogElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLImageElement: 'readonly',
        TouchEvent: 'readonly',
        Node: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // React Hooks 규칙 (RC 와 별개로 hooks 호출 순서·deps array 검증).
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 미사용 변수 — TS 가 이미 잡지만 ESLint 도 일관 검증.
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // 본 프로젝트는 React 17+ 의 new JSX transform — React import 강제 X.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',  // TS 가 prop 검증
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/self-closing-comp': 'warn',

      // 코드 품질 — 정책 #5 strict 정합.
      'eqeqeq': ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-unused-expressions': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: { version: '19' },
    },
  },
  // FSD 격리 — 상위 레이어 → 하위 레이어만 import. 슬라이스 외부 접근 = index.ts (Public API) 만.
  // CLAUDE.md 정책 #4 정합. 본 룰은 각 레이어별 src/{layer}/ 안에서 상위 레이어 import 차단.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['../app/**', '../pages/**', '../widgets/**', '../features/**', '../entities/**'], message: 'shared 레이어는 상위 레이어 import 금지 (FSD 정책 #4)' },
        ],
      }],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['../app/**', '../pages/**', '../widgets/**', '../features/**'], message: 'entities 레이어는 상위 레이어 import 금지 (FSD 정책 #4)' },
        ],
      }],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['../app/**', '../pages/**', '../widgets/**'], message: 'features 레이어는 상위 레이어 import 금지 (FSD 정책 #4)' },
        ],
      }],
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['../app/**', '../pages/**'], message: 'widgets 레이어는 상위 레이어 import 금지 (FSD 정책 #4)' },
        ],
      }],
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['../app/**'], message: 'pages 레이어는 app import 금지 (FSD 정책 #4)' },
        ],
      }],
    },
  },
  // .stories.tsx — TS strict 완화 (Storybook decorator·meta 타입).
  {
    files: ['src/**/*.stories.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
