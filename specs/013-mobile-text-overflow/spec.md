<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 013 모바일 본문 우측 잘림 해소

## 보고
v0.5.6 (SDD 012) 적용 후 모바일 페이지 전환 + 페이지 안 세로 자연 흐름 = 정상. 다만 사용자 보고 — 본문 텍스트가 *우측에서 잘려서 나옴* (예: *외곽으로 빠질수록* → *외곽으로 빠질* / *우진혁의 동생* → *우진혁의 동*).

## 근본 원인
- 모바일 selector: `.book-content { width: max-content !important }` (011 도입).
- `width: max-content` = 부모가 *자식 intrinsic width 합* 으로 늘어남. 다만 *자식 `<p>` 의 한국어 line 너비* 가 max-content 계산에 영향 → 한 line 이 viewport 초과 시 부모 max-content > N × 100vw.
- 결과: flex item width: 100vw 의도되었으나 *부모 max-content 폭이 우선* → flex item line wrap 안 됨 → viewport 우측 cut-off.

## 핫픽스
- `.book-content { width: auto !important }` — flex parent intrinsic width 가 자동으로 flex items 합 (flex-shrink: 0 이라 N × 100vw 그대로).
- `.book-content > * { box-sizing: border-box !important }` — width: 100vw + padding/border 가 viewport 초과 X.
- `.section-body > * { overflow-wrap: break-word !important; word-break: keep-all }` — 한국어 자연 줄바꿈 강제. 긴 단어도 viewport 안에서 break.
- `.book-content > * > *, .section-body > * { max-width: 100% !important }` — 자식 element 가 부모 100vw 안에서만.

## 검증 (사용자)
- 모바일 캐시 강제 새로고침 → 챕터 §1 진입.
- 본문 한국어 자연 줄바꿈 + 우측 잘림 없음.
- 가로 페이지 전환 + 세로 자연 흐름 유지.
- 데스크탑 영향 0.
