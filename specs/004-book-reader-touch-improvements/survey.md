<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Survey — 북리더 모바일 터치 swipe 현 상태

## 대상
`src/widgets/book-reader/book-reader.tsx` (touch/mouse swipe 로직 L259~291) + `book-reader.css` (touch-action / overflow / overscroll 정합).

## 현 상태 (코드 기반)

### 터치 핸들링
```tsx
// L261-264
const onTouchStart = (e) => {
  const t = e.touches[0]
  if (t) dragStartRef.current = {x: t.clientX, y: t.clientY}
}
// L265-271
const onTouchEnd = (e) => {
  const start = dragStartRef.current
  if (!start) return
  const t = e.changedTouches[0]
  if (!t) return
  finishDrag(start, t.clientX, t.clientY)
}
// L284-291
const finishDrag = (start, endX, endY) => {
  const dx = endX - start.x
  const dy = endY - start.y
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
  if (dx > 0) goPrev()
  else goNext()
}
```

- **`onTouchMove` 핸들러 없음** — 손가락 움직이는 동안 시각 피드백 0.
- **`e.preventDefault()` 없음** — 브라우저 기본 터치 동작 (스크롤 / pull-to-refresh / overscroll bounce) 동작.
- React synthetic event = **passive listener** 기본 — `preventDefault()` 호출해도 무시됨.

### CSS (book-reader.css)
- `book-frame` = `overflow: hidden` (frame 내부 column scroll JS 제어).
- `book-reader` section 자체에 `touch-action` 정의 없음 → 기본 `auto` (= 브라우저가 가로/세로 swipe 모두 본인 스크롤로 처리).

### 임계 조건
- `Math.abs(dx) < 60` — 60px 이상 가로 이동 필요.
- `Math.abs(dx) < Math.abs(dy) * 1.5` — *세로가 dx의 약 0.67배 이상이면 무시*. 모바일 사용자가 손가락을 *완전 수평* 으로 끌기 어려움 (자연 사선) → **간헐 먹통**의 원인.

## 사용자 보고 증상 정합

| 증상 | 코드 원인 |
|---|---|
| "화면 자체가 움직임" | `touch-action: auto` + `preventDefault X` → 브라우저 기본 스크롤 동작 |
| "부드럽거나 자연스럽지 못함" | `onTouchMove` 없음 → 손가락 시각 피드백 0, 끝에서만 갑자기 페이지 한 번 넘김 |
| "간헐 먹통" | 임계 `dx < dy * 1.5` 엄격 → 자연 사선 swipe 무시 |

## 영향 범위
- 코드: `book-reader.tsx` ~30 LOC 변경 (touch handler 추가/조정 + passive: false useEffect).
- CSS: `book-reader.css` `touch-action` 1 property 추가.
- 런타임 동작: 모바일 swipe 자연. 데스크탑 마우스 drag = 그대로 (영향 0).
- 회귀: 키보드 네비, 페이지 전환, TOC 동작 = 영향 없음.

## 메모리 룰 정합
- `feedback_code_review_conventions.md` — 사용자 명시 개선 요청, 자동 적용 OK.
- `feedback_long_autonomous_review_mode.md` — 코드 검토·개선 자동.
