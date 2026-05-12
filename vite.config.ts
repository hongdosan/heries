import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// content/ 디렉토리는 dev 서버에서 vite 가 자동 서빙 (root 하위 파일).
// build 시에는 npm scripts 의 후처리 (`cp -r content dist/content`) 로 복사한다.
// publicDir 비활성화 — 별도 public/ 폴더 미사용.
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    port: 8000,
    open: false,
  },
})
