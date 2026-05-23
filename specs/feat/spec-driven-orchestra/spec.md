<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Spec — SDD(spec-driven-orchestra) 통합

> 본 통합 자체를 첫 SDD 사이클로 취급한다. Branch: `feat/spec-driven-orchestra`.

## What & Why
H-eries 저장소에 spec-driven-orchestra 패키지를 통합한다. 목적: AI 코딩 작업을 **SDD(Spec-Driven Development)** 가
지휘하고, 결정론적 게이트(`pre-commit` + CI, **strict**)가 "spec 없이 코드 없음 / 검증 없이 커밋 없음"을 강제하게 만든다.
기존 하네스(heries-orchestrator + 6 에이전트)는 SDD Implement 단계에서 호출되는 악기로 흡수한다.

## 수용 기준 (Acceptance)
- AC1: `specify init` 완료 — `.specify/`(memory/constitution.md + templates + scripts) + `/speckit-*` 스킬 9종 존재.
- AC2: `.specify/memory/constitution.md` 에 R1~R7 + ENFORCEMENT_LEVEL=strict + H-eries 정체성 병합.
- AC3: 게이트 설치 — `.claude/hooks/pre-implement.sh`(PreToolUse), `.git/hooks/pre-commit`(strict 핀), `.claude/hooks/post-task.sh`(Stop), `.github/workflows/sdd-gate.yml`(CI). 모두 실행권한.
- AC4: SDD 스킬 — `.claude/skills/{grill-me(+VARIANT),sdd-conductor,handoff}` 존재.
- AC5: 공통 자산 — 루트 CLAUDE.md(SDD 진입점), INTERVIEW-RESULT.md, DECISION-LOG.md, INTEGRATION-REPORT.md.
- AC6: 게이트 스모크 — (a) spec 없는 브랜치에서 코드 staged → 커밋 차단(R1) (b) 마크다운 전용 커밋 → 통과.
- AC7: 기존 동작 보존 — `npm run typecheck && npm run lint` 통과, 기존 하네스·콘텐츠 파이프라인 무손상 (regression.md).

## 엣지 케이스
- 마크다운(챕터·카드) 커밋이 게이트에 막히면 안 됨 → 게이트는 코드 확장자만 감지(확인됨).
- strict 자동 미감지(`.env.production` 없음) → 게이트에 명시 핀 필요(적용됨).
- R7/sync-check는 콘텐츠 100+ 마크다운에 부적합 → advisory 처리(적용됨).

## 성공 기준 (Success)
- 코드 작업이 spec/plan/검증 게이트를 통과해야만 커밋·머지됨.
- 콘텐츠 창작 흐름은 영향 없음.
- 사용자가 Day 0 검증(INTEGRATION-CHECKLIST.md)을 통과로 확인.

## 범위 외 (Out of scope)
- 기존 src/ 컴포넌트 코드 변경 없음. 작품 서사·플롯 변경 없음.
- karpathy-guidelines 플러그인 설치(사용자 `/plugin` 수동), GitHub 브랜치 보호 설정(사용자).
