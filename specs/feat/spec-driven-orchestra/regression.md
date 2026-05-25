<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Regression — 기존 동작 보존 검증 (R4)

> survey.md 존재 → R4 강제. 커밋 전 아래 B1~B5 통과 필요.

## 1. 회귀 대상

### B1: 타입 안전성
- 기존 동작: `npm run typecheck` (tsc --noEmit) 통과.
- 검증: 통합 후에도 통과. **자동** (SDD_TEST_CMD 일부).
- 통과 기준: 에러 0.

### B2: 린트
- 기존 동작: `npm run lint` (eslint src) 통과.
- 검증: 통합 후에도 통과. **자동** (SDD_TEST_CMD 일부).
- 통과 기준: 에러 0.

### B3: 마크다운 전용 커밋 비차단
- 기존 동작: 챕터·카드 마크다운 커밋 자유.
- 검증: `.md`만 staged → `pre-commit` exit 0 (스모크 테스트).
- 통과 기준: 차단되지 않음.

### B4: 기존 하네스 무손상
- 기존 동작: heries-orchestrator + 6 에이전트 + 스킬 로드.
- 검증: `.claude/agents/`·`.claude/skills/heries-orchestrator` 파일 무변경. 신규 스킬은 추가만.
- 통과 기준: 기존 파일 diff 없음.

### B5: 빌드 산출물
- 기존 동작: `npm run build` 성공(check-images/manifest/secrets + tsc + vite + copy-content).
- 검증: 통합이 build 파이프라인 미변경.
- 통과 기준: build 스크립트 무변경.

## 2. 마이그레이션 시나리오
- 인프라 추가만 — 동작 교체 없음. Strangler Fig 불필요.

| 단계 | 회귀 통과 기준 |
|---|---|
| 1 (통합 커밋) | B1, B2, B5 |
| 2 (게이트 운영) | B3, B4 |

## 3. 롤백
- 조건: 게이트가 정상 작업을 과도 차단.
- 방법: INTEGRATION-CHECKLIST.md §롤백 가이드 (Level 1~3 / git reset).

## 4. 결정 로그
| 시각 | 결정 | 근거 |
|---|---|---|
| 2026-05-23 | typecheck+lint를 회귀 검증으로 | 단위 테스트 부재, 프로젝트 de-facto 검증 |

## 5. 다음 단계
- [ ] implementation-notes.md (선택)
