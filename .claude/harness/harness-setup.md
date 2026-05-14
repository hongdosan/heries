<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries 하네스 — 도입 가이드

`H-eries` 가 [revfactory/harness](https://github.com/revfactory/harness) 를 도입하는 절차와 분담 원칙을 정의한다. 본 문서는 *계획·절차*. 도입 후 진화는 [harness-state.md](harness-state.md) 변경 이력에 누적 기록.

## 목차

- [1. 하네스란](#1-하네스란)
- [2. H-eries 도메인 분담 원칙](#2-H-eries-도메인-분담-원칙)
- [3. 도입 절차 (Phase 0–5)](#3-도입-절차-phase-05)
- [4. 산출물 위치·명명 규칙](#4-산출물-위치명명-규칙)
- [5. 검증·진화](#5-검증진화)
- [6. 작업 사이클](#6-작업-사이클)
- [7. 참고](#7-참고)

---

## 1. 하네스란

[`revfactory/harness`](https://github.com/revfactory/harness) 는 **Claude Code 용 메타 스킬**. 도메인 한 줄을 입력받아 전문 에이전트 팀과 그들이 사용할 스킬을 자동 생성한다.

- **저장소**: https://github.com/revfactory/harness
- **라이선스**: Apache 2.0 — 본 저장소 *All Rights Reserved* 와 충돌 없음. harness 자체는 도구이며 산출물 라이선스 강제 안 함.
- **참고 논문**: Hwang, M. (2026). *Harness: Structured Pre-Configuration for Enhancing LLM Code Agent Output Quality*

### 1.1 핵심 철학

- **도메인 → 팀 자동화**: 수작업 에이전트 작성 대체
- **6 패턴 카탈로그**: 파이프라인 / 팬아웃·인 / 전문가 풀 / 생성-검증 / 감독자 / 계층적 위임
- **진화 가능성**: 동일 피드백 2회 이상 반복 시 자동 진화 트리거 발동
- **스킬-에이전트 분리**: "스킬 = 어떻게 / 에이전트 = 누가"

### 1.2 8 Phase 워크플로우

| Phase | 역할 | 산출물 |
|-------|------|--------|
| 0 | 현황 감사 | 모드 분기 (신규/확장/유지보수) |
| 1 | 도메인 분석 | 작업 유형 + 기술 스택 |
| 2 | 팀 아키텍처 설계 | 6 패턴 중 선택 |
| 3 | 에이전트 정의 | `.claude/agents/{name}.md` |
| 4 | 스킬 생성 | `.claude/skills/{name}/SKILL.md` |
| 5 | 통합·오케스트레이션 | orchestrator 스킬 + CLAUDE.md 포인터 |
| 6 | 검증·테스트 | 6단계 (구조 / 모드 / 실행 / 트리거 / 드라이런 / 시나리오) |
| 7 | 진화 | 피드백 → 매핑 → 변경 이력 |

---

## 2. H-eries 도메인 분담 원칙

`H-eries` 는 **단일 작가** 도메인. FE/BE 같은 기술 영역 분담 없음. 모든 에이전트가 *작가의 글쓰기·검증·발행 사이클* 에 종속한다.

| 영역 | 담당 | 근거 |
|------|------|------|
| 소설 본문 (스토리·문체·구성) | **사용자 직접 작성 (작가)** | 창작은 사람의 영역 |
| 등장인물·세계관 SSOT 골격 | 사용자 초안 → `agent-lorekeeper` 보강·검증 | 인물 정합성·중복·SSOT 미등록 명명 검출 |
| 신규 챕터의 SSOT 정합성 검사 | `agent-continuity-reviewer` (자동 트리거) | 캐릭터·연표·세계관 모순 검출 |
| 챕터 집필 보조 (구조·문체) | `agent-author` (요청 시) | 작가 보조 — 결정권은 작가 |
| 정적 사이트 빌드·GitHub 배포 | `agent-publisher` (요청 시) | 반복 작업 자동화 (라이브러리 의존성 0 유지) |
| 저작권 고지 표기 | 모든 산출물 자동 적용 (CLAUDE.md 강제) | 저작권 명확성 |

> **분담의 의미**: *창작* 은 사람의 영역, *정합성·검증·반복 작업* 은 하네스의 영역.

### 2.1 하네스 대상 매트릭스

| 에이전트 | 우선순위 | 도입 방식 | 트리거 시점 |
|---|---|---|---|
| `agent-lorekeeper` | **1 (최우선)** | 하네스 자동 생성 | 즉시 |
| `agent-author` | 2 | 하네스 자동 생성 | 첫 챕터 집필 시 |
| `agent-continuity-reviewer` | 3 | 하네스 자동 생성 (생성-검증 패턴 짝꿍) | 두 번째 챕터 진입 직전 |
| `agent-publisher` | 4 | 하네스 자동 생성 또는 단순 스킬 (`gh` CLI 래퍼) | 첫 GitHub Pages 발행 직전 |

---

## 3. 도입 절차 (Phase 0–5)

### Phase 0 — 사전 준비

1. **라이선스 검토** — Apache 2.0 (harness) ↔ All Rights Reserved (H-eries) 충돌 없음. harness 산출물에는 H-eries 표기 표준 적용.
2. **환경 변수 활성화** — `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 셸 환경 또는 `.zshrc`.
3. **분담 원칙 합의** — §2 매트릭스를 본 문서 SSOT 처리.
4. **GitHub 저장소 준비** — 공개 저장소. README 첫머리에 저작권 고지 표기.

### Phase 1 — 플러그인 설치

[`harness-install.md §2`](harness-install.md#2-설치) 절차 참조.

### Phase 2 — 시범 생성 (첫 도메인: `lorekeeper`)

1. **첫 대상 선정**: `agent-lorekeeper` (등장인물 SSOT 관리). [§2.1](#21-하네스-대상-매트릭스) 우선순위 1.
2. `/harness` 또는 *"하네스 구성해줘"* 자연어로 트리거. 도메인 한 줄은 [`harness-install.md §4.1`](harness-install.md#41-트리거-프롬프트-예시) 참조.
3. harness Phase 1–6 자동 실행.
4. 산출물 위치 확인:
    - `.claude/agents/agent-lorekeeper.md`
    - `.claude/skills/{생성된-스킬}/SKILL.md`
    - `_workspace/01_*.md` (중간 산출물 — `.gitignore` 처리)

### Phase 3 — 산출물 정합성 검증

하네스 산출물이 **H-eries 고유 원칙** 과 정합하는지 검증.

| # | 검증 항목 | 통과 조건 |
|---|---|---|
| 1 | 저작권 고지 부착 | frontmatter 다음 줄에 `<!-- © 2026 홍도산. All rights reserved. Original creator work. -->` |
| 2 | SSOT 위치 인용 | `content/series/{slug}/characters/` 등 명시적 참조 |
| 3 | 라이브러리 의존성 도입 시도 | 시도 시 사용자 확인 요청 (자동 도입 금지). `package.json` / `requirements.txt` / 빌드 스크립트 추가 거부 |
| 4 | `origin: original` 필드 강제 | 등장인물 카드 frontmatter 에 `origin: original` 필수 — 누락 시 reject |
| 5 | 단일 작가 가정 | 다인 협업 분기 (브랜치 전략·리뷰 워크플로우 등) 미포함 |
| 6 | GitHub 공개 저장소 인지 | 비공개 토큰·시크릿·개인 식별 정보 산출물에 포함 금지 |
| 7 | frontmatter `name` | `H-eries-{role}` 패턴 (예: `H-eries-lorekeeper`) |

검증 실패 항목 → 수동 보정 → [`harness-state.md`](harness-state.md) 변경 이력에 사유 기록.

### Phase 4 — 작업 사이클 통합

생성된 에이전트가 [§6 작업 사이클](#6-작업-사이클) 6단계와 매핑되는지 확인:

| 작업 사이클 Step | harness Phase | 비고 |
|---|---|---|
| 1 챕터 초안 작성 | — | 사용자 고유 |
| 2 SSOT 갱신 | 3·4·6 | `agent-lorekeeper` 호출 |
| 3 연속성 감사 | 6 검증 | `agent-continuity-reviewer` 호출 |
| 4 문체·구조 점검 (선택) | — | `agent-author` 요청 시 |
| 5 커밋 | 7 진화 | 변경 이력 누적 트리거 |
| 6 발행 | — | `agent-publisher` 호출 |

### Phase 5 — 진화 사이클

1. 첫 실주행 후 피드백을 [`harness-state.md`](harness-state.md) 변경 이력에 기록.
2. **동일 피드백 2회 반복** → 자동 진화 트리거 → 해당 에이전트/스킬 수정.
3. 분기별 SSOT vs 챕터 정합성 sample audit.

---

## 4. 산출물 위치·명명 규칙

### 4.1 디렉토리 구조

| 대상 | 위치 |
|---|---|
| 에이전트 정의 | `.claude/agents/agent-{role}.md` |
| 스킬 정의 | `.claude/skills/{kebab-case-domain}/SKILL.md` |
| 하네스 트리거 등록 | `.claude/CLAUDE.md` |
| 시리즈 메타 | `content/series/{slug}/_series.md` |
| 등장인물 SSOT | `content/series/{slug}/characters/{character-id}.md` |
| 세계관·연표·용어집 | `content/series/{slug}/{worldbuilding,timeline,glossary}/*.md` |
| 챕터 본문 | `content/series/{slug}/chapters/ep-{NN}-{slug}.md` |
| 정적 자산 (이미지·CSS) | `assets/` (라이브러리 없음 — 직접 작성 CSS 만) |
| 사이트 진입점 | `index.html` 또는 `index.md` |
| GitHub Pages 라우팅 | `.nojekyll` (Jekyll 우회 — raw static) |
| 하네스 중간 산출물 | `_workspace/` (`.gitignore`) |

### 4.2 명명 규칙

| 대상 | 패턴 | 예시 |
|---|---|---|
| 에이전트 파일 | `agent-{role}.md` | `agent-lorekeeper.md` |
| frontmatter `name` | `H-eries-{role}` | `H-eries-lorekeeper` |
| 스킬 디렉토리 | kebab-case 도메인 | `character-bible/` |
| 시리즈 슬러그 | kebab-case (영문 권장) | `clash-of-multiverses` |
| 등장인물 ID | kebab-case 자작 명명 | `woo-jin-hyeok`, `protagonist-name` |
| 챕터 파일 | `ep-{NN}-{slug}.md` | `ep-01-prologue.md`, `ep-12-final-clash.md` |
| 중간 산출물 | `{NN}-{agent}-{artifact}.{ext}` | `01-lorekeeper-cards.md` |

> 하네스 생성 결과가 위 패턴과 다르면 수동 정정 후 변경 이력에 기록.

---

## 5. 검증·진화

### 5.1 검증 (Phase 6 6단계)

1. **구조 검증**: 파일 위치 · frontmatter 존재 · 에이전트 간 참조 일관성
2. **실행 모드 검증**: 단일 / 팀 / 하이브리드 모드별 데이터 경로
3. **실행 테스트**: with-skill vs without-skill 비교
4. **트리거 검증**: should-trigger 8–10개 + should-NOT 8–10개
5. **드라이런**: phase 순서 논리성 · dead link 부재
6. **시나리오**: 정상 1개 + 에러 1개 이상 (예: `origin: original` 필드 누락 시 reject)

### 5.2 진화 트리거

- 동일 피드백 **2회 이상 반복**
- 에이전트 **반복 실패 패턴** 발견
- 사용자가 **오케스트레이터 우회** 하여 수동 작업

위 트리거 발동 시 → 해당 에이전트/스킬 수정 → 변경 이력 갱신.

### 5.3 변경 이력 위치

- **중앙 누적**: [`harness-state.md`](harness-state.md) §변경 이력
- **에이전트 단위 (선택)**: 각 `agent-*.md` 본문 하단

> 모든 진화 변경은 *날짜 / 변경 내용 / 대상 / 사유* 4컬럼 기록.

---

## 6. 작업 사이클

`H-eries` 일상 사이클. 단일 작가 가정의 단순 6단계.

| Step | 행위 | 주체 | 산출물 |
|---|---|---|---|
| 1 | 챕터 초안 작성 | 사용자 (작가) | `chapters/ep-NN-{slug}.md` 초안 |
| 2 | 신규 등장인물·세계관 발생 시 SSOT 갱신 | `agent-lorekeeper` | `characters/{id}.md` · `worldbuilding/*.md` · `glossary/*.md` 추가/갱신 |
| 3 | 챕터-SSOT 정합성 감사 | `agent-continuity-reviewer` | 모순·누락·명명 SSOT 미등록 보고서 |
| 4 | 문체·구조 점검 (선택) | `agent-author` | 가독성·구성 코멘트 |
| 5 | 커밋 — 메시지에 *변경 챕터·캐릭터·SSOT* 명시 | 사용자 | git commit |
| 6 | 발행 (GitHub push → GitHub Pages 재빌드) | `agent-publisher` | 공개 사이트 갱신 |

> **Closure Discipline** (사이클 마감 원칙): 한 챕터의 작업은 반드시 6단계까지 완주. 도중 중단 시 다음 세션에 *어디까지 진행했는지* 변경 이력 또는 커밋 메시지로 기록.

---

## 7. 참고

- harness 저장소: https://github.com/revfactory/harness
- harness SKILL.md: https://github.com/revfactory/harness/blob/main/skills/harness/SKILL.md
- 현 상태 SSOT: [`harness-state.md`](harness-state.md)
- 설치·적용: [`harness-install.md`](harness-install.md)
