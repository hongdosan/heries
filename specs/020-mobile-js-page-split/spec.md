<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 020 모바일 JS 본문 분할 (column-fill 의존 X)

## 보고 / 우려
사용자 보고 (v0.5.10 / 017+018 후):
> pc에서는 width 좁아져 모바일처럼 나와도 정상이지만, 모바일에서는 1/1 같이 첫 페이지만?

= iOS Safari 17.4 미만 / 일부 안드로이드 = `column-fill: auto` 미지원 → 1 column 안 압축 → 1/1 회귀 우려. SDD 011 ~ 010 보고와 동일 환경 변수.

## 해결 — JS 본문 분할
column-fill 의존 X. 모바일 진입 시:
1. **측정 단계** (`mobilePages === null`):
   - 단일 `dangerouslySetInnerHTML` 로 본문 mount.
   - CSS `column-count: 1` → 1 column 안 자식 자연 stack.
   - 측정 직전 `cover / section-cover / book-end-cta` 의 `height: 100% + break-after: column` 임시 무력화 (style.height = auto).
   - `useLayoutEffect` 안에서 `.book-content` 직계 자식 순회:
     - `.section-body` 면 안 자식 (p / blockquote / img 등) 의 `getBoundingClientRect().top` 측정 + 페이지 누적 height 초과 시 *새 페이지 chunk* (section-body wrapper 유지).
     - cover / section-cover / book-end-cta = 각자 1 페이지 강제 (height: 100% UI 보존).
   - `setMobilePages([chunks])`.
2. **분할 단계** (`mobilePages` set):
   - `.book-content-paged { display: flex; flex-direction: row }` + 각 chunk = `.book-page { flex: 0 0 100%; height: 100%; overflow: hidden }`.
   - frame `overflow-x: auto + scroll-snap-type: x mandatory`.
   - 기존 JS pagination (`measure() / goToPage / scrollLeft`) 그대로 작동.

## 추가 — 최소 높이 보강
사용자 요청 "최소 높이는 조금만 더 키우자":
- `chapter.tsx` book container `max-sm:min-h-[500px]` → `max-sm:min-h-[600px]`.
- `book-reader.css` `.book-frame { min-height: 300px → 360px }`.

## 트레이드오프
- JS 분할 = 첫 paint = 측정 단계 (단일 div, column: 1) → setState 후 paint = chunks. 짧은 flicker 가능.
- 본문 직계 자식 + section-body 안 1-레벨 자식까지 측정. 더 깊은 nesting (list 안 list 등) 은 한 element 단위 = 그 element 가 frame 초과 시 짤림 (드물지만 가능).
- 글자 크기 / 폰트 / bodyHtml / isMobile 변경 시 = `setMobilePages(null)` → 재측정.

## 검증 (사용자)
- 모바일 실기기 (iOS / Android) = chunks 분할 모드 자동 진입 → N/N 페이지 + 좌/우 swipe.
- PC 좁힘 = 동일 (모바일 미디어쿼리 발동 + JS 분할).
- 글자 크기 / 폰트 변경 → 재측정 + 페이지 재분할.
- 데스크탑 (>640px) = isMobile false → 기존 CSS columns 모드 그대로 → 영향 0.

## 회귀 X
- 데스크탑 = isMobile false → dangerouslySetInnerHTML 단일 + columnCount: 2 inline 그대로 → 변경 0.
- JS measure() / goToPage = 그대로 작동.
- 014 의 `--page-w` setProperty = 단일 모드에서도 무해, 유지.
