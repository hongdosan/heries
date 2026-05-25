<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — markdown 한국어 join 정정

## 단계
1. `joinParagraphLines` 의 `isKoreanOrCJK` 조건 제거.
2. 단순화: `sep = isPunct(nextCh) ? '' : ' '`.
3. 함수 주석 갱신.
4. typecheck + lint pass.

## 검증
- npm run typecheck && npm run lint.
- 수동: 모든 chapter 본문 자연성 (한국어 자동 정렬 줄바꿈 자리에 공백).
