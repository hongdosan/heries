<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 008 핫픽스: 모바일 책 본문 페이지 전환 회귀

## 보고
사용자 보고 (2026-05-26) — 핫픽스 배포된 서비스(v0.5.1) 모바일에서 책 본문 진입 시 *챕터 주 썸네일 한 장만 보이고 그 이외 본문 페이지 전환 불가*. 사실상 페이지 하나만 존재.

## 추정 원인
SDD 004 (북리더 모바일 터치 swipe 개선) 의 두 변경이 모바일 column-flow 페이지네이션을 차단한 것으로 보임:
1. `book-reader.css` `.book-reader-root { touch-action: pan-y pinch-zoom; }` — `pan-y` 가 cascading 영향으로 자식 `book-content` 의 가로 column 스크롤·페이지 인식을 모바일 브라우저에서 차단.
2. `book-reader.tsx` passive:false `touchmove` + axis lock + `preventDefault()` — 모바일에서 페이지 전환 input chain 을 방해할 가능성.

## 핫픽스 (최소 변경)
1. `.book-reader-root { touch-action: pan-y pinch-zoom; }` 제거. 클래스 자체 = section 에서 제거.
2. passive:false touchmove handler (useEffect) 제거. axisLockRef 제거. rootRef 제거.
3. **임계 완화 (`dy * 1.5` → `dy * 1.0`) 는 유지** = SDD 004 의 기능 개선 부분.

## 결과
- 모바일 swipe 동작 = SDD 004 *이전 상태* (v0.4.0 직전 동작). *부드러움 약간 부족* 보고는 재발 가능하나, *페이지 전환 자체 안 됨* 회귀가 더 critical.
- 데스크탑 마우스 drag, 키보드, TOC = 영향 0.

## 후속
- SDD 004 의 *원래 의도* (모바일 swipe 진동 + 부드러움) = 별도 사이클로 재설계. CSS `touch-action` 적용 범위를 `book-frame` 외부로만 한정하는 방식 검토.
