<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 014 모바일 한 페이지 모드 우측 잘림 해소

## 적용 파일
- `src/widgets/book-reader/book-reader.tsx`
  - `import { useLayoutEffect }` 추가.
  - `measure()` 안 `frame.style.setProperty('--page-w', '${frame.clientWidth}px')` 추가.
  - measure 호출 effect `useEffect` → `useLayoutEffect` (paint 전 동기 측정 → 첫 paint 정확).
- `src/widgets/book-reader/book-reader.css`
  - `.book-frame { --page-w: 100% }` 정적 선언 (IDE lint 만족 + 안전 fallback).
  - 모바일 selector `.book-content > * { flex/width/max-width: var(--page-w, 100%) }`.
  - 013 의 `overflow-wrap: break-word; word-break: keep-all; max-width: 100%` 유지.
- `specs/014-mobile-scrollbar-width/spec.md` — 근본 + 해결 SSOT.

## 작업 순서
1. measure() 안 setProperty 추가.
2. useEffect → useLayoutEffect.
3. CSS `.book-frame { --page-w: 100% }` 선언 + 모바일 selector 의 width var() 사용.
4. typecheck + lint.

## 검증 (사용자)
- `npm run dev` 재시작 → 데스크탑 창 ≤640px 좁힘 + 모바일 실기기 진입.
- 챕터 §1 ~ §N 본문 우측 잘림 없음 + 가로 페이지 전환 + N/N indicator 정상.
- 데스크탑 (>640px) CSS columns 패턴 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 (>640px) = flex selector 발동 X → 영향 0.
- JS pagination 로직 (goToPage, scrollToSection, measure total/cur) = `frame.clientWidth` 그대로 사용 → 변경 0.
- BookToc / BookProgressBar / BookHeader = 영향 0.
