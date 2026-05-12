import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// content/ 디렉토리는 dev 서버에서 vite 가 자동 서빙 (root 하위 파일).
// build 시에는 npm scripts 의 후처리 (`scripts/copy-content.mjs`) 로 복사한다.
//
// base 경로:
//   - reader build (production) = '/heries/' — GitHub Pages 의 repo prefix
//     (hongdosan.github.io/heries/) 에 맞춰 정적 asset 경로 prefix 반영.
//   - author build (VITE_AUTHOR_MODE=true) = '/' — 로컬 정적 서버
//     (npx serve dist-author 등) 에서 `/heries/` prefix 없이도 자산 로드 가능.
//     author 빌드는 라이브 사이트에 절대 배포되지 않으므로 GH Pages prefix 불필요.
//   - dev = '/' — vite dev 서버 root.
//   Vite 는 `import.meta.env.BASE_URL` 로 본 값을 노출하며, BrowserRouter
//   `basename` 및 정적 asset 경로 prefix 에 자동 반영됨.
//
// publicDir = 'public' — SPA fallback (`public/404.html`) 등 정적 자산
// 복사를 위해 활성화 (이전에는 비활성). content/ 는 별도 후처리이므로 무관.
export default defineConfig(({ command }) => {
  const isAuthor =
    process.env.VITE_AUTHOR_MODE === 'true' ||
    process.env.VITE_AUTHOR_MODE === '1'
  const isBuild = command === 'build'
  return {
    plugins: [react()],
    base: isBuild && !isAuthor ? '/heries/' : '/',
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
