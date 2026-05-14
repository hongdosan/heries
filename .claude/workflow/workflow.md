<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries AI 개발 흐름도

> **저자 / 방법론**: 홍도산
>
> 본 문서는 H-eries 프로젝트에서 **auto-mode (자율 진행)** 으로 개발할 때 강제되는 개발 흐름이다. 신규 기능 / 개선 / 검토 세 트랙 모두 본 흐름을 따른다.

## 0. 강제 조건 (Auto-Mode Enforcement)

다음 조건 중 **하나 이상** 충족 시 본 워크플로우 적용 강제:

1. 사용자가 `auto-mode` / `자율 진행` / `중단 요청 전까지 계속` 등 명시
2. 사용자가 본 디렉토리 (`.claude/ai-workflow/`) 의 template 을 직접 참조
3. 작업 규모 = 단일 파일 변경 이상 (= 3 파일 이상 또는 신규 슬라이스 도입 또는 콘텐츠 SSOT 갱신)

본 흐름을 우회하면 안 됨. 위반 시 사용자가 "ai-workflow 따라" 명시로 재진입 요청.

## 1. 개요

H-eries 의 모든 작업 산출물은 **문서 ↔ 코드 동기** 원칙. 사용자 명시 결정 → 프롬프트 (해당 트랙 template) → 계획 → 실행 → commit. 도중 결정 변경 시 *문서 먼저 갱신* 한 후 코드.

세 트랙:

| 트랙 | 정의 | template |
|---|---|---|
| **신규 (develop)** | 새 슬라이스·새 기능·새 페이지·새 콘텐츠 도입 | [`template/prompt-template-develop.md`](./template/prompt-template-develop.md) |
| **개선 (improvement)** | 기존 코드/콘텐츠의 동작 변경·리팩토링·튜닝 | [`template/prompt-template-improvement.md`](./template/prompt-template-improvement.md) |
| **검토 (review)** | 변경 X 또는 보고서만 — 기존 산출물 점검 | [`template/prompt-template-review.md`](./template/prompt-template-review.md) |

모든 트랙은 [`template/prompt-reference.md`](./template/prompt-reference.md) (H-eries SSOT) 를 *필수 정독* 한다.

## 2. 6 단계 (Step-by-Step)

### Step 01 — Context Definition (사용자 의도 명확화)

- 사용자 자유 표현 → 적합 트랙 (develop / improvement / review) 식별
- 해당 트랙의 template 을 선택 (또는 새 사용자 명시 항목으로 prompt 갱신)
- *애매함* 발견 시 1 회 사용자 확인 (사용자 메모리 "사전 4 질문 폭탄 X" 정합 — 핵심 결정만)

### Step 02 — Prompt Quality Assurance (프롬프트 검증)

- 작성된 프롬프트가 [`template/prompt-reference.md`](./template/prompt-reference.md) 의 모든 §원칙을 *충돌하지 않게* 반영하는지 점검
- 충돌 발견 시 reference 우선 — 프롬프트 측 수정
- 산출물 = `prompt/custom/<topic>.md` (선택 — 큰 사이클일 때만)

### Step 03 — Roadmap Design (계획 수립)

- 작업이 *3 commit 이상 분할 권고 규모* 면 계획서 작성
- 산출물 = `plan/<topic>/NN-<scope>.md` (예: `01-content.md`, `02-frontend.md`)
- 각 파일 마지막에 **제안 커밋 메시지 초안** 절 필수 (§ "Closure Discipline" SSOT)

소규모 (단일 commit) = 계획서 생략. 본 워크플로우 Step 03 skip 허용.

### Step 04 — Technical Review (계획 승인)

- 계획서가 있는 경우 본인 검토:
  - CLAUDE.md 11 원칙 위반 0?
  - 의존성 0 정책 위반 0? (런타임 의존 추가 X / dev 도구는 OK)
  - FSD 단방향 import 위반 0?
  - TypeScript strict 위반 0?
  - 마스킹 정책 (reader 빌드 누수 0) 정합?
- critical 발견 시 Step 03 으로 되돌아가 계획 수정

### Step 05 — Adaptive Execution (구현 + 동기 갱신)

- 코드 수정 진행. 매 단계마다 다음 게이트 통과 의무:
  1. `npm run typecheck` — 0 에러
  2. `npm run build` — 0 에러 + 마스킹 누수 0
  3. `npm run build-storybook` — 0 에러 (storybook 영향 변경 시만)
- 도중 결정 변경 시 **문서 먼저 (계획서·프롬프트·CLAUDE.md / harness-state 등) → 코드** 순서
- Storybook 영향 = `shared/ui/` 신규 컴포넌트 시 `.stories.tsx` 강제 (CLAUDE.md 원칙 #11)

### Step 06 — Commit & Close (커밋 + 동기 종료)

- 계획서가 있으면 *제안 커밋 메시지 초안* 그대로 사용 (한국어 본문, 사용자 메모리 정합)
- 사용자 commit 정책 (메모리) 준수 = **main 브랜치 + 사용자 직접 commit** 기본. 단, *사용자가 명시 위임* ("커밋해", "푸쉬해") 시 본 에이전트 commit/push 허용
- `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` 부착
- 누적 산출물 갱신 (CLAUDE.md §원칙 #8):
  - `.claude/harness/harness-state.md` §변경 이력 1행 (hot 20 임계 점검)
  - 세션 종료 직전 시 `.claude/handoff/CURRENT.md` 덮어쓰기

## 3. 핵심 원칙

1. **Reference SSOT** — 모든 트랙은 [`prompt-reference.md`](./template/prompt-reference.md) 를 우선 정독. 충돌 시 reference 가 정답.
2. **Template-Based** — 자유 프롬프트 작성 X. 트랙별 template 의 필드 구조 강제 (개발 사항 / 영향 범위 / DoD / 검증 방법 등).
3. **Synchronous Update** — Step 05 의 결정 변경은 즉시 Step 01~03 (프롬프트·계획서·CLAUDE.md) 으로 역전파. 문서 stale 금지.
4. **Closure Discipline** — 커밋 메시지는 계획서 SSOT. 초안과 다르면 계획서를 먼저 갱신 후 commit.
5. **Auto-mode 도 사용자 명시 권한 위임만** — 의존성 추가·git history 변경·force push·다인 협업 분기 같은 *되돌리기 어려운* 작업은 위임 명시 받기 전 진행 금지.
6. **검증 게이트 통과 의무** — Step 05 의 typecheck/build/마스킹 누수 3 게이트는 매 commit 전 통과 확인.
7. **변경 이력 누락 금지** — 의미 있는 변경 = harness-state §변경 이력 1행. 누락 = 정책 위반 (CLAUDE.md §원칙 #8).

## 4. 트랙별 흐름 요약

### 신규 (develop)

```
사용자 요청 → Step 01 (의도 확인)
            → Step 02 (develop template + reference 정합)
            → Step 03 (계획서 — 큰 작업만)
            → Step 04 (계획 승인)
            → Step 05 (구현 + 게이트 통과)
            → Step 06 (commit + 변경 이력)
```

### 개선 (improvement)

```
사용자 요청 → Step 01 (개선 대상 파일·현재 문제 식별)
            → Step 02 (improvement template + reference 정합)
            → Step 03 (계획서 — 큰 리팩토링만)
            → Step 04 (계획 승인 — 영향 범위·회귀 위험 점검)
            → Step 05 (구현 + 게이트 통과 + dist 결과 비교)
            → Step 06 (commit + 변경 이력)
```

### 검토 (review)

```
사용자 요청 → Step 01 (검토 대상 파일·검토 포커스 식별)
            → Step 02 (review template + reference 정합)
            → Step 05 (검토 보고만 — 심각도별 critical/major/minor)
            → 수정 사이클 진입 시 = 개선 트랙으로 전환 + 새 사이클
```

검토 트랙은 *제안만* — 사용자 확인 후 별도 개선 트랙 진입. **항목별 제안 → 확인 → 수정의 순차 진행** (일괄 수정 금지).

## 5. 참고

- [`template/prompt-reference.md`](./template/prompt-reference.md) — H-eries SSOT (필수 정독)
- [`../CLAUDE.md`](../CLAUDE.md) — 핵심 원칙 11 항 + 도구 우선순위
- [`../harness/harness-state.md`](../harness/harness-state.md) — 현 상태 + 변경 이력
- [`../handoff/CURRENT.md`](../handoff/CURRENT.md) — 세션 핸드오프
- [`../agents/`](../agents/) — 6 에이전트 정의 (lorekeeper / worldsmith / author / continuity-reviewer / frontend-engineer / publisher)
- [`../skills/heries-orchestrator/`](../skills/heries-orchestrator/) — 라우터 스킬
