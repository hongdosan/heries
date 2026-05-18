<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries 하네스 — 인덱스

`H-eries` 는 *나만의 웹 시리즈* 정적 사이트 프로젝트. 이름은 `홍도산` 의 `h` + `series` 의 `eries`. 첫 작품 `차원 격돌` (`series/clash-of-multiverses/`) 을 비롯한 소설을 markdown / HTML 만으로 발행하며, **라이브러리 의존성 0**.

본 디렉토리는 [revfactory/harness](https://github.com/revfactory/harness) 플러그인 위에서 운영되는 *문서 기반 프로세스 하네스* 의 3종 문서를 보관한다.

## 저작권 고지

`H-eries` 의 모든 소설·등장인물·세계관은 작가*(홍도산)* 의 **100% 오리지널 창작** 이며 모든 권리는 홍도산 단독 귀속. 본 저장소의 어떤 콘텐츠도 상업적 사용을 허락하지 않는다. 모든 산출물 .md 첫 줄에 다음 HTML 주석 1줄을 부착한다:

```html
<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
```

## 구성

| 문서 | 내용 |
|---|---|
| [harness-state.md](harness-state.md) | 하네스 현 상태 · 도메인 정의 · 에이전트 인벤토리 · SSOT 구조 · 변경 이력 (SSOT) |
| [harness-setup.md](harness-setup.md) | 도입 가이드 — H-eries 도메인 분담 · Phase 매트릭스 · 작업 사이클 |
| [harness-install.md](harness-install.md) | 설치·적용 절차 — 플러그인 설치 · `agent-lorekeeper` 시범 생성 · 검증 · 트러블슈팅 |

## 진입 순서

1. **현 상태 파악** — [`harness-state.md`](harness-state.md)
2. **도입 결정** — [`harness-setup.md`](harness-setup.md)
3. **실 설치** — [`harness-install.md`](harness-install.md) (`/plugin install harness@harness-marketplace` + `agent-lorekeeper` 시범 생성)

## 변경 추적

본 디렉토리 3종 문서의 모든 변경은 [`harness-state.md`](harness-state.md) 의 *변경 이력* 표에 누적 기록한다 (harness Phase 7 패턴). 다른 곳에 분산 기록하지 않는다.

## 누적 산출물 최적화

`harness-state.md` §변경 이력 은 **20행** 임계, `.claude/handoff/CURRENT.md` 는 **단일 파일 덮어쓰기** (정책 v3, 2026-05-11). 변경 이력 hot 초과 시 `harness-state-archive.md` 로 이동. 정책 SSOT: [`../CLAUDE.md`](../CLAUDE.md) §누적 산출물. 점검 시점 = *세션 시작 직후* + *세션 종료 직전*. 임계 점검 결과는 필요 시 사용자에게 보고.
