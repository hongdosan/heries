<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Decision Log

> 모든 의미 있는 결정의 시간순 기록. SDD_OVERRIDE 우회도 여기 자동 기록(strict라 비활성이지만 형식 보존).

## 형식
```
## YYYY-MM-DD - [컨텍스트]
- 결정 / 근거 / 대안 / 영향
```

---

## 2026-05-23 - 통합 패키지(spec-driven-orchestra) 적용

### 결정 1: 강제 레벨 = strict, 0단계 조사 = 켬
- **근거**: 사용자 명시 선택(INTERVIEW-RESULT.md Q1). 191 코드 파일 → 기존 코드.
- **대안**: standard(AI 추천). 사용자가 더 강한 strict 선택.
- **영향**: R3/R4 우회 불가, `SDD_OVERRIDE` 비활성.

### 결정 2: strict 자동 미감지 → 게이트에 명시 핀
- **근거**: H-eries에 `.env.production`/`*.tf`/`k8s` 없음(deploy.yml만). 자동 감지로는 standard로 떨어짐.
- **결정**: 설치된 `.git/hooks/pre-commit`에 `: "${ENFORCEMENT_LEVEL:=strict}"` + `SDD_TEST_CMD` 기본값 주입. `sdd-gate.yml`도 `level=strict` 핀.
- **영향**: 설치본이 pristine 소스(`enforcement/hooks/pre-commit.sh`)와 의도적으로 divergent. 소스는 참조용 보관.

### 결정 3: SDD_TEST_CMD = "npm run typecheck && npm run lint"
- **근거**: 단위 테스트 스위트 부재. typecheck + lint가 프로젝트의 사실상 검증(`npm run validate`는 build 포함이라 pre-commit엔 무거움).
- **대안**: `npm run validate`(build 포함) — CI에서만 고려 가능. 현재 CI도 typecheck+lint.
- **영향**: 코드 커밋 시 typecheck+lint 통과 필수.

### 결정 4: 공존 = SDD 최상위 지휘자
- **근거**: 사용자 선택. 기존 heries-orchestrator + 6 에이전트는 Implement 단계 악기로, workflow.md는 SDD에 흡수.
- **영향**: 코드 작업 = SDD feature 브랜치 흐름. 콘텐츠(마크다운) = 기존 파이프라인 유지(게이트 무관).

### 결정 5: R7(sync-check) H-eries 적용 안 함 (advisory)
- **근거**: R7/`sync-check.sh`는 *오케스트라 패키지 자체*의 이중언어(EN/KO) 문서 쌍·악기 수 정합 검사. H-eries 100+ 마크다운은 창작 콘텐츠(`.ko` 쌍 없음) → 적용 시 전부 실패.
- **결정**: `enforcement/sync-check.sh` + `enforcement/SPEC.yml`은 참조용 보관. CI R7 스텝은 advisory echo로 대체(차단 X). SPEC.yml은 **repo 루트가 아닌 `enforcement/` 하위**에 둠(루트면 콘텐츠 문서를 지배).
- **영향**: R1~R6은 강제, R7은 비강제. 사용자 검토 필요 항목(INTEGRATION-REPORT §유의).

### 결정 6: 루트 CLAUDE.md = SDD 진입점, `.claude/CLAUDE.md` = 프로젝트 SSOT
- **근거**: specify init이 루트에 SPECKIT 스텁 생성. 기존 상세 instructions는 `.claude/CLAUDE.md`. 둘 다 로드됨.
- **영향**: 루트는 SDD 운영 레이어만, 작품 규칙은 `.claude/CLAUDE.md` 우선.

### 결정 7: 브랜치 정책 reconcile (2026-05-23 확정)
- **결정**: 콘텐츠(마크다운)는 develop 직접 커밋(게이트 무관). 코드(`.ts/.tsx/.sh`)는 **`NNN-slug` feature 브랜치 off develop** → spec/plan → 게이트 통과 커밋 → `merge --no-ff`로 develop 합류 → release → main.
- **근거**: 사용자 선택(Option A). 3-브랜치 구조 보존 + strict 게이트 보존 동시 달성. merge commit은 pre-commit 미발동이라 develop 합류 무마찰.
- **대안**: develop 게이트 면제(strict 약화) / specs/develop 상시(feature 의미 약화) — 모두 기각.
- **영향**: 반영처 — `.claude/harness/git-strategy.md` §2-1b, constitution §5, 메모리 [[3-branch-develop-release-main-commit]] + [[project_sdd_integration]].

### 미해결 / 사용자 확인 필요
- (위 결정 7로 브랜치 정책 reconcile 해소됨)
- **GitHub 보호 규칙**: CI 게이트 우회 불가는 main에 required-PR 브랜치 보호를 켰을 때만. 미설정 시 로컬 `--no-verify` 가능. (사용자 GitHub 설정 필요)
- **karpathy-guidelines**: `/plugin marketplace add multica-ai/andrej-karpathy-skills` + `/plugin install` 필요(사용자 실행).

---

## 향후 추가 기록 (각 SDD 사이클 종료 시)
```
## YYYY-MM-DD - <branch> [기능명] 사이클 종료
- 시작/종료 / 유형(Full/Mini) / 주요 결정 / 알려진 이슈 / 다음 SDD / 상세: specs/<branch>/
```
