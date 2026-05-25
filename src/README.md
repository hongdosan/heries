<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# src/ — Feature-Sliced Design (FSD)

`H-eries` 의 프론트엔드. **React 19 + React Router 7 (BrowserRouter) + Vite 6 + TypeScript strict**. 런타임 외부 UI/상태 라이브러리 미사용 — *코드만 있으면 어디서든 실행 가능* 한 이식성 우선. GitHub Pages 배포는 `public/404.html` SPA fallback 트릭으로 deep link 호환 (런타임 의존성 추가 0).

**dev 도구 (v0.3.0+)**: Storybook · ESLint 9 (flat config + typescript / react / react-hooks / jsx-a11y plugins) · `babel-plugin-react-compiler` (`compilationMode: 'infer'` — 컴포넌트·hook 자동 메모이제이션) · **Tailwind v4** (`tailwindcss` + `@tailwindcss/vite`) · TypeScript 5. 모두 devDependencies — dist 영향 0~수 KB.

**CSS 아키텍처**: ITCSS 7 layer (Settings → Tools → Generic → Elements → Objects → Components → Utilities) + Utility-first Tailwind + shadcn/ui 패턴 `cn()` helper (`src/shared/lib/cn.ts`). 상세 = [`shared/styles/tailwind-migration.md`](./shared/styles/tailwind-migration.md).

## 6 레이어 (의존 방향: 위 → 아래만)

| 레이어 | 책임 | 의존 가능 (↓ 만) |
|---|---|---|
| `app/` | 글로벌 진입점 — `main.tsx` (`createRoot` + `StrictMode` + `BrowserRouter` + `Routes`) | pages, widgets, features, entities, shared |
| `pages/` | URL 단위 페이지 — `useParams` + `useAsync` + 페이지별 hero. **page-only loader 는 `pages/{slice}/api/`** (`loadSeries` / `loadChapter` / `loadCharacter` — 1 page only, 2026-05-19 이동). | widgets, features, entities, shared |
| `widgets/` | 페이지 구성 블록 (Header/HeaderBrand/HeaderNav/HeaderActions/HeaderContact/HeaderMobileMenu/AuthorModeToggle/ThemeToggle/Footer/HomeHero/ChapterToc/CharacterList/BookReader) — props-only | features, entities, shared |
| `features/` | 사용자 시나리오 (mini-game launcher 등) | entities, shared |
| `entities/` | 도메인 데이터 **type** + **공통 fetch** — `series` (`api/fetch-manifest` + `model`) / `chapter` (`model` only) / `character` (`model` only). 도메인 type SSOT + 다중 page 호출 fetch 함수만 남음. | shared |
| `shared/` | 도메인 무지 유틸 — `api/` (fetchMarkdown) · `lib/` (env·spoiler·use-async·markdown·frontmatter·types 등) · `config/` (spoiler-patterns) · `ui/` (atoms) · `styles/` · `images/` | (없음) |

> **격리 규칙**: 동일 레이어 슬라이스 간 직접 import 금지. 다른 슬라이스를 사용하려면 그 슬라이스의 Public API (`index.ts`) 만 통과.

## Public API 패턴

각 슬라이스는 외부 노출용 `index.ts` 를 통해서만 접근. import 시 `.js` 확장자 명시 (Vite + TypeScript Bundler 모드 호환).

```ts
// ✓ 권장
import { Header } from '../../widgets/header/index.js'

// ✗ 금지 — 내부 모듈 직접 참조
import { Header } from '../../widgets/header/header.js'
```

## 빌드

```bash
npm install              # 1회
npm run dev              # 개발 (http://localhost:8000)
npm run build            # 프로덕션 (dist/) — 라이브 배포용
npm run typecheck        # 타입 체크만
```

`.tsx`/`.ts` 소스만 git 커밋. 빌드 산출물 (`dist/`, `node_modules/`, `storybook-static/`) 은 `.gitignore`.

## 스포일러 분리 (runtime, 정책 #9 v2)

`shared/lib/spoiler.ts` + `shared/lib/use-author-mode.ts` 가 SSOT. 단일 빌드 산출물에 작가 콘텐츠 평문 포함되되, runtime 에 `useAuthorMode()` hook 이 sessionStorage `heries:author=1` 플래그를 구독해 마스킹 분기:

- `_series.md` 의 `## 시놉시스` 절 마스킹
- 캐릭터 카드의 `## H-eries 분기 ~` 이하 모든 절 마스킹
- 캐릭터 frontmatter 의 `heries_arc` 필드 제거
- 캐릭터 상세 페이지 = 주인공 외 라우트 가드 (잠금 안내)
- 챕터 본문은 마스킹 안 함 (이미 발행됨)

작가 모드 진입 = `/unlock` 페이지 폼 또는 `?unlock=KEY` 쿼리. `VITE_AUTHOR_KEY` 환경변수 (`.env.local` / GitHub Secret) 와 평문 비교. 환경변수 미설정 시 영구 잠금.

## 페이지 디자인 (디자인 시스템 v3)

| 페이지 | 레이아웃 | 핵심 요소 |
|---|---|---|
| `HomePage` | 큰 hero + 시리즈 카드 그리드 | 작품 1개당 카드 1개. 호버 elevate. |
| `SeriesPage` | hero (제목·상태 pill·시작일) + **3 탭** (개요·챕터·등장인물) | 정보 분리. `useState<Tab>` 로 탭 전환. |
| `ChapterPage` | reader 폭(680px) + EP 모노 태그 + 본문 + **prev/next 카드** | 큰 행간 (1.95) + `word-break: keep-all` 한글 친화. |
| `CharacterPage` | hero + **분할 레이아웃** (좌 sticky 메타카드 240px / 우 위키 본문) | 모바일은 단일 컬럼 적층. |

**디자인 토큰**: `shared/styles/tokens.css` 의 `:root` 에 surface/text/accent/spacing/type/radius/shadow/motion 정의. 다크 모드는 `@media (prefers-color-scheme: dark)` 로 토큰 swap. 단일 폰트 (Pretendard) + 잉크블루 액센트 + 모노톤.

**CSS 분산**: 슬라이스별로 `*.css` 를 함께 두고 `index.ts` 에서 import. 전역 CSS (tokens / base / typography / layout / utilities / author-mode / responsive) 는 `shared/styles/` 에 두고 `app/main.tsx` 에서만 import.

## 슬라이스 구성 (예시: `widgets/header/`)

```
widgets/header/
├── index.ts              # Public API — export { Header }
└── header.tsx            # 컴포넌트 본체
```

## 디렉토리 구조

```
src/
├── README.md
├── app/main.tsx                                    # createRoot + BrowserRouter + Routes
├── pages/{home,series,series-list,chapter,character,about,notice,unlock,not-found}/
│   ├── *.tsx                                       # useParams + useAsync + 페이지 hero
│   ├── {sub-component}.tsx                         # 페이지 내부 분리 컴포넌트 (locked-character-card 등)
│   ├── api/load-*.ts                               # page-only loader (series / chapter / character — 1 page only 라 page segment 정합, 2026-05-19 entities → pages 이동)
│   └── index.ts                                    # Public API
├── widgets/{header,header-brand,header-nav,header-actions,header-contact,header-mobile-menu,author-mode-toggle,theme-toggle,footer,home-hero,chapter-toc,character-list,book-reader}/
│   ├── *.tsx                                       # 컴포넌트
│   └── index.ts                                    # Public API
├── features/mini-game/                             # in-page launcher + games (lazy chunk)
├── entities/{series,chapter,character}/
│   ├── api/fetch-manifest.ts                       # 다중 page 호출 fetch (series only — fetchSeriesIndex / fetchSeriesManifest / normalizeSeriesManifest)
│   ├── model/types.ts                              # 도메인 type SSOT (SeriesFrontmatter / SeriesManifest / SeriesPageData / ChapterFrontmatter / ChapterPageData / CharacterFrontmatter / CharacterPageData 등)
│   └── index.ts                                    # Public API (type re-export + series 만 api re-export)
└── shared/
    ├── api/                                        # 도메인 무관 fetch — markdown.ts (fetchMarkdown raw text)
    ├── config/                                     # 설정 파일 — spoiler-patterns.json (마스킹 헤더 SSOT)
    ├── lib/                                        # types·frontmatter·markdown(renderMarkdown)·env·spoiler·use-async·cn·use-img-fallback·use-document-title·use-author-mode·use-scrollbar-autohide·use-dialog·theme
    ├── ui/                                         # button·empty·loading·error-boundary (정책 #11 stories 동반)
    ├── images/                                     # thumbnail-placeholder.webp (= H-eries 컬렉션 hero) / heries-mark.webp / favicon.webp / mini-game/sprites
    └── styles/                                     # 전역 CSS — tokens·base·typography·layout·utilities·author-mode·responsive·article·tailwind
```

## 작성 시 체크리스트

1. 새 슬라이스 작성 시 → 적절한 레이어 (`widgets/` vs `features/` vs `entities/`)
2. `index.ts` 만 Public API 로 export
3. 다른 슬라이스의 내부 모듈 직접 import 금지
4. 동일 레이어 간 import 발견 시 → `shared/` 또는 `entities/` 로 추출
5. 외부 라이브러리 import 발견 시 → 사용자 확인 (CLAUDE.md §3 — 최소 의존)
6. 신규 컨텐츠 절·필드가 스포 영역이면 → `shared/lib/spoiler.ts` 동시 갱신
7. 새 페이지/위젯의 스타일은 슬라이스 내 `*.css` 에 작성하고 `index.ts` 에서 import, `tokens.css` 디자인 토큰 사용 (raw 색상값 X)

## H-eries FSD 적용 결정 (2026-05-18)

본 프로젝트는 *H-eries 도메인 특성* 에 맞게 FSD 를 다음과 같이 결정.

### 1. `widgets/` 사용 ✓
- 헤더 SoC 분리 (5 widget: header-brand / header-actions / header-contact / author-mode-toggle / theme-toggle) + 페이지 조각 (home-hero / series-section / series-list / chapter-toc / character-list / footer) = **12 widget 활용**
- 재사용 가치 명확 (header-actions 가 다이얼로그 3 종 그룹화 등)

### 2. Slice grouping 미사용 (단일 작품 도메인)
- 현재 시리즈 = *차원 격돌* 1 종. pages/ 8 슬라이스 모두 독립.
- 미래 신규 시리즈 추가 시: `pages/series-collection/{home, list, series, chapter, character}` 그룹 검토.

### 3. Segment 네이밍 — *목적* 으로 (`components` / `hooks` X)
- `shared/lib/` = 라이브러리 코드 (use-async / markdown / spoiler / manifest 등)
- `shared/ui/` = 비즈니스 로직 X 공통 UI (Button / Empty / Loading / ErrorBoundary)
- `shared/styles/` = 전역 CSS
- `entities/{slug}/{slug}.ts` = 현재 type + loader 혼재. **`entities/{slug}/{api, model}/` segment 분리 권장** (개선 검토 영역)

### 4. API 위치 결정 (재사용 범위 기준)
| 사용 범위 | 위치 | 예시 (H-eries) |
|---|---|---|
| 1 page 만 사용 | `pages/{slice}/api/` | `pages/series/api/load-series.ts` / `pages/chapter/api/load-chapter.ts` / `pages/character/api/load-character.ts` (2026-05-19 entities → pages 이동 완료). |
| 1 도메인 안 여러 features | `features/{slice}/api/` | features/mini-game/ (도메인 데이터 없음 — 미사용) |
| 여러 도메인 재사용 | `entities/{domain}/api/` | `entities/series/api/fetch-manifest.ts` (fetchSeriesIndex / fetchSeriesManifest / normalizeSeriesManifest) — 시리즈 도메인 IO. 여러 widget·page 호출. |
| 전역 공통 (도메인 무관) | `shared/api/` | `shared/api/markdown.ts` (fetchMarkdown raw text — 도메인 무관 IO). pure 변환 함수 (`renderMarkdown` 등) 은 `shared/lib/` 정합. |

### 5. Bottom-Up 작업 흐름
신규 코드 작업 시 다음 순서:
1. **pages/{slice}/ 안 작성** (한 page 만 사용 시작)
2. 다른 page 에서 재사용 발견 시 → `features/{slice}/` 로 이동
3. 여러 features 에서 재사용 시 → `entities/{domain}/` 로 이동
4. 전역 사용 시 → `shared/` 로 이동

### 6. 격리 규칙 (ESLint 자동 강제)
`eslint.config.js` 의 `no-restricted-imports` per-layer 패턴 — 상위 레이어 import 금지. 동일 레이어 다른 슬라이스 = `index.ts` 만 통과.

## Atomic Design (FSD 와 공존, 2026-05-19)

본 프로젝트는 **FSD = 책임 격리** (디렉토리 구조 / import 방향 / Public API) 와 **Atomic Design = UI 위계 멘탈 모델** (Storybook 사이드바 그룹화 / 컴포넌트 합성 위계 / 작성 원칙) 을 *공존* 시킨다. 두 분류는 *직교* 관계 — FSD 는 *코드 조직*, Atomic 은 *UI 위계*. **디렉토리는 FSD 유지**, Atomic 은 멘탈 모델 + Storybook + 작성 원칙 으로만 적용한다 (Atomic 디렉토리 신설 X).

### 5 단계 정의 (H-eries 운용 기준)

| 단계 | 정의 | 핵심 기준 | H-eries 위치 |
|---|---|---|---|
| **Atoms** | 더 이상 분해 불가 + HTML element 수준 + 비즈니스 로직 0 + 컨텍스트 0 | props 로 모든 variant 제어 / 단일 책임 | `shared/ui/` 만 |
| **Molecules** | atoms 2~3 의 작은 조합 + **SRP** + **컨텍스트 X** + **UI 네이밍** (예: `IconButton`) | "한 가지 일" | `widgets/` 소형 / `pages/{slice}/sub` / `shared/ui/` (조합 시) |
| **Organisms** | atoms / molecules / organisms 의 합성 + **컨텍스트 ○** + **도메인 네이밍** (예: `Header`) + 명확한 영역 | "한 명확한 책임 영역" | `widgets/` 합성 / `features/{slice}/` |
| **Templates** | 페이지 레이아웃 골격 + 콘텐츠 X | 와이어프레임 | 별도 슬라이스 X — `pages/{slice}.tsx` 가 직접 hero + section 구성 |
| **Pages** | template 인스턴스 + 실제 데이터 + 콘텐츠 | URL 단위 진입점 | `pages/` 레이어 |

**Molecule ↔ Organism 경계의 핵심 = *컨텍스트 유무*.** UI 네이밍 + SRP = molecule / 도메인 네이밍 + 명확한 영역 = organism. *모호 시 organism 으로 시작* → Bottom-Up 으로 재사용 발견 시 molecule 추출.

### FSD ↔ Atomic 매핑 표

| FSD 위치 | Atomic | 예시 (현 H-eries) |
|---|---|---|
| `app/` | (외부) | `main.tsx` (Routes / Provider) |
| `pages/` 진입점 | **Pages** | `HomePage` / `SeriesPage` / `ChapterPage` / `CharacterPage` 등 9개 |
| `pages/{slice}/{sub}.tsx` | **Molecules** 또는 **Organisms** | `LockedCharacterCard` (Molecule) |
| `widgets/` 소형 | **Molecules** | `HeaderBrand` / `ThemeToggle` / `AuthorModeToggle` / `HeaderContact` |
| `widgets/` 합성 | **Organisms** | `Header` / `HeaderNav` / `HeaderActions` / `HeaderMobileMenu` / `Footer` / `HomeHero` / `ChapterToc` / `CharacterList` / `BookReader` |
| `features/{slice}/` | **Organisms** | `mini-game/games/Gwangsalgeom` / `SwordsmanSurvival` |
| `entities/{domain}/` | (Atomic 외) | `series` / `chapter` / `character` (api + model) |
| `shared/ui/` | **Atoms** (대부분) | `Button` / `Loading` / `Empty` / `ErrorBoundary` |
| `shared/lib/` · `shared/api/` · `shared/styles/` · `shared/config/` · `shared/images/` | (Atomic 외) | 비-UI 공통 자산 |

### Storybook title 컨벤션

Storybook 사이드바 = **Atomic 분류 우선**. FSD 위치는 디렉토리 경로 / 파일 명에 그대로 남는다. 한글 제목 보존 + Pascal 명 병기:

```ts
// shared/ui/button/button.stories.tsx
title: 'atoms/버튼 (Button)'

// widgets/header-brand/header-brand.stories.tsx
title: 'molecules/헤더 브랜드 (HeaderBrand)'

// widgets/header/header.stories.tsx
title: 'organisms/헤더 (Header)'

// features/mini-game/games/gwangsalgeom/gwangsalgeom.stories.tsx
title: 'organisms/mini-game/광살검 (Gwangsalgeom)'

// pages/character/locked-character-card.stories.tsx
title: 'molecules/잠금 캐릭터 카드 (LockedCharacterCard)'
```

### 신규 컴포넌트 분류 의사결정 트리

```
신규 컴포넌트
    ↓
비즈니스 로직 0 + HTML element 1~2 ?
    YES → Atom (shared/ui/)
    NO  ↓
컨텍스트 ○ + 도메인 네이밍 ?
    YES → Organism (widgets/ 합성 또는 features/{slice}/)
    NO  ↓
SRP + UI 네이밍 ?
    YES → Molecule
         - 여러 widget/page 재사용 → shared/ui/
         - 단일 widget 결합     → widgets/{name}/
         - 단일 page 결합       → pages/{slice}/{sub}.tsx
    NO  → 의도 모호 — organism 으로 시작 + 재사용 발견 시 molecule 추출
```

**premature abstraction 금지** — 1곳 사용 시 절대 위 레이어 X. *현재 어느 레이어까지 재사용되는가?* 만 기준.

### 컴포넌트 작성 5 원칙

1. **레이아웃 스타일 외부 주입** — `interface Props extends HTMLAttributes<HTMLElement>` 패턴 + `{ ...props }` spread. `margin` / `padding` / `width` 등 레이아웃 스타일은 컴포넌트 내부 hardcode 금지. 사용처가 `className` / `style` 로 주입. 재사용 시 사용처별 변형을 props 폭증 없이 처리.

    ```ts
    // ✓ 권장
    interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'solid' | 'outline'
    }

    function Button({ variant = 'solid', children, className, ...props }: ButtonProps) {
      return (
        <button className={cn('btn', `btn-${variant}`, className)} {...props}>
          {children}
        </button>
      )
    }

    // 사용처에서 레이아웃 주입
    <Button className="mt-4 w-full">제출</Button>
    ```

2. **Compound 컴포넌트 패턴** — 큰 organism (BookReader 등) 의 부분 노출 시 `<X.Header />` / `<X.Toc />` 식 compound 도입. props 폭증 / 약간 다른 organism 의 중복 방지. *도입 시점 = 2+ 변형 발견 시*.

    ```ts
    <BookReader>
      <BookReader.Header onClose={...} />
      <BookReader.Progress sections={...} />
      <BookReader.Content body={...} />
      <BookReader.Toc episodes={...} />
    </BookReader>
    ```

3. **UI 상태 / 이벤트 핸들러 = props 주입** — 비즈니스 로직 / 도메인 상태는 부모 (page / widget) 에서 처리. 컴포넌트 = presentational. Storybook 에서 모든 상태·동작 한눈 검증 — 재사용성·테스트성 ↑.

4. **SRP (Single Responsibility)** — molecule = 한 가지 일 / organism = 한 명확한 영역. props 폭증 = 분할 또는 compound 신호.

5. **네이밍 = 의도 반영** — molecule = UI 네이밍 (`IconButton` / `Tag` / `Pill` — 컨텍스트 X) / organism = 도메인 네이밍 (`Header` / `BookReader` / `ChapterToc` — 컨텍스트 ○). 모호 시 organism 으로 시작 → 재사용 발견 시 molecule 추출.

### Molecules 신규 분리 후보 (점진 도입)

다음 영역은 *현재 Organism 내부에 포함* 되어 있으나 향후 재사용 발견 시 Molecule 슬라이스로 분리 검토:

- **BookHeader 아이콘 그룹** (글자 크기 / 폰트 / 테마 / 목차 4 아이콘 버튼) — `book-reader/` 내부 → `widgets/icon-button-group/` 분리 후보
- **시리즈 카드 메타 블록** (제목 + 상태 pill + 시작일) — `pages/home/` 내부 카드 → `widgets/series-card-meta/` 분리 후보
- **CTA + 부제 조합** (HomeHero 의 "지금 보기" + 부제 / 챕터 끝 CTA) — `widgets/cta-block/` 분리 후보

도입 시점 = 2+ 곳 재사용 발견 시 (Bottom-Up).

## 관련 문서

- [`/.claude/CLAUDE.md`](../.claude/CLAUDE.md) — 핵심 원칙 13개 (§3 최소 의존, §4 FSD + Atomic 공존, §5 TS+JSX, §9 스포일러 분리, §12 workflow 강제)
- [`/.claude/workflow/template/prompt-reference.md`](../.claude/workflow/template/prompt-reference.md) — H-eries SSOT (의존·아키텍처·게이트·작성 원칙)
- [`/tsconfig.json`](../tsconfig.json) — `jsx: react-jsx`, `strict`, `moduleResolution: Bundler`
- [`/vite.config.ts`](../vite.config.ts) — `publicDir: false` + `cp -R content dist/content` 후처리
- [`/package.json`](../package.json) — 런타임 의존 3개 (react / react-dom / react-router-dom)
