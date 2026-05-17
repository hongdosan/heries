<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 신규 기능 개발 프롬프트 (develop)

- **역할**: H-eries 에 새 슬라이스·새 페이지·새 콘텐츠·새 기능 도입을 위해 작업 의도·범위·검증을 명확히 적어 코드 개발 요청하는 프롬프트 템플릿.
- **트랙**: develop ([`workflow.md`](../workflow.md) §4-신규)

> **필수 정독**: [`prompt-reference.md`](./prompt-reference.md) — H-eries 단일 기준점.

---

## 개발 사항

> *무엇을* 만드는가. 컴포넌트·페이지·콘텐츠 종류·기대 동작 한 줄.

-

## 개발 방향

> *어떻게* 만드는가. FSD 레이어 (app/pages/widgets/features/entities/shared) 의 어디에 두는지, 사용할 기존 토큰·헬퍼·entities
> 목록.

-

## 영향 범위

> 본 작업이 *건드리는* 파일·슬라이스·콘텐츠.

-

## 제외 범위 (out-of-scope)

> 본 작업에서 *건드리지 않는* 영역. 후속 사이클로 미루는 항목 명시.

-

## 완료 조건 (DoD)

> 다음 모두 충족 시 완료. 누락 = 미완료.

- [ ] `npm run validate` (lint + typecheck + build 단일 게이트) 0 에러
- [ ] `npm run build-storybook` 0 에러 (`shared/ui/` 또는 storybook 영향 변경 시)
- [ ] check-secrets + check-manifest + check-images 통과 (build 안 자동)
- [ ] FSD 단방향 import 위반 0 (eslint-plugin no-restricted-imports 자동)
- [ ] CLAUDE.md 13 원칙 위반 0
- [ ] 외부 의존 추가 = 사용자 확인 완료 (해당 시)
- [ ] `shared/ui/` 신규 컴포넌트 = `.stories.tsx` 동반 (정책 #11)
- [ ] 변경 이력 1행 (`.claude/harness/harness-state.md`)

## 검증 방법

> 단위 검증 + 시각 검증. 시각 검증은 자동화 안 되면 "사용자 검수" 명시.

-

## 사용자 commit 위임 여부

> default = X (사용자 직접). 위임 시 "commit + push 위임" 명시.

- [ ] 사용자가 commit + push 명시 위임함

## 참고

- 필수 정독 참고서: [`prompt-reference.md`](./prompt-reference.md)
- 개발 흐름: [`../workflow.md`](../workflow.md)
- 핵심 원칙: [`../../CLAUDE.md`](../../CLAUDE.md)
