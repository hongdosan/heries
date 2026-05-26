<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 015 모바일 frame 높이 폭증 + 페이지 전환 흔들림

## 보고
사용자 보고 (v0.5.7 / 014 후):
1. *모바일에서 북리더 페이지 넘김 있을 때, 북리더 페이지 흔들림 현상 존재.*
2. *모바일 때 북리더 높이가 브라우저에 맞게 조절되는게 아니라, 엄청 김.*

## 근본 원인
- 012 (v0.5.6) 에서 `frame { height: auto + min-height: 100vh + overflow: visible }` + 자식 `{ height: auto + min-height: 100vh }` 패턴 적용.
- 결과: 각 페이지 (cover / section-cover / section-body / book-end-cta) 가 *본문 길이만큼 늘어남*. 본문 긴 § 페이지는 viewport 의 몇 배 → frame 자체가 매우 김.
- 페이지마다 height 가 다름 + `scroll-snap-type: x mandatory` 충돌 → 가로 swipe 전환 시 *세로 jitter* (페이지 N 의 height ≠ 페이지 N+1 의 height → snap 위치 보정 중 흔들림).

## 핫픽스 — viewport 안 자동 stretch (사용자 의도 — *브라우저 높이에 맞게 자동 조절*)
- `chapter.tsx MAIN_CLS`: `items-center` → `items-stretch sm:items-center` (모바일 stretch, 데스크탑 center).
- `chapter.tsx` book container div: `max-sm:flex max-sm:flex-col` 추가 (모바일 세로 flex).
- `chapter.tsx` BookReader wrapper div: `max-sm:flex-1 max-sm:min-h-0` (남는 공간 다).
- `book-reader.tsx` `<section>`: `max-sm:flex-1 max-sm:min-h-0 max-sm:flex max-sm:flex-col`.
- `book-reader.tsx` `.book-frame` div: `max-sm:flex-1 max-sm:min-h-0`.
- `book-reader.css` 모바일 selector:
  - `.book-frame { height: 100% + overflow-x: auto + overflow-y: hidden + scroll-snap-type: x proximity }`
  - `.book-content { height: 100% + align-items: stretch }`
  - `.book-content > * { height: 100% + overflow-y: auto + scroll-snap-align: start }`

결과: frame height = main 안 *사이트 header/footer + book header 빼고 남는 영역* 자동 stretch. 별도 dvh 추정 X.

## 트레이드오프
- 모바일에서 책 reader 가 main 영역 풀 차지 (사이트 header/footer 는 그대로 표시).
- 페이지 안 본문 길면 *세로 스크롤* — CSS columns 자동 분할 X (iOS Safari column-fill: auto 미지원).
- scroll-snap proximity = 사용자 자유 swipe + 가까운 페이지 snap → jitter X.

## 검증 (사용자)
- 모바일 캐시 강제 새로고침 → 챕터 §1 진입.
- frame 높이 = 화면의 85% 정도 (header 위 / progress bar 아래 공간 확보).
- 가로 swipe 페이지 전환 = 부드러움 (흔들림 X).
- 페이지 안 본문 길면 세로 스크롤 가능.
- 우측 잘림 없음 (014 해결 유지).
- 데스크탑 영향 0.
