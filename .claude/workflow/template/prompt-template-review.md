<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 코드 검토 프롬프트 (review)

- **역할**: H-eries 의 기존 코드/콘텐츠를 *변경 X / 보고만* 검토. 발견 사항을 심각도별 정리해 사용자에게 보고하고, 수정은 *별도 개선 사이클* 로 전환.
- **트랙**: review ([`workflow.md`](../workflow.md) §4-검토)

> **필수 정독**: [`prompt-reference.md`](./prompt-reference.md) — H-eries 단일 기준점.

---

## 검토 대상 파일 경로

> 절대 경로 또는 repo-relative. 슬라이스 전체 (예: `src/features/mini-game/`) 도 가능.

-

## 검토 포커스 (해당 항목 선택)

> 다중 선택 가능. 본 검토의 *우선 관점*.

- [ ] **버그** — race condition / 메모리 누수 / edge case / 잘못된 분기
- [ ] **CLAUDE.md 정책** — 13 원칙 위반 점검
- [ ] **FSD 정합** — 단방향 import / 슬라이스 격리
- [ ] **TypeScript strict** — strict 7 옵션 잠재 위반
- [ ] **의존성** — 런타임 의존 0 정책 / dev 도구 dist 영향 0
- [ ] **마스킹** — reader 빌드 누수 / 작가 모드 정합
- [ ] **a11y** — focus-visible / ARIA / 키보드 / reduced-motion
- [ ] **성능** — RAF / DOM 직접 갱신 / 불필요 re-render
- [ ] **dead code** — 미사용 export / class / 변수
- [ ] **적응형** — hardcoded px/hex → CSS var/clamp/dvh
- [ ] **카피·스타일** — SSOT 미등록 명명 / stale 표현 / 톤 일관성

## 리뷰 결과 요청 형식

- **심각도별 분류**: critical (즉시 수정 의무) / major (다음 사이클 권고) / minor (백로그)
- **각 이슈**:
    - 위치 (`파일:라인`)
    - 문제 (한 줄)
    - 근거 (코드 인용 또는 정책 참조)
    - 제안 (수정 방향, 코드 한 줄 또는 짧은 스니펫)
- **수정 사이클 진입 시**:
    - 본 검토 트랙 = *보고만*. 수정은 새 *개선 트랙* 사이클로.
    - **항목별 제안 → 사용자 확인 → 수정의 순차 진행** (일괄 수정 금지).
    - 커밋 메시지 = 개선 트랙의 *제안 커밋 메시지 초안* SSOT 사용.

## 제외 범위 (out-of-scope)

> 본 검토가 *다루지 않는* 영역. 별도 검토 사이클 권고.

-

## 보고 시점

> 검토 보고 = 즉시 응답 (사용자 결정 대기). 큰 사이클 (다수 슬라이스) 면 *섹션별 분할 보고* 권고.

-

## 참고

- 필수 정독 참고서: [`prompt-reference.md`](./prompt-reference.md)
- 개발 흐름: [`../workflow.md`](../workflow.md)
- 핵심 원칙: [`../../CLAUDE.md`](../../CLAUDE.md)
- 변경 이력 SSOT: [`../../harness/harness-state.md`](../../harness/harness-state.md)
