<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->

# Claude 세션 Context Handoff — heries 4-Tier 적용 가이드

`heries` 프로젝트가 [Claude 세션 간 Context Handoff: 4계층 전략](https://codex.epril.com/claude-session-context-handoff-4-layer-strategy) (codex.epril.com, 2026-04-23) 을 *단일 작가 정적 웹 시리즈* 도메인에 맞춰 적용한 운영 매뉴얼.

> Tier 가 올라갈수록 영속성과 구조화 강도가 높아진다. 현 사이클: **Tier 1 + Tier 2 즉시 적용**, **Tier 3 부분 운영** (auto-memory + harness-state 변경 이력), **Tier 4 점진 도입** (ADR 은 사이트 디자인/콘텐츠 결정 누적 시).

## 목차

- [목적](#목적)
- [Tier 1 — In-Session Context Management](#tier-1--in-session-context-management)
- [Tier 2 — Short-Term Handoff (Document & Clear)](#tier-2--short-term-handoff-document--clear)
- [Tier 3 — Persistent Context (영구 메모리)](#tier-3--persistent-context-영구-메모리)
- [Tier 4 — Cross-Session Orchestration](#tier-4--cross-session-orchestration)
- [heries 디렉토리 매핑](#heries-디렉토리-매핑)
- [작성 규칙](#작성-규칙)
- [안티 패턴](#안티-패턴)
- [End-of-Session 한 줄 프롬프트](#end-of-session-한-줄-프롬프트)
- [참고](#참고)

---

## 목적

| 문제 | heries 에서의 발현 | 본 전략의 해법 |
|---|---|---|
| Context rot | 1M 컨텍스트라도 60% 근방부터 품질 저하 | Tier 1 능동 개입 |
| Auto-compact 비대칭 | 가장 둔해진 순간 발동 → 다음 턴 필수 정보 누락 | Tier 1 `/compact [focus]` + Tier 2 우회 |
| Context amnesia | 새 세션은 백지 — 작가의 결정·차용 원작 표기·캐릭터 카드 작업 흐름 미전달 | Tier 2/3 영속화 |

목표: 단일 작가의 *집필·검증·발행* 사이클을 *세션 단위 일회성 대화* 가 아닌 **연속된 작품 자산** 으로 전환.

---

## Tier 1 — In-Session Context Management

### 사용 도구

| 도구 | 용도 | heries 운영 원칙 |
|---|---|---|
| `/rewind` (Esc Esc) | 실패한 시도 직후 되돌리기 | 등장인물 카드 작성 중 *원작 사실 오류·라이브러리 자동 도입 시도* 발견 시 즉시 |
| `/compact [focus]` | 부분 요약 — focus 인자 **필수** | 무인자 호출 금지. 예: `/compact focus on 청명 카드 결정 사항, drop namu.wiki 원문 텍스트` |
| Subagent (Task/Explore) | 읽기 전용 탐색 | 코드베이스 구조·기존 카드 검색용. **소설 본문·SSOT 작성은 main agent 직접** |
| `/context` | 컨텍스트 사용률 확인 | 70% 이상이면 Tier 2 핸드오프 작성 후 `/clear` |

### 진행 결정 기준

- **In-session 연속**: 같은 인물/챕터 작업 → 그대로 이어가기
- **실패 후 재시도**: `/rewind` + 정정 정보 프롬프트
- **무관한 task** (예: 등장인물 → 사이트 빌드): `/clear`
- **컨텍스트 60% 초과 + 같은 task**: Tier 2 전환

---

## Tier 2 — Short-Term Handoff (Document & Clear)

같은 프로젝트에서 세션만 새로 시작해야 할 때. 3단계.

1. Claude 가 현재 상태를 `.md` 로 dump
2. `/clear` 또는 세션 재기동
3. 새 세션에서 "X.md 를 읽고 이어서 작업해" + **검증 지시**

### heries 핸드오프 문서 구조

**단일 파일 `.claude/handoff/CURRENT.md` 덮어쓰기** (2026-05-11 정책 변경). 날짜별 파일 (`<YYYY-MM-DD>-<topic>.md`) 생성·archive 디렉토리 모두 폐기. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md` 로 commit 단위 추적.

본 변경의 사유: (1) 핸드오프 인덱스 관리 비용 제거 — *최신 = CURRENT.md* 단일 진입점. (2) 핸드오프 hot 한도/archive 이동/INDEX.md 누적의 3중 메타 작업 폐기 — 단일 파일 덮어쓰기 1동작으로 단순화. (3) git history 가 이미 시계열 보존 — 별도 archive 중복.

필수 섹션 (원문 그대로 채택):

| 섹션 | 작성 규칙 |
|---|---|
| **Summary** | 1–3문장 |
| **Key Decisions** | 결정 + *근거* 함께 |
| **Traps to Avoid** | 실패한 접근, 새 세션이 빠지기 쉬운 함정 |
| **Working Agreements** | 사용자 운영 원칙·선호 |
| **Relevant Files** | `path:Lxx-Lyy — 왜 중요한지` 형식. 라인 번호 필수 |
| **Open Work** | **상태 서술형** ("X is not yet implemented"). 명령형 금지 |
| **Prompt for New Chat** | 새 세션 프롬프트. 끝에 **검증 지시** 필수 |

### 핵심 원칙

> **Handoff 는 fact 가 아니라 hypothesis 로 다룬다.** 이전 세션이 혼동 상태에서 작성했을 가능성을 새 세션이 의심해야 한다.

### 토큰 예산

- 핸드오프 자체: **2,000 토큰 이내**
- 상세 (예: 등장인물 카드 전문) 는 별도 파일에 두고 핸드오프는 *경로* 만 인용

### 갱신 시점 + 단일 파일 운영

`CURRENT.md` 덮어쓰기 시점 — **세션 종료 직전** (다음 세션이 즉시 회수) 또는 **컨텍스트 60% 초과** (현 세션 안에서 `/clear` 전). 세션 시작 직후는 *읽기* 만 (검증 + 임계 점검). 정책 SSOT: [`../CLAUDE.md`](../CLAUDE.md) §누적 산출물.

이전 사이클 본문이 필요할 때:

```sh
git log --oneline .claude/handoff/CURRENT.md      # 갱신 이력
git show <commit>:.claude/handoff/CURRENT.md      # 특정 시점 본문 회수
```

---

## Tier 3 — Persistent Context (영구 메모리)

### 3.1 진입점 .md 계층 (이미 운영)

| 위치 | 용도 | 변경 정책 |
|---|---|---|
| `~/.claude/CLAUDE.md` | 글로벌 사용자 규약 | 사용자 개인 영역 |
| `.claude/CLAUDE.md` | heries 핵심 원칙 7개 + 도구 우선순위 | 변하지 않는 규약만 |
| `README.md` | 프로젝트 진입점 | 작품 추가·라이선스 변경 시 |
| `src/README.md` | FSD 가이드 (Public API · 의존 방향 · 빌드) | 아키텍처 결정 시 |
| `content/series/{slug}/_series.md` | 시리즈 메타·시놉시스·차용 원작 목록 | 원작 차용 추가 시 |
| `content/series/{slug}/characters/{id}.md` | 등장인물 SSOT | 인물 도입·갱신 시 |
| `.claude/harness/harness-state.md` 변경 이력 | 하네스/구조 진화 기록 | 모든 진화 변경 |

**Pruning 원칙**: "변하는 것" (현재 작업 상태·진행 중 결정) 은 CLAUDE.md 에 넣지 않는다. 그런 정보는 Tier 2 핸드오프 또는 `harness-state.md` 변경 이력으로.

### 3.2 Report Registry 패턴 (점진 도입)

| 원문 카테고리 | heries 매핑 | 비고 |
|---|---|---|
| `_registry.md` | (미도입 — 핸드오프 누적 시 신설) | 50줄 이내 인덱스 |
| `arch/` | `README.md`, `src/README.md`, `harness-state.md` 변경 이력 | 메인 아키텍처 |
| `commits/` | git log 자체 (별도 디렉토리 X) | `git log --oneline` |
| `design/` | (미정 — 사이트 디자인 시스템 도입 시) | |
| **`handoff/`** | `.claude/handoff/` | **본 디렉토리** |
| `impl/` | (미정 — 챕터별 plan 누적 시 `content/series/{slug}/_plans/` 검토) | |
| `review/` | (미정 — `agent-continuity-reviewer` 도입 후 산출물) | |

**핵심**: main agent 가 5,000줄 전체 리포트가 아닌 50줄 registry 만 읽도록.

### 3.3 auto-memory (이미 운영)

`/Users/hongyeongjune/.claude/projects/-Users-hongyeongjune-IdeaProjects-{...}/memory/` — 사용자 선호·피드백 영속화. 디렉토리 리네임 (`clash-of-multiverses` → `heries`) 후 새 경로 자동 마이그레이션 여부는 다음 세션에서 확인.

---

## Tier 4 — Cross-Session Orchestration

### 4.1 Spec-Driven Development (이미 부분 운영)

| heries 매체 | 역할 |
|---|---|
| 등장인물 카드 (`characters/{id}.md`) | SSOT — 인물 정의 |
| 시리즈 메타 (`_series.md`) | 시놉시스·차용 원작 목록 |
| 챕터 frontmatter | 에피소드 메타 (title·episode·published·characters) |
| `.claude/harness/harness-setup.md §6` | 작업 사이클 (1 초안 → 6 발행) |

### 4.2 ADR (Architecture Decision Record) — 향후 도입

핸드오프 "Key Decisions" 가 동일 주제로 반복되면 ADR 로 승격.

| 도입 시점 | 위치 후보 |
|---|---|
| 사이트 디자인 시스템 결정 시 | `.claude/adr/NN-design-system.md` |
| 콘텐츠 운영 결정 누적 시 | `.claude/adr/NN-<topic>.md` |

### 4.3 Git commit + 핸드오프 이중 기록

원문 지적 — commit message 는 *왜 그 결정·어떤 대안 배제* 미포함. heries 의 해법:

- Git commit message: `<type>(<scope>): <변경 요약>` (예: `feat(characters): add cheong-myeong card`)
- 결정 근거: 핸드오프 또는 ADR 로 분리
- commit message 에서 참조: `(see .claude/handoff/2026-05-07-...)`

### 4.4 Master-Clone 정책

heries 도 **Master-Clone** 채택:

| 모델 | 특징 | heries 채택 |
|---|---|---|
| **Master-Clone** | main agent 에 모든 컨텍스트, Task/Explore 로 자기 복제본에 위임 | ✓ 채택 |
| Lead-Specialist | custom subagent 다수 | ✗ — 단일 작가라 조율 오버헤드 > 작업 |

**예외**: `agent-continuity-reviewer` 같이 *책임이 명확한 1인 1역할* 은 specialist 로 두되, 호출은 main agent 가 — *준-Master-Clone* 형태.

> revfactory/harness 도입 후에도 같은 정책. 자동 생성 에이전트도 Master-Clone 친화적으로 보정.

---

## heries 디렉토리 매핑

| 원문 권장 | heries 실제 |
|---|---|
| `.claude/reports/handoff/` | `.claude/handoff/` |
| `.claude/reports/_registry.md` | (미도입) |
| `.claude/skills/handoff/SKILL.md` | (revfactory/harness 도입 후 검토) |
| 핸드오프 파일 명명 | **단일 파일 `CURRENT.md` 덮어쓰기** (2026-05-11~). 날짜별 파일·archive 폐기 |

---

## 작성 규칙

1. **명령형 금지** — Open Work 는 상태 서술형. "Implement X" ✗ → "X is not yet implemented" ✓
2. **파일 참조 라인 번호 필수** — `src/widgets/header/header.ts:L15-L42 — DOM mount 진입점`
3. **CLAUDE.md 중복 금지** — Prompt for New Chat 끝에 "Read CLAUDE.md first. Do NOT restate anything already covered there"
4. **실패 명시적 기록** — Traps to Avoid 가 핸드오프 가치를 가장 많이 올림
5. **토큰 예산 의식** — 2,000 토큰 이내. 상세는 별도 리포트로 분리
6. **모든 .md 첫 줄에 비상업적 팬픽 고지** — heries 표준

---

## 안티 패턴

- Auto-compact 맹신 — 가장 안 좋은 순간 발동
- 파일 전체 dump — 20줄 필요한데 2,000줄 통째로
- Long-running session 집착 — 새 task 는 이전 맥락 10% 만 필요
- Subagent 과다 — Master-Clone 정책 위반
- 핸드오프 없는 무중단 세션 — `/clear` 사고 시 복구 불가
- **heries 고유**: 라이브러리 자동 도입 시도 (Astro/Eleventy/번들러). 라이브러리 의존성 0 원칙 위배

---

## End-of-Session 한 줄 프롬프트

세션 종료 직전, Tier 2 핸드오프 자동 갱신용 압축 프롬프트:

```
세션 종료 핸드오프를 .claude/handoff/CURRENT.md 에 덮어쓴다 (단일 파일 정책).

포함 섹션:
- Summary (완료 사항 1–3문장)
- Key Decisions (결정 + 근거)
- Traps to Avoid (실패한 접근·함정)
- Working Agreements (사용자 운영 원칙)
- Relevant Files (path:Lxx-Lyy 라인 번호 필수)
- Open Work (상태 서술형, 명령형 금지)
- Prompt for New Chat (검증 지시 포함)

규칙:
- 2,000 토큰 이내
- 첫 줄에 `<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->`
- Open Work 는 "X is not yet implemented" 식
- Prompt for New Chat 끝에 "나열된 파일을 Read 도구로 읽고 본 문서의 주장을 코드와 대조해 검증해" 명시
- CLAUDE.md / handoff/handoff.md / harness/ / src/README.md 에 이미 적힌 내용은 재기술 금지
```

향후 `.claude/skills/handoff/SKILL.md` 로 단축키 등록 검토 (revfactory/harness 도입 후).

---

## 참고

- **원문 (외부)**: <https://codex.epril.com/claude-session-context-handoff-4-layer-strategy> — *Claude 세션 간 Context Handoff: 4계층 전략* (codex.epril.com, 2026-04-23). 본 가이드의 4-Tier 명칭·구조·실전 규칙·안티 패턴은 모두 원문 차용. heries 도메인에 맞춰 매핑·해석한 결과물.
- heries 하네스 현 상태: [`../harness/harness-state.md`](../harness/harness-state.md)
- heries 작업 사이클: [`../harness/harness-setup.md`](../harness/harness-setup.md) §6
- 핵심 원칙: [`../CLAUDE.md`](../CLAUDE.md)
