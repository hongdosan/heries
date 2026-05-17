<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# Changelog

H-eries 의 *작품 + 코드* 모든 변경을 tag 단위로 기록한다.

형식 = [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) + [SemVer](https://semver.org/lang/ko/).

브랜치·release 운영 규약 = [`.claude/harness/git-strategy.md`](./.claude/harness/git-strategy.md).

---

## [Unreleased]

(다음 release 후보 — develop 안 누적 변경)

### Added (콘텐츠 — ep-04 발행)
- **`chapters/ep-04.md` *자대*** — 4 절 (수료 / 자대 도착 / 동기 / 첫 출동 명령), 3824 자. 진혁이 수료 평가 양호로 본인 희망 자대 (서울 북부 비각성자 부대) 배치, 4 인 1 조 편성 (조성훈 + 전직 119 / 대학 휴학 2 명), 첫 출동 직전 학생증 사진을 한 박자 보는 행동으로 컷
- **자대 동기 조성훈** 첫 등장 (ep-04 §3 — 윤곽만, 미래 정보 백엔드 전용)

### Added (캐릭터 카드 — SSOT)
- **`characters/2-major-supporting/woo-seon-a.md`** 신규 (우선아) — 진혁의 동생, 고등학생, 공개 절 5 + 백엔드 절 5. ep-04 §4 학생증 사진 정서적 앵커 정합. 거주지 = 구리 (백엔드 SSOT, 본문 노출 X)
- **`characters/2-major-supporting/jo-seong-hun.md`** 신규 (조성훈, 자대 동기) — 공개 절 5 + 백엔드 절 5. **각성 트리거 인물** (백엔드 전용, 미래 정보)

### Changed (캐릭터 카드 — 우진혁 ep-04 정합)
- `frontmatter.reader_snapshot: ep-03 → ep-04`
- §외형 손 백엔드: 손등 옅은 흉터 1줄 (졸업식 강당 ep-02 정합 — continuity-reviewer M1)
- §군 §훈련 종합: 수료 평가 양호 + 본인 희망 자대 배치
- §군 §부대 위치 (신규): 서울 북부 비각성자 부대 + 4 인 1 조 + 분대장 상사 + 동기 3 명
- §가족 §남매 거주지 (백엔드): 구리
- §각성 트리거: 입대 동기 = 조성훈 매핑
- §주변 호칭 사전: 5 행 추가 (수료 동기 / 자대 분대장 / 조성훈 / 119 / 휴학)

### Changed (발행 메타)
- `manifest.json`: ep-04 chapter + 우선아 / 조성훈 character 등록
- `_series.md` updated: 2026-05-18
- `thumbnails/ep-04/` 디렉토리 + `PROMPT.md` ep-04 5장 영문 cinematic (대표 + §1~§4)

### Added (시각 검증 — Storybook)
- **5 신규 widget storybook stories**: `author-mode-toggle / theme-toggle / header-contact / header-actions / header-brand` 각 3 variant (잠금/활성/다크 또는 sun/moon/monitor 등). 정책 #11 (shared/ui 강제) 외 widgets 도 권장 적용. build-storybook 통과

### Added (audit 보고서 — 사용자 결정 대기)
- **`.claude/workflow/audit/2026-05-18-gwangsalgeom-complexity.md`** — 1369 줄 광살검 컴포넌트 5 파일 분할 권장 (Phase 1 적용 시 메인 920→480 줄 60% 감소). 게임 메커닉 변경 risk 0 — 순수 추출만 (상수/타입/순수 함수). **자동 적용 X**
- **`.claude/workflow/audit/2026-05-18-gwangsalgeom-css.md`** — 795 줄 60 selector cross-check. 진짜 dead 0 건 (false positive 12 건 분석). 실제 issue 1 건: `sm-hud-title` className CSS 정의 누락 (unstyled). **자동 적용 X**

### Fixed (사소)
- `pages/home/home.tsx`: `<h1>` 마침표 제거 (브랜드 톤 정합)

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
- 작품 #1 *차원의 격돌* (clash-of-multiverses) 골격
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
