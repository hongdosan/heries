<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — SDD 통합 구현 계획

## How
1. **Phase 1**: `specify init --here --integration claude --force --no-git` → `.specify/` + `/speckit-*` 스킬.
2. **Phase 2**: enforcement/ 전체 미러(소스: `~/IdeaProjects/hongdosan-spec-driven-orchestra`). EN CONSTITUTION 정본 + KO 번역.
3. **Phase 3**: 게이트 설치
   - `.git/hooks/pre-commit` ← `enforcement/hooks/pre-commit.sh` + strict/SDD_TEST_CMD 핀 주입.
   - `.claude/hooks/{pre-implement,post-task}.sh` 갱신 + 실행권한.
   - `.github/workflows/sdd-gate.yml`: level=strict 핀 + Node setup + npm ci + R3 기본 명령 + R7 advisory.
   - `.claude/settings.json`: PreToolUse→pre-implement, Stop→post-task.
4. **Phase 4**: constitution 병합 — `.specify/memory/constitution.md` 에 R1~R7 + strict + H-eries 원칙.
5. **Phase 5**: SDD 스킬 — grill-me/handoff(로컬 reference clone에서 cp), sdd-conductor(작성), VARIANT.md.
6. **Phase 6**: 공통 자산 — 루트 CLAUDE.md, INTERVIEW-RESULT, DECISION-LOG, INTEGRATION-REPORT.
7. **Phase 7**: 첫 사이클 산출물(본 specs/) + 게이트 스모크 + Day 0 검증.

## 기술 결정
- 설치본 hook은 pristine 소스와 의도적 divergence(strict 핀). 소스는 `enforcement/`에 참조 보관.
- SDD_TEST_CMD = `npm run typecheck && npm run lint` (build 미포함 — pre-commit 경량화).
- SPEC.yml은 `enforcement/` 하위(루트 X — 콘텐츠 문서 미지배).

## 검증 (tasks.md / AC 매핑)
- AC1~AC5: 파일 존재 + 실행권한 확인.
- AC6: 임시 브랜치 스모크 테스트(스테이징 후 hook 직접 실행, 커밋 안 함).
- AC7: `npm run typecheck && npm run lint` 실행 통과.

## 리스크 / 완화
- PreToolUse 훅이 plan.md 작성을 막을 가능성 → settings.json은 세션 재시작 후 활성, 현 세션 무영향.
- 브랜치 정책 충돌(메모리) → DECISION-LOG 미해결 항목으로 사용자 확인.
