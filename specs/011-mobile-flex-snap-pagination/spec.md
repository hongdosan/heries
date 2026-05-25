<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 011 모바일 flex row + scroll-snap pagination

## 보고
- v0.5.2 (008): SDD 004 touch-action revert. → 모바일 1/1 잔존.
- v0.5.4 (010): `column-width: 100% + column-fill: auto`. → 사용자 iOS Safari 캡쳐에서 *EP 01 한별 단지의 밤* cover 한 장만 + indicator 1/1.

## 근본 원인
CSS columns 패턴 = 부모 (`book-frame { overflow: hidden }`) 너비 안에서 column 생성. 모바일에서:
- `column-count: 1` → column 1 개만, 본문 세로 stack.
- `column-width: 100%` + `column-fill: auto` → iOS Safari가 `column-fill: auto` / `break-after: column` 일부 무시 → 여전히 column 1 개.
- 결과: `frame.scrollWidth = clientWidth × 1` → JS total = 1 페이지.

## 핫픽스 — 패턴 자체 변경
**모바일에서 CSS columns 폐기 + flex row + scroll-snap**:

```css
@media (max-width: 640px) {
  .book-frame {
    overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x mandatory;
  }
  .book-content {
    column-* unset;
    display: flex; flex-direction: row;
    width: max-content; height: 100%;
  }
  .book-content > * {
    flex: 0 0 100vw; width: 100vw; height: 100%;
    overflow-y: auto;        /* 페이지 안 본문 세로 스크롤 허용 */
    scroll-snap-align: start;
    break-after: unset; break-before: unset;
  }
}
```

`book-content` 직계 자식 (book-cover, section-cover, div.section-body, aside.book-end-cta) 각각 한 페이지 (100vw). 가로 stack → `scrollWidth = N × 100vw`. JS scrollLeft pagination 정상.

## 트레이드오프
- 페이지 안 본문 = *세로 스크롤* (CSS columns 자동 분할 X). 본문 길이 영향.
- 데스크탑 = 영향 0 (`@media (max-width: 640px)` 안).

## 검증 (사용자)
- 모바일 iOS Safari 캐시 강제 새로고침 → 챕터 진입.
- cover 한 페이지 → 좌 swipe → §1 본문 페이지 → 우 swipe → §2 ...
- 페이지 안 본문 길면 세로 스크롤 가능.
- indicator = N/N (cover + 각 § + end = 본문 §갯수 + 3).
