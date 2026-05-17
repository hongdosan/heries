import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// content/ 디렉토리는 dev 서버에서 vite 가 자동 서빙 (root 하위 파일).
// build 시에는 npm scripts 의 후처리 (`scripts/copy-content.mjs`) 로 복사한다.
//
// base 경로:
//   - production build = '/heries/' — GitHub Pages 의 repo prefix
//     (hongdosan.github.io/heries/) 에 맞춰 정적 asset 경로 prefix 반영.
//   - dev = '/' — vite dev 서버 root.
//   Vite 는 `import.meta.env.BASE_URL` 로 본 값을 노출하며, BrowserRouter
//   `basename` 및 정적 asset 경로 prefix 에 자동 반영됨.
//
// publicDir = 'public' — SPA fallback (`public/404.html`) 등 정적 자산
// 복사 활성. content/ 는 별도 후처리이므로 무관.
//
// 정책 #9 v2 (2026-05-14) — 단일 라이브 빌드. 작가 콘텐츠도 dist 평문 포함.
// 기본 화면은 runtime 마스킹 (`spoiler.ts`), 작가 모드 진입은 `/unlock` 페이지
// 에서 `VITE_AUTHOR_KEY` 검증 → sessionStorage `heries:author=1` 플래그.
//
// React Compiler (RC) — React 19 의 자동 메모이제이션 컴파일러.
// 분석 가능한 컴포넌트/hook 을 자동으로 memo·useCallback·useMemo 처리.
// Rules of React 준수하지 않는 코드는 자동 skip (동작 정합 보장).
// 특정 컴포넌트 opt-out = 함수 앞 'use no memo' directive.
// devDep 만 추가 — dist 의 react-compiler-runtime 은 매우 작음 (수 KB).
const reactCompilerConfig = {
  // 컴파일러 적용 범위.
  //   'all'        = 모든 함수 컴파일 → utility 함수 (theme.ts 등) 까지 컴파일됨 →
  //                 module top-level 호출 시 useMemoCache hook 호출 fail.
  //   'annotation' = 'use memo' directive 있는 함수만 컴파일. utility 안전 + 컴포넌트 명시 opt-in.
  // 안정성 우선 — annotation 채택.
  compilationMode: 'annotation' as const,
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', reactCompilerConfig]],
        },
      }),
      // Tailwind v4 — CSS-first 패턴. 사용된 utility class 만 추출 (purge 자동).
      // 기존 디자인 토큰 (tokens.css / mini-game.css / stickman-murim.css) 와 coexist.
      tailwindcss(),
    ],
    base: isBuild ? '/heries/' : '/',
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2022',
    },
    server: {
      port: 8000,
      open: false,
    },
  }
})
