<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 022 conditional render key 강제 (mobilePages 분기 별개 element)

## 보고
v0.5.12 (021 dep 추가) 후에도 모바일 1/1 잔존.

## 가설
`{mobilePages ? <div ref={contentRef}>{chunks}</div> : <div ref={contentRef} dangerouslySetInnerHTML />}` 두 분기 같은 div tag + 같은 위치 → React reconcile 시 *동일 element* 로 diff → props 변경만 발생. `dangerouslySetInnerHTML` 가 *innerHTML 잔존* + chunks children 이 mount 안 되는 케이스. `measure()` 가 잔존 innerHTML (= 단일 dangerouslySetInnerHTML 본문) 측정 → scrollWidth ≈ clientWidth → 1/1.

## 핫픽스
두 분기 `<div>` 에 `key="paged"` / `key="single"` 명시 → unmount + 새 mount. 별개 element. contentRef 가 새 element 받음. ResizeObserver / measure 가 새 DOM 측정.

## 검증 (사용자, 배포 후)
- 모바일 / PC 좁힘 → 페이지 카운트 N/N.
- 좌/우 swipe + 키보드 페이지 전환.
