<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 024 모바일 flex item width = var(--page-w) (1/1 자율 디버그 v2)

## 보고 (v0.5.14 후 자율 진행)
사용자: "나 자는 동안 혼자 잘 찾아봐". 1/1 자율 fix.

## 가설 진단
v0.5.14 fix (raf 측정, key 강제, data-* attribute, jitter 해소) 후에도 1/1 잔존 가능. 추가 가설:
- `.book-content-paged { width: auto }` (flex parent) + `.book-page { flex: 0 0 100% }` (flex item) = iOS Safari 가 *circular reference* 로 자식 width 0 평가.
- 0 width 자식 N 개 = parent intrinsic = 0 → `frame.scrollWidth ≈ frame.clientWidth` → JS total = 1.

## 핫픽스
- `.book-page` flex-basis / width = `var(--page-w, 100%)` (014 의 `--page-w` CSS variable = frame.clientWidth px, JS measure() 가 set).
- `measure()` 안 `void frame.offsetWidth` — setProperty 후 CSS recalc + layout 강제 → scrollWidth 정확 측정.

## 검증 (사용자)
- 모바일 / PC 좁힘 → 페이지 카운트 N/N.
- dev tools elements `.book-frame` `data-chunks` / `data-total` 확인.
