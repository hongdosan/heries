<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 016 모바일 frame height grounded (브라우저 창 높이 실시간 반영)

## 보고
v0.5.8 (015) 적용 후 사용자 보고:
- PC 에서 브라우저 창 *가로* 줄여 모바일 미디어쿼리 발동 시 frame 이 *모니터 높이만큼* 길어짐.
- 브라우저 창 *세로* 줄여도 frame 안 줄어듦.

## 근본 원인
- 015 의 CSS chain: `.book-frame { height: 100% }` + `.book-content { height: 100% }` + `.book-content > * { height: 100% }`.
- `height: 100%` 는 *부모 명시 height* 있을 때만 정상. 없으면 `auto` = intrinsic content.
- 부모 chain: book-content (height 100%) ← book-frame (height 100%) ← BookReader root (flex-1 max-sm:min-h-0) ← wrapper (flex-1) ← book container (max-sm:flex-col) ← main (`min-h-[calc(100vh-160px)]` *만*).
- **main 이 *명시 height* 가 아니라 *min-height* 만**. content (= book-content 안 가장 긴 본문 페이지) intrinsic 따라 main 늘어남 → chain 100% 가 다 늘어남 → frame 본문 길이 (모니터 풀까지) 따라감.
- site layout (`<Header><main><Footer>`) = flex container 아님 → main flex-1 무효 → main height 통제 안 됨.

## 핫픽스
- `chapter.tsx MAIN_CLS`: `min-h-[calc(100vh-160px)]` → 모바일 `h-[calc(100dvh-160px)]` (명시 fixed) + 데스크탑 `sm:h-auto sm:min-h-[calc(100vh-160px)]` (기존 동작 유지).
- 결과:
  - 모바일 = main height fixed (브라우저 viewport - 160px) → 자식 stretch chain grounded → frame = main 안 *사이트 header/footer + book header/progress/nav* 빼고 남는 영역 자동.
  - 브라우저 창 세로 줄임 → dvh 실시간 → main 줄어듦 → frame 줄어듦.
  - 데스크탑 = 기존 min-h 동작 그대로 (영향 0).

## 검증 (사용자)
- PC 에서 브라우저 창 좁힘 (≤640px) → 챕터 진입.
- 창 *세로 크기* 변경 시 frame 도 같이 늘어남/줄어듦.
- 페이지 안 본문 길면 페이지 안에서만 세로 스크롤 (frame 자체 늘어남 X).
- 모바일 실기기 동일.
- 데스크탑 (>640px) 영향 0.
