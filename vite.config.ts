import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  return {
    plugins: [react()],
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
