<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — markdown 한국어 줄바꿈 공백 처리 수정

## 무엇을
`src/shared/lib/markdown.ts:183` 의 `joinParagraphLines` 함수 한국어 처리 로직 정정.

## 왜
**버그**: IDE 자동 정렬이 한국어 본문에 줄바꿈을 추가하면, 마크다운 렌더링 시 *두 단어가 붙어서 출력*. 사용자 보고 — *동생 우선아의\\n학생증이었다* → 사이트에서 *동생 우선아의학생증이었다* (띄어쓰기 누락).

코드:
```ts
const sep = (isKoreanOrCJK(prevCh) && isKoreanOrCJK(nextCh)) || isPunct(nextCh)
  ? ''
  : ' '
```

→ 한국어 양쪽 = 공백 없이 연결 가정. **잘못된 가정** — 한국어 자연 산문은 단어 사이 띄어쓰기. 줄바꿈 = 띄어쓰기 자리.

## 정정안
한국어 조건 제거. 줄바꿈 = 기본 공백 (` `). 단 다음 줄이 구두점 시작 = 공백 없음 (구두점 자연 정합).

```ts
const sep = isPunct(nextCh) ? '' : ' '
```

## 회귀 위험
- *한국어 한 단어가 두 줄에 걸친* 케이스 = 한국어 문법상 거의 없음. 본문 grep으로 확인.
- 영문·숫자 줄바꿈 = 이미 공백 처리 (변경 없음).

## 검증
- typecheck/lint pass.
- ep-01.md 본문 *우선아의 / 학생증* 자리 자동 공백 확인 (수동).
