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
- [진화 우선순위](#진화-우선순위)
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
| 서비스 | `H-eries` — 단일 작가의 소설 컬렉션 정적 사이트 |
| 작품 #1 | **차원의 격돌** (`series/clash-of-multiverses/`) |
| 콘텐츠 성격 | **비상업적 크로스팬픽** — 원작 캐릭터 권리는 각 원저작자에게 귀속 |
| 작성자 | 단일 (`홍도산`) — 외부 협업자·다인 작가 가정 없음 |
| 독자 | 읽기 전용 (방문자는 수정 권한 없음) |
| 빌더 | 라이브러리 의존성 0 — markdown / HTML 만. GitHub Pages 의 raw static 모드(`.nojekyll`) 또는 정적 호스팅 |
| 배포 | GitHub **공개** 저장소 |

## 구성 요소

`H-eries` 하네스를 구성하는 요소.

| # | 요소 | 위치 |
|---|---|---|
| 1 | 페르소나/역할 정의 | 각 에이전트 frontmatter + 본문 §0 |
| 2 | 다중 전문 에이전트 분리 | `.claude/agents/agent-{lorekeeper,author,continuity-reviewer,publisher}.md` |
| 3 | 단일 기준점 (SSOT) | 등장인물·세계관·연표·용어집 — `content/series/{slug}/{characters,worldbuilding,timeline,glossary}/` |
| 4 | 단계별 작업 사이클 | 챕터 초안 → SSOT 갱신 → 연속성 감사 → 커밋 → 발행 ([harness-setup.md §6](harness-setup.md#6-작업-사이클)) |
| 5 | AI 자가 검증 | `agent-continuity-reviewer` 가 신규 챕터의 SSOT 정합성 감사 |
| 6 | 산출물 스키마 | 등장인물 카드 frontmatter (`name`, `origin`, `affiliation`, `role`, `first_appearance`), 챕터 frontmatter (`title`, `episode`, `published`) |
| 7 | 비상업적 팬픽 고지 | 모든 .md 첫 줄 HTML 주석 1줄 — CLAUDE.md 에 강제 |
| 8 | 도구 우선순위 | `.claude/CLAUDE.md` §도구 우선순위 + Serena MCP 사용 지침 |
| 9 | 변경 이력 (Synchronous Update) | 본 문서 §변경 이력 — 하네스 docs 3종의 SSOT |

## 에이전트 인벤토리

2026-05-12 하네스 엔지니어링: 4 → 6 세분화. 코드 작업 분리 + 세계관 분리.

| 에이전트 (frontmatter `name`) | 역할 | 상태 | 정의 |
|---|---|---|---|
| `H-eries-lorekeeper` | 캐릭터 카드 SSOT (`characters/`) 작성·정정·검증 | 작성 (2026-05-12) | [`../agents/H-eries-lorekeeper.md`](../agents/H-eries-lorekeeper.md) |
| `H-eries-worldsmith` | 시리즈 메타 + 세계관·연표·용어집 (`_series.md`, `worldbuilding/`, `timeline/`, `glossary/`) | 작성 (2026-05-12, 신규) | [`../agents/H-eries-worldsmith.md`](../agents/H-eries-worldsmith.md) |
| `H-eries-author` | 챕터 본문 작성 (`chapters/`) — 시놉시스 사실화 / 플롯 보존 | 작성 (2026-05-12) | [`../agents/H-eries-author.md`](../agents/H-eries-author.md) |
| `H-eries-continuity-reviewer` | 신규 챕터 정합성 감사 (직접 수정 X — 보고서만) | 작성 (2026-05-12) | [`../agents/H-eries-continuity-reviewer.md`](../agents/H-eries-continuity-reviewer.md) |
| `H-eries-frontend-engineer` | `src/` (FSD) + `scripts/` + 빌드 설정. Serena MCP 우선, 의존성 0 정책 | 작성 (2026-05-12, 신규) | [`../agents/H-eries-frontend-engineer.md`](../agents/H-eries-frontend-engineer.md) |
| `H-eries-publisher` | 발행·배포 — manifest, 빌드 검증, 이미지 강제, 썸네일 프롬프트, GH Pages | 작성 (2026-05-12) | [`../agents/H-eries-publisher.md`](../agents/H-eries-publisher.md) |

작성률: **6/6 (100%)**. 라우터 = [`../skills/H-eries-orchestrator/SKILL.md`](../skills/H-eries-orchestrator/SKILL.md).

## SSOT 구조

```
content/
  series/
    clash-of-multiverses/        # 작품 #1: 차원의 격돌
      _series.md                 # 시리즈 메타 (제목·시놉시스·연재 상태·차용 원작 목록)
      characters/                # 등장인물 SSOT (캐릭터당 1 파일)
        {character-id}.md        # frontmatter + 서술 본문
      worldbuilding/             # 지역·세력·체계
      timeline/                  # 연표
      glossary/                  # 용어집
      chapters/
        ep-01-{slug}.md          # 에피소드 본문 (frontmatter + 본문)
        ep-02-{slug}.md
        ...
```

### 등장인물 카드 frontmatter 예시

```markdown
---
name: 캐릭터 표시명
origin: 원작 출처 (예: "OOO 웹툰 - 작가명") — 차용 시 필수, 누락 시 reject
affiliation: 소속 (조직/세력/소속 시리즈)
role: protagonist | antagonist | supporting | cameo | original
first_appearance: ep-01-prologue
aliases: [별칭1, 별칭2]
heries_arc: tba   # 본 작품에서의 소환 시점·상태. 보류 시 tba (선택 필드)
---

(본문 = 원작 메타 → 원작 캐논 → H-eries 분기 → 검증 출처 4 절 구조)
```

> `origin` 필드는 **차용 캐릭터** 식별에 필수. 본 작품 오리지널 캐릭터는 `origin: original`.
> *다중 우주 전제* 로 인해 본문은 *원작 캐논 절* 과 *H-eries 분기 절* 을 분리 작성한다. 정책 SSOT: [`../../content/series/clash-of-multiverses/_series.md`](../../content/series/clash-of-multiverses/_series.md) §기본 전제.

## 자동 강제 메커니즘

| 항목 | 존재 |
|---|---|
| `H-eries-continuity-reviewer` 자동 호출 (신규 챕터 작성 시) | **구현** — `H-eries-orchestrator` SKILL.md §4-2 챕터 작성 파이프라인 (author → continuity-reviewer 자동) |
| 등장인물 카드 frontmatter 스키마 검증 | LLM 순응 (`H-eries-lorekeeper` §검증 체크리스트) |
| 챕터 → 캐릭터 참조 무결성 검증 | LLM 순응 (`H-eries-continuity-reviewer` §검증 체크리스트) |
| 비상업적 팬픽 고지 부착 강제 | **구현** — CLAUDE.md §핵심 원칙 #1 + 모든 에이전트 §작업 원칙 |
| 이미지 budget 강제 (≤500KB) | **구현** — `scripts/check-images.mjs` 빌드 게이트 (build·build:author 시작에 chain) |
| 작가 빌드 라이브 노출 차단 | **구현** — `.github/workflows/deploy.yml` 의 `VITE_AUTHOR_MODE: ""` env 강제 |
| Pre-commit hook | 없음 (사용자 메모리 = 사용자 직접 commit 정책 — hook 도입 보류) |

자동 강제: **4건** (orchestrator 파이프라인 + 고지 부착 + 이미지 budget + 작가 빌드 격리). 콘텐츠 정합성은 LLM 순응 + 에이전트 §검증 체크리스트.

## 진화 우선순위

1. **`agent-lorekeeper` 시범 생성** ([harness-install.md §4](harness-install.md#4-첫-적용--agent-lorekeeper-시범-생성)) — harness Phase 1–6 자동 실행. 가장 핵심: 등장인물 SSOT 정의·검증.
2. **첫 시리즈 메타 작성** — `content/series/clash-of-multiverses/_series.md` (시놉시스 + 차용 원작 목록).
3. **첫 챕터 시범 작성 + `agent-author` 도입** — 한 사이클 완주 (집필 → SSOT 갱신).
4. **`agent-continuity-reviewer` 도입** — 두 번째 챕터 진입 직전. 첫 챕터를 바탕으로 검증 규칙 학습.
5. **`agent-publisher` 도입** — GitHub Pages 발행 절차 자동화. `.nojekyll` 라우팅·인덱스 페이지 갱신·`gh` CLI 래퍼.
6. **자동 강제 도입 (선택)** — frontmatter 스키마 검증 스크립트 (라이브러리 미사용 — bash + grep 등). pre-commit 도입 여부는 사용자 판단.

## 변경 이력

harness Phase 7 패턴을 차용한 변경 이력. 모든 진화 변경은 *날짜 / 변경 내용 / 대상 / 사유* 4컬럼으로 기록.

> **Hot 한도: 20행.** 21행 도달 시 **hot 에 최근 3행만 남도록 가장 오래된 행을 한꺼번에** [`harness-state-archive.md`](harness-state-archive.md) 로 이동 (= 매번 약 18행 일괄 이동, **1줄 bullet 압축 형식** `- YYYY-MM-DD: 핵심`). 카드 1장당 발동 사이클 회피. 원본 복원은 git history. 정책 SSOT: [`../CLAUDE.md`](../CLAUDE.md) §누적 산출물. 점검 시점 = 세션 시작 직후 + 세션 종료 직전.

| 날짜 | 변경 내용 | 대상 | 사유 |
|---|---|---|---|
| 2026-05-12 | **11 인 자작 카드 본문 1차 패스 + manifest 등재 + 이미지 압축 + 2 분리 commit** — H-eries-orchestrator skill 호출 → general-purpose subagent (model: opus) 통해 lorekeeper agent 정의 inline 위임 (Agent subagent_type 'H-eries-lorekeeper' 미등록으로 우회). 본 사이클 산출: (1) **11 카드 신규** = `content/series/clash-of-multiverses/characters/1-protagonist/hyeon-woo-jin.md` + `2-major-supporting/{eira, yamura-tou, seo-un-hyeok, ryeong-geuk, go-cheon-han, yu-baek-gyeong, bi-hyeon, rim-woo-gyeong, hyeon-woo, baek-mu-jin}.md`. (2) **manifest.json** characters 배열 11 인 등재 (status: 재구축 중 유지). (3) **이미지 압축** = `content/_shared/{H-eries-mark, thumbnail-placeholder}.webp` 4302 → 295 KB (-93%), 빌드 게이트 500 KB/이미지 통과. (4) **2 분리 commit** = `dd7f170` chore(images) 이미지 + `09c35bb` feat(characters) 11 카드 + manifest. **검증**: (a) 카드 평균 53 줄 (50~67 범위, 백무진 67 = 모방 가능/불가 분리 표) (b) 외부 IP grep 점검 6 항목 모두 0 매칭 (그림자 군주·차크라·매화검법·수라혈천도·접촉 발동·모노마 등) (c) 모든 카드 `origin: original` + 저작권 고지 1줄 + 공개 절·작가 분기 절 분리 + heries_arc 마스킹 필드 (d) 핵심 정정 일관 = 백무진 *기예 모사* (능력 자체 X, 기술만 O) / 림우경 한국 외형 + 조상 혈통 작가 분기 마스킹 / 에이라 비-한국 여성 / 인간형 외형 필수. **typecheck/build 실패** = 본 사이클 무관 환경 이슈 (node_modules/vite 미설치 + `npm run typecheck` 의 `tsc -b --noEmit` 충돌 TS5094) — frontend-engineer 별도 사이클 처리 권장 | `content/series/clash-of-multiverses/characters/{1-protagonist,2-major-supporting}/*.md` (11 신규), `content/series/clash-of-multiverses/manifest.json` (11 인), `content/_shared/{H-eries-mark,thumbnail-placeholder}.webp` (압축) | 본 사이클 = 작품 컨셉 전면 개편 (2026-05-12) 후 *첫 카드 본문 작성 사이클*. lorekeeper 위임 패턴 = orchestrator skill 라우팅 + general-purpose subagent inline lorekeeper 정의 (Agent type 미등록 우회) 검증 완료 — 다음 사이클부터 동일 패턴 적용. 다음 사이클 후보 = (a) worldsmith 진영 SSOT 11 본문 작성 + `_series.md` 10 → 11 인 동기화 (b) 추가 결정 4 항목 (진영 간 관계 그리드 / 페이즈 2 작가 정체 단서 일관성 6 단서 수렴 여부 / 현우진-에이라 동맹 or 라이벌 / 백무진 *모든 기술 본 자* 떡밥 페이즈 2 발현 형식) (c) frontend-engineer 환경 복구 (`npm install` + typecheck 스크립트 정정) (d) ep-01~04 자작 변환 (legacy 본문에서 사건·구성·문체 보존, 등장인물·세계관 표현만 자작 치환). 변경 이력 hot 18행 / 한도 20 — 여유 2, 다음 사이클 후 임계 임박 보고 필요 |
| 2026-05-12 | **대규모 통합 사이클 — orphan squash (history 초기화) + SPA 전환 + NOTICE 페이지 + 옵션 C 11 카드 fix + 라이선스 All Rights Reserved 통일 + ZERO 정책 표현 통일** — 사용자 결정 5건: (1) *원격 GitHub commit 기록 다 초기화 (병렬)* (2) *SPA 로 진행* (3) *코드도 저작권 가장 강한 것* (4) *NOTICE 따로 페이지 + 전체 프론트엔드 개선* (5) 옵션 C (11 카드 렌더링 차단 fix). 단일 메가 사이클 산출: (a) **git history rewrite** = orphan branch + root commit `e394480` + force push origin main. 이전 39 commit (e00ba18 부터, *non-commercial cross-fanfic·sungjinwoo·14-original list·spoiler masking* 등 차용 컨셉 흔적 다수) → root 1 commit squash. GitHub reachable history 차용 흔적 0. dangling commit 은 자동 gc 대기 (수 주~수 개월) — 사용자 결정 *repo 재생성 안 함*. (b) **SPA 전환** (`b68a233`) = HashRouter → BrowserRouter + basename `import.meta.env.BASE_URL.replace(/\/$/, '')` + vite.config base 분기 (production `/H-eries/` / dev `/`) + publicDir 활성화 + public/404.html 신규 (spa-github-pages redirect) + index.html replaceState 복원 inline script + meta description 갱신. (c) **NOTICE 페이지** = `src/pages/notice/{notice.tsx,index.ts}` 신규 + `<Route path="/notice">` 등록 + footer NOTICE 외부 GitHub URL → 내부 `<Link to="/notice">` 전환 (2곳) + `content/notice.md` dev 미러 + `scripts/copy-content.mjs` 가 build 시 루트 NOTICE.md → dist/content/notice.md 자동 복사 (SSOT = 루트 NOTICE.md). (d) **환경 복구** = `npm install` 73 packages 0 vulnerabilities + `package.json` typecheck `tsc -b --noEmit` → `tsc --noEmit` (TS5094 충돌 제거). (e) **footer `.site-footer .meta` CSS 정의 8행 제거**. (f) **옵션 C 11 카드 fix** (`1e3aa79`) = manifest.json characters `string[]` → `CharacterIndex[]` 객체 배열 (11 인 `{id, folder, name}`) + types.ts CharacterFolder union 에 `'1-protagonist'` 추가 (legacy `'1-main-character'` 보존) + manifest.ts `normalizeSeriesManifest` + `normalizeCharacters` 헬퍼 (string[] 레거시도 graceful) + character.tsx FOLDER_LABEL `'1-protagonist': '주인공'` + character-list.tsx GROUP_ORDER 선두 추가. (g) **라이선스 통일** (`736d12e`) = LICENSE MIT scope 폐기 → 전체 단일 All Rights Reserved + NOTICE §코드 라이선스 (구분)·§이력 절 제거 + README §저작권 *코드 MIT 별도* 제거. (h) **표현 통일** (`b73ff5c`) = *외부 IP 차용 0* → *외부 IP 차용 ZERO 정책* (NOTICE/content/notice/CLAUDE.md/CURRENT.md/footer disclaimer/state.md 일관) + README HashRouter 잔존 3 곳 → BrowserRouter + content/about.md FAQ heading 형식 (`**Q.**` → `### Q.` 사용자 직접). (i) **scripts/copy-content.mjs (`0b2adf4`)** = 미사용 `stat` import 제거 (NOOP cleanup). **commit** = root `e394480` + 6 commit (`b68a233` SPA + `07756b0` footer 링크 + `9cfe194` NOTICE 표현 + `1e3aa79` 옵션 C + `0b2adf4` stat 정리 + `b73ff5c` 문서 표현 통일) + 사전 3 commit (`736d12e` 라이선스 + `4b04113` footer meta + `6c3d3bf` 핸드오프 — orphan squash 전, root commit 에 흡수). **검증**: typecheck 0 / build 1.11s 0 에러 / 11 카드 dist 정상 + loadCharacter find 11/11 매칭 / 마스킹 누수 0 (H-eries 분기 0건, heries_arc 0건) / FSD 위반 0 / SPA 라우팅 흐름 GitHub Pages 호환 (404.html → ?/path → replaceState → React Router 매칭) | **메가 사이클** = root `e394480` 99 files + 6 후속 commit. 주요 = LICENSE / NOTICE.md / README.md / content/notice.md / content/about.md / .claude/CLAUDE.md / .claude/handoff/CURRENT.md / .claude/harness/harness-state.md / content/series/clash-of-multiverses/manifest.json / src/app/main.tsx / src/pages/notice/{notice.tsx,index.ts} / src/widgets/footer/footer.tsx / src/shared/lib/{types,manifest}.ts / src/pages/character/character.tsx / src/widgets/character-list/character-list.tsx / src/shared/styles/style.css / scripts/copy-content.mjs / vite.config.ts / index.html / public/404.html / package.json | 본 사이클 = H-eries 최대 통합 사이클. *원격 history 초기화* 가장 destructive (사용자 명시 권한). agent 위임 패턴 추가 검증 = (1) lorekeeper (옵션 C 콘텐츠) + frontend (옵션 C 코드) 병렬 분리 충돌 0 (2) agent 미커밋 stash + orphan checkout + stash pop (3) Agent type 미등록 → general-purpose + agent 정의 inline 우회 안정. **잔여 결정** = (a) GitHub UI repo 재생성 보류 (자동 gc 대기) (b) 11 카드 추가 SSOT 4 항목 (진영 간 관계 / 페이즈 2 작가 정체 6 단서 / 현우진-에이라 / 백무진 떡밥 발현) 보류. **다음 사이클 후보** = (1) worldsmith 진영 SSOT 11 본문 + _series.md 10 → 11 인 동기화 (2) build:author base 분기 (`--base=/`) (3) ep-01~04 자작 변환. 변경 이력 hot **19행 / 한도 20 — 여유 1**. **다음 사이클 시작 직후 압축 임계 도달 (20행) — archive 압축 발동 의무** |
| 2026-05-12 | **메가 사이클 후속 마무리 — 이미지 재압축 + favicon 교체 + 세레나 재등록 + ErrorBoundary + build:author base 분기 + 프론트 정리** — 사용자 명시 5건: (1) *이미지 압축* (2) *favicon = H-eries-mark 로 설정 / 기존 차원의 격돌 이미지 어디?* (3) *세레나 연동* (4) *전체 프론트엔드 검토 + 에러 바운더리* (5) *알아서 커밋·푸시*. 단일 후속 마무리 사이클: (a) **이미지 재압축** (`f9fbcf2`) = _shared 2장 = H-eries-mark 2248 → 91 KB (-96%, 사용자 신규 이미지) + thumbnail-placeholder 230 → 220 KB (-5%) = 합 2478 → 311 KB (-87%). (b) **favicon 교체** (`914cba8`) = `src/shared/img/favicon.webp` 를 H-eries-mark.webp (보라색 h 마크 + 다중우주 모티프) 로 덮어쓰기. (c) **세레나 MCP 재등록** = `claude mcp add serena-H-eries` 경로 `/Users/hongyeongjune/IdeaProjects/H-eries` (이전 stale 경로 `/Users/홍도산/onion-workspace/H-eries` 폐기, 시스템 username 정정). 검증 `serena-H-eries: ✓ Connected`. 첫 LSP 인덱싱 5~15분 백그라운드 → 다음 세션부터 도구 가용. (d) **ErrorBoundary 전역 도입** (`1f351d8`) = `src/shared/ui/error-boundary/{error-boundary.tsx, index.ts}` 신규 (React 19 Class Component 직접 구현, 의존성 0 정책 = react-error-boundary 미사용). `src/app/main.tsx` 의 `<BrowserRouter>` 내부 `<Header>` 와 `<Routes>` 사이 전역 wrap (옵션 A). fallback 분기 = dev (`import.meta.env.DEV`) → error.message + stack + component stack `<details open>` / production → "문제가 발생했습니다" + 사용자 친화. 둘 다 console.error. 「홈으로」 = `window.location.assign(import.meta.env.BASE_URL)` (basename 정합). CSS `.error-boundary` 절 신규. (e) **build:author base 분기** (`6d7bcd9`) = `vite.config.ts` 에 `VITE_AUTHOR_MODE` env 분기 = reader build production `/H-eries/` / author build `/` / dev `/`. dist-author/index.html asset 경로 `/assets/...` (no /H-eries) → `npx serve dist-author` 즉시 동작. dist (reader) 는 `/H-eries/assets/...` 유지. agent 2 이전 부차 발견 해소. (f) **프론트엔드 정리** (`6c7c4db`) = `pages/chapter/chapter.tsx:2` import 명시 (`'../../entities/chapter' → '../../entities/chapter/index.js'`, FSD 일관성) + `widgets/header/header.tsx` theme-toggle aria-label + title 추가 (a11y, accessible name 누락 정정) + `style.css` stale class 4 영역 삭제 (`.theme-toggle-text` × 2 / `.header-contact-arrow` × 2 / `.character-rights-notice` × 2 / `.sr-only`) + undefined var 정정 (`--bg-2` → `--bg-soft` / `--rule-soft` → `--rule` / `--shadow-1` fallback → `--shadow`). **검증**: typecheck 0 / reader build 0 에러 + 마스킹 누수 0 (9 verbatim, 12 masked) / author build 0 에러 (24 verbatim, 0 masked) / check-images OK / FSD 위반 0 / 마크다운 렌더러 11+ 케이스 통과. **legacy 차원의 격돌 이미지 복구 불가** = dangling commit·blob 어디에도 cover.webp / ep-01~04 thumbnails 없음 (직전 main `6c3d3bf` tree 도 빈 상태 = orphan squash 이전부터 이미 제거). 복구 가능 자산 = unreachable PNG 1개 (`be9b36f` 1254×1254 RGBA 2.3 MB) — 사용자 결정 보류. 백업 경로 `/Users/홍도산/onion-workspace/H-eries-archive/` 도 stale (시스템 username `hongyeongjune` vs 작가명 `홍도산` 혼동의 결과 추정). **commit** = 5 분리 (f9fbcf2 이미지 재압축 + 914cba8 favicon + 1f351d8 ErrorBoundary + 6d7bcd9 base 분기 + 6c7c4db 프론트 정리) | `src/shared/ui/error-boundary/{error-boundary.tsx,index.ts}` (신규), `src/app/main.tsx` (ErrorBoundary wrap), `vite.config.ts` (VITE_AUTHOR_MODE base 분기), `src/widgets/header/header.tsx` (a11y), `src/pages/chapter/chapter.tsx` (FSD), `src/shared/styles/style.css` (stale class + undefined var + .error-boundary), `src/shared/img/favicon.webp` (H-eries-mark 교체), `content/_shared/{H-eries-mark,thumbnail-placeholder}.webp` (재압축), `~/.claude.json` (serena-H-eries 등록), `.claude/handoff/CURRENT.md` (덮어쓰기), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 메가 사이클 (직전 통합) 후속 마무리. **agent 위임 패턴 4회 검증** = lorekeeper × 2 + frontend-engineer × 4 모두 general-purpose inline 우회로 안정. ErrorBoundary 는 사이트 전역 에러 격리 첫 도입 — 향후 페이지별 wrap 추가 시 더 세밀한 격리. build:author base 분기로 *작가 로컬 검수 워크플로우* 가 npx serve / file:// 등 다양한 환경 호환. **legacy 이미지 복구 불가 = 작품 컨셉 전환 사이클의 누락** — 다음 사이클부터 *백업 경로 점검 strict + 정책 SSOT 유지* 필요. **다음 사이클 후보** = (1) 변경 이력 archive 압축 (hot 20 도달 = 필수 발동) (2) worldsmith 진영 SSOT 11 본문 + `_series.md` 10 → 11 인 동기화 (3) ep-01~04 자작 변환 (4) frontend 부차 발견 항목 (useAsync AbortController·ChapterPage 분해·페이지별 ErrorBoundary·외부 링크 rel) (5) legacy dangling PNG `be9b36f` 복구 결정 (6) 천기망 Serena MCP (별도 프로젝트, 절대 경로 미회신). 변경 이력 hot **20행 / 한도 20 — 도달**. **다음 사이클 시작 직후 archive 압축 발동 의무** |
| 2026-05-12 | **11차 archive 압축 + UX 장애 5종 fix + 레거시 18 ref 보존 + 4 차 이름 일괄 + 5 카드 컨셉 보강 + IntelliJ 19/30** — 사용자 명시 다건: (1) *archive 압축* (2) *UX 장애 해결* (3) *레거시 복구 + gitignore* (4) *등장인물 안 보임 / 차원의 격돌 페이지 버그 해결* (5) *현우진 → 현진혁 → 현우혁 → 우진혁 + 서운혁 → 서운룡 + 령극 → 천령극 + 비현 → 막무련* 4 차 이름 일괄 (6) *유백경 + 백무진 + 우진혁 + 서운룡 + 막무련* 5 카드 컨셉 전면 보강 (7) *IntelliJ 권장 경고 모두 해결* (8) *자율 권한 위임 — 알아서 커밋·푸시*. 메가 사이클 산출: (a) **archive 압축** = hot 20행 → 3 kept + 본 메타 = 4 → 5 행. archive 17 bullets 누적 (`harness-state-archive.md` 80행). (b) **레거시 복구 + gitignore 보장** = `content/_legacy_recovery_2026-05-12/` 신규 (`_legacy_*` gitignore, 98 파일 / 8.0 MB / git status clean). 회수 = 15 legacy 카드 (sungjinwoo·naruto·luffy 등 from `d371fd74`) + legacy `_series.md` + 14 사이클별 핸드오프 + raw-bundle (`legacy-all.bundle` 6.8 MB, `git bundle --all`, refs/recovered/* 18개 unreachable→reachable 승격). 회수 불가 = ep-01~04 본문 / 22-card 완성본 (어떤 tree 에도 staged 안 됨). 레거시 시놉시스 구조 파악 = 페이즈 1 (1막 3 추락 / 2막 5 추락 / 3막 단독 주인공 군단 호출 + 임시 휴전 협공 cliffhanger). 본문 카피 X. (c) **UX 장애 5종 fix**: 1) `src/pages/home/home.tsx` HERO_ALT + eyebrow + h1 → 크로스오버 팬픽 폐기 → MULTIVERSE · ORIGINAL · WEB SERIES + *오리지널 다중/평행 세계 시리즈* (외부 IP ZERO 직접 위반 해소). 2) `src/widgets/header/header.tsx` `.meta` + aria-label + stale 주석 정정. 3) `_series.md` 등장인물 표 10인 tba → 11인 실제 카드 + 원형 매핑 + status `자작 매핑 완료 — 챕터 집필 대기`. 4) `manifest.json` + `series.json` status 일관성. 5) **★ 핵심 — BrowserRouter 상대경로 fetch 실패** = `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`. 원인 = `./content/...` 상대경로가 SPA route 기준으로 resolve. 수정 = `src/shared/lib/env.ts` 에 **`assetUrl(rel)` 헬퍼** 신규 (BASE_URL prefix + `^\.?\/` 정리), 13 호출처 일괄. dev 8 endpoint 200 OK. (d) **Notice 외부 URL 정정** = `github.com/홍도산/H-eries` (한글화 부작용) → `github.com/hongdosan/heries` (실제 repo) + about.md 의 NOTICE 외부 GitHub → 내부 `./notice` 라우트. (e) **4 차 이름 일괄** = 현우진 (玄祐眞) → 현진혁 (玄鎭赫) → 현우혁 (玄祐赫) → **우진혁 (禹鎭赫)** [woo-jin-hyeok] / 서운혁 (徐雲赫) → **서운룡 (徐雲龍)** [seo-un-ryong] / 령극 (靈極) → **천령극 (天靈極)** [cheon-ryeong-geuk] / 비현 (鼻玄) → **막무련 (莫武連)** [mak-mu-ryeon]. 파일 rename + slug + name + 한자 + manifest + _series.md row + 9 카드 인간관계 표현 모두 일관 정정. hyeon-woo 모티프 = *현 성씨 우연* → *우 글자 공유 우연* 강화. (f) **5 카드 컨셉 전면 보강**: 우진혁 (가족 약값·단검 폐기 → 부모 부재 + 똑똑한 여동생 + UDT 군문 + 격투칼 + 명부 호흡 무한 재생 + *마음에서 우러나는 군주적 충성* 회로 + 카피 임계 안배) / 유백경 (청람검문 → **종남파** + **천하일대검수** + 정·중·후 묵직 단일 + **천하삼십육검 (天下三十六劍) — 천하 삼십육 방 어디에서 들어오는 공격도 막지 못할 방위가 없다**) / 백무진 (무명자 → 평범한 학생 + *눈이 좋은 편* 자기 인식 + **카피 임계 — 신체 자체 최적화 변형** + **다중우주 분기 떡밥** *모든 세계관 신체 능력 카피하는 상위 분기 백무진*) / 서운룡 (전면 재작성: 혈교 역대 혈마 + 비사실적 외모 + 환술·사기·피 + 혈교 무공 배운 자 전율·무릎 회로 + ★ **신체 강탈 강림 안배** 페이즈 2~3 떡밥) / 막무련 (전면 재작성: 녹림 역대 녹림왕 + 외공의 극 + **만수파천권 (萬獸破天拳)** 만 마리 짐승 권법 + 자연 가호 동물 회로 + *곰의 가죽 여우의 결* 호탕 + 영리). (g) **IntelliJ 권장 경고 19/30 해결** = import shorten 16 (`/index.js` → 디렉토리, main/series/chapter/character/home/chapter-character-strip) + regex redundant escape 3 (markdown.ts `\]` `\}`) + scripts process import 3 (check-images/copy-content/optimize-images) + var → const 3 (index.html L22, 404.html L17·18) + package.json `name` 표준 (`H-eries` → `heries` 소문자 npm 규약) + `homepage` URL 정정 (한글 → hongdosan/heries) + vite.config base (`/H-eries/` → `/heries/`). index.html `Cannot resolve 'src'` 11건은 Vite dev/build 동적 경로 IDE false positive (코드 차원 해결 불가능, `.idea/` source root 영역). | `.claude/harness/harness-state.md` (본 행, 17행 archive 이동), `.claude/harness/harness-state-archive.md` (17 bullets append), `content/_legacy_recovery_2026-05-12/**` (gitignored 98 파일 / 8 MB), `src/shared/lib/env.ts` (assetUrl 헬퍼), `src/shared/lib/{manifest,use-img-fallback}.ts` (assetUrl 적용), `src/pages/{home,series,chapter,about,notice}/*.tsx` (assetUrl 적용), `src/widgets/{chapter-toc,series-list}/*.tsx` (assetUrl 적용), `src/widgets/header/header.tsx` (UX), `content/series/clash-of-multiverses/_series.md` (11인 표), `content/series/clash-of-multiverses/manifest.json` (status), `content/series.json` (status) | 본 사이클 = (1) 정책 의무 (archive 압축 hot 20 도달) + (2) 사용자 직접 버그 보고 4건 동시 해결. **★ BrowserRouter 상대경로 버그** = 메가 통합 사이클 (HashRouter → BrowserRouter, `b68a233`) 의 *부작용 잔존* — 당시 SPA redirect 와 basename 만 다뤘으나 fetch 상대경로는 누락. 본 사이클이 *5월 12일 메가 사이클 후속 결산*. **다음 사이클 후보** = (1) worldsmith 진영 SSOT 11 본문 (`worldbuilding/factions/*.md`) (2) ep-01~04 자작 변환 (author → continuity-reviewer 파이프라인) (3) frontend 부차 발견 (useAsync AbortController / ChapterPage 분해 / 페이지별 ErrorBoundary / 외부 링크 rel) (4) 추가 SSOT 4 항목 (진영 그리드 / 페이즈 2 작가 정체 6 단서 / 현우진-에이라 / 백무진 떡밥). 변경 이력 hot **4행 / 한도 20** (3 kept + 1 meta = 4). 다음 압축 임계 = 21행 (16 사이클 후 발동). |

> 다음 진화 트리거: `agent-lorekeeper` 시범 생성 후 §에이전트 인벤토리·구성 요소 표 갱신.

## 참고

- 도입 가이드: [harness-setup.md](harness-setup.md)
- 설치·적용: [harness-install.md](harness-install.md)
- harness 저장소: https://github.com/revfactory/harness
- harness SKILL.md: https://github.com/revfactory/harness/blob/main/skills/harness/SKILL.md
