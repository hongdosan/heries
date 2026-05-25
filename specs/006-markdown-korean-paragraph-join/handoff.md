<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Handoff — 006-markdown-korean-paragraph-join

## 결과
`src/shared/lib/markdown.ts` `joinParagraphLines` — *한국어 양쪽 = 공백 없음* 가정 제거. 줄바꿈 = 기본 공백 인서트. 다음 줄 구두점 시작 = 공백 없음 (자연).

## 효과
- 모든 본문 (ep-01·ep-02·_archive 등) 의 *우선아의\\n학생증* 류 IDE 자동 정렬 줄바꿈 = 사이트 렌더 시 *공백* 으로 자연.
- 본문 텍스트 수정 불필요. 코드 수정 1 곳으로 일괄 해결.

## 검증
- typecheck/lint pass.
- 수동 (사용자): `npm run dev` → ep-01 §7 *동생 우선아의 학생증* 자연 띄어쓰기 확인.

## 회귀 0
- 영문·숫자 줄바꿈 = 이전과 동일 (공백 인서트).
- 구두점으로 시작 = 공백 없음 (이전과 동일).
