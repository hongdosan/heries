<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries 하네스 — 현 상태

`H-eries` 의 AI 협업 구조를 정의하는 메타 레이어 문서. 사실 기반으로 현 상태를 누적 기록한다.

## 목차

- [정의](#정의)
- [도메인](#도메인)
- [구성 요소](#구성-요소)
- [에이전트 인벤토리](#에이전트-인벤토리)
- [SSOT 구조](#ssot-구조)
- [자동 강제 메커니즘](#자동-강제-메커니즘)
- [변경 이력](#변경-이력)
- [참고](#참고)

## 정의

`H-eries` 하네스는 자체 런타임 없이 [Claude Code](https://claude.com/claude-code) 위에 **문서 기반 프로세스 하네스 (Documentation-Driven Process Harness)** 를 얹은 구조다.

| 층위 | 정의 | 본 프로젝트 |
|---|---|---|
| Runtime Harness | LLM 호출·도구 디스패치·실행 흐름을 코드로 묶은 시스템 | Claude Code (재사용) |
| Process / Documentation Harness | 페르소나·SSOT·산출물 형식을 문서로 강제하는 메타 레이어 | **본 프로젝트가 정의** |

## 도메인

| 항목 | 값 |
|---|---|
| 서비스 | `H-eries` — 단일 작가의 오리지널 다중/평행 세계 정적 웹 시리즈 |
| 작품 #1 | `series/clash-of-multiverses/` (tba) |
| 콘텐츠 성격 | **100% 오리지널 창작** — 외부 IP 차용 ZERO |
| 작성자 | 단일 (`hongdosan`) — 외부 협업자 가정 없음 |
| 독자 | 읽기 전용 |
| 빌더 | React 19 + React Router + Vite (런타임 의존 3 종) + Storybook (dev 전용) |
| 배포 | GitHub **공개** 저장소 + GitHub Pages (`.nojekyll`, BrowserRouter) |

## 구성 요소

| # | 요소 | 위치 |
|---|---|---|
| 1 | 페르소나/역할 정의 | 각 에이전트 frontmatter + 본문 §0 |
| 2 | 다중 전문 에이전트 분리 | `.claude/agents/heries-{lorekeeper,worldsmith,author,continuity-reviewer,frontend-engineer,publisher}.md` |
| 3 | 단일 기준점 (SSOT) | 등장인물·세계관·연표·용어집 — `content/series/{slug}/{characters,worldbuilding,timeline,glossary}/` |
| 4 | 단계별 작업 사이클 | 챕터 초안 → SSOT 갱신 → 연속성 감사 → 사용자 commit → 발행 |
| 5 | AI 자가 검증 | `heries-continuity-reviewer` 가 신규 챕터의 SSOT 정합성 감사 |
| 6 | 산출물 스키마 | 등장인물 카드 frontmatter (`name`, `origin: original`, `role`, `first_appearance`, `heries_arc`), 챕터 frontmatter (`title`, `episode`, `published`) |
| 7 | 저작권 고지 부착 강제 | 모든 .md 첫 줄 (또는 frontmatter 직후) HTML 주석 1줄 — CLAUDE.md §원칙 #1 |
| 8 | 도구 우선순위 | `.claude/CLAUDE.md` §도구 우선순위 + Serena MCP 사용 지침 |
| 9 | 변경 이력 (Synchronous Update) | 본 문서 §변경 이력 |

## 에이전트 인벤토리

| 에이전트 (frontmatter `name`) | 역할 | 정의 |
|---|---|---|
| `H-eries-lorekeeper` | 캐릭터 카드 SSOT (`characters/`) 작성·정정·검증 | [`../agents/heries-lorekeeper.md`](../agents/heries-lorekeeper.md) |
| `H-eries-worldsmith` | 시리즈 메타 + 세계관·연표·용어집 | [`../agents/heries-worldsmith.md`](../agents/heries-worldsmith.md) |
| `H-eries-author` | 챕터 본문 작성 — 시놉시스 사실화 / 플롯 보존 | [`../agents/heries-author.md`](../agents/heries-author.md) |
| `H-eries-continuity-reviewer` | 신규 챕터 정합성 감사 (보고서만, 직접 수정 X) | [`../agents/heries-continuity-reviewer.md`](../agents/heries-continuity-reviewer.md) |
| `H-eries-frontend-engineer` | `src/` (FSD) + `scripts/` + 빌드 설정 | [`../agents/heries-frontend-engineer.md`](../agents/heries-frontend-engineer.md) |
| `H-eries-publisher` | 발행·배포 — manifest, 빌드 검증, 이미지 강제, GH Pages | [`../agents/heries-publisher.md`](../agents/heries-publisher.md) |

라우터 = [`../skills/heries-orchestrator/SKILL.md`](../skills/heries-orchestrator/SKILL.md).

## SSOT 구조

```
content/
  series/
    clash-of-multiverses/
      _series.md                 # 시리즈 메타 (제목·시놉시스 등)
      characters/                # 등장인물 SSOT (캐릭터당 1 파일)
        1-protagonist/{slug}.md
        2-major-supporting/{slug}.md
        3-antagonist/{slug}.md
        4-minor/{slug}.md + _mob-pool.md
      worldbuilding/             # 지역·세력·체계
      timeline/                  # 연표
      glossary/                  # 용어집
      chapters/
        ep-{NN}-{slug}.md        # 에피소드 본문
      thumbnails/                # 시리즈·챕터 썸네일 + PROMPT.md
      manifest.json
```

### 등장인물 카드 frontmatter 예시

```markdown
---
slug: woo-jin-hyeok
name: 우진혁
origin: original   # 모든 본 프로젝트 캐릭터는 original (외부 IP 차용 ZERO)
role: protagonist | antagonist | supporting | cameo
first_appearance: tba
heries_arc: tba    # 본 작품 소환 시점·상태. reader 빌드에서 마스킹
summary: 한 줄 요약
---
```

본문은 *공개 절* (`## 핵심 정체성` / `## 능력` / `## 인간관계` 등 — reader 빌드 노출) 과 *작가 분기 절* (`## H-eries 분기 — {작품명} 변형` 이하 — 스포일러, reader 빌드 마스킹) 을 분리 작성.

## 자동 강제 메커니즘

| 항목 | 존재 |
|---|---|
| `H-eries-continuity-reviewer` 자동 호출 (신규 챕터 작성 시) | **구현** — `heries-orchestrator` SKILL.md 파이프라인 (author → continuity-reviewer 자동) |
| 등장인물 카드 frontmatter 스키마 검증 | LLM 순응 (`heries-lorekeeper` §검증 체크리스트) |
| 챕터 → 캐릭터 참조 무결성 검증 | LLM 순응 (`heries-continuity-reviewer` §검증 체크리스트) |
| 저작권 고지 부착 강제 | **구현** — CLAUDE.md §원칙 #1 + 모든 에이전트 §작업 원칙 |
| 이미지 budget 강제 (≤500KB) | **구현** — `scripts/check-images.mjs` 빌드 게이트 |
| 작가 빌드 라이브 노출 차단 | **구현** — `.github/workflows/deploy.yml` 의 `VITE_AUTHOR_MODE: ""` env 강제 |
| 마스킹 누수 게이트 | **구현** — `scripts/check-masking.mjs` 빌드 후처리 |
| `shared/ui/` 스토리북 강제 | LLM 순응 (CLAUDE.md §원칙 #11) |
| Pre-commit hook | 없음 (사용자 메모리 = 사용자 직접 commit 정책) |

## 변경 이력

본 표는 **2026-05-14 전체 초기화** 됨 (사용자 명시 = 이전 데이터로 인한 오염 방지). 이전 행은 git history 에서 회수 가능.

> **Hot 한도: 20행.** 21행 도달 시 hot 에 최근 3행만 남도록 가장 오래된 행을 한꺼번에 별도 archive 로 이동. 정책 SSOT: [`../CLAUDE.md`](../CLAUDE.md) §누적 산출물. 점검 시점 = 세션 시작 직후 + 세션 종료 직전.

| 날짜 | 변경 내용 | 대상 | 사유 |
|---|---|---|---|
| 2026-05-14 (라운드 28~30) | **첫 paint fallback + 로그 톤 일관** — (1) `index.html` inline `<style>` 추가 (CSS module 로드 전 다크/라이트 fallback, prefers-color-scheme + data-theme="dark" 양쪽 케이스) (2) `scripts/copy-content.mjs` 빌드 로그에 `✓` prefix 추가 (check-images / check-masking 과 일관) (3) 페이지 transition 첫 진입 fade-in = 의도된 자연 동작 (변경 X). 검증: typecheck 0 / build 0 / 마스킹 누수 0. | `index.html` (inline style), `scripts/copy-content.mjs` (prefix), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 가벼운 UX/로그 폴리시. 변경 이력 hot **10행 / 한도 20**. |
| 2026-05-14 (라운드 25~27) | **heading anchor + outline 임계 + author-only marker CSS** — (1) markdown.ts h2/h3 에 `<a class="heading-anchor">#</a>` 자동 부착 + typography.css hover 룰 (챕터 본문 `.article-prose` 안에서는 숨김, 모바일 항상 흐림 노출) (2) chapter outline 표시 임계 1 → 2 절 (1 절 이하 가치 작음) (3) author-mode.css 에 `.author-only-label` / `.author-only-value` 룰 보강 (character.tsx 에서 marker 만 있고 효과 0 이었던 잔여 정합). 검증: typecheck 0 / build 0 / 마스킹 누수 0. | `src/shared/lib/markdown.ts` (anchor), `src/shared/styles/typography.css` (.heading-anchor), `src/pages/chapter/chapter.tsx` (outline 임계), `src/shared/styles/author-mode.css` (label/value), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = UX 가독성 + 운영 marker 정합. 변경 이력 hot **9행 / 한도 20**. |
| 2026-05-14 (라운드 23~24) | **Node.js 20 → 22 LTS 업그레이드 + 미니 게임 스토리 보강** — (1) `.github/workflows/deploy.yml` node-version 20 → 22 (Active LTS, 로컬 v22.12.0 과 정합) (2) `package.json` engines.node `>=22` 추가 (의도 명시) (3) mini-game stories DarkBackground variant 추가 + over 시연 한계 주석. 검증: typecheck 0 / build 0 / build-storybook 0 / 마스킹 누수 0. | `.github/workflows/deploy.yml` (node 22), `package.json` (engines), `src/features/mini-game/mini-game.stories.tsx` (DarkBackground), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 의존 안전성 강화 (Active LTS) + 폴리시. 변경 이력 hot **8행 / 한도 20**. |
| 2026-05-14 (라운드 21~22) | **자율 라운드 21~22 — 404.html UX + package.json 메타** — (1) `public/404.html` = CSP meta + viewport + 다크모드 자동 적응 style + "이동 중…" 본문 (redirect 실패/지연 시 빈 화면 X) (2) `package.json` = description / author / repository.url 추가 (npm 표준 메타). 검증: typecheck 0 / build 0 / 마스킹 누수 0. | `public/404.html` (보강), `package.json` (메타), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = UX·메타 폴리시. 변경 이력 hot **7행 / 한도 20**. |
| 2026-05-14 (라운드 19~20) | **자율 라운드 19~20 — 모바일 touch-action 점검 + footer 동적 연도** — (1) 게임 stage `touch-action: none` 이미 적용 확인 (변경 없음) (2) footer 저작권 연도 = `2026` 하드코딩 → `copyrightRange()` 동적 (`2026` 또는 `2026–{현재}`). 2027 진입 시 자동 갱신. 검증: typecheck 0 / build 0 / build-storybook 0 / dist css 32.19 KB / js 274.58 KB / 마스킹 누수 0. | `src/widgets/footer/footer.tsx` (copyrightRange), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 가벼운 폴리시 + 미래 시점 대비. 변경 이력 hot **6행 / 한도 20**. |
| 2026-05-14 (라운드 15~18) | **자율 라운드 15~18 — title hook + 게임 wave UX + widgets stories + scroll-nav** — (1) `shared/lib/use-document-title.ts` 신규 (의존 0 hook) + 7 페이지 동적 title (소개/저작권/시리즈/챕터/캐릭터/홈/404) (2) 게임 wave 진입 + elite spawn 시 `mg-announce` toast (1.1s fade) (3) widgets stories 3 신규 (chapter-toc / character-list / series-list, MemoryRouter decorator + 3 variants 씩) (4) chapter scroll-nav 본문 길이 기반 가시성 (`useIsScrollable` hook, viewport 보다 80px 이상 길 때만 노출). 검증: typecheck 0 / build 0 / build-storybook 0 / dist css 32.19 KB / js 274.48 KB / 마스킹 누수 0. | `src/shared/lib/use-document-title.ts` (신규), `src/pages/{home, about, notice, series, chapter, character, not-found}/*.tsx` (title), `src/features/mini-game/{mini-game.tsx, mini-game.css}` (announce), `src/widgets/{chapter-toc, character-list, series-list}/*.stories.tsx` (신규), `src/pages/chapter/chapter.tsx` (useIsScrollable), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = UX·SEO·테스트 가시화. 변경 이력 hot **5행 / 한도 20**. |
| 2026-05-14 (라운드 10~14) | **자율 라운드 10~14 — CI·a11y·게임 UX·SPA 전환** — (1) `.github/workflows/deploy.yml` 강화 = typecheck step + build-storybook sanity check + dist storybook 누수 검증 (2) base.css `:focus-visible` 통일 (button/details/[tabindex]/input 등) (3) 게임 focus 이탈 시 자동 일시정지 (`isFocused` + onFocus/onBlur) + start 직후 stage 자동 focus (4) 게임 일시정지 overlay 화면 ("일시정지 — 재개 버튼") (5) SPA route fade-in (RouteTransition wrap + useLocation.key + CSS keyframe + prefers-reduced-motion 무력화) (6) CLAUDE.md 원칙 #10 = "예약, 무대 컨셉 결정 후 작성" 으로 명시화. 검증: typecheck 0 / build 0 / build-storybook 0 / dist css 31.55 KB / js 273.21 KB / 마스킹 누수 0. | `.github/workflows/deploy.yml` (CI 강화), `src/shared/styles/{base.css, utilities.css, responsive.css}` (focus-visible + route-transition), `src/features/mini-game/{mini-game.tsx, mini-game.css}` (focus pause + overlay), `src/app/main.tsx` (RouteTransition), `.claude/CLAUDE.md` (#10 명시화), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 보안·UX·a11y·CI 의 합동 강화. 변경 이력 hot **4행 / 한도 20**. |
| 2026-05-14 (라운드 6~9) | **자율 라운드 6~9 — 보안·SEO·게임 UX** — (1) `src/README.md` stale `## 검증 출처 노출` 표현 정정 (2) `index.html` Content-Security-Policy meta tag + referrer 추가 (default-src self / object-src none / frame-ancestors none 등) (3) `public/robots.txt` + `public/sitemap.xml` 신규 (SEO, home/about/notice/series 4 URL) (4) 미니 게임 best-score localStorage 보존 (key=`heries:mini-game:best-score`) + idle/over 화면 표시 + 신기록 마킹 (5) entities/widgets/scripts/CSS 점검 = 견고 (변경 없음). 마크다운 self-test 스크립트 = vitest 사이클 보류. 검증: typecheck 0 / build 0 / dist css 31.05 KB / js 272.47 KB / 마스킹 누수 0. | `src/README.md`, `index.html` (CSP), `public/{robots.txt, sitemap.xml}` (신규), `src/features/mini-game/{mini-game.tsx, mini-game.css}` (best-score), `.claude/{harness/harness-state.md, handoff/CURRENT.md}` | 본 사이클 = 자율 라운드 6~9 누적. 변경 이력 hot **3행 / 한도 20**. |
| 2026-05-14 (라운드 5) | **자율 라운드 4~5 — tsconfig strict 강화 (38→0) + 미니 게임 입력 변경 (방향키 + Space) + step 함수 Cognitive Complexity 감축 + IDE 경고 8건 처리** — 새 strict 옵션 3종 (noUncheckedIndexedAccess / noImplicitOverride / noPropertyAccessFromIndexSignature) → markdown.ts 18 / manifest.ts 15 / mini-game.tsx 29 / env.ts 2 / theme.ts 1 / error-boundary.tsx 3 = 38 에러 모두 수정. 게임 PC 입력 = 방향키 고정 (WASD 제거) + Space 발사 + Enter 재시작 (사용자 명시). step 함수 200→50 행 (helper 분리: readKeyboardMove / combineMove / movePlayer / fireBullet / updateBullets / chaseEnemies / resolveBulletEnemyHits / findHittingBullet / resolvePlayerEnemyHits / updateParticles). IDE 경고 처리: optional chain ×2, globalThis ×2, nested ternary 1, role="application" (a11y 의도 보존). entities/widgets/scripts/CSS 변수 점검 = 견고. | `tsconfig.json` (strict 7종), `src/shared/lib/{markdown.ts, manifest.ts, env.ts, theme.ts}`, `src/shared/ui/error-boundary/error-boundary.tsx`, `src/features/mini-game/mini-game.tsx` (입력 변경 + step 분리), `.claude/handoff/CURRENT.md` (덮어쓰기), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 자율 라운드 4~5 누적. typecheck 0 / build 0 / build-storybook 0 / 마스킹 누수 0. 변경 이력 hot **2행 / 한도 20**. |
| 2026-05-14 (라운드 1~3) | **콘텐츠 전면 재시작 + CSS 슬라이스 분리 + Storybook 도입 + 정책·하네스 초기화 + 자율 검토 라운드 1~3 + 미니 게임 + character-mention 폐기** — 단일 메가 사이클. 사용자 명시 큰 틀: (1) 콘텐츠 폐기·우진혁 큰 틀 한 줄만 보존 (2) CSS 1502행 → 15 파일 슬라이스 분산 (3) Storybook 8.6 devDeps + shared/ui 스토리 강제 정책 신설 (4) CLAUDE.md §원칙 #3·#10·#11 갱신 (5) 챕터 본문 `.article-prose` 강조 평탄화 (6) harness-state + archive 전체 초기화 + stale 규칙 제거 (7) URL XSS 방어 + skip-link a11y + reduced-motion 확장 + og 메타 (8) 404 페이지 분리 + widgets stories + useAsync AbortController (9) `features/mini-game/` 신규 (검기생존록, 의존 0 / FSD 정합 / TS strict / stage onKeyDown 전환) (10) `features/character-mention/` 폐기 (사용자 명시 = 챕터 호버 툴팁 제거) + markdown {{char}} syntax 제거 (11) 카피라이팅 stale 일반화 (home/header/footer/README). 검증: typecheck 0 / build 0 / build-storybook 0 / dist css 30.84 KB / dist js 269.58 KB / 마스킹 누수 0. | `content/series/clash-of-multiverses/**`, `src/shared/styles/{tokens,base,typography,layout,utilities,author-mode,responsive}.css`, `src/{widgets,features,pages}/**/*.css` (슬라이스 분산), `src/features/{mini-game,character-mention}/` (신규/폐기), `src/pages/not-found/` (신규), `src/shared/lib/{markdown,spoiler,use-async,manifest,types}.ts`, `src/shared/styles/style.css` (폐기), `.storybook/{main,preview}.ts` (신규), `*.stories.tsx` (error-boundary/header/footer/mini-game), `scripts/copy-content.mjs` (stale 규칙 제거), `index.html` (og + skip-link 대응), `content/{about.md, notice.md}`, `README.md`, `.claude/{CLAUDE.md, harness/harness-state.md, handoff/CURRENT.md}`, `.claude/harness/harness-state-archive.md` (폐기), `package.json` (Storybook devDeps + scripts), `.gitignore` (storybook-static/) | 본 사이클 = 작품 컨셉 + 하네스 + 정책 + 코드 정합의 합동 초기화 + 자율 검토 3 라운드 누적. 사용자 명시 = 이전 데이터로 인한 망가짐 방지. 다음 사이클 후보: (a) 새 무대 컨셉 결정 (b) tsconfig `noUncheckedIndexedAccess` 도입 (markdown.ts 18 에러 + theme.ts 1 = 별도 사이클) (c) 페이지별 ErrorBoundary (d) 게임 viewport 밖 RAF 일시정지 (Intersection Observer). 변경 이력 hot **1행 / 한도 20** — 신규 출발. |

## 참고

- 도입 가이드: [harness-setup.md](harness-setup.md)
- 설치·적용: [harness-install.md](harness-install.md)
- harness 저장소: https://github.com/revfactory/harness
- harness SKILL.md: https://github.com/revfactory/harness/blob/main/skills/harness/SKILL.md
