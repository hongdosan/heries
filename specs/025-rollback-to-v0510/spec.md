<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 025 v0.5.10 코드 rollback (020~024 폐기)

## 보고 / 결정
사용자: "갑자기 내부 텍스트 짤리는 현상도 생김 그냥 버그를 더 만들고 있네"

= 020~024 누적 fix 가 새 버그 양산. 명시적 후퇴.

## rollback 대상
다음 3 파일을 v0.5.10 시점 (017 fullscreen + 018 CSS columns column-count: 1) 으로 복원:
- `src/widgets/book-reader/book-reader.tsx`
- `src/widgets/book-reader/book-reader.css`
- `src/pages/chapter/chapter.tsx`

## 폐기 변경
- 019 (min-height 보강)
- 020 (JS 본문 분할)
- 021 (measure dep mobilePages)
- 022 (conditional key 강제)
- 023 (jitter raf + data-* attribute)
- 024 (flex var(--page-w) + forced layout)

## 남는 동작
- 모바일 fullscreen reader (017) — viewport 풀, 사이트 header/footer 가림.
- CSS columns column-count: 1 (018) — iOS Safari 17.4+ 정상, 미만은 1/1 가능.

## 후속 결정 (사용자)
v0.5.10 상태에서 모바일 1/1 발생 시:
- 옵션 A: iOS Safari 17.4+ 만 지원 = 그대로 유지.
- 옵션 B: 페이지 안 세로 스크롤 허용 (cut-off X) — 015 패턴.
- 옵션 C: 다른 접근.

사용자 의사결정 후 진행.
