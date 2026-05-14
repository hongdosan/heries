<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 코드 개선 프롬프트 (improvement)

- **역할**: H-eries 의 기존 코드/콘텐츠의 동작 변경·리팩토링·튜닝을 명확히 적어 코드 개선 요청하는 프롬프트 템플릿.
- **트랙**: improvement ([`workflow.md`](../workflow.md) §4-개선)

> **필수 정독**: [`prompt-reference.md`](./prompt-reference.md) — H-eries 단일 기준점.

---

## 개선 대상 파일 경로

> 절대 경로 또는 repo-relative 경로. 여러 파일 가능.

-

## 현재 문제점

> *무엇이* 문제인가. 버그/성능/UX/정합성/dead code 중 분류 명시.

-

## 개선 방향

> *어떻게* 해결하는가. 사용할 기존 토큰·헬퍼·정합 패턴 명시.

-

## 기대 결과

> 개선 *후* 의 상태. dist 크기 / 동작 변화 / UX 변화 등 정량/정성 둘 다.

-

## 영향 범위

> 본 개선이 *건드리는* 다른 슬라이스·파일·콘텐츠. 회귀 위험 영역 표시.

-

## 제외 범위 (out-of-scope)

> 같이 손대고 싶지만 본 사이클에서는 *제외* 하는 항목. 별도 사이클 권고.

-

## 완료 조건 (DoD)

- [ ] `npm run typecheck` 0 에러
- [ ] `npm run build` 0 에러 + 마스킹 누수 0
- [ ] `npm run build-storybook` 0 에러 (영향 시)
- [ ] 동작 회귀 0 (기존 기능 변경 X — 의도된 변경만)
- [ ] dist CSS/JS 크기 변화 ±N KB 안 (현재 사이즈 기준 ±5% 권고)
- [ ] FSD 단방향 import 위반 0
- [ ] CLAUDE.md 11 원칙 위반 0
- [ ] 변경 이력 1행 (`.claude/harness/harness-state.md`)

## 검증 방법

> 회귀 점검 + 새 동작 검증.

-

## 사용자 commit 위임 여부

- [ ] 사용자가 commit + push 명시 위임함

## 참고

- 필수 정독 참고서: [`prompt-reference.md`](./prompt-reference.md)
- 개발 흐름: [`../workflow.md`](../workflow.md)
- 핵심 원칙: [`../../CLAUDE.md`](../../CLAUDE.md)
