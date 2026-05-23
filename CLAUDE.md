<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# CLAUDE.md — H-eries AI 코딩 가이드 (SDD 진입점)

## 한 줄 요약
**SDD(Spec-Driven Development)가 지휘자.** SDD가 스킬·에이전트를 호출하고, 강제 게이트(`pre-commit` + CI, **strict**)가 흐름을 선택이 아닌 필수로 만든다.

> **프로젝트 SSOT는 [`.claude/CLAUDE.md`](.claude/CLAUDE.md)** — H-eries 작품·세계관·작가 원칙·하네스·도구 우선순위. 본 파일은 그 위의 **SDD 운영 레이어**만 정의한다. 충돌 시 `.claude/CLAUDE.md`의 작품 규칙 우선, SDD 게이트는 코드 작업에 강제.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure, shell commands, and other important information, read the current plan in `specs/<branch>/`.
<!-- SPECKIT END -->

## 작업 시작 시 첫 행동
| 작업 유형 | 첫 행동 |
|---|---|
| 새 코드 기능 / 컴포넌트 / 리팩토링 | `sdd-conductor` → feature 브랜치 `NNN-slug` → `/speckit-specify` |
| 기존 코드 변경 | 먼저 0단계 조사(`survey.md`) — H-eries는 조사 ON |
| 챕터·카드·세계관 (마크다운) | 기존 `heries-orchestrator` 파이프라인 (게이트 무관) |
| 작은 결정 | DECISION-LOG.md 기록 |

## SDD 7단계 (코드 작업)
Survey*(기존코드) → Specify → Clarify(grill-me) → Plan → Tasks → Verify → Implement(karpathy + heries 에이전트) → Handoff
- 명령: `/speckit-specify` · `/speckit-clarify` · `/speckit-plan` · `/speckit-tasks` · `/speckit-analyze` · `/speckit-implement` (하이픈 표기)
- 산출물: `specs/<branch>/{spec,plan,tasks,survey,regression,handoff,implementation-notes}.md`

## 강제 게이트 (strict — 우회 불가)
| 게이트 | 막는 것 | 규칙 |
|---|---|---|
| `.claude/hooks/pre-implement.sh` (PreToolUse) | spec+plan 없이 코드 작성 | R1, R2 |
| `.git/hooks/pre-commit` | spec/plan 없거나 검증 미통과 코드 커밋 | R1–R4, R6 |
| `.github/workflows/sdd-gate.yml` (CI) | spec/plan 없음 / 검증 실패 PR 머지 | R1, R2, R3, R6 |
| `.claude/hooks/post-task.sh` (Stop) | handoff 누락 (경고) | R5 |
- 규칙 SSOT: [`.specify/memory/constitution.md`](.specify/memory/constitution.md) (R1~R7 + strict). 정본 영문: `enforcement/sdd/CONSTITUTION.md`.
- `SDD_TEST_CMD = npm run typecheck && npm run lint` (단위 테스트 부재 → de-facto 검증).
- **마크다운 전용 커밋은 게이트 통과** — 게이트는 코드 파일(`.ts/.tsx/.sh/...`)이 staged 될 때만 발동.
- **R7(sync-check)은 H-eries 적용 안 함** (패키지 자체 이중언어 문서 검사용 — 콘텐츠에 부적합). advisory.

## 안티 패턴
- ❌ spec/plan 전에 코드 작성 (게이트 차단)
- ❌ typecheck/lint 미통과 코드 커밋 (게이트 차단, strict 우회 불가)
- ❌ 회귀(`regression.md`) 없이 기존 코드 건드리기 (`survey.md` 있으면 차단)
- ❌ 첫날부터 거대 추상화 (Karpathy: Simplicity First)
- ❌ 작품 플롯/서사 변경 (작가 영역 — SDD는 코드·구조에만)

## 관련 문서
- 통합 결과: `INTERVIEW-RESULT.md` · `INTEGRATION-REPORT.md` · `DECISION-LOG.md`
- 오케스트라 가이드: `ORCHESTRA-GUIDE.md` · 실행 지시: `AI-EXECUTION.md` · Day0/7/30 검증: `INTEGRATION-CHECKLIST.md`
