<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# Changelog

H-eries 의 *작품 + 코드* 모든 변경을 tag 단위로 기록한다.

형식 = [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) + [SemVer](https://semver.org/lang/ko/).

브랜치·release 운영 규약 = [`.claude/harness/git-strategy.md`](./.claude/harness/git-strategy.md).

---

## [Unreleased]

### Added (BookReader v3 책 형태 paginated reader — 2026-05-19 야간 자율 / 사용자 명시 "퇴근 자율 진행 / develop only / bookreader 중점")

- **BookReader v3 재설계** (CSS columns paginated 패턴) — 시안 img_2 정합:
  - 좌 페이지 = 작품 cover (thumb + 시리즈명) / 우 페이지 = 챕터 cover (thumb + EP NN + 챕터명)
  - 각 절 = section-cover (h2 + section thumb) + section-body (본문 column flow) — 한 spread = 좌(cover) + 우(본문 시작) 또는 본문 연속 spread
  - 마지막 = book-end-cta (이전·다음 화 + 전체 회차 보기)
  - column-gap 0 + column-rule (책 fold 시각) + columnWidth 390 / maxWidth 780 (정확 2 col fit, scrollLeft mismatch 회피)
  - frame `overflow: hidden` + 드래그·터치·키보드·화살표 만 페이지 넘김 (스크롤 X)
  - userSelect none (텍스트 드래그·복사 차단)
- **chapter.tsx pages 합성** — DOMParser 로 markdown body 의 h2 단위 분할 + 각 절 section-cover (h2 + 첫 img thumb) + section-body wrapper. 작품 / 챕터 thumbnail = manifest.thumbnail / chapter.thumbnail (assetUrl 변환).
- **모든 thumbnail 동일 시각 크기** — `max-width: 280px + aspect-ratio: 16/9 + margin: 0 auto + object-fit: cover`. cover / section thumb 자매 정합.
- **BookHeader 정합** — Aa (글자 크기 sm/md/lg/xl 미리보기) + 가 (sans/serif 토글) + ≡ (목차) + ✕ (닫기). 페이지 인디케이터 = 하단 nav 중앙 (prev / 페이지 / next 3 영역 균등). 모든 button h-7 min-w-6 px-1.5 leading-none + flex items-center gap-0.5. SVG menu icon `-mt-0.5` (글리프 baseline 보정).
- **BookProgressBar 양 끝 "표지" / "끝"** — special id (`__cover_series__` / `__end__`) 으로 첫 장 / 마지막 장 이동 가능.
- **하단 nav 이전화·다음화** — 모든 페이지에서 회차 이동 가능 + SPA navigation.
- **useBookSettings hook 신규** (`shared/lib/use-book-settings.ts`) — theme.ts 패턴 자매 정합. BookFontSize / BookFontFamily + localStorage 영속.
- **마우스 drag swipe** — 기존 touch swipe 자매 정합 + 60px threshold + finishDrag 통합.
- **목차 클릭 동작** — element offsetLeft 측정 → spread 시작 page 정렬.

### Fixed (BookReader 다수 버그 정정 — 2026-05-19)

- **column 잘림 / 다음 페이지 노출 버그** = column-gap 60 → 0 (spread 사이 gap 60px shift 로 다음 col 일부 노출되던 mismatch 해소).
- **`closeCurrentSection` 닫기 태그 오류** = `</section>` → `</div>` 정정 (실제로는 `<div class="section-body">` 시작 — section / div nesting 깨져서 cover/section 동작 영향) — 데드 / 잘못된 로직 동시 해결.
- **block element 사이 whitespace text node** = `.replace(/>\s+</g, '><')` 으로 합성 HTML 정규화 (multi-column 안 inline box 가 col 차지하는 버그 회피).
- **display: flex → display: grid + align-content: center** (.book-cover / .section-cover / .book-end-cta) — multi-column 안 flex break 동작 불완전한 케이스 회피.
- **break-before/after column 정책 단순화** = `break-after: column` 만 명시 + `break-inside: avoid` + `height: 100%` (이중 break 회피).
- **section-body 자식만 padding-inline + break-inside** — `.book-content > *` 직접 적용 시 section-body 전체 break-inside avoid → column flow 깨지는 버그 회피.
- **thumbnail 통합 규칙** — `.book-cover-thumb` / `.section-cover-thumb` 동일 규칙 (max-width 280 / aspect 16:9 / cover / margin auto).
- **BookHeaderProps `export`** — file-local interface → `export interface` 정합 (IDE TS server stale 우회).
- **root `<div role="region">` → `<section aria-label="...">`** (semantic 정합 + jsx-a11y 경고 해소).
- **`pendingThumb` 데드 변수 제거** (chapter.tsx 의 transformedBody — 사용 안 함 + void 패턴).
- **page indicator 위치** = BookReader 안 → wrapper 하단 nav 중앙 (3 영역 평행 정렬).
- **wrapper / main 외부 공백 균형** — chapter wrapper max-w 변경 + main padding 균등 + footer mt 영향 안내.

### Added (자율 진행 사이클 PM4 — 2026-05-19 / 사용자 명시 "보류하지말고 자율 진행해" "물어보지말고 계속 자율진행해")

- **BookHeader 3 placeholder 활성화** — 글자 크기 (sm/md/lg/xl cycle, localStorage `heries:book-reader:font-size`) + 폰트 (sans/serif toggle, localStorage `heries:book-reader:font-family`) + 테마 (auto/light/dark cycle, `theme.ts` 전역 SSOT 재사용). BookHeader 의 disabled placeholder 3 종 모두 실제 동작.
- **`shared/lib/use-book-settings.ts` 신규** — BookReader 사용자 설정 hook (BookFontSize / BookFontFamily / cycleX / localStorage 영속). theme.ts 패턴 자매 정합 (Theme / getTheme / setTheme / nextTheme).
- **BookReader props 확장** — `fontSize` / `fontFamily` props. content 영역에 Tailwind utility class 동적 적용 (`text-sm/base/lg/xl` + `font-sans/serif`). font-size 변경 시 column re-layout 자동 발동 (measure() useEffect deps 에 fontSize/fontFamily 추가).
- **chapter.tsx 통합** — `useBookSettings` hook + `theme.ts` state owner. BookHeader / BookReader 에 settings + cycle callback props 전달.

### Changed (작성 5 원칙 §1 자매 정합 마이그레이션 — 2026-05-19 / 사용자 명시 "보류하지말고")

- **molecules 3 + organisms 7 HTMLAttributes spread 적용** — Button 자매 정합. 사용처가 `className` + 모든 표준 HTML attribute (id / aria-* / data-* / event handlers) 외부 주입 가능.
  - **molecules 3** (단일 root element): `HeaderBrand` (HTMLAttributes<HTMLDivElement>) / `ThemeToggle` (ButtonHTMLAttributes<HTMLButtonElement>) / `LockedCharacterCard` (HTMLAttributes<HTMLElement> — `mainClassName` props 폐기 + `className` 일반화 + 사용처 정정).
  - **organisms 7** (단일 root element): `Header` / `HeaderNav` / `HeaderActions` / `Footer` / `HomeHero` / `CharacterList` / `BookReader` (`onKeyDown` 외부 handler chain 추가 — 외부 handler 가 `preventDefault` 시 내부 키 네비 skip).
  - **보류 4** (Fragment `<>` root — wrapper 추가 시 layout 영향 위험): `AuthorModeToggle` / `HeaderContact` (button + dialog Fragment) / `HeaderMobileMenu` / `ChapterToc` (button + dialog Fragment). 의도된 Fragment 패턴 정합 유지.

### Changed (자율 진행 사이클 PM3 — 2026-05-19 / 사용자 명시 "물어보지말고 계속 자율진행해")

- **pages/{slice}/api/ segment 도입 (FSD bottom-up 정합)** — `loadSeries` / `loadChapter` / `loadCharacter` 3 loader 모두 *1 page only* 사용 (각각 `pages/series/series.tsx` / `pages/chapter/chapter.tsx` / `pages/character/character.tsx`) → FSD 원칙 "현재 어느 레이어까지 재사용되는가?" 기준 = `pages/{slice}/api/` 가 정합. 3 loader 를 entities → pages 로 이동:
  - **신규**: `pages/series/api/load-series.ts` / `pages/chapter/api/load-chapter.ts` / `pages/character/api/load-character.ts`
  - **삭제**: `entities/series/api/load-series.ts` / `entities/chapter/api/load-chapter.ts` / `entities/character/api/load-character.ts` + 빈 `entities/chapter/api/` / `entities/character/api/` 폴더
  - **entities 책임 재정의**: 도메인 type SSOT (`series` / `chapter` / `character` 의 `model/types.ts`) + 다중 page 호출 fetch (`series/api/fetch-manifest.ts` — fetchSeriesIndex / fetchSeriesManifest / normalizeSeriesManifest) 만 남음. *loadX = page 책임*.
  - **import 경로 정정**: 3 page (`series.tsx` / `chapter.tsx` / `character.tsx`) + 3 entities/index.ts (loadX export 제거).
  - **타입 SSOT**: `SeriesPageData` / `ChapterPageData` / `CharacterPageData` 는 `entities/{slug}/model/types.ts` 유지 (도메인 type SSOT). page 의 loader 가 entities 의 type import.
- **동기 갱신** (workflow §3 동기 갱신 원칙) — `src/README.md` §6 레이어 표 + §디렉토리 구조 트리 + §API 위치 결정 표 / `.claude/workflow/template/prompt-reference.md` §3 entities 표기.
- **T7 molecules 5 일괄 HTMLAttributes spread 마이그레이션 = 보류 결정** — 비판적 평가 결과 *명목적 자매 정합* 일 뿐 실질 가치 0 (단일 사용 + props 0 패턴이 *현 자매 정합*). 일괄 spread = premature abstraction 의 변종. 실제 재사용 변형 발견 시 도입 정합.

### 검증 (PM3 사이클)

- 게이트: typecheck 0 / build OK 3.27s (bundle 67.63 KB gzip — 변경 거의 0) / build-storybook OK 3.55s / check-secrets 0
- FSD bottom-up 정합 ↑ (entities = 도메인 type + 공통 fetch / pages/{slice}/api = page-only loader)
- 응집도 ↑ (페이지가 자신의 데이터 로직 소유)

### Changed (보류 사이클 자율 진행 — 2026-05-19 / 사용자 명시 "보류도 자율 진행해")

- **shared/ui atom 자매 정합 (작성 5 원칙 §1 적용)** — `Empty` / `Loading` 의 `Props` interface 를 `extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>` + `{...rest}` spread 패턴으로 갱신 (Button 자매 정합). 사용처 외부에서 `id` / `aria-*` / `data-*` 등 표준 HTML attribute 주입 가능. 기존 사용처 (Empty 8 곳 / Loading 6 곳) = `children` + `className` 만 사용 — 회귀 0. atom 의 작성 5 원칙 §1 (레이아웃 외부 주입) 정합 회복.
- **src/README §디렉토리 구조 stale 정정** — `shared/api/` 안 stale 표기 `manifest.ts (fetchSeriesIndex / fetchSeriesManifest / fetchMarkdown / normalizeSeriesManifest)` → 실제 `markdown.ts (fetchMarkdown raw text)` 만. `fetchSeriesIndex` / `fetchSeriesManifest` / `normalizeSeriesManifest` = `entities/series/api/fetch-manifest.ts` (이전 사이클 이동). `shared/lib/` 목록에 `use-dialog` 추가.
- **src/README §API 위치 결정 표 정정** — `shared/lib/manifest.ts` (존재 X) → `shared/api/markdown.ts` 로 정정 + entities 예시 = `entities/series/api/fetch-manifest.ts` 정합 (시리즈 도메인 IO / 여러 widget·page 호출). 전역 공통 절에 *도메인 무관* 명시 + pure 변환 함수 (`renderMarkdown` 등) `shared/lib/` 정합 보강.

### 검증 (보류 사이클)

- `entities/{series, chapter, character}/{api, model, index.ts}` segment 분리 정합 ✓ (변경 불필요)
- `shared/api/` (도메인 무관 IO) ↔ `shared/lib/` (pure 변환) ↔ `entities/{slug}/api/` (도메인 IO) 경계 정합 ✓ (책임 분리 명확 — 통합 X)
- BookReader compound 패턴 = *보류* (현 사용처 1곳 — `pages/chapter/chapter.tsx`만. 작성 5 원칙 §2 "2+ 변형 발견 시" 미충족 — premature abstraction 회피)
- 게이트: typecheck 0 / build OK 1.83s (bundle 67.63 KB gzip) / build-storybook OK 2.78s / check-secrets 0

### Added (Atomic Design 가이드라인 도입 — 2026-05-19 사이클 / 사용자 명시 *workflow 6 단계 강제 + 비판적·상세 자율 진행*)

- **Atomic Design 5 단계 공존 (v3.5, 2026-05-19)** — FSD 6 레이어 위에 atoms / molecules / organisms / templates / pages 5 단계를 *논리적 분류* 로 공존. **디렉토리는 FSD 유지** (Atomic 디렉토리 신설 X). Atomic = *Storybook 사이드바 + 컴포넌트 작성 멘탈 모델 + 작성 5 원칙* 으로만 적용.
  - **분류 기준 = 컨텍스트 유무**: atoms (shared/ui — 비즈니스 로직 0 + HTML element 수준) / molecules (SRP + 컨텍스트 X + UI 네이밍 — `IconButton`) / organisms (컨텍스트 ○ + 도메인 네이밍 + 명확한 영역 — `Header`, `BookReader`) / templates (별도 슬라이스 X — pages 직접 레이아웃) / pages (실제 콘텐츠).
  - **모호 시 organism 시작** → Bottom-Up 재사용 발견 시 molecule 추출 (premature abstraction 회피).
  - **컴포넌트 작성 5 원칙 정립** — (1) 레이아웃 스타일 외부 주입 (`HTMLAttributes<>` spread) (2) Compound 컴포넌트 패턴 (큰 organism — 2+ 변형 시 도입) (3) UI 상태 / 이벤트 핸들러 = props 주입 (presentational) (4) SRP (5) 네이밍 = molecule UI / organism 도메인.
  - **영향 문서**: `src/README.md` §Atomic Design 전면 작성 (5 단계 정의 + FSD ↔ Atomic 매핑 표 + Storybook title 컨벤션 + 의사결정 트리 + 작성 5 원칙 + Molecules 분리 후보) / `.claude/CLAUDE.md` §4 (FSD + Atomic 공존 + 13 widget 정정 + Bottom-Up widgets 보충 + 신규 Atomic 5 단계 sub-bullet) + §하네스 트리거 표 / `.claude/workflow/template/prompt-reference.md` §2 (런타임 ↔ dev 분리 정합 / Tailwind dev 도구 명시) + §3 (widgets 13 / pages 9 / features mini-game / Atomic 공존 표) + §7 (컴포넌트 작성 5 원칙) / `.claude/agents/heries-frontend-engineer.md` §0 + §2 (원칙 9, 10 신규 + Atomic 분류 + 5 원칙) + §5 (체크리스트 4 항 추가) + §6 (트리거 키워드 확장) + frontmatter / `.claude/skills/heries-orchestrator/SKILL.md` (라우팅 표 트리거 확장).
  - **Storybook title 컨벤션 적용 (20 stories)** — `atoms/{한글} ({Pascal})` (4) / `molecules/{한글} ({Pascal})` (5) / `organisms/{한글} ({Pascal})` (11). 한글 제목 보존 + Pascal 명 병기. shared/ui (4) / widgets/소형 (4) / pages/character (1) / widgets/합성 (9) / features/mini-game (2).
  - **계획서 SSOT**: `.claude/workflow/plan/atomic-fsd/01-context.md` ~ `04-tech-review.md` (Step 01~04 산출물).
  - **코드 영향 0** — 디렉토리 변경 X / FSD 격리 영향 0 / TS strict 영향 0 / 마스킹 정책 영향 0. 게이트 통과: typecheck 0 / build OK / build-storybook OK (title 충돌 0) / check-secrets 0.

### Added (Phase 12 + 던전 SSOT 사용자 명시 — 2026-05-19 추가 사이클)
- **dungeon.md v2** *(사용자 명시 통합)* — §2 발생 패턴 (랜덤 발생 / 마수 지구 유입 = 사람 해침 = 시급 클리어) + §3 폐쇄 메커니즘 (보스 처치 = 유일 폐쇄) + §4 자원 / 경제 시스템 (지구에 없는 자원 + 마수 시체 = 돈 + 헌터 수익원 4종 + 등급별 격차) + §5 작전 분담 표 (협회 매입 시장 추가) + §7 TBD 갱신.
- **awakener-system.md v3** (dungeon v2 정합 동기화) — §2-2-1 헌터 = 직업 = 던전 부산물 수익 신규 + §5-3-1 마수 시체 = 돈 신규 + §5-4 던전 절 전면 갱신 + §6 SSOT 누적 표 #12~#16 5 항목 추가.
- **writing-principles.md v2.1** — §2-1 *...* 강조 *내면 사고 X* 명시 + *한 명사 단독 끊김* 명시 / §2-2 *주어 mismatch / 목적어 누락 / 띄어쓰기* 3 패턴 신규 추가.
- **harness/harness.md** — 인덱스 표에 git-strategy + private-config 추가 + 진입 순서에 콘텐츠 SSOT cross-link.

### Fixed (Phase 12 추가 사이클)
- **챕터 본문 작가 영역 정정 5 곳** — ep-02 §1 *각성자 한 명 식별* 한 줄 + ep-02 §4 진혁 *돈* 동기 발화 + 코치 *정예 부대 수료자 적음 / 너 같은 애가* 응답 + ep-01 §3 60→35행 압축 + 대화 컷 6줄 삽입 + ep-04 §4 진혁 *떨립니다. 안 보일 뿐이에요* 답 + ep-03 §2 측정관/면접관 *탈인간급 / 인원 부족* 톤 보강.
- **자체 재검토 추가 정정** — ep-02 §4 *너 같은 신체가* → *너 같은 애가* (주어 mismatch) + ep-01 §3 *어머니의 어깨가 진혁을 밀고* → *어머니가 진혁의 어깨를 밀고* (원본 복원) + *체육 선생이 육상부에* → *체육 선생이 진혁을 육상부에* (목적어 보충) + ep-02 §1 *그 사람.* 단독 시구 합치기.
- **카드 잔여 위반** — woo-jin-hyeok.md *재등급 심사* → *재등급 측정* + *한 박자 어색한 웃음* → *살짝 어색한 웃음*.
- **shared/lib** — use-scrollbar-autohide keydown 핸들러 leak 정정 (cleanup 정확 제거).
- **CSS dead rule 제거** — layout.css `main.page-about` + `.about-meta` (about.tsx Tailwind 마이그레이션 후 잔존) + responsive.css `.series-card / .scroll-nav-btn / .chapter-nav-link` hover (Tailwind v4 마이그레이션 후 잔존).
- **widgets 자매 정합** — author-mode-toggle / header-contact transition 일관 (`[color,background-color]` → `[color,background]`) + chapter-toc SortBtn focus-visible ring + character-list locked card role="group" + launcher dialog aria-modal="true".
- **a11y MAJOR 3** — header-nav focus-visible underline + theme-toggle aria-label 단순화 + author-mode input aria-describedby 연결.
- **series-list FilterTab** — WAI-ARIA tabs 키보드 네비 (Arrow/Home/End + roving tabindex + id) + `<time dateTime>` 추가 (자매 series.tsx TabNav 정합).
- **not-found.tsx** — `<main>` className + `<h1>` 추가 (자매 정합) / **about.tsx** — `max-w-reader` → `max-w-page` 통일.
- **CSS 토큰** — `--shadow-md` 신규 추가 (3 곳 dark variant) + chapter-toc 토큰화.

### Internal (Phase 6~8)
- **worldbuilding 신규** — dungeon.md / _mob-pool.md (단역 풀 SSOT character-doctrine §2-6 정합).
- **scripts** — check-secrets.mjs 미사용 param 제거 + check-manifest.mjs `_` prefix 운영 파일 제외 로직.
- **TS strict 강화** — `exactOptionalPropertyTypes` + `allowUnreachableCode` + `allowUnusedLabels` 3 옵션 활성.

### Added (작가 원칙 SSOT v2 + a11y + 코드 검토 — 2026-05-19 사이클)
- **writing-principles.md v2** — §1-4 *부대 = 비각성자 only + 임무 중 각성 시 퇴소 (예외 잔류 사유 명시)* 신규 / §1-5 *퇴소 사유 5종 (사망 최다 / 불구 / PTSD / 자의 탈진 / 자의 목표)* 신규 / §2-2 *한국어 문법 정합* 신규 (주어·서술어·조사·시제 + 어색 신조 금지) / §1-3 *탈인간급·인원 부족* 톤 강화 / 번호 재정렬 + §4-2 자체 검증 v2.
- **CLAUDE.md §10** = 한국어 문법 / 부대 구성 / 퇴소 사유 3 항목 신규. **§12 + workflow.md §0** = workflow 강제 범위 확장 (모든 챕터 / 신규 기능 / 개선 / SSOT 갱신).
- **6 agents** — workflow 강제 + Required Read (writing-principles.md) 명시. **continuity-reviewer §5** = 검증 체크리스트 v2 (신규 SSOT 3종 추가).
- **shadow 토큰 신규** (`--shadow-md` — root + dark prefers + dark data-theme 3 곳) + chapter-toc 토큰화.
- **TypeScript strict 강화** — `exactOptionalPropertyTypes` + `allowUnreachableCode` + `allowUnusedLabels` 3 옵션 활성 (typecheck 0 에러). `fetch-manifest.ts` started/thumbnail conditional assign 정합.
- **a11y (WCAG 2.1 AA)** — TabNav 키보드 네비 (Arrow/Home/End + roving tabindex) + Series heading 계층 (Synopsis/Lore Notes/Cast/Latest → h2) + 3 dialog `aria-modal="true"` (header-mobile-menu / author-mode-toggle / header-contact) + main div `tabIndex={-1}`.
- **manifest 신규 필드** — `categories: string[]` + `loreNotes: LoreNote[]` + Series 페이지 SeriesHeader / TabNav / OverviewPanel / CastSection / LatestChaptersSection / CharactersSpoilerAlert 재작성 (시안 img_2.png 정합).

### Fixed
- **챕터 본문 SSOT 위반 21 곳 정정** — ep-01 (5) / ep-02 (6) / ep-03 (6) / ep-04 (4): *한 박자* 8 곳 + *…* 강조 (내면 사고) 6 곳 + 시구 패턴 (한 줄 / 한 발, 다시) 2 곳 + 띄어쓰기 (두 마리 / 죽일 겁니다) 2 곳 + 단조 종결어 합치기 1 곳 + 카드 인용 정합 (ep-03 진혁 *돈* 동기) 1 곳 + ep-04 선아 *고2*→*고1* (시점 정합) 1 곳 + ep-03 *각성 측정*→*각성 확인* 1 곳.
- **캐릭터 카드 6 곳** — *한 박자* 5 곳 + 트라우마 앵커 1 곳. 우선아 카드 ep-04 학년 SSOT *고1* 확정 (TBD → 확정) + 앵커 기술 정합.
- **문서 stale 정정** — README + CLAUDE.md + prompt-reference.md = Vite 6→7 / Storybook 8→9 / *tba*→*연재 중*. src/README.md widgets 리스트 12개 정확 반영 (HeaderNav / HeaderMobileMenu / HomeHero 신규 추가 / SeriesList 삭제 반영) + features mini-game 명시.

### Added (홈/시리즈 디자인 개선 — 2026-05-19 시안 정합)
- **홈 페이지 Hero 재작성** (`widgets/home-hero/home-hero.tsx`) — *H-eries · Multi-verse Collection* 캡션 + 큰 헤드라인 *서로 다른 세계가 / 하나의 상상으로 연결됩니다.* + 부제 2줄 + *시리즈 보러 가기* CTA (검정 둥근 버튼) + *H-eries 소개* 보조 링크. 헤드라인 = clamp(36px, 6vw, 72px). 시안 img.png 정합.
- **시리즈 목록 페이지 신규** (`/series`) — Breadcrumb + 페이지 헤더 + 통계 (전체/연재 중/완결) + 필터 탭 (URL ?filter=ongoing|done) + 가로형 카드 (썸네일 + 메타 + 자세히 CTA) + Coming soon placeholder. 시안 img_1.png 정합.
- **헤더 nav 신규** (`widgets/header-nav/`) — *시리즈* / *소개* 텍스트 링크 + 활성 라우트 강조. sm 미만 hidden.
- **Storybook stories** — home-hero (기본 + 다크) / header-nav (기본 + 시리즈 활성 + 소개 활성)
- **sitemap** — `/series` 추가 (priority 0.95)

### Changed
- **홈 페이지** = 작품 목록 섹션 제거 (`/series` 페이지로 분리). Hero CTA 중심 단순화.

### Internal
- bundle gzip 68.48 → 66.71 KB (-1.77 KB, home chunk 축소)

---

## [v0.3.1] — 2026-05-18

콘텐츠 (ep-04 + 우선아·김성훈 카드) + 헤더 SoC + FSD segment + dependency major. 상세 = git log 12e65d0.

### Added (콘텐츠 — ep-04 발행)
- **`chapters/ep-04.md` *자대*** — 4 절 (수료 / 자대 도착 / 동기 / 첫 출동 명령), 3824 자. 진혁이 수료 평가 양호로 본인 희망 자대 (서울 북부 비각성자 부대) 배치, 4 인 1 조 편성 (김성훈 + 전직 119 / 대학 휴학 2 명), 첫 출동 직전 학생증 사진을 한 박자 보는 행동으로 컷
- **자대 동기 김성훈** 첫 등장 (ep-04 §3 — 윤곽만, 미래 정보 백엔드 전용)

### Added (캐릭터 카드 — SSOT)
- **`characters/2-major-supporting/woo-seon-a.md`** 신규 (우선아) — 진혁의 동생, 고등학생, 공개 절 5 + 백엔드 절 5. ep-04 §4 학생증 사진 정서적 앵커 정합. 거주지 = 구리 (백엔드 SSOT, 본문 노출 X)
- **`characters/2-major-supporting/kim-seong-hun.md`** 신규 (김성훈, 자대 동기) — 공개 절 5 + 백엔드 절 5. **각성 트리거 인물** (백엔드 전용, 미래 정보)

### Changed (캐릭터 카드 — 우진혁 ep-04 정합)
- `frontmatter.reader_snapshot: ep-03 → ep-04`
- §외형 손 백엔드: 손등 옅은 흉터 1줄 (졸업식 강당 ep-02 정합 — continuity-reviewer M1)
- §군 §훈련 종합: 수료 평가 양호 + 본인 희망 자대 배치
- §군 §부대 위치 (신규): 서울 북부 비각성자 부대 + 4 인 1 조 + 분대장 상사 + 동기 3 명
- §가족 §남매 거주지 (백엔드): 구리
- §각성 트리거: 입대 동기 = 김성훈 매핑
- §주변 호칭 사전: 5 행 추가 (수료 동기 / 자대 분대장 / 김성훈 / 119 / 휴학)

### Changed (발행 메타)
- `manifest.json`: ep-04 chapter + 우선아 / 김성훈 character 등록
- `_series.md` updated: 2026-05-18
- `thumbnails/ep-04/` 디렉토리 + `PROMPT.md` ep-04 5장 영문 cinematic (대표 + §1~§4)

### Added (시각 검증 — Storybook)
- **5 신규 widget storybook stories**: `author-mode-toggle / theme-toggle / header-contact / header-actions / header-brand` 각 3 variant (잠금/활성/다크 또는 sun/moon/monitor 등). 정책 #11 (shared/ui 강제) 외 widgets 도 권장 적용. build-storybook 통과

### Added (audit 보고서 — 사용자 결정 대기)
- **`.claude/workflow/audit/2026-05-18-gwangsalgeom-complexity.md`** — 1369 줄 광살검 컴포넌트 5 파일 분할 권장 (Phase 1 적용 시 메인 920→480 줄 60% 감소). 게임 메커닉 변경 risk 0 — 순수 추출만 (상수/타입/순수 함수). **자동 적용 X**
- **`.claude/workflow/audit/2026-05-18-gwangsalgeom-css.md`** — 795 줄 60 selector cross-check. 진짜 dead 0 건 (false positive 12 건 분석). 실제 issue 1 건: `sm-hud-title` className CSS 정의 누락 (unstyled). **자동 적용 X**

### Fixed (사소)
- `pages/home/home.tsx`: `<h1>` 마침표 제거 (브랜드 톤 정합)

### Fixed (콘텐츠 SSOT — 정합 사이클)
- **`chapters/ep-03.md` SSOT fix** — 진혁 출신 답 `"구리시"` → `"서울."` (우진혁 카드 §출신 배경 SSOT + ep-04 §3 *서울입니다.* 정합) + 수료 동기 출신 *남양주 호평. 오는 데...* → *외곽 쪽. 오는 데...* (자치구·동 단위 본문 노출 정책 *서울 북부* 한계 위반 정정, 시간 디테일 보존). 사건/결과/플롯 변경 0
- **`chapters/ep-04.md` (M2 적용)** — §2 마무리 비교절 *사물함 문을 닫는 손이 본가의 옷장 문을 닫던 결과 비슷했다* 삭제 (사용자 메모리 시적 표현 금지 정합, continuity-reviewer minor M2)
- 신규 카드 **헤더 한글 통일** (`woo-seon-a.md` / `kim-seong-hun.md`) — `## H-eries 분기 — Clash of Multiverses 변형` → `## H-eries 분기 — 차원 격돌 변형` (우진혁 카드 + 시리즈 한글 명 정합)
- **`woo-seon-a.md` SSOT reference 정정** — *(ep-03 §2 본문 명시)* → *(백엔드 SSOT — 본문 노출 X)* (ep-03 본문 정정 후 reference 어긋남 해소)
- **`kim-seong-hun.md` markdown 정합** — 테이블 외부 `|` 시작 한 줄 → 일반 텍스트
- **ep-04 frontmatter** `characters: ["우진혁"]` → `["우진혁", "우선아"]` (ep-01~03 정합, 우선아 학생증 사진 + 호명 5 회 정서적 등장)

### Added (audit 보고서)
- **`.claude/workflow/audit/2026-05-18-chapter-vocab-region.md`** — 어휘 / 자치구 grep cross-check. ep-03 SSOT 위반 1 건 자동 정정 완료, 정정 후 grep 0 ✓
- **`.claude/workflow/audit/2026-05-18-autonomous-cycle-summary.md`** — 자율 사이클 누계 + 결정 대기 항목 정리

### Added (시각 검증 — Interaction Stories)
- **`AuthorModeToggle` / `HeaderContact`** `play` function 추가 (`@storybook/test` 활용) — 다이얼로그 open + 제목 + input/이메일 expect 검증

### Changed (캐릭터 카드 — 김성훈 신설)
- **`characters/2-major-supporting/kim-seong-hun.md`** 신규 (자대 동기 — 각성 트리거 인물). 공개 절 5 + 백엔드 절 6 (성격·대화·출신·각성 트리거·호칭·이력). 미래 정보 백엔드 전용

### Changed (운영 정합)
- `manifest.json`: 김성훈 character entry 등록
- 신규 widget 5 종 + Interaction stories 반영 → `src/README.md` widgets 목록 갱신
- public/sitemap.xml: ep-04 chapter URL 추가 (`/chapter/4`)
- `gwangsalgeom.tsx` 주석 + `tailwind-migration.md` stale stickman-murim 텍스트 정정 (sm- prefix 호환 보존 명시)

### Changed (FSD 아키텍처 정합 — segment 도입 + Bottom-Up 가이드)
- **entities/ segment 분리** — 3 entity (`series` / `character` / `chapter`) 각각 `api/load-*.ts` + `model/types.ts` + `index.ts` (re-export) 구조. 이전 단일 파일 (loader + type 혼재) 폐기. FSD segment 네이밍 (`api` / `model` / `lib` / `config` / `ui`) 정합
- **shared/api/ 분리** — `shared/lib/manifest.ts` → `shared/api/manifest.ts` (git mv). fetch + 정규화 함수 (fetchSeriesIndex / fetchSeriesManifest / fetchMarkdown / normalizeSeriesManifest) 모음. import 경로 6 파일 정정 (pages 2 + widgets 1 + entities 3)
- **shared/config/ 분리** — `shared/lib/spoiler-patterns.json` → `shared/config/spoiler-patterns.json` (git mv). 설정 파일 segment 분리 (정책 SSOT)
- **`CLAUDE.md §4` FSD 가이드 보강** — Bottom-Up 작업 흐름 (pages → features → entities → shared 순으로 위 레이어 이동) / Segment 네이밍 원칙 (`components` / `hooks` 같은 성격 X) / widgets 활용 / Slice grouping 미사용 (단일 작품 도메인) 명시
- **`src/README.md` 갱신** — H-eries FSD 적용 결정 6 절 추가 (widgets / grouping / segment / API 위치 / Bottom-Up / 격리), 디렉토리 트리 = entities api/model + shared/{api, config, lib, ui, images, styles}

### Changed (a11y micro)
- `HeaderActions` = `role="group" + aria-label="페이지 액션"` 추가 (3 토글 그룹 시맨틱)
- `series.tsx` tabs = `id` + `aria-controls` + 각 panel `role="tabpanel" + aria-labelledby` (WAI-ARIA tabs 완전 정합)
- `chapter.tsx` scroll-nav = `<div role="toolbar" aria-label>` 변경 (role 없는 aria 무의미 해소)

---

## [v0.3.0] — 2026-05-17

dev tooling 대규모 도입 + CSS Tailwind 전면 전환 + bundle 최적화. **사용자-facing 시각 변경 최소 (디자인 토큰 동일)**, 다만 dev 환경 + 빌드 산출물 구조 변경 큼.

### Added (CSS 아키텍처)
- **ITCSS 7 layer** (Inverted Triangle CSS, Harry Roberts) 차용 + 명시 — Settings / Tools / Generic / Elements / Objects / Components / Utilities. 본 프로젝트 매핑: tokens.css = Settings, base.css reset = Generic, base.css 의 a/button/img + typography.css h1~h6 = Elements, layout.css + utilities.css = Objects, 슬라이스 .css = Components, Tailwind class = Utilities
- **`src/shared/lib/cn.ts`** 신규 — shadcn/ui 패턴의 `cn()` class composition helper (런타임 의존 0 자체 구현, 0.2 KB)
- **`scripts/check-manifest.mjs`** 신규 — manifest.json vs filesystem 정합 자동 검증 (누락=error, 고아=warning). build 게이트 추가
- **`tailwind.css @theme` 토큰 보강** — `--text-2xl/3xl`, `--container-page/reader`, `--shadow-soft`, `--radius-*`, `--accent-soft/ring`, `--accent-fg` (accent 배경 위 텍스트 색, 다크 모드 자동)

### Added (shared/ui 컴포넌트 — 정책 #11 stories)
- **`shared/ui/empty`** — 빈/오류 상태 안내 (`<Empty>오류: ...</Empty>`). 8 곳 사용
- **`shared/ui/loading`** — 로딩 안내 (`<Loading />` default = "불러오는 중…"). 6 곳 사용 + Suspense fallback
- **`shared/ui/button`** — variants (primary/secondary/ghost) + sizes (sm/md). shadcn 패턴 + cn() helper + disabled 시각. Button primary = inline style var(--accent) + var(--accent-fg)
- **`shared/ui/index.ts`** barrel — 단일 import 옵션 (개별 슬라이스 index.ts 도 그대로 유효)

### Added (dev tooling)
- **React Compiler (babel-plugin-react-compiler)** — `compilationMode: 'all'`. 자동 메모이제이션
- **ESLint 9** flat config + plugins
  - `@typescript-eslint/{parser, eslint-plugin}` + `eslint-plugin-react` + `eslint-plugin-react-hooks@5` + `eslint-plugin-jsx-a11y`
  - FSD 격리 룰 (`no-restricted-imports` per-layer) — 정책 #4 자동화
  - 코드 품질 룰 (`eqeqeq`, `no-var`, `prefer-const`, `no-console`, `react/jsx-key` 등)
  - a11y 룰 (alt-text, aria-*, heading-has-content, tabindex-no-positive 등)
  - `npm run validate` 단일 게이트 = lint + typecheck + build
- **Tailwind v4** (`tailwindcss` + `@tailwindcss/vite`) — coexist 패턴
  - `tailwind.css` 의 `@theme` 가 tokens.css :root var 직접 참조 (SSOT 단일). 다크 모드 자동 반영
  - 전략 SSOT: `tailwind-migration.md` (토큰 매핑 + Phase 로드맵)
- **`tsconfig.verbatimModuleSyntax: true`** — type-only import 명시 강제

### Changed (CSS Tailwind 전면 전환 — 6 페이지 + 5 widget + 1 ui 슬라이스 완료)
- **pages/not-found** — Tailwind utility 전환, `not-found.css` 폐기
- **pages/about / pages/notice** — wrapper Tailwind 전환 (page-about/notice/about-meta 폐기). breadcrumb / loading / empty / article-prose 는 ITCSS layer 4-5 보존
- **pages/home** — hero grid + figure aspect-[16/9] + cta 모두 Tailwind, `home.css` 폐기
- **pages/series** — hero (grid clamp 220-320px) + tabs + status-pill 모두 Tailwind, `series.css` 폐기
- **pages/character** — hero + meta-aside (sticky + grid 2col + child selector [&>dt]/[&>dd]) + locked card 모두 Tailwind, `character.css` 폐기
- **widgets/footer** — Tailwind utility 전환, `footer.css` 폐기
- **widgets/header** — Tailwind utility 전환 (backdrop-blur + responsive max-sm:hidden 등), `header.css` 폐기
- **widgets/series-list** — grid auto-fill 320px + aspect-[16/9] + group-hover scale 등, CSS 가 home.css 안 정의됐던 룰 폐기
- **widgets/chapter-toc** — sort toggle + chapter-row grid 96px_56px_1fr_auto + cn() helper 첫 사용, CSS 가 series.css 안 정의됐던 룰 폐기
- **widgets/character-list** — 그룹별 grid auto-fill 240px + has-[a]:hover 변형, CSS 가 series.css 안 정의됐던 룰 폐기
- **shared/ui/error-boundary** — Tailwind utility 전환 (시각 + dev stack trace details 모두), `error-boundary.css` 폐기
- **storybook preview** — tailwind.css import 추가, 폐기된 .css import 모두 제거
- **마이그레이션 보류** (각자 정합 이유):
  - **pages/chapter** — `.article` / `.article-wiki` / `.article-prose` body typography 룰 40+ (h2/h3/p/ol/ul/blockquote/hr 등 markdown 결과). 시각 회귀 위험 매우 큼.
  - **pages/unlock** — `author-mode.css` 안 정의 (작가 모드 전용)
  - **features/mini-game/** — 게임 좌표계 (px) / `@keyframes` / `transform: scale(var(--mg-scale))` / `::-webkit-scrollbar-thumb` 등 Tailwind 가 표현 안 함

### Changed (보안)
- **`check-secrets.mjs`** 패턴 7종 추가 — GitHub fine-grained PAT / OAuth, Anthropic API, Stripe live/restricted, Slack token, PEM private key, JWT

### Changed (CI)
- **deploy.yml** = Lint step 추가 (typecheck 직전)

### Bundle (현 상태)
- 메인 js: 81.88 KB gzip (v0.2.7 = 97.62 → **-15.7 KB** route-based code-split + mini-game lazy)
- 메인 css: 8.71 KB gzip (v0.2.7 = 11.65 → **-2.9 KB**)
- 각 page chunk: 0.4~6 KB (lazy fetch)
- mini-game chunk: 16.39 KB js + 6.06 KB css (사용자가 게임 메뉴 클릭 시만 fetch)
- 빌드 시간: ~1.5s

### Performance (route-based code-split — React.lazy + Suspense)
- Home = eager (초기 진입 = 메인 + home chunk)
- About / Notice / Series / Chapter / Character / Unlock / NotFound = lazy
- MiniGameLauncher (home + series page) = lazy
- Suspense fallback = `<Loading />` (shared/ui/loading 컴포넌트)
- 사용자 첫 진입 = ~90 KB gzip (vs 이전 110 KB)

### Fixed (자율 사이클 진행 중)
- **React Compiler `compilationMode 'all'` → `'infer'`** — `'all'` 모드가 plain utility 함수 (theme.ts / makePlayer 등) 도 컴파일 → `useMemoCache` hook 호출 → module top-level 또는 React tree 밖 호출 시 "Invalid hook call" fail. `'infer'` (React default) = 컴포넌트 (PascalCase + JSX 반환) + hook (`use` prefix) 자동 감지·컴파일 = 안전 + 자동 메모이제이션 효과 유지
- **`applyTheme(getTheme())` module top-level 호출 이동** — main.tsx 의 React 진입 전 호출을 `index.html` inline script 로 이동 (first-paint 전 FOUC 차단)
- **CSP meta `frame-ancestors 'none'` 제거** — `<meta>` 태그에서 무시되는 directive (HTTP header 만 유효), console warning 해소

### Changed (운영 정합 — 자율 사이클)
- 디렉토리 정합 — `dist-author/` (정책 #9 v2 단일 빌드 후 폐기), `content/_shared/` (v0.2.0 이미지 이동 후 빈) 폐기
- `.claude/CLAUDE.md` 정책 #3: v0.3.0 dev tooling (React Compiler / ESLint / Tailwind) 명시 + `compilationMode 'infer'` 권장 주석
- `.claude/agents/heries-{frontend-engineer, publisher}.md`: "Tailwind 도입 X" stale 정정 + `npm run validate` 게이트 안내
- `.claude/workflow/template/*.md`: "CLAUDE.md 11 원칙" → "13 원칙" 정합 + validate / check-manifest 게이트 추가
- `src/shared/lib/types.ts`: `CharacterFrontmatter.reader_snapshot` 필드 추가
- `src/README.md`: v0.3.0 dev tooling + CSS 아키텍처 명시

### Added (헤더 영역 SoC 정합 + 작가 모드 UX — 2026-05-18)
- **헤더 5 widget 슬라이스 신규** — `widgets/{author-mode-toggle, theme-toggle, header-contact, header-actions, header-brand}/`. `widgets/header/header.tsx` 는 조립만 (`<HeaderBrand /> + <HeaderActions />`) 책임 단순화
- **작가 모드 헤더 토글** (`widgets/author-mode-toggle/`) — 자물쇠 SVG 버튼 + native `<dialog>` 모달 (focus trap / ESC / backdrop 자동, 의존 0). 잠긴 상태 = 스포일러 주의 + 본인 책임 명시 + 키 입력 (눈 토글 SVG) + 잠금 해제 / 활성 상태 = 노출 안내 + 잠그기. `/unlock` 페이지는 `?unlock=KEY` 쿼리 진입용으로 유지
- **작가 문의 헤더 토글** (`widgets/header-contact/`) — 메일 SVG 버튼 + 다이얼로그 확인창 (안내 + 이메일 표시 + Copy/Check SVG 토글 (2초) + 메일 보내기). 즉시 mailto 트리거 X (실수 클릭 보호)
- **테마 토글 SVG 통일** (`widgets/theme-toggle/`) — unicode 글리프 (◐○●) → Lucide-style SVG (monitor/sun/moon) 18px stroke 2. 폰트 metric 으로 박스 위쪽 떠 보이는 이슈 해결 + 다른 헤더 액션과 정렬 정합
- **헤더 브랜드** (`widgets/header-brand/`) — `heries-mark.webp` 마크 (Vite `?url` import, hover scale) + `H-eries` 로고 + 부제. 마크가 "H" 자리에 위치하는 시각 트릭 (`[mark]eries` = "Heries"), aria-label `H-eries 홈` 으로 스크린리더 의미 보존
- **다이얼로그 패턴 정합** — native `<dialog>` + `showModal()` (의존 0). 중앙 정렬 = `fixed inset-0 m-auto + max-h-[calc(100dvh-32px)]`. backdrop click → 닫기 (`e.target === dialogRef.current`)
- **SVG 아이콘 정합** — 헤더 액션 = 18px stroke 2 (Lock/Unlock/Mail/Sun/Moon/Monitor), 다이얼로그 내부 = 14px (Copy/Check, EyeOpen/EyeOff). 모두 `currentColor` → 다크 모드 자동

### Changed (헤더 영역 후속 — 2026-05-18)
- 헤더 액션 우측 정렬 + 미니멀 그룹 (`gap-1` 배경/border 없음)
- 부제 모바일 노출 + 좌측 정렬 + `text-[10px]` 축소 + 로고와 더 붙음 (`gap-0 leading-[1.05]`)
- `pages/home/home.tsx`: `pb-[2px]` → `pb-0.5` (Tailwind shortcut)

### Notes
- 이전 v0.3.0 첫 시도에서 사이트 장애 → 즉시 롤백. 본 작업은 develop 에 보존, *재검토·테스트* 후 별도 release 진입
- 사용자-facing 변경 0 (시각·동작 동일 — dev tooling 만)
- CSS 마이그레이션 = 점진 (footer / not-found 까지 진행). 게임 슬라이스·markdown 본문은 후순위

---

## [v0.2.7] — 2026-05-17

### Fixed (광살검 모바일 결함 보강 — v0.2.6 hotfix)
- **모바일 가상 패드 위치 정합** — `sm-pad-base/dot` → `sm-stage` 자식 (`sm-world` 밖) 으로 이동. 이전 = `sm-world` 안 `transform: scale(view.scale)` 영역에 갇혀 JS 가 설정한 viewport px 좌표가 scale 적용 후 작아져 항상 좌상단 쪽 표시
- **`mini-game-dialog-card` height 명시** — `max-height` 만 → `height + max-height` 둘 다 `calc(100dvh - gap)`. 이전 = content fit → body flex 1 의 부모 height 가 frame content 따라감 → frame content 가 sm-stage size 따라가서 resize 시 무한 축소 루프. 광살검에서 브라우저 너비 줄였다 늘릴 때 stage 가 무한히 얇아지는 결함

### Changed (광살검 패드 버튼)
- **장풍 버튼 disabled** — `qiReady = ki >= QI_COST` 신규 + 내공 부족 시 `disabled` 속성 + `is-disabled` 클래스
- **이형환위 버튼 disabled** — 내공 부족 시 `disabled` 속성 + `is-disabled` 클래스 (기존 게이지 `sm-pad-cd` 위 보강)
- **`.sm-pad-btn` 라벨 가운데 정렬 + 줄바꿈 차단** — `width: 56` → `min-width: 56` + `padding: 0 10px` + `display: inline-flex` + `align-items/justify-content: center` + `white-space: nowrap` (이형환위 4자 라벨 폭 자동 fit + 글자 가운데)
- **`.sm-pad-btn:disabled / .is-disabled` 시각** — opacity 0.42 + grayscale 0.4 + cursor not-allowed + pointer-events none

### Notes
- 검증: typecheck 0 / vite build 0 / check-secrets 0
- 메뉴 화면도 dialog card 가 viewport 차지 (이전엔 content fit) — 무한 축소 루프 차단 우선

---

## [v0.2.6] — 2026-05-17

### Reverted
- **v0.2.4 / v0.2.5 모바일 변경 일괄 revert** — iOS 모바일에서 화면 자체 잘림 + 검기생존록 9:16 비율 깨짐 야기. v0.2.3 (`b5eaf3c`) 상태로 코드 복원
- v0.2.4 / v0.2.5 tag 는 history 보존 (이후 참고용)

### Fixed (광살검 무조건 fit)
- **`stickman-murim.tsx` fit() `STAGE_FIT_MIN_W/H` 폐기** — `Math.max(MIN, rect)` 가 viewport 가용 height (가로 모바일 ~322px) 보다 큰 `MIN_H = 420` 강제 → stage viewport 밖 삐져나옴. MIN 폐기로 "어떤 화면이든 fit" 보장. rect 0 시만 skip
- **`frame--landscape` min-height 동적** — `420px` → `min(420px, calc(100dvh - 120px))` (viewport 짧으면 자동 축소, 큰 viewport 는 420 floor 유지)
- **`sm-frame::after` 가로 회전 풀스크린 안내 폐기** — 게임 영역 가림 + 디자인 부적합. PC 권장 안내는 select intro 로 이동
- **모바일 헤더 슬림** — `--mg-dialog-head` 48 → 36, padding s-2 s-3 → 2px s-2, close 44 → 28, title font fs-md → fs-sm (가용 게임 height 증가)
- **`dialog-body` padding `s-2`** — 게임 frame 과 dialog 경계 분리 (이전 = 딱 붙음)

### Changed
- **PC 환경 권장 안내** — `mini-game-select-intro` 안에 `(PC 환경 권장)` 한 줄 추가 (모든 미니 게임 공통, 메뉴 화면 1회 안내)
- **`mini-game-select` grid** — `minmax(200px, 1fr)` → `minmax(min(200px, 100%), 1fr)` (좁은 viewport 시 단일 컬럼 fallback, 우측 overflow 차단)
- **`mini-game-select-card` 컴팩트** — padding s-5 s-4 → s-3, height 148 → min-height 128, emoji fs-2xl → fs-xl, title fs-md → fs-sm + nowrap ellipsis, desc 2줄 → 1줄 nowrap ellipsis (좁은 card 폭 글씨 잘림 차단)

### Notes
- 검증: typecheck 0 / vite build 0 / check-secrets 0
- 사용자 시연 후 v0.2.4 / v0.2.5 의 모바일 결함 호소 → 즉시 롤백 + fit 본질 해결 + UI 정합 동시 처리
- 단일 push 로 사이트 안정 복구 + 광살검 무조건 fit + 미니 게임 메뉴 정합 적용

---

## [v0.2.3] — 2026-05-16

### Changed (광살검 모바일 UX)
- **좌측 [←][→] 버튼 → 좌측 영역 swipe 가상 패드** (검기생존록 패턴 정합)
  - 터치한 자리에 반투명 ring + dot (조이스틱) 표시, drag dx 부호로 좌/우 이동
  - 우측 영역 = 베기·장풍·이형환위 버튼 (기존 유지)
- **모바일 portrait 시 가로 회전 안내** — `↻ 기기를 가로로 돌려 주세요` 풀스크린 (z-index 200). landscape 회전 시 자동 해제
- **터치 차단** — `user-select: none`, `touch-action: none`, `-webkit-touch-callout: none`, `-webkit-tap-highlight-color: transparent`, `overscroll-behavior: contain`, `onContextMenu` 차단. 더블탭 확대·텍스트 선택·long-press 메뉴·overscroll bounce 모두 차단

### Notes
- 사용자 시연 후 OK 확인 → main 직접 commit (release 사이클 단축)
- v0.3.0 (Compiler/ESLint/Tailwind) 은 develop 에만 보존 — 별도 release 진입 대기

---

## [v0.2.2] — 2026-05-16

### Changed (운영 — 분리 범위 확장)
- **`.claude/harness/harness-state.md` 분리** — 작가 운영 *engineering* 측면 (변경 이력 누적 SSOT) → `.private-config/heries/claude/harness/harness-state.md` + 심링크
- **`.env.local` 분리** — `VITE_AUTHOR_KEY` 등 작가 시크릿 → `.private-config/heries/frontend/env/.env.local` + 심링크. private repo 안에서 git 추적 가능 (이전 = gitignore 로 회피)

### Updated
- `scripts/init-private.sh` — 파일 심링크 (디렉토리 아닌) 도 처리 (`harness-state.md`, `.env.local`)
- `.gitignore` — 신규 심링크 2 경로 추가
- `.claude/harness/private-config.md` — 매핑 표 + 미분리 항목 갱신

### Notes
- `.claude/harness/` 의 나머지 (`harness.md`, `harness-setup.md`, `harness-install.md`, `git-strategy.md`, `private-config.md`) = 공개 유지 (정책·가이드 = OSS·외부 참고 가치)
- 사용자-facing 변경 0 (배포·빌드 동작 동일)

---

## [v0.2.1] — 2026-05-16

### Added (운영)
- **프라이빗 서브모듈 `.private-config` 도입** — 천기망 (`martial-arts-config`) 의 `heries/` 폴더 정합
  - `.claude/handoff/` → `.private-config/heries/claude/handoff/` 분리 + 심링크
  - `.claude/workflow/plan/` → 동일 분리 + 심링크
  - `.claude/workflow/prompt/custom/` → 동일 분리 + 심링크
- `scripts/init-private.sh` 신규 — clone 후 심링크 자동 생성 (작가/외부 기여자 모두)
- `.claude/harness/private-config.md` 신규 — 서브모듈 운영 SSOT (동작 원리·시나리오·트러블슈팅)

### Changed
- `README.md` 빠른 시작 = 서브모듈 권한 유무 따른 2 흐름 안내 + 브랜치 전략·프라이빗 자료 섹션 추가
- `.gitignore` = 심링크 3 경로 추가 (`.claude/handoff`, `.claude/workflow/plan`, `.claude/workflow/prompt/custom`)
- 사용자 메모리 `feedback_main_only_user_commits.md` (3 branch 전략 v2 + 서브모듈 정합)

### Notes
- 본 변경은 사용자-facing 0 — 작가 운영 흐름·UX 변경만. 사이트 빌드·배포 동작 동일
- 미분리 (공개 repo 유지): `.claude/agents`, `.claude/skills`, `.claude/CLAUDE.md`, `.claude/harness/*`, `.claude/workflow/{workflow.md, template/}` — OSS·외부 참고 가치

---

## [v0.2.0] — 2026-05-16

### Added (작품)
- 챕터 ep-01 *마수의 등장* 발행 (직전 사이클 누적, tag 0.1.x 미부여 분 포함)
- 챕터 ep-02 *마수와 사람 사이* 발행
- 챕터 ep-03 *입소* 발행
- 우진혁 카드 작가 백엔드 32+ 절 + reader_snapshot ep-03

### Added (코드 · 게임)
- **광살검 (stickman-murim) 미니 게임 신규** — 가로형 검술·장풍·이형환위·광살 액션
  - sprite 11장 (hero / hero-attack / hero-qi / hero-dash / assassin / elite / impact / impact-elite / death / gwangsal / dash-burst)
  - 메커닉: 베기 (Space) / 장풍 (Z, 내공 14 관통) / 이형환위 (Shift, 내공 31 + 3초 무적 + 경로 적 일소) / 광살 (내공 234 가득 시 자동, 적 전체 즉사)
  - dialog `mini-game-frame--landscape` modifier (가로형 dialog 수용)
- **디자인 토큰 (`--sm-*`) 20 토큰** 도입 (검기생존록 `--mg-*` 패턴 정합)
- **CHANGELOG.md + .claude/harness/git-strategy.md** 신규 (브랜치 전략 SSOT)

### Changed (코드 구조)
- **이미지 자산 폴더 이동** — `content/_shared/images/` → `src/shared/images/` (FSD 정합)
  - vite `?url` import 전환 → 자동 hash + cache-busting
  - 14장 이동 (mini-game sprite + heries-mark + thumbnail-placeholder + favicon)
- `scripts/check-images.mjs` + `optimize-images.mjs` 스캔 경로 갱신
- 시리즈 페이지에도 mini-game launcher 추가 (home + series 양쪽)
- 검기생존록 sprite 경로도 새 위치 정합
- `index.html` favicon 경로 정합

### Fixed
- `dashCdFraction = NaN` 버그 (DASH_COOLDOWN_MS=0 일 때 0/0) → ki 잔량 기반 게이지로 전환
- 광살검 sprite 본체 위치와 보호막 mismatch — ring 폐기 + sprite 자체 cyan drop-shadow glow
- `flipped` 로직 반전 (피격 sprite 방향)
- 장풍 hit knockback 제거 + wave `hitIds` per-wave 추적 (같은 적 중복 hit 차단)

### Removed (cleanup)
- 광살검 dead CSS ~120줄 (SVG 시절 잔존 룰 + ring `::before` fallback)
- TSX 미사용 import / 상수 (`SPRITE_DASH_BURST`, `DashGhost`, `KI_PER_QI_KILL`, `cx`)
- stale 주석 (졸라맨 무협 → 광살검, 천검기 폐기, 無影步 → 이형환위, 이형화위 오타)

### Refactored
- Magic number 9곳 상수화 (`HURT_FLASH_MS`, `QI_CAST_POSE_MS`, `GWANGSAL_FX_MS`, `DASH_PATH_PAD_RATIO`, `PARTICLE_LIFE_JITTER_*`, `PARTICLE_VY_BIAS_RATIO`, `GWANGSAL_HITSTOP_MS`, `ENEMY_KNOCKBACK_ON_DAMAGE`)
- nested ternary → if/else 추출 (광살검 2곳)
- React UMD global → 명시 import (`ReactNode`, `MouseEvent`, `CSSProperties`)
- `role="application" + tabIndex` 위치 정합 (광살검 ↔ 검기생존록 자매 게임 패턴 통일)

### Verified
- typecheck 0 / vite build 통과 (126 modules)
- dist css **11.33 KB gzip** / js **97.31 KB gzip**
- 이미지 budget OK (34 files, all ≤ 500 KB)
- check-secrets 0 누수

---

## [v0.1.0] — 2026-05-14

### Added (초기화 사이클 + 브랜치 전략 도입 전 누적)
- H-eries 프로젝트 초기 구조 (FSD 6 레이어, React 19 + Vite + Storybook)
- 작품 #1 *차원 격돌* (clash-of-multiverses) 골격
- 우진혁 카드 작가 백엔드 700+ 줄
- 미니 게임 *검기생존록 (swordsman-survival)* 신규
- 작가 모드 unlock 정책 v2 (단일 빌드 + runtime `/unlock` + `?unlock=KEY`)
- 빌드 게이트 — `check-images.mjs` + `check-secrets.mjs`
- 디자인 토큰 (`tokens.css`) + 다크 모드 자동 전환
- mini-game dialog launcher (catalog + games/)
- 콘텐츠 마크다운 렌더러 (`shared/lib/markdown.ts`)
- 컴포넌트 storybook (`shared/ui/` + 일부 `widgets/`)

### Notes
- v0.1.0 이전 git history = 본 tag 의 누적 변경. 자세한 commit 단위는 git log 참조.
- 본 release 직전 = 브랜치 전략 도입 (v0.2.0 부터 develop / release / main 3 branch + tag).
