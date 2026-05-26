<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 021 JS 분할 후 measure() 재호출 (1/1 회귀 해소)

## 보고
v0.5.11 (020) 후 사용자 보고:
> 목차는 정상적으로 존재하는데 왜 페이지수만 1/1로 나올까? PC는 괜찮은데.

= 데스크탑 정상 (CSS columns). 모바일 / PC 좁힘 = JS 분할 모드 진입했으나 페이지 카운트 1/1.

## 근본
- 측정 layoutEffect 가 `setMobilePages(chunks)` 호출 → re-render → content DOM 교체 (`dangerouslySetInnerHTML` → chunks `<div>` map).
- ResizeObserver 가 같은 element ref 그대로 observe 중이지만, *element 자체 box size 가 한 cycle 안에 자동 트리거되지 않는 케이스* 있음 → measure() 호출 안 됨.
- 첫 measure() = dangerouslySetInnerHTML + column-count: 1 + frame overflow: hidden → scrollWidth ≈ clientWidth → total = 1. 그 후 chunks render 됐어도 재측정 트리거 X.

## 핫픽스
`measure()` useLayoutEffect dep 에 `mobilePages` 추가:
```diff
- }, [measure, bodyHtml, fontSize, fontFamily])
+ }, [measure, bodyHtml, fontSize, fontFamily, mobilePages])
```

→ `mobilePages` 변경 시 (null → chunks) layoutEffect 재실행 → `measure()` 즉시 호출 + ResizeObserver 재생성 (새 cleanup + observe). `frame.scrollWidth = N × clientWidth` 정확 측정 → N/N.

## 검증 (사용자)
- 모바일 / PC 좁힘 (≤640px) → 챕터 진입.
- 페이지 카운트 = N/N (전체 페이지 수 + 현재).
- 좌/우 swipe + 키보드 페이지 전환 정상.
- 데스크탑 (>640px) = 영향 0.
