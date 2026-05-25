<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Handoff — SDD 통합 사이클

## 1. 한 줄 요약
spec-driven-orchestra를 H-eries에 strict 강제로 통합 완료. SDD가 최상위 지휘자, 기존 하네스는 Implement 악기.

## 2. 완료 상태
### 완료 ✅
- `specify init` (.specify/ + speckit-* 9 스킬)
- constitution 병합 (R1~R7 + strict + H-eries 정체성)
- 게이트 전부 설치: pre-implement(PreToolUse), pre-commit(strict 핀), post-task(Stop), CI(sdd-gate.yml), settings.json
- SDD 스킬: grill-me(+VARIANT), sdd-conductor, handoff
- 공통 자산: 루트 CLAUDE.md, INTERVIEW-RESULT, DECISION-LOG, INTEGRATION-REPORT
- 첫 사이클 산출물(본 specs/) + 스모크 테스트(R1 차단 / 마크다운 통과) + 통합 커밋 게이트 PASS

### 미완료 (사용자 액션) ❌
- `karpathy-guidelines` 플러그인: `/plugin marketplace add multica-ai/andrej-karpathy-skills` → `/plugin install`
- GitHub main 브랜치 보호(required PR + sdd-gate 체크) → CI 우회 불가화
- (선택) GitHub repo 변수 `SDD_TEST_CMD` 설정 — 미설정 시 워크플로 기본값 사용
- 브랜치 정책 reconcile 확정(메모리 main만 ↔ SDD feature 브랜치)

## 3. 주요 결정
- DECISION-LOG.md 결정 1~6 참조. 핵심: strict 명시 핀, R7 advisory, SPEC.yml은 enforcement/ 하위.

## 4. 알려진 이슈
- 🐛 settings.json 훅(pre-implement/post-task)은 **다음 세션부터 활성**(현 세션 미적용).
- ⚠️ R7/sync-check은 H-eries 콘텐츠에 비강제(advisory).

## 5. 다음 작업자 액션
### 즉시
- [ ] 사용자: 통합 커밋(전체 staged 상태). 메시지 예: `feat(sdd): spec-driven-orchestra 통합 — strict 게이트 + SDD 지휘자`
- [ ] karpathy 플러그인 설치

### 새 feature로
- [ ] 첫 실전 코드 SDD 사이클(예: 컴포넌트 추가) → `sdd-conductor`

## 6. 참고
- specs/feat/spec-driven-orchestra/{spec,plan,survey,regression}.md
- INTEGRATION-REPORT.md / INTERVIEW-RESULT.md / DECISION-LOG.md
