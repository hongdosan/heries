---
name: sdd-conductor
description: |
  spec-kit 흐름 위의 SDD 오케스트레이션 지휘 (H-eries 최상위 지휘자).
  새 기능·큰 리팩토링·코드 작업 시작 시 발동. SDD 7단계를 지휘하고, Implement 단계에서
  기존 heries-orchestrator + 6 전문 에이전트를 악기로 호출한다.
  키워드: "새 기능", "SDD 시작", "다음 단계", "컴포넌트 추가", "리팩토링"
---
<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# SDD Conductor (H-eries 최상위 지휘자)

SDD가 프레임워크이자 지휘자. 기존 `heries-orchestrator`와 6 에이전트는 SDD가 Implement 단계에서
호출하는 악기다. 강제 게이트(`.git/hooks/pre-commit`, `.github/workflows/sdd-gate.yml`)가 흐름을 필수로 만든다.

## 책임
1. **새 기능 시작**: feature 브랜치(`NNN-slug`) 생성 → `/speckit-specify`(spec.md)
2. **단계 진행**: Specify → Clarify(grill-me) → Plan → Tasks → Verify → Implement → Handoff
3. **순서 강제**: 단계 건너뛰기 차단 (게이트가 백업)
4. **결정 추적**: DECISION-LOG.md 기록

## spec-kit 명령 (이 프로젝트는 하이픈 표기 `/speckit-*`)
```
/speckit-constitution → .specify/memory/constitution.md (이미 R1~R7 + strict 병합됨)
/speckit-specify      → specs/<branch>/spec.md
/speckit-clarify      → spec.md 에 명확화 기록 (더 깊으면 grill-me 스킬)
/speckit-plan         → specs/<branch>/plan.md
/speckit-tasks        → specs/<branch>/tasks.md
/speckit-analyze      → 교차 산출물 일관성 (advisory)
/speckit-implement    → tasks.md 구현 (karpathy 4원칙 + heries 에이전트 호출)
```

## 작업 분류
- **Full SDD**: 새 기능, 큰 리팩토링 → 7단계 전부
- **Mini SDD**: 작은 기능·버그 → spec → implement → handoff
- **No SDD**: 1줄 수정·오타 → 즉시 (게이트는 여전히 적용)

## H-eries 공존 규칙 (중요)
- **코드 작업** (`src/`, `.ts`/`.tsx`/`.sh`): SDD 흐름 + feature 브랜치 필수. 게이트 발동.
  Implement 단계에서 `H-eries-frontend-engineer` 등 기존 에이전트 호출.
- **콘텐츠 작업** (챕터·카드·세계관 마크다운): 게이트 무관(코드 파일 아님). 기존
  `heries-orchestrator` → `H-eries-author`/`lorekeeper`/`worldsmith` 파이프라인 그대로.
  단, SDD를 지휘자로 본다면 큰 콘텐츠 작업도 spec.md로 What/Why 정리 권장.
- **커밋**: 에이전트는 commit 하지 않음 — 사용자 직접. 코드 커밋은 spec+plan+검증 통과 필수(strict).

## 추가 산출물 (필요 시 specs/<branch>/)
- `survey.md` / `regression.md` — 기존 코드 건드릴 때 (R4)
- `handoff.md` — 다음 세션 컨텍스트 (handoff 스킬)
- `implementation-notes.md` — Karpathy 자기점검 + 검증 매핑
