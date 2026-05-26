<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 019 모바일 fullscreen 작은 viewport min-height 가드

## 보고
사용자 보고 (v0.5.10 / 017+018 후):
> 화면이 너무 작아지면 겹쳐지는 문제가 있음. 최소 높이가 있어야 할 듯?

= 모바일 fullscreen 안 자식 (BookHeader + frame + BookProgressBar + nav) 자연 height 합 > viewport 시 *겹침* (overflow).

## 핫픽스
3-layer guard:
1. `chapter.tsx` book container `max-sm:min-h-[500px]` — 자식 합 최소 500px 보장 (BookHeader ~50 + frame min 300 + progress ~40 + nav ~50 + buffer).
2. `book-reader.css` `.book-frame { min-height: 300px !important }` — frame 자체 최소 보장.
3. `chapter.tsx MAIN_CLS` `max-sm:overflow-y-auto` — viewport 가 500px 미만이면 fullscreen container 안 세로 스크롤 fallback.

## 결과
- 정상 viewport (500px+ 세로) = container = viewport, frame = 남는 영역 stretch.
- 작은 viewport (500px 미만) = container = 500px (viewport 초과), main fullscreen 안 세로 스크롤 가능 → 자식 겹침 X.
- 데스크탑 영향 0.

## 검증 (사용자)
- PC 브라우저 창 *세로* 줄여서 viewport 500px 미만 → fullscreen 안 세로 스크롤 + 자식 겹침 X.
- 정상 viewport = frame stretch + 페이지 자동 분할 그대로.
- 데스크탑 (>640px) = 영향 0.
