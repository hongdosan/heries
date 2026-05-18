<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# src/ — Feature-Sliced Design (FSD)

`H-eries` 의 프론트엔드. **React 19 + React Router 7 (BrowserRouter) + Vite 6 + TypeScript strict**. 런타임 외부 UI/상태 라이브러리 미사용 — *코드만 있으면 어디서든 실행 가능* 한 이식성 우선. GitHub Pages 배포는 `public/404.html` SPA fallback 트릭으로 deep link 호환 (런타임 의존성 추가 0).

**dev 도구 (v0.3.0+)**: Storybook · ESLint 9 (flat config + typescript / react / react-hooks / jsx-a11y plugins) · `babel-plugin-react-compiler` (`compilationMode: 'infer'` — 컴포넌트·hook 자동 메모이제이션) · **Tailwind v4** (`tailwindcss` + `@tailwindcss/vite`) · TypeScript 5. 모두 devDependencies — dist 영향 0~수 KB.

**CSS 아키텍처**: ITCSS 7 layer (Settings → Tools → Generic → Elements → Objects → Components → Utilities) + Utility-first Tailwind + shadcn/ui 패턴 `cn()` helper (`src/shared/lib/cn.ts`). 상세 = [`shared/styles/tailwind-migration.md`](./shared/styles/tailwind-migration.md).

## 6 레이어 (의존 방향: 위 → 아래만)

| 레이어 | 책임 | 의존 가능 (↓ 만) |
|---|---|---|
| `app/` | 글로벌 진입점 — `main.tsx` (`createRoot` + `StrictMode` + `BrowserRouter` + `Routes`) | pages, widgets, features, entities, shared |
| `pages/` | URL 단위 페이지 — `useParams` + `useAsync` + 페이지별 hero | widgets, features, entities, shared |
| `widgets/` | 페이지 구성 블록 (Header/HeaderBrand/HeaderActions/HeaderContact/AuthorModeToggle/ThemeToggle/Footer/SeriesList/ChapterToc/CharacterList) — props-only | features, entities, shared |
| `features/` | 사용자 시나리오 (zero-state, 추후 검색·테마 토글·북마크 등) | entities, shared |
| `entities/` | 도메인 데이터 로더 (`loadSeries`/`loadChapter`/`loadCharacter`) — fetch + frontmatter + markdown + 스포 마스킹 합성 | shared |
| `shared/` | 도메인 무지 유틸 — `lib/` (env·spoiler·use-async·markdown·frontmatter·manifest·types), `styles/` | (없음) |

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
├── pages/{home,series,chapter,character,about,notice,unlock,not-found}/
│   ├── *.tsx                                       # useParams + useAsync + 페이지 hero
│   ├── {sub-component}.tsx                         # 페이지 내부 분리 컴포넌트 (chapter-outline / locked-character-card 등)
│   └── index.ts                                    # Public API
├── widgets/{header,header-brand,header-actions,header-contact,author-mode-toggle,theme-toggle,footer,series-list,chapter-toc,character-list}/
│   ├── *.tsx                                       # 컴포넌트
│   └── index.ts                                    # Public API
├── features/                                       # zero-state
├── entities/{series,chapter,character}/
│   ├── api/load-*.ts                               # 데이터 로더 (스포 마스킹 합성)
│   ├── model/types.ts                              # 페이지 데이터 형 (SeriesPageData 등)
│   └── index.ts                                    # Public API (re-export api + model)
└── shared/
    ├── api/                                        # fetch / 정규화 — manifest.ts (fetchSeriesIndex / fetchSeriesManifest / fetchMarkdown / normalizeSeriesManifest)
    ├── config/                                     # 설정 파일 — spoiler-patterns.json (마스킹 헤더 SSOT)
    ├── lib/                                        # types·frontmatter·markdown·env·spoiler·use-async·cn·use-img-fallback·use-document-title·use-author-mode·use-scrollbar-autohide·theme
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
| 1 page 만 사용 | `pages/{slice}/api/` | (현재 H-eries 의 load* = entities 위치 — pages 가 더 정합, **검토 영역**) |
| 1 도메인 안 여러 features | `features/{slice}/api/` | features/mini-game/ |
| 여러 도메인 재사용 | `entities/{domain}/api/` | (다른 widget 도 entity 호출 시 entities 정합) |
| 전역 공통 | `shared/api/` (또는 lib) | shared/lib/manifest.ts (fetchSeriesIndex / fetchSeriesManifest) |

### 5. Bottom-Up 작업 흐름
신규 코드 작업 시 다음 순서:
1. **pages/{slice}/ 안 작성** (한 page 만 사용 시작)
2. 다른 page 에서 재사용 발견 시 → `features/{slice}/` 로 이동
3. 여러 features 에서 재사용 시 → `entities/{domain}/` 로 이동
4. 전역 사용 시 → `shared/` 로 이동

### 6. 격리 규칙 (ESLint 자동 강제)
`eslint.config.js` 의 `no-restricted-imports` per-layer 패턴 — 상위 레이어 import 금지. 동일 레이어 다른 슬라이스 = `index.ts` 만 통과.

## 관련 문서

- [`/.claude/CLAUDE.md`](../.claude/CLAUDE.md) — 핵심 원칙 9개 (§3 최소 의존, §5 TS+JSX, §9 스포일러 분리)
- [`/tsconfig.json`](../tsconfig.json) — `jsx: react-jsx`, `strict`, `moduleResolution: Bundler`
- [`/vite.config.ts`](../vite.config.ts) — `publicDir: false` + `cp -R content dist/content` 후처리
- [`/package.json`](../package.json) — 의존 7개 (react·react-dom·react-router-dom + vite·@vitejs/plugin-react·typescript + @types/react·@types/react-dom)
