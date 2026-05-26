<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 026 mount 직후 raf 재측정 (모바일 1/1 timing fix)

## 결정적 단서 (사용자)
> 야 잠만 모바일에서 글자크기 버튼 누르니까 갑자기 1/1에서 N/N으로 바뀜

= 글자크기 변경 = useLayoutEffect dep (fontSize) 변경 → measure() 재호출 → N/N 정상.
= 첫 measure() (mount 직후) 만 1/1 측정. iOS Safari 가 useLayoutEffect 시점에 flex chain layout 미완료 → frame.scrollWidth ≈ clientWidth → total = 1.

## 핫픽스
`useLayoutEffect` 안 첫 `measure()` 호출 직후 `requestAnimationFrame(measure)` 추가 → 다음 frame (layout 완료 시점) 에 자동 재측정.

```diff
useLayoutEffect(() => {
  measure()
+ const raf = requestAnimationFrame(measure)
  const ro = ...
  return () => {
+   cancelAnimationFrame(raf)
    ro?.disconnect()
    ...
  }
}, [...])
```

= 사용자가 글자크기 누르는 동작을 자동화. mount 직후 자동 재측정.

## 검증 (사용자)
- 모바일 / PC 좁힘 → 챕터 진입 → 페이지 카운트 = N/N (글자크기 안 누르고도).
- 글자크기 변경 시 N/N 그대로 (재측정 정상).
- 데스크탑 영향 0 (raf 측정도 동일 결과).

## 회귀 X
- 코드 변경 = useLayoutEffect 안 raf 1 줄 + cleanup 1 줄.
- v0.5.10 base (017 fullscreen + 018 CSS columns column-count: 1) 위에 timing fix.
