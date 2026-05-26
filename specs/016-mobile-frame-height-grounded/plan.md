<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 016 모바일 frame height grounded

## 적용 파일
- `src/pages/chapter/chapter.tsx` `MAIN_CLS` 1 줄:
  - `min-h-[calc(100vh-160px)]` → `h-[calc(100dvh-160px)] sm:h-auto sm:min-h-[calc(100vh-160px)]`.
- `specs/016-mobile-frame-height-grounded/spec.md` — 근본 + 해결.

## 작업 순서
1. MAIN_CLS 1 줄 수정.
2. typecheck + lint.

## 검증 (사용자)
- PC 브라우저 창 ≤640px 좁힘 + 세로 변경 → frame 실시간 반응.
- 모바일 실기기 = 동일.
- 데스크탑 영향 0.

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.

## 회귀 영향
- 데스크탑 (>640px) = `sm:h-auto + sm:min-h-...` 기존 min-h 동작 동일 → 영향 0.
- JS pagination = 변경 0.
