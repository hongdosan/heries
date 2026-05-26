<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — 017 모바일 fullscreen reader 모드

## 보고 / 의사결정
사용자 의사결정 — 사용자 GrillMe 응답 B (권장):
> 북리더가 페이지 안에 있는게 아니고 북리더 자체가 페이지가 되는건 별론가?

= 모바일에서 챕터 페이지 자체 = 책 reader fullscreen. 사이트 header/footer 가림.

## 구현
- `chapter.tsx MAIN_CLS` 모바일 utility 추가:
  - `max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:bg-bg` — viewport 풀 점유 + 사이트 header/footer 위 덮음.
  - `max-sm:max-w-none max-sm:m-0 max-sm:p-0 max-sm:min-h-0 max-sm:items-stretch` — 데스크탑 layout 무력화.
- `chapter.tsx` book container:
  - `max-sm:max-w-none max-sm:h-full max-sm:rounded-none max-sm:border-0 max-sm:shadow-none` — 모바일 fullscreen 안 border/rounded 제거 + 풀.
- 닫기 = BookHeader 안 시리즈 Link 그대로 (`book-header.tsx:70` `<Link to={'/series/${seriesSlug}'}>`). 사용자가 작품 제목 탭 → 시리즈 페이지.

## 결과
- 모바일 = chapter 진입 시 *책 reader 가 viewport 풀* (사이트 header/footer 가림).
- 책 안 = BookHeader + frame (남는 영역 다) + BookProgressBar + nav.
- frame height = 정확히 viewport - (BookHeader + progress + nav) — 드래그/스크롤 X.
- 닫기 = 작품 제목 탭 → 시리즈.
- 데스크탑 = 기존 인라인 페이지 그대로 (영향 0).

## 검증 (사용자)
- 모바일 / PC 좁힘 (≤640px) → 챕터 진입.
- 책 reader 가 viewport 풀 (위·아래 여백 0).
- 사이트 header/footer 안 보임 (책 reader 가 덮음).
- frame = 페이지 안 정확히 fit, 드래그/스크롤 X.
- 작품 제목 탭 → 시리즈 페이지.
- 데스크탑 (>640px) = 기존 인라인 페이지 그대로.

## 회귀 X
- 데스크탑 (>640px) = `sm:` prefix 없는 기존 클래스 그대로 → 영향 0.
- JS pagination / measure() = 변경 0.
