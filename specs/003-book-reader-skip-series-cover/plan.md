<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 시리즈 cover 제거 실행 계획

## 접근
가장 단순. `chapter.tsx` 에서 `seriesThumbSrc` + `coverSeriesHtml` 제거, 합성에서 빼기. 스토리북 동일 패턴 정리.

## 단계
1. `chapter.tsx` L113 `seriesThumbSrc` 변수 제거.
2. `chapter.tsx` L117-123 `coverSeriesHtml` 변수 + HTML literal 제거.
3. `chapter.tsx` L202 `fullBodyHtml = (coverSeriesHtml + coverChapterHtml + ...)` → `(coverChapterHtml + ...)` 로 변경.
4. `book-reader.stories.tsx` 시리즈 cover `<section>` 블록 제거.
5. `assetUrl` import 사용처 점검 — `chapterThumbSrc` 가 동일 import 사용하므로 import 유지.
6. `npm run typecheck` pass 확인.
7. `npm run lint` pass 확인.

## 검증 (R3)
- `npm run typecheck && npm run lint` pass.
- (수동) `npm run dev` → 임의 챕터 진입 → 첫 페이지 = 챕터 cover (EP 01 + 챕터 thumbnail) 확인.
- (수동) 시리즈 리스트 페이지 (`/series/clash-of-multiverses`) 노출 정상 = manifest thumbnail 그대로.

## 위험 / 완화
- **위험 1**: CSS 클래스 미사용 잔존 (`.book-cover-series` 등) → dead code. **완화**: 본 사이클 외 처리, survey.md 노트.
- **위험 2**: 스토리북 갱신 누락 시 스토리 - 실제 차이. **완화**: stories.tsx 동시 정리.
- **위험 3**: 첫 페이지 = 챕터 cover 가 너무 짧게 끝남 (챕터 thumbnail + 제목만) → 의도된 변경.

## Constitution 정합
- R1 ✓ (본 spec.md 비자명)
- R2 ✓ (본 plan)
- R3 = `npm run typecheck && npm run lint`
- R4 (regression) = 별도 파일
- R6 strict ✓
- R7 미적용 (H-eries)
