<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# H-eries Constitution — SDD 강제 규칙 (R1–R7)

> **정본(governing) 규칙 텍스트는 영문 [`enforcement/sdd/CONSTITUTION.md`](../../enforcement/sdd/CONSTITUTION.md)** 입니다.
> 게이트(훅·CI)와 `/speckit.analyze`가 이 파일을 읽습니다. 규칙을 바꾸면 게이트가 막는 대상이 바뀝니다.
> H-eries 프로젝트 고유 정체성·원칙은 [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) 가 SSOT이며, 본 문서는 그 위에 SDD 강제 레이어를 얹습니다.

---

## 1. 프로젝트 정체성

H-eries 는 단일 작가(홍도산)의 **오리지널 다중/평행 세계 정적 웹 시리즈**. 저작권 전부 홍도산 귀속.
런타임 = React 19 + React Router 7 + Vite 7 (TypeScript strict). 외부 런타임 의존 최소. GitHub Pages 정적 발행.

**SDD 공존 모델 (2026-05-23 결정):** SDD가 **최상위 지휘자**. 7단계 흐름이 모든 작업을 지휘하고,
기존 `heries-orchestrator` + 6 전문 에이전트는 Implement 단계에서 호출되는 *악기*다. 기존 `workflow.md`
6단계는 SDD 흐름에 흡수된다.

## 2. 핵심 원칙 (H-eries 고유 — 위반 시 작업 거부)

이 원칙들은 `.claude/CLAUDE.md` §핵심 원칙의 요약이며, SDD Implement에서도 강제된다:

- **P1 — 저작권 고지**: 모든 `.md` 산출물 첫 줄(frontmatter 직후)에 `<!-- © 2026 홍도산. All rights reserved. Original creator work. -->`.
- **P2 — 100% 오리지널**: 모든 캐릭터·세계관·명명은 작가 자작. 카드 `origin: original`. 자작 명명은 lorekeeper/worldsmith SSOT 등록 후 사용.
- **P3 — 최소 런타임 의존**: React 19 + Router 7 + Vite 7 외 런타임 라이브러리 추가 시 사용자 확인. devDependencies는 별도 허용.
- **P4 — FSD + Atomic Design**: `src/` 6 레이어 격리, 상위→하위 import만, 슬라이스 Public API(`index.ts`)만.
- **P5 — TypeScript strict + 작가 원칙 SSOT**: 챕터/카드 작성은 `writing-principles.md` 강제 준수.
- **P6 — 시크릿 0 노출**: 개인정보·키·토큰 코드/git/dist 금지. `scripts/check-secrets.mjs` 게이트.

## 3. SDD 강제 규칙 R1–R7 (정본: 영문 CONSTITUTION.md)

### R1 — 스펙 없이 코드 없음
`specs/<branch>/spec.md`(`/speckit-specify` 산출) 없는 기능의 구현 파일 생성·수정 불가.
강제: `pre-implement` 훅(세션 중) + `pre-commit` + CI 게이트 (fail-closed, 우회 불가).

### R2 — 계획 없이 코드 없음
구현 기능은 `specs/<branch>/plan.md`(`/speckit-plan`) 필수. 강제: `pre-implement` + `pre-commit` + CI.

### R3 — 검증 통과 없이 커밋 없음
구현 파일을 건드리는 커밋은 검증(`SDD_TEST_CMD`)이 통과해야 함. no-op(`true`/`:`/`echo`) 거부.
H-eries `SDD_TEST_CMD = npm run typecheck && npm run lint` (단위 테스트 스위트 부재 → typecheck+lint가 사실상의 검증).
강제: `pre-commit` 훅 + CI 게이트.

### R4 — 기존 동작 보존 (컨텍스트 의존)
기능이 기존 코드를 건드리면 `specs/<branch>/regression.md` 존재 + 통과 필수.
`survey.md`가 있을 때만 발동(0단계 조사 ON). 강제: `pre-commit` 훅.

### R5 — 조용한 인계 누락 없음
`specs/<branch>/handoff.md` 없이 종료 가능하나 경고. 강제: `post-task` 훅(경고, 차단 X).

### R6 — 운영 엄격성 (본 프로젝트 **strict 고정**)
**H-eries는 ENFORCEMENT_LEVEL=strict 로 고정**(통합 인터뷰 결정, INTERVIEW-RESULT.md).
자동 운영 시그널(`.env.production`/`*.tf`/`k8s`)은 없으나 사용자가 명시 선택 → 설치된 `.git/hooks/pre-commit`
및 `sdd-gate.yml`에 strict 핀 고정. R3/R4 **우회 불가** (`SDD_OVERRIDE` 비활성).

### R7 — 문서 동기화 (**H-eries 적용 불가 / advisory**)
원래 R7/`sync-check.sh`는 *오케스트라 패키지 자체*의 이중언어(EN/KO) 문서 쌍·악기 수 정합 검사다.
H-eries는 **타깃 저장소**로, 100+ 마크다운이 창작 콘텐츠(챕터/카드)이며 `.ko` 쌍이 없어 sync-check 적용 시
전부 실패한다. 따라서 R7은 H-eries 콘텐츠에 **적용하지 않으며**(CI에서 advisory로 스킵), `enforcement/sync-check.sh`
와 `enforcement/SPEC.yml`은 패키지 참조용으로만 보관한다. (근거: DECISION-LOG.md / INTEGRATION-REPORT.md)

---

## 4. 강제 레벨

```
ENFORCEMENT_LEVEL = strict   # H-eries 고정 (우회 불가)
```

- **strict**: R1–R6 적용; R3/R4 우회 불가. `SDD_OVERRIDE` 경로 없음.

> 마크다운 전용 커밋(챕터·카드·세계관)은 게이트가 *코드 파일만* 감지하므로 자유롭게 통과한다.
> 게이트는 `.ts/.tsx/.sh/.sql/...` 등 구현 파일이 staged 될 때만 발동한다.

## 5. 커밋·브랜치 정책 (메모리 정합)

- 코드 작업: SDD feature 브랜치(`NNN-slug`) → spec+plan → PR → main. **에이전트는 commit 하지 않음 — 사용자 직접.**
- 콘텐츠 작업(마크다운): 게이트 무관, 기존 develop 흐름 유지 가능.
- 기존 3-브랜치 전략(develop/release/main)과 SDD feature 브랜치는 코드 작업에서 reconcile 필요 (DECISION-LOG 참조).

## 6. 이 헌법이 하지 않는 것

- AI가 프로젝트를 "이해"하게 만들지 않음 — 비준수를 *실패*하게 만들 뿐.
- 사람의 검토 대체 X. 테스트 대체 X — 검증 *없이는* 진행 거부.

---

**Version**: 1.0.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-05-23
