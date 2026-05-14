<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries — Claude Code Operating Instructions

`H-eries` 는 단일 작가(`홍도산`)의 **오리지널 다중/평행 세계 정적 웹 시리즈**. 모든 등장인물·세계관은 작가 본인 창작이며, 저작권은 전적으로 `홍도산` 에게
귀속된다. **HTML + TypeScript + CSS 만** 사용 — 외부 라이브러리·번들러·프레임워크 없음. GitHub 공개 저장소 + GitHub Pages raw
static (`.nojekyll`) 로 발행.

## 핵심 원칙 (모든 작업에 강제)

1. **모든 `.md` 산출물에 저작권 고지 1줄 부착** — frontmatter 가 없으면 첫 줄, 있으면 frontmatter 직후 줄에 다음 HTML 주석 1줄:
   `<!-- © 2026 홍도산. All rights reserved. Original creator work. -->`
2. **등장인물 카드 `origin` 필드는 모두 `original`** — 본 프로젝트는 *작가(홍도산) 의 100% 오리지널 창작*. 차용 캐릭터·세계관·고유 능력명·고유
   진영명을 절대 도입하지 않는다. 외부 IP 의 캐릭터·세계관·고유명사 (예: 특정 작가의 작품에 등장하는 인물명·기술명·진영명) 를 본 프로젝트에
   *기재·인용·차용·암시·오마주 형태로도* 도입하지 않는다.
    - **카드 구조 (SSOT)** — 카드는 *공개 절* (`## 핵심 정체성` · `## 능력` · `## 인간관계` 등 — reader 빌드 노출) 과 *작가 분기
      절* (`## H-eries 분기 — {작품명} 변형` 이하 — 본 작품 변형 + 스포일러) 을 **분리 작성한다**. 분기 절은 reader 빌드에서 마스킹 (원칙
      #9).
    - **`heries_arc` 필드** — 본 작품 소환 시점 (예: `① 능력 각성 직후` / `⑤ 시스템 폭주 후` / 보류 시 `tba`) 을 frontmatter 에
      기록. 본 필드와 *H-eries 분기 절* 은 모두 reader 빌드에서 마스킹 (원칙 #9).
    - **운영 디테일 미노출** — 위 두 항목은 SSOT 운영 규약으로, `_series.md` 등 reader 노출 문서의 본문에서는 *구현 디테일 (
      필드명·placeholder·절 구조)* 을 노출하지 않는다 (서사 사실만 기술).
    - **외부 IP 차용 ZERO 정책** — 신규 캐릭터·세계관 도입 시: (a) *기존 작품의 캐릭터·고유명사·고유 능력·고유 진영* 과 명백히 구별되는 자작 모티프·자작
      명명 사용 (b) *닌자·무협 (정파·사파·혈교·천마신교 등)·헌터·회귀자·환생자·판타지* 등 *장르 원형·일반 명사* 는 사용 가능하나, *특정 작품의 식별 가능한
      고유 표현* 은 회피 (c) 의심스러우면 사용자 확인. NOTICE.md 의 모든 정책은 운영 SSOT.
3. **최소 의존 — 런타임은 React 19 + React Router + Vite 만** (2026-05-14 정책 v3). 본 의존 외 *런타임* 외부 라이브러리·UI
   키트·상태 관리 라이브러리 도입 시 사용자 확인 필수. *의존 추가의 정신* = "코드만 있으면 어디서든 실행 가능" — 특정 빌드 시스템·SaaS·플랫폼에 묶이는 *런타임*
   의존 금지. **dev 도구는 별도** — Storybook 등 *dist 산출물에 0 영향* 인 devDependencies 는 허용 (단, package.json
   `dependencies` vs `devDependencies` 구분 엄수).
4. **FSD 아키텍처** — 프론트엔드 코드는 `src/` 6 레이어 (`app/pages/widgets/features/entities/shared`). 상위 레이어 → 하위
   레이어만 import (격리). 슬라이스 외부에서는 `index.ts` (Public API) 만 import. 가이드: [
   `../src/README.md`](../src/README.md)
5. **TypeScript strict + JSX** — `tsconfig.json` 의 `strict: true` 유지. `.tsx` 소스만 git 커밋, 빌드 산출물 (
   `dist/`) 은 `.gitignore`. 빌드 = `npm run build` (Vite). 개발 = `npm run dev`.
6. **단일 작가 가정** — 다인 협업·코드 리뷰 분기 미적용.
7. **GitHub 공개 저장소** — 비공개 토큰·시크릿·개인 식별 정보(이메일·주소 등) 산출물 포함 금지.
8. **누적 산출물 최적화 강제** — append-only 구조는 임계 초과 시 압축 의무. 변경 이력 hot **20행** / 핸드오프 = 단일 파일 `CURRENT.md`
   덮어쓰기 (정책 v3). 점검 시점 = *세션 시작 직후* + *세션 종료 직전*. 절차: §누적 산출물.
9. **스포일러 분리 (작가 모드 vs 독자 모드)** — 독자 (default 빌드) 가 보는 것은 *시리즈 목록 + 등장인물 (원작 정보) + 발행된 챕터* 만. 마스킹
   대상 = (a) `_series.md` 의 `## 시놉시스` 절 (b) 캐릭터 카드의 `## H-eries 분기 ~` 이하 모든 절 (c) frontmatter
   `heries_arc` (d) `worldbuilding/timeline/glossary/`. 작가 모드 = `VITE_AUTHOR_MODE=true` 환경 변수 (
   `npm run dev:author` / `npm run build:author`). 라이브 GitHub Pages 는 항상 reader 빌드만 배포.
10. **작가 원칙 SSOT** — *(예약, 무대 컨셉 결정 후 작성)*. 새 무대 컨셉이 결정되면
    `content/series/{slug}/worldbuilding/writing-principles.md` 에 SSOT 작성 후 본 원칙에 챕터 작성 가이드 항목 추가.
11. **공통 컴포넌트 (`shared/ui/`) 스토리북 강제** (2026-05-14 신설) — `src/shared/ui/{name}/` 신규 컴포넌트 추가 시 동일
    슬라이스에 `{name}.stories.tsx` **반드시** 함께 작성. 누락 = 정책 위반. 스토리는 의미 있는 variant 최소 2 개 + 정상 케이스 1 개 (=
    최소 3 스토리). `widgets/`, `features/` 슬라이스는 권장 (강제 X). `pages/` 는 라우팅 의존이라 미적용.
12. **AI 개발 흐름 강제** (2026-05-14 신설) — auto-mode (자율 진행) 또는 3 파일 이상 변경 / 신규 슬라이스 도입 / 콘텐츠 SSOT 갱신 시 [`./workflow/workflow.md`](./workflow/workflow.md) 의 6 단계 흐름 (Context → Prompt QA → Roadmap → Tech Review → Adaptive Execution → Commit/Close) 강제. 트랙별 프롬프트 템플릿: [`develop`](./workflow/template/prompt-template-develop.md) / [`improvement`](./workflow/template/prompt-template-improvement.md) / [`review`](./workflow/template/prompt-template-review.md). 단일 기준점: [`prompt-reference.md`](./workflow/template/prompt-reference.md).

## 도구 우선순위

| 작업                             | 우선 도구                                                                                                           |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------|
| 코드 심볼 탐색 (클래스·함수·변수)           | Serena MCP (`serena-H-eries`) — `find_symbol` / `get_symbols_overview` / `find_referencing_symbols` 등 시맨틱 도구 우선 |
| 텍스트 패턴 검색 (마크다운 본문·고지문 등 비-심볼) | `Grep` / `Glob` (`grep` / `find` 셸 명령보다 우선)                                                                     |
| 파일 읽기                          | `Read` (단, 코드 파일은 Serena 로 심볼 단위 부분 읽기 우선 — 전체 Read 는 토큰 비용 큼)                                                  |
| 파일 편집 (작은 변경)                  | `Edit`                                                                                                          |
| 파일 전면 재작성                      | `Write`                                                                                                         |
| 외부 정보                          | `WebFetch` 또는 사용자 안내                                                                                            |

### Serena MCP 사용 지침

- `src/` 하위 `.ts` / `.tsx` 코드 탐색은 **Serena 시맨틱 도구를 우선** 사용한다. 이유: LSP 기반 심볼 단위 부분 읽기로 전체 파일 Read /
  광역 grep 대비 토큰 사용량을 크게 절감.
- 사용 예: 컴포넌트·함수·타입 정의 위치 찾기 → `find_symbol`. 특정 심볼의 호출처 추적 → `find_referencing_symbols`. 파일·디렉토리의 심볼
  개요 → `get_symbols_overview`.
- `grep` / `Grep` 은 *텍스트 패턴이 명확한 경우* (예: 저작권 고지문 1줄, frontmatter 키 존재 검사, `content/` 마크다운 본문 검색) 에만
  사용.
- `content/` 마크다운·`handoff/`·`harness/` 등 비-코드 산출물은 Serena 가 아닌 기존 도구 (`Read` / `Grep`) 사용.

## 하네스

본 프로젝트는 [revfactory/harness](https://github.com/revfactory/harness) 위에서 운영되는 *문서 기반 프로세스 하네스* 를
도입한다.

- 운영 문서 진입점: [`./harness/harness.md`](./harness/harness.md)
- 현 상태 SSOT: [`./harness/harness-state.md`](./harness/harness-state.md)
- 도입 가이드: [`./harness/harness-setup.md`](./harness/harness-setup.md)
- 설치·적용: [`./harness/harness-install.md`](./harness/harness-install.md)

### 하네스 트리거 (6 에이전트 + 1 오케스트레이터)

H-eries 작업은 **`H-eries-orchestrator` 스킬** ([
`./skills/H-eries-orchestrator/SKILL.md`](./skills/H-eries-orchestrator/SKILL.md)) 이 라우터 역할. 사용자
요청 → 적합 에이전트 자동 라우팅. 단순 질문·읽기·검색은 직접 응답.

| 트리거 키워드                                                           | 호출 에이전트                                | 정의                                                                                   |
|-------------------------------------------------------------------|----------------------------------------|--------------------------------------------------------------------------------------|
| "등장인물 추가/갱신", "캐릭터 카드", "origin 누락", "무공 정정", "사부·문파"             | `H-eries-lorekeeper`                   | [`./agents/H-eries-lorekeeper.md`](./agents/H-eries-lorekeeper.md)                   |
| "세계관 추가", "연표 갱신", "용어집", "`_series.md`", "차용 원작 목록", "페이즈 구조"    | `H-eries-worldsmith`                   | [`./agents/H-eries-worldsmith.md`](./agents/H-eries-worldsmith.md)                   |
| "챕터 작성", "ep-NN 작성", "본문 집필", "시놉시스 받아", "떡밥 매설"                  | `H-eries-author` (→ 자동 reviewer 파이프라인) | [`./agents/H-eries-author.md`](./agents/H-eries-author.md)                           |
| "정합성 감사", "연속성 검증", "챕터 검수", "SSOT 정합", "떡밥 추적"                   | `H-eries-continuity-reviewer`          | [`./agents/H-eries-continuity-reviewer.md`](./agents/H-eries-continuity-reviewer.md) |
| "컴포넌트 추가/수정", "렌더러", "UX 개선", "FSD", "빌드 스크립트", "타입 에러", "마스킹 로직" | `H-eries-frontend-engineer`            | [`./agents/H-eries-frontend-engineer.md`](./agents/H-eries-frontend-engineer.md)     |
| "사이트 빌드", "GitHub 배포", "manifest 갱신", "썸네일 프롬프트", "이미지 압축", "발행"  | `H-eries-publisher`                    | [`./agents/H-eries-publisher.md`](./agents/H-eries-publisher.md)                     |

**실행 모드:** 서브 에이전트 기본 + 챕터 작성은 author → continuity-reviewer 파이프라인 (하이브리드). 팀 모드는 사용자 명시 요청 시에만.

**모든 Agent 호출:** `model: "opus"` 명시 (하네스 품질 보장).

**사용자 commit 정책 (메모리):** main 브랜치만 + 사용자 직접 commit — 에이전트는 commit 하지 않음.

## 작업 사이클

[`./harness/harness-setup.md`](./harness/harness-setup.md) §6 참조.

## 세션 핸드오프

세션 종료 직전 또는 컨텍스트 60% 초과 시 Tier 2 핸드오프 갱신. 4-Tier 가이드: [
`./handoff/handoff.md`](./handoff/handoff.md). 핸드오프는 **단일
파일 [`./handoff/CURRENT.md`](./handoff/CURRENT.md) 덮어쓰기** (2026-05-11 정책 변경 — 날짜별 신규 파일·archive 폐기,
이전 본문은 git history 로 회수). 새 세션 시작 시 `CURRENT.md` 부터 Read 후 *Relevant Files* 검증 → 본 CLAUDE.md →
harness 진입점 순.

## 누적 산출물 (위치 + 최적화)

본 문서·산출물의 모든 변경은 [`./harness/harness-state.md`](./harness/harness-state.md) §변경 이력 표에 누적 기록한다 (분산 기록
금지).

다음 append-only 구조는 임계 초과 시 압축한다. **세션 시작 직후** 와 **세션 종료 직전** 두 시점에 점검 강제.

| 대상                                                                | Hot 한도     | 초과 시 처리                                                                                                                                                                                                                                                                                   |
|-------------------------------------------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`./harness/harness-state.md`](./harness/harness-state.md) §변경 이력 | 최근 **20행** | 21행 도달 시 **hot 에 최근 3행만 남도록 가장 오래된 행을 한꺼번에** [`./harness/harness-state-archive.md`](./harness/harness-state-archive.md) 로 이동 (= 매번 약 18행 일괄 이동, 카드 1장당 archive 발동 사이클 회피). archive 형식 = **1줄 bullet** (`- YYYY-MM-DD: 핵심 내용`) — 셀 단위 손실 압축. 원본 복원은 git history 로 해당 행이 hot 에 있던 commit 참조 |
| [`./handoff/CURRENT.md`](./handoff/CURRENT.md)                    | 단일 파일      | 세션 종료 직전 / 컨텍스트 60% 초과 시 **덮어쓰기**. 이전 본문 회수 = git history (`git log -p .claude/handoff/CURRENT.md`). 토큰 예산 2,000 이내. archive 디렉토리·날짜별 파일 생성 금지                                                                                                                                            |

원칙:

- *Hot* 임계는 보수적으로. 늘릴 필요가 보이면 본 정책 자체를 갱신 후 적용 — 임의 완화 금지.
- 압축은 **이동 + 손실 압축**. archive 파일은 *검색·요약* 용도로 가벼움 우선 — 원본 행 복원은 git history 로 보장 (이미 commit 된 hot 표
  행을 그대로 되돌릴 수 있음).
- *압축 의무 누락* 자체가 본 정책 위반. 세션 시작 시 임계 점검 결과를 (필요 시) 사용자에게 보고하고 압축 후 작업 진입.
- 변경 이력 압축 시 archive 이동 자체를 *변경 이력에 새 1행으로* 기록 (메타-기록).
