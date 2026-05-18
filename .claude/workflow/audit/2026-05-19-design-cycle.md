<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 2026-05-19 새벽 — 홈/시리즈 디자인 개선 audit (자율 사이클)

## 사이클 트리거

사용자 자기 전 명시 (2026-05-19 새벽):
- `.claude/workflow/plan/design/img.png` (메인 화면 시안) + `img_1.png` (시리즈 목록 시안) **형식만 참고**, 히리즈 톤·내용 유지.
- 자율 진행 (큰/작은 작업 무관), develop only, main 절대 X.

## 변경 요약

| 영역 | 파일 | 변경 |
|---|---|---|
| Hero | `widgets/home-hero/home-hero.tsx` | 전면 재작성 (캡션 + 큰 헤드라인 + CTA) |
| 시리즈 목록 | `pages/series-list/{series-list.tsx, index.ts}` | 신규 (`/series` 라우트) |
| 헤더 nav | `widgets/header-nav/{header-nav.tsx, .stories.tsx, index.ts}` | 신규 |
| 헤더 조립 | `widgets/header/header.tsx` | HeaderNav 통합 (브랜드 + nav + 액션) |
| 홈 페이지 | `pages/home/home.tsx` | 작품 목록 섹션 제거 (`/series` 분리) |
| 라우트 | `src/app/main.tsx` | `/series` lazy route 추가 |
| 사이트맵 | `public/sitemap.xml` | `/series` priority 0.95 |
| SSOT | `worldbuilding/awakener-system.md` | 신규 (각성·헌터·길드·협회) |
| SSOT 참조 | `worldbuilding/writing-principles.md` | §1-7 = awakener-system 링크 추가 |
| Stories | `home-hero / header-nav` | 신규 stories |
| CHANGELOG | `CHANGELOG.md` | [Unreleased] entry |

## 시각 검증 체크리스트 (사용자 영역)

### 홈 페이지 (`/`)
- [ ] Hero 캡션 `H-eries · Multi-verse Collection` tracking 적절
- [ ] 헤드라인 *서로 다른 세계가 / 하나의 상상으로 연결됩니다.* 2 줄 줄바꿈 자연 (모바일 = 1 줄 될 수도)
- [ ] 부제 2 줄 줄바꿈 자연
- [ ] *시리즈 보러 가기* CTA 검정 버튼 + → 화살표 + hover lift + accent 색상 변경
- [ ] *H-eries 소개* 보조 링크 hover underline
- [ ] 모바일 (`< sm` 브레이크) = 헤드라인 36px, 버튼 크기 적절
- [ ] 다크 모드 정합 (text-fg / bg-fg 토큰)
- [ ] 미니게임 런처 = Hero 아래 잔존 (Suspense)

### 시리즈 목록 페이지 (`/series`)
- [ ] Breadcrumb `H-eries / 시리즈` 표시
- [ ] 페이지 헤더 = 캡션 + 시리즈 + 우측 통계 (전체/연재 중/완결)
- [ ] 통계 숫자 = 실제 series.json 정합 (현재 1 / 1 / 0)
- [ ] 필터 탭 3 종 = 클릭 시 URL ?filter=ongoing 등 변경 + 카드 필터링
- [ ] 활성 탭 = 둥근 border + bg-bg-soft + font-semibold
- [ ] 가로형 카드 = 4:3 썸네일 (좌) + 메타 (우) — 모바일 = 1 열 stack
- [ ] 카드 hover = bg-bg-soft + 썸네일 scale 1.03
- [ ] `SERIES 01` + 상태 dot (연재 중 = 초록, 완결 = fg-4) + 상태 텍스트
- [ ] 제목 = 큰 글씨 + hover = accent
- [ ] 시놉시스 = description 또는 _series.md summary 정합
- [ ] 메타 = 📖 화수 · 📅 시작일 · ⏱ 최근 갱신 (manifest fetch)
- [ ] Coming soon placeholder (filter=all 일 때만 표시)

### 헤더
- [ ] 좌측 = HeaderBrand (마크 + 로고)
- [ ] 중앙/우측 = HeaderNav (*시리즈* / *소개*) — sm 이상만 노출
- [ ] 우측 = `|` divider + HeaderActions (작가 모드 / 메일 / 테마)
- [ ] /series 진입 시 *시리즈* 링크 = text-fg + font-semibold
- [ ] /about 진입 시 *소개* 링크 = 동일

### 일반
- [ ] typecheck / lint / build 모두 통과 (확인됨)
- [ ] 작가 모드 진입/잠금 정합 (시리즈 목록 카드 마스킹 없음 — 시리즈 자체는 공개)
- [ ] 모바일 responsive (320px 최소 너비)
- [ ] prefers-reduced-motion 정합 (transition 비활성)

## 알려진 정합 보완 후보 (사용자 결정)

| # | 항목 | 시안 정합 | 비고 |
|---|---|---|---|
| 1 | 카드 카테고리 라벨 (각성자·마수) | 부분 | `series.json` 또는 `_series.md` 에 *category* 필드 추가 필요 |
| 2 | 메타 이모지 (📖 📅 ⏱) | 부분 | 시안 = □ 아이콘. Lucide SVG 또는 단순 텍스트 권장 가능 |
| 3 | *자세히* CTA 위치 | 부분 | 시안 = 우측 상단. 현재 = 카드 하단 (모바일 정합 위해 보류) |
| 4 | 필터 탭 디자인 | OK | 시안 = 둥근 border + 숫자 작게. 현재 정합 |
| 5 | 작품 목록 = 홈 vs /series | 변경 | 시안 = 홈에 없음 → /series 만. 현재 정합 |

## 다음 사이클 후보

1. 사용자 시각 검증 + 정합 보완 1·2·3 결정
2. ep-05 작성 (사용자 시놉시스)
3. 카드 §가족 세부 (lorekeeper)
4. 작가 모드 시리즈 목록 페이지 분기 검토 (필요 시)
5. /about 페이지 디자인 정합 (시안 없으면 보류)

## Git 상태

- develop = 4ff3667 (chore(submodule): pointer 갱신)
- 4 commits push 완료 (69e8ec3 → 4f19308 → 4ff3667 + submodule a6cb092 → 74158a2)

## 누적 변경

src/ 코드:
- 신규 파일: `pages/series-list/series-list.tsx` (185 줄) + `pages/series-list/index.ts` + `widgets/header-nav/header-nav.tsx` + `widgets/header-nav/index.ts` + `widgets/header-nav/header-nav.stories.tsx` + `widgets/home-hero/home-hero.stories.tsx`
- 갱신: `widgets/home-hero/home-hero.tsx` (전면) + `widgets/header/header.tsx` (HeaderNav 통합) + `pages/home/home.tsx` (작품 목록 분리) + `src/app/main.tsx` (라우트)

content:
- 신규: `worldbuilding/awakener-system.md` (111 줄)
- 갱신: `worldbuilding/writing-principles.md` (§1-7 링크)

기타:
- `CHANGELOG.md` ([Unreleased])
- `public/sitemap.xml`
- `.claude/workflow/audit/2026-05-19-design-cycle.md` (본 보고서, 신규)
