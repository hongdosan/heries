<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries — AI 작업 단일 기준점 (SSOT)

> 본 문서는 **H-eries** (`홍도산/heries`) 의 모든 AI 작업 (개발·개선·검토) 시 준수해야 할 **단일 기준점 (SSOT)** 이다. 모든 에이전트·자율 사이클은 본 지침을 엄격 준수한다.
>
> 정책 변경 시 본 문서를 먼저 갱신한 후 코드 수정. 본 문서와 코드가 충돌하면 **본 문서가 정답** — 코드 수정.

## 1. 프로젝트 정체성

- **이름**: H-eries = `홍도산` + `(s)eries`
- **성격**: 단일 작가 (`hongdosan`) 의 **오리지널 웹 시리즈 컬렉션** (정적 사이트)
- **저작권**: © 2026 홍도산. All rights reserved.
- **100% 오리지널 창작** — 모든 캐릭터·세계관·고유 표현은 작가 본인 창작. `origin: original` 필드 강제. 모든 고유 호칭·기술명·진영명은 작가 자작 SSOT 등록 후 사용.
- **배포**: GitHub Pages (`hongdosan.github.io/heries/`), BrowserRouter + `.nojekyll`
- **단일 작가 가정**: 다인 협업·코드 리뷰 분기 미적용

## 2. 기술 스택 (베스트 안전 stable 조합)

### 런타임 의존 (정책 #3 — 추가 시 사용자 확인 필수)
- React 19
- React Router 7 (BrowserRouter)
- Vite 7 (빌드만, 결과는 정적 파일)

### Dev 의존 (devDependencies, dist 영향 0)
- TypeScript 5.9 strict + 추가 옵션 (`noUncheckedIndexedAccess` / `noImplicitOverride` / `noPropertyAccessFromIndexSignature` + `noUnusedLocals/Parameters` / `noFallthroughCasesInSwitch` / `noImplicitReturns`)
- Storybook 9 (Vite builder)
- `@vitejs/plugin-react` 4
- Node 22 LTS (Active, CI + 로컬)

### 외부 *런타임* 라이브러리 금지

- UI 키트 (shadcn / MUI / Chakra 등)
- 상태 관리 (Redux / Zustand / Recoil 등)
- 애니메이션 (framer-motion / react-spring 등)
- **CSS-in-JS** (Emotion / styled-components 등)
- 폼 (react-hook-form 등)
- 마크다운 (marked / remark 등 — 자체 `renderMarkdown` 사용)

### 외부 *dev* 도구 (도입 시 사용자 확인 + dist 영향 0~수 KB 확인)

- **Tailwind v4** *(v0.3.0+ 도입)* — `tailwindcss` + `@tailwindcss/vite`. utility-first CSS. devDeps 만. dist 영향 = 사용된 utility 만 tree-shake (수 KB).
- **ESLint 9** (flat config + typescript / react / react-hooks / jsx-a11y plugins)
- **Storybook 9** (Vite builder)
- **babel-plugin-react-compiler** (`compilationMode: 'infer'`)

**도입 시 사용자 확인** 후 *런타임 vs dev* 구분 명확화. dev 도구는 `dist/` 산출물에 0~수 KB 영향 확인 의무.

## 3. 아키텍처 — FSD (Feature-Sliced Design) 엄격 준수 + Atomic Design 공존

```
src/
├── app/          # createRoot + BrowserRouter + 전역 wrap
├── pages/        # URL 단위 페이지 9 — home / series-list / series / chapter / character / about / notice / unlock / not-found
├── widgets/      # 페이지 구성 블록 13 — header / header-brand / header-nav / header-actions / header-contact / header-mobile-menu / author-mode-toggle / theme-toggle / footer / home-hero / chapter-toc / character-list / book-reader
├── features/     # 사용자 시나리오 — mini-game (in-page launcher + 광살검 + 검기생존록)
├── entities/     # 도메인 데이터 type + 공통 fetch — series (api/fetch-manifest + model) / chapter (model only) / character (model only). page-only loader 는 pages/{slice}/api/ 로 이동 (2026-05-19).
└── shared/       # 도메인 무지 — api / config / lib / styles / ui / images
```

- **격리 규칙**: 상위 → 하위만 import. 동일 레이어 슬라이스 간 직접 import X.
- **Public API**: 슬라이스 외부에서는 `index.ts` (Public API) 만 import.
- **css 분산**: 슬라이스 옆 `{slice}.css` + `index.ts` 의 `import './{slice}.css'`. shared 전역 = `shared/styles/` (tokens / base / typography / layout / utilities / author-mode / responsive / article / tailwind).

### Atomic Design 공존 *(2026-05-19 도입)*

FSD 6 레이어 위에 **Atomic Design 5 단계** (atoms / molecules / organisms / templates / pages) 를 *논리적 분류* 로 공존. 디렉토리는 FSD 유지, Atomic 은 **Storybook 사이드바 + 컴포넌트 작성 멘탈 모델 + 작성 5 원칙** 으로만 적용 (Atomic 디렉토리 신설 X).

| Atomic | FSD 위치 | 기준 |
|---|---|---|
| **Atoms** | `shared/ui/` | 비즈니스 로직 0 + HTML element 수준 + 컨텍스트 0 |
| **Molecules** | `widgets/` (소형) · `pages/{slice}/sub` · `shared/ui/` (조합 시) | SRP + 컨텍스트 X + UI 네이밍 (`IconButton`, `Tag`) |
| **Organisms** | `widgets/` (합성) · `features/{slice}/` | 컨텍스트 ○ + 도메인 네이밍 (`Header`, `BookReader`) + 명확한 영역 |
| **Templates** | (없음) | pages 가 직접 hero + section 구성 |
| **Pages** | `pages/` | template 인스턴스 + 실제 콘텐츠 |

**Molecule ↔ Organism 경계 = 컨텍스트 유무.** 모호 시 organism 으로 시작 → Bottom-Up 재사용 발견 시 molecule 추출.

상세 가이드 = [`../../../src/README.md`](../../../src/README.md) §Atomic Design.

## 4. CLAUDE.md 핵심 원칙 13 항 (강제)

1. 모든 `.md` 첫 줄 (또는 frontmatter 직후) HTML 주석 1줄 저작권 고지 부착
2. 모든 캐릭터 카드 `origin: original` + 카드 절 구조 (독자 절 / 작가 절 분리, reader 빌드 마스킹)
3. **런타임 의존 0** (React/React Router/Vite 외) + **dev 도구 허용** (Storybook 등 devDeps)
4. FSD 6 레이어 단방향 import (격리)
5. TypeScript strict + JSX (strict 7 옵션 포함)
6. 단일 작가 가정 (다인 협업 X)
7. GitHub 공개 저장소 (비공개 토큰·시크릿·개인 정보 산출물 X)
8. 누적 산출물 최적화 강제 (harness-state §변경 이력 hot 20 / 핸드오프 CURRENT.md 덮어쓰기, 세션 시작/종료 직전 점검)
9. 스포일러 분리 (정책 v2 — 단일 빌드 + runtime `/unlock`. 마스킹 = `## 시놉시스` / `## H-eries 분기 ~` / `heries_arc` / worldbuilding/timeline/glossary + 비-주인공 캐릭터 상세 라우트 가드)
10. 작가 원칙 SSOT *(2026-05-18 활성화 / 2026-05-19 v2)* — 모든 챕터·카드·세계관 작성 시 [
    `writing-principles.md`](../../../content/series/clash-of-multiverses/worldbuilding/writing-principles.md) 필독.
    비각성자 부대 *(자율 입대 정예 / 비각성자 only / 임무 중 각성 시 퇴소)* · 퇴소 사유 5종 *(사망·불구·PTSD·자의 탈진·자의 목표)* · 각성 시스템
    *(단순 운 / 헌터 + 길드 + 협회, 군 X)* · 한국어 문법 정합 · 대화 중심 톤 강제.
11. `shared/ui/` 신규 컴포넌트 = `.stories.tsx` 강제 (최소 3 스토리, widgets/features 권장)
12. AI 개발 흐름 강제 — 모든 챕터 작성 / 신규 기능 / 개선 / SSOT 갱신 시 [
    `../workflow.md`](../workflow.md) 의 6 단계 흐름 강제 *(2026-05-19 범위 확장)*
13. 개인 정보 / 시크릿 절대 비공개 (실명·실주소·실전화·실생년월일 / API 키 / DB 비밀번호 / `VITE_AUTHOR_KEY` / OAuth secrets·결제 정보 → 코드 /
    git / dist 0)

## 5. 검증 게이트 (매 commit 전 통과 의무)

| 게이트 | 명령 | 통과 기준 |
|---|---|---|
| **통합** | `npm run validate` | lint + typecheck + build 단일 게이트 (v0.3.0+) |
| Lint | `npm run lint` | 0 error / 0 warning |
| TypeScript | `npm run typecheck` | 0 에러 |
| 빌드 | `npm run build` | 0 에러 + 시크릿 누수 0 |
| 스토리북 | `npm run build-storybook` | 0 에러 (storybook 영향 변경 시) |
| 이미지 budget | (build 의 check-images 단계) | ≤500 KB / 이미지 |
| 시크릿 누수 | (build 의 check-secrets 단계) | 0 건 |
| 의존 audit | `npm audit` | 0 취약점 (정기 점검) |

CI = `.github/workflows/deploy.yml` 도 동일 게이트 + `dist storybook 누수 검증` 추가.

## 6. 콘텐츠 SSOT (작가 워크플로우)

```
content/
├── _shared/images/                       # 공통 이미지 (heries-mark / placeholder / mini-game sprite)
├── about.md, notice.md
├── series.json                           # 시리즈 인덱스
└── series/{slug}/
    ├── _series.md                        # 시리즈 메타 (시놉시스 = 스포 마스킹)
    ├── manifest.json
    ├── thumbnails/                       # cover + 챕터 썸네일 + PROMPT.md (작가 전용)
    ├── characters/{1-protagonist,2-major-supporting,3-antagonist,4-minor}/
    ├── chapters/ep-{NN}-{slug}.md
    └── worldbuilding/, timeline/, glossary/   # 작가 전용 (reader 마스킹)
```

- 캐릭터 카드 frontmatter = `slug / name / origin: original / role / first_appearance / heries_arc / summary`
- 챕터 frontmatter = `title / episode / published`
- 마스킹 SSOT = `src/shared/lib/spoiler-patterns.json`

## 7. 코드 스타일

- **TypeScript**: `strict: true` + 추가 옵션 7 종. `any` 금지 (불가피하면 `unknown` + 좁히기). `enum` 대신 `as const` + union 선호.
- **Import**: 상대 경로 (`../../shared/lib/...`). 슬라이스 외부에서 슬라이스 내부 모듈 직접 import 금지 — Public API (`index.ts`) 통과.
- **Import 확장자**: Vite Bundler 모드 호환 위해 `.js` 명시 (예: `from '../../shared/lib/env.js'`).
- **네이밍**: 풀 네이밍 우선. boolean = `is`/`has` 접두사. 핸들러 = `handle` 또는 `on` 접두사.
- **파일·폴더**: kebab-case (예: `mini-game.tsx`, `use-document-title.ts`).
- **컴포넌트**: PascalCase, 단일 책임, props 최소화, `readonly` 권장.
- **CSS**: 사이트 토큰 (`var(--*)`) 우선. hardcoded px → spacing var / clamp() / vh / vw / dvh / rem. hex → `tokens.css` 정의 var.
- **주석**: 기본은 작성 X. WHY 가 비명시인 경우만 (제약·invariant·workaround·surprise). WHAT 은 작성 금지.

### 컴포넌트 작성 원칙 5종 *(2026-05-19 정립)*

1. **레이아웃 스타일 외부 주입** — `interface Props extends HTMLAttributes<HTMLElement>` + `{ ...props }` spread. `margin` / `padding` / `width` 등 레이아웃 스타일은 컴포넌트 내부 hardcode 금지. 사용처가 `className` / `style` 로 주입. 재사용 시 사용처별 변형을 props 폭증 없이 처리.
2. **Compound 컴포넌트 패턴** — 큰 organism (BookReader 등) 의 부분 노출 시 `<X.Header />` / `<X.Toc />` 식 compound. props 폭증 / 약간 다른 organism 의 중복 방지. 도입 시점 = 2+ 변형 발견 시.
3. **UI 상태 / 이벤트 핸들러 = props 주입** — 비즈니스 로직 / 도메인 상태는 부모 (page / widget) 에서 처리. 컴포넌트 = presentational. Storybook 에서 모든 상태·동작 한눈 검증 가능.
4. **SRP (Single Responsibility)** — molecule = 한 가지 일 / organism = 한 명확한 영역. props 폭증 = 분할 또는 compound 신호.
5. **네이밍 = 의도 반영** — molecule = UI 네이밍 (`IconButton`, `Tag` — 컨텍스트 X) / organism = 도메인 네이밍 (`Header`, `BookReader` — 컨텍스트 ○). 모호 시 organism 시작 → 재사용 발견 시 molecule 추출.

## 8. 라이브러리 격리 / Adapter

- 외부 라이브러리는 직접 import 금지. 슬라이스 안 wrapper 두기.
- 현재 도입된 외부 = React / React Router / Vite (런타임) + Storybook (dev). 추가 시 사용자 확인 + adapter 슬라이스.

## 9. AI 에이전트 행동 지침

- **사용자 commit 정책**: main 브랜치 + 사용자 직접 commit 기본. 명시 위임 시만 본 에이전트 commit/push 허용.
- **사전 4 질문 폭탄 X**: 핵심 결정만 1 회 확인. 나머지는 합리적 default 진행.
- **Plan 안 작업**: 승인된 plan 범위만. 임의 확장 금지.
- **기존 컨벤션 우선**: 새 상수/유틸 만들기 전 기존 코드베이스 확인.
- **순차 진행**: 코드 변경은 *항목별 제안 → 확인 → 수정*. 일괄 수정 금지.
- **변경 이력**: 의미 있는 변경 = `.claude/harness/harness-state.md` §변경 이력 1행.
- **검증 게이트**: 매 commit 전 typecheck/build/build-storybook + 마스킹 누수 확인.
- **누적 산출물**: 세션 시작 / 종료 직전 점검. 임계 도달 시 archive 의무 (정책 #8).

## 10. 도구 우선순위

| 작업 | 우선 도구 |
|---|---|
| 코드 심볼 탐색 | Serena MCP (`find_symbol` / `get_symbols_overview` / `find_referencing_symbols`) |
| 텍스트 패턴 (md 본문·고지문 등) | Grep / Glob |
| 파일 읽기 | Read |
| 작은 편집 | Edit |
| 전면 재작성 | Write |
| 외부 정보 | WebFetch / 사용자 안내 |

## 11. 하네스 (6 에이전트 + 라우터)

| 에이전트 | 역할 | 트리거 |
|---|---|---|
| `heries-lorekeeper` | 캐릭터 카드 SSOT | "등장인물 추가/갱신", "캐릭터 카드" |
| `heries-worldsmith` | 세계관·연표·용어집 | "세계관 추가", "_series.md" |
| `heries-author` | 챕터 본문 | "챕터 작성", "ep-NN" |
| `heries-continuity-reviewer` | 정합성 감사 | "정합성 감사", "챕터 검수" |
| `heries-frontend-engineer` | `src/` + 빌드 설정 | "컴포넌트", "렌더러", "FSD" |
| `heries-publisher` | 발행·배포 | "사이트 빌드", "manifest 갱신" |

라우터 = [`heries-orchestrator`](../../skills/heries-orchestrator/SKILL.md) 스킬.

## 12. 작업 분할 / Plan 설계 시 참고

- 단일 commit = template 단일 채우기로 충분
- 3 commit 이상 권고 = plan 작성 (`plan/<topic>/NN-<scope>.md`)
- 큰 사이클 (10+ commit) = 별도 사이클로 분할 + 사용자 결정 대기

## 13. 변경 시 본 문서 갱신 의무

- 신규 정책 / 신규 의존 / 신규 검증 게이트 / 신규 에이전트 추가 시 = 본 문서 먼저 갱신
- workflow Step 05 의 동기 갱신 원칙 = 본 문서가 첫 동기 대상
