<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 010 핫픽스

## 단계
1. `book-reader.css:34-41` `@media (max-width: 640px) { .book-content }` 룰 갱신.
2. `column-count: 1 !important` 제거.
3. `column-count: unset !important; column-width: 100% !important; column-fill: auto !important;` 추가.
4. 주석으로 회귀 사유 + 핫픽스 의도 기록.
5. typecheck + lint pass.
6. develop → release → main + tag v0.5.4.

## 폴백
모바일 column-width 시도가 브라우저 별로 inconsistent 한 경우 (예: Safari 등에서 column-fill: auto 무시) — 별도 사이클에서 flex/scroll-snap 패턴으로 재설계.
