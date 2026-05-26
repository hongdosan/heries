<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 027 v0.5.15 base + 026 raf + cut-off 방어막

## 결정 (사용자)
- v0.5.15 환경 = 1/1 → 글자크기 후 N/N (JS 분할 작동) + 본문 cut-off 버그.
- v0.5.17 환경 (v0.5.10 rollback + 026) = 여전히 1/1 (CSS columns column-fill iOS 미지원).
- 결론: v0.5.15 가 진짜 방향. + cut-off fix 추가.

## 적용
1. v0.5.15 코드 복원 (3 파일: book-reader.tsx, book-reader.css, chapter.tsx).
2. 026 raf re-measure 다시 적용 (`useLayoutEffect` 안 `requestAnimationFrame(measure)`) — mount 직후 자동 재측정.
3. cut-off 방어막: `.book-content-paged > .book-page { overflow-x: hidden; overflow-y: auto }`. 분할 부정확 시 page 안 element 가 page 보다 크면 *작은 세로 스크롤* (cut-off X). 정상 분할 시 사용자 인지 X.

## 검증 (사용자)
- 모바일 / PC 좁힘 → 페이지 카운트 N/N (mount 직후, 글자크기 안 누름).
- 페이지 안 본문 cut-off X.
- 글자크기 / 폰트 변경 시 재측정 + N/N.
- 데스크탑 영향 0.

## 회귀 X
- 데스크탑 = isMobile false → 영향 0.
- 사용자 의도 "드래그 X" 와 약간 절충 — 분할 정확하면 사용자 인지 X. 부정확 (예외) 시 작은 세로 스크롤로 cut-off 회피.
