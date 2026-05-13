<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 등장 인물 정리 가이드

본 작품의 모든 등장 인물은 *짧게라도* 정의한다. 이름 있는 인물은 단독 카드, 이름 없는 단역은 공동 풀 파일에 1~2 줄씩 누적.

## 디렉토리 구조

| 디렉토리 | 분류 | 정의 |
|---|---|---|
| `1-protagonist/` | 단독 주인공 | 우진혁 1 인 |
| `2-major-supporting/` | 페이즈 1 ~ 3 지속 등장 + 페어링 핵심 | 자작 10 인 (페이즈 1 무대 위 인물) |
| `3-antagonist/` | 메인 빌런 + 페이즈별 적대 | 작가 (페이즈 2 메인) / 편집자 (페이즈 2 후반 동맹화) / 페이즈별 트리거 빌런 |
| `4-minor/` | 단역·카메오·1 회성 | 여동생·옛 작전 동료·헌터 센터 담당·운동부 코치·마수 등 |

## frontmatter 표준

```markdown
---
slug: 한국어-kebab-case
name: 표시명 (한자)
origin: original    # 모든 카드 = original 강제 (외부 IP 차용 0)
affiliation: 소속 / 진영 / 차원
role: protagonist | major-supporting | antagonist-major | antagonist-arc | mentor | minor-supporting | cameo | mob
arc_span: series-long | phase-long | arc | single-episode | cameo-recurring
aliases: [별칭1, 별칭2]
heries_arc: ① 페이즈 1 도입 — 강제 소환 직전 (또는 등장 시점)
summary: 한 줄 ~ 세 줄 요약
first_appearance: ep-NN-slug
---
```

### `role` 분류

- **protagonist** — 단독 주인공 (1 인 = 우진혁)
- **major-supporting** — 페이즈 1 ~ 3 지속 + 페어링 핵심 (10 인)
- **antagonist-major** — 시리즈 메인 빌런 (작가)
- **antagonist-arc** — 페이즈/장 단위 빌런 (페이즈 1 폭주 트리거 등)
- **mentor** — 동맹/조언자 (편집자)
- **minor-supporting** — 단기 등장 (여러 챕터에 걸쳐 등장 후 퇴장 = 옛 작전 동료, 헌터 센터 담당 등)
- **cameo** — 정기 등장 X, 동기·회상으로만 (여동생)
- **mob** — 1 회성 (마수, 일반 헌터, 운동부 코치 등)

### `arc_span` 분류

- **series-long** — 작품 전체 (우진혁·작가·편집자)
- **phase-long** — 한 페이즈 전체 (10 인 = 페이즈 1, 영혼화 후 페이즈 2~3 재등장)
- **arc** — 여러 챕터 (특정 사건 = 각성 트리거 동료)
- **single-episode** — 1 챕터만
- **cameo-recurring** — 짧게 반복 등장 (여동생 = 매 작전 직전 문자)

## 단독 카드 vs 공동 풀 파일

- **이름이 있는 인물 → 단독 카드** (slug.md). `role` 무관 (mob 이라도 이름 있으면 단독).
- **이름이 없는 단역 → 공동 풀 파일** (`4-minor/_mob-pool.md`). 1 인당 1~2 줄. 등장 챕터 명시.

## 모든 등장 인물 = 짧게라도 정의 (강제)

챕터 작성 시 등장한 인물은 *반드시* 다음 둘 중 한 곳에 정의:
1. 신규 단독 카드 (이름 있는 인물)
2. `4-minor/_mob-pool.md` 1~2 줄 추가 (이름 없는 단역)

미정의 등장 인물 = 챕터 작성 reject.
