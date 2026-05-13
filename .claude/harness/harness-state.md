<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries 하네스 — 현 상태

`H-eries` 의 AI 협업 구조를 정의하는 메타 레이어 문서. 사실 기반으로 현 상태를 누적 기록한다.

## 목차

- [정의](#정의)
- [도메인](#도메인)
- [구성 요소](#구성-요소)
- [에이전트 인벤토리](#에이전트-인벤토리)
- [SSOT 구조](#ssot-구조)
- [자동 강제 메커니즘](#자동-강제-메커니즘)
- [진화 우선순위](#진화-우선순위)
- [변경 이력](#변경-이력)
- [참고](#참고)

## 정의

`H-eries` 하네스는 자체 런타임 없이 [Claude Code](https://claude.com/claude-code) 위에 **문서 기반 프로세스 하네스 (Documentation-Driven Process Harness)** 를 얹은 구조다.

| 층위 | 정의 | 본 프로젝트 |
|---|---|---|
| Runtime Harness | LLM 호출·도구 디스패치·실행 흐름을 코드로 묶은 시스템 | Claude Code (재사용) |
| Process / Documentation Harness | 페르소나·SSOT·산출물 형식을 문서로 강제하는 메타 레이어 | **본 프로젝트가 정의** |

## 도메인

| 항목 | 값 |
|---|---|
| 서비스 | `H-eries` — 단일 작가의 소설 컬렉션 정적 사이트 |
| 작품 #1 | **차원의 격돌** (`series/clash-of-multiverses/`) |
| 콘텐츠 성격 | **비상업적 크로스팬픽** — 원작 캐릭터 권리는 각 원저작자에게 귀속 |
| 작성자 | 단일 (`홍도산`) — 외부 협업자·다인 작가 가정 없음 |
| 독자 | 읽기 전용 (방문자는 수정 권한 없음) |
| 빌더 | 라이브러리 의존성 0 — markdown / HTML 만. GitHub Pages 의 raw static 모드(`.nojekyll`) 또는 정적 호스팅 |
| 배포 | GitHub **공개** 저장소 |

## 구성 요소

`H-eries` 하네스를 구성하는 요소.

| # | 요소 | 위치 |
|---|---|---|
| 1 | 페르소나/역할 정의 | 각 에이전트 frontmatter + 본문 §0 |
| 2 | 다중 전문 에이전트 분리 | `.claude/agents/agent-{lorekeeper,author,continuity-reviewer,publisher}.md` |
| 3 | 단일 기준점 (SSOT) | 등장인물·세계관·연표·용어집 — `content/series/{slug}/{characters,worldbuilding,timeline,glossary}/` |
| 4 | 단계별 작업 사이클 | 챕터 초안 → SSOT 갱신 → 연속성 감사 → 커밋 → 발행 ([harness-setup.md §6](harness-setup.md#6-작업-사이클)) |
| 5 | AI 자가 검증 | `agent-continuity-reviewer` 가 신규 챕터의 SSOT 정합성 감사 |
| 6 | 산출물 스키마 | 등장인물 카드 frontmatter (`name`, `origin`, `affiliation`, `role`, `first_appearance`), 챕터 frontmatter (`title`, `episode`, `published`) |
| 7 | 비상업적 팬픽 고지 | 모든 .md 첫 줄 HTML 주석 1줄 — CLAUDE.md 에 강제 |
| 8 | 도구 우선순위 | `.claude/CLAUDE.md` §도구 우선순위 + Serena MCP 사용 지침 |
| 9 | 변경 이력 (Synchronous Update) | 본 문서 §변경 이력 — 하네스 docs 3종의 SSOT |

## 에이전트 인벤토리

2026-05-12 하네스 엔지니어링: 4 → 6 세분화. 코드 작업 분리 + 세계관 분리.

| 에이전트 (frontmatter `name`) | 역할 | 상태 | 정의 |
|---|---|---|---|
| `H-eries-lorekeeper` | 캐릭터 카드 SSOT (`characters/`) 작성·정정·검증 | 작성 (2026-05-12) | [`../agents/H-eries-lorekeeper.md`](../agents/H-eries-lorekeeper.md) |
| `H-eries-worldsmith` | 시리즈 메타 + 세계관·연표·용어집 (`_series.md`, `worldbuilding/`, `timeline/`, `glossary/`) | 작성 (2026-05-12, 신규) | [`../agents/H-eries-worldsmith.md`](../agents/H-eries-worldsmith.md) |
| `H-eries-author` | 챕터 본문 작성 (`chapters/`) — 시놉시스 사실화 / 플롯 보존 | 작성 (2026-05-12) | [`../agents/H-eries-author.md`](../agents/H-eries-author.md) |
| `H-eries-continuity-reviewer` | 신규 챕터 정합성 감사 (직접 수정 X — 보고서만) | 작성 (2026-05-12) | [`../agents/H-eries-continuity-reviewer.md`](../agents/H-eries-continuity-reviewer.md) |
| `H-eries-frontend-engineer` | `src/` (FSD) + `scripts/` + 빌드 설정. Serena MCP 우선, 의존성 0 정책 | 작성 (2026-05-12, 신규) | [`../agents/H-eries-frontend-engineer.md`](../agents/H-eries-frontend-engineer.md) |
| `H-eries-publisher` | 발행·배포 — manifest, 빌드 검증, 이미지 강제, 썸네일 프롬프트, GH Pages | 작성 (2026-05-12) | [`../agents/H-eries-publisher.md`](../agents/H-eries-publisher.md) |

작성률: **6/6 (100%)**. 라우터 = [`../skills/H-eries-orchestrator/SKILL.md`](../skills/H-eries-orchestrator/SKILL.md).

## SSOT 구조

```
content/
  series/
    clash-of-multiverses/        # 작품 #1: 차원의 격돌
      _series.md                 # 시리즈 메타 (제목·시놉시스·연재 상태·차용 원작 목록)
      characters/                # 등장인물 SSOT (캐릭터당 1 파일)
        {character-id}.md        # frontmatter + 서술 본문
      worldbuilding/             # 지역·세력·체계
      timeline/                  # 연표
      glossary/                  # 용어집
      chapters/
        ep-01-{slug}.md          # 에피소드 본문 (frontmatter + 본문)
        ep-02-{slug}.md
        ...
```

### 등장인물 카드 frontmatter 예시

```markdown
---
name: 캐릭터 표시명
origin: 원작 출처 (예: "OOO 웹툰 - 작가명") — 차용 시 필수, 누락 시 reject
affiliation: 소속 (조직/세력/소속 시리즈)
role: protagonist | antagonist | supporting | cameo | original
first_appearance: ep-01-prologue
aliases: [별칭1, 별칭2]
heries_arc: tba   # 본 작품에서의 소환 시점·상태. 보류 시 tba (선택 필드)
---

(본문 = 원작 메타 → 원작 캐논 → H-eries 분기 → 검증 출처 4 절 구조)
```

> `origin` 필드는 **차용 캐릭터** 식별에 필수. 본 작품 오리지널 캐릭터는 `origin: original`.
> *다중 우주 전제* 로 인해 본문은 *원작 캐논 절* 과 *H-eries 분기 절* 을 분리 작성한다. 정책 SSOT: [`../../content/series/clash-of-multiverses/_series.md`](../../content/series/clash-of-multiverses/_series.md) §기본 전제.

## 자동 강제 메커니즘

| 항목 | 존재 |
|---|---|
| `H-eries-continuity-reviewer` 자동 호출 (신규 챕터 작성 시) | **구현** — `H-eries-orchestrator` SKILL.md §4-2 챕터 작성 파이프라인 (author → continuity-reviewer 자동) |
| 등장인물 카드 frontmatter 스키마 검증 | LLM 순응 (`H-eries-lorekeeper` §검증 체크리스트) |
| 챕터 → 캐릭터 참조 무결성 검증 | LLM 순응 (`H-eries-continuity-reviewer` §검증 체크리스트) |
| 비상업적 팬픽 고지 부착 강제 | **구현** — CLAUDE.md §핵심 원칙 #1 + 모든 에이전트 §작업 원칙 |
| 이미지 budget 강제 (≤500KB) | **구현** — `scripts/check-images.mjs` 빌드 게이트 (build·build:author 시작에 chain) |
| 작가 빌드 라이브 노출 차단 | **구현** — `.github/workflows/deploy.yml` 의 `VITE_AUTHOR_MODE: ""` env 강제 |
| Pre-commit hook | 없음 (사용자 메모리 = 사용자 직접 commit 정책 — hook 도입 보류) |

자동 강제: **4건** (orchestrator 파이프라인 + 고지 부착 + 이미지 budget + 작가 빌드 격리). 콘텐츠 정합성은 LLM 순응 + 에이전트 §검증 체크리스트.

## 진화 우선순위

1. **`agent-lorekeeper` 시범 생성** ([harness-install.md §4](harness-install.md#4-첫-적용--agent-lorekeeper-시범-생성)) — harness Phase 1–6 자동 실행. 가장 핵심: 등장인물 SSOT 정의·검증.
2. **첫 시리즈 메타 작성** — `content/series/clash-of-multiverses/_series.md` (시놉시스 + 차용 원작 목록).
3. **첫 챕터 시범 작성 + `agent-author` 도입** — 한 사이클 완주 (집필 → SSOT 갱신).
4. **`agent-continuity-reviewer` 도입** — 두 번째 챕터 진입 직전. 첫 챕터를 바탕으로 검증 규칙 학습.
5. **`agent-publisher` 도입** — GitHub Pages 발행 절차 자동화. `.nojekyll` 라우팅·인덱스 페이지 갱신·`gh` CLI 래퍼.
6. **자동 강제 도입 (선택)** — frontmatter 스키마 검증 스크립트 (라이브러리 미사용 — bash + grep 등). pre-commit 도입 여부는 사용자 판단.

## 변경 이력

harness Phase 7 패턴을 차용한 변경 이력. 모든 진화 변경은 *날짜 / 변경 내용 / 대상 / 사유* 4컬럼으로 기록.

> **Hot 한도: 20행.** 21행 도달 시 **hot 에 최근 3행만 남도록 가장 오래된 행을 한꺼번에** [`harness-state-archive.md`](harness-state-archive.md) 로 이동 (= 매번 약 18행 일괄 이동, **1줄 bullet 압축 형식** `- YYYY-MM-DD: 핵심`). 카드 1장당 발동 사이클 회피. 원본 복원은 git history. 정책 SSOT: [`../CLAUDE.md`](../CLAUDE.md) §누적 산출물. 점검 시점 = 세션 시작 직후 + 세션 종료 직전.

| 날짜 | 변경 내용 | 대상 | 사유 |
|---|---|---|---|
| 2026-05-13 | **대화형 서사 원칙 도입 + ep-01 / ep-03 대화형 재작성 + 림우경 = 작가 감지 첫 인물 명시** — 사용자 새 작가 원칙 4 가지: (1) 대화형 중심 서사 (제 3 자 설명 X) (2) 성장·전투·근거 있는 강함 모두 대화로 (3) 갑작스런 상황·이해 어려운 상황 = 제 3 자 끼어들기 OK (예외) (4) 제 3 자 = 작가 가능 → 림우경 (찰나의 결) 이 가장 먼저 감지. 산출: (a) **`worldbuilding/writing-principles.md` § 3 절 갱신** = 기존 *묘사 자세히* → *대화형 중심 서사* 로 교체 + § 3-1 대화 비율 강제 + § 3-2 제 3 자 = 작가 음성 (예외 자리만) + § 3-3 림우경 = 작가 감지 첫 인물 명시 + § 4-1 전투씬 = 외침·신호 + 한 합 분해 + 전투 후 복기 강제 (b) **림우경 카드 §능력 신규 항목** = *★ 작가의 서술 한 줄 감지 — 메타 떡밥*. 페이즈 1 강제 소환 박자 직후 그가 가장 먼저 정리하는 한 줄 = *이 박자는 우리가 만든 것이 아니다, 누군가가 쓴 것이다* (c) **ep-01 대화형 재작성** (306 행 / 1686 단어) = 우진혁 ↔ 우아진 식탁 회상 + 우진혁 ↔ 코치 직접 대화 + 우진혁 ↔ 스카웃 담당 본격 대화 + 우진혁 ↔ 우아진 결정 후 약속 대화 (제 3 자 서술 = 起·結 짧은 단락 + 그날 밤 작가 음성 1 단락만) (d) **ep-03 대화형 + 외침·신호 전투씬 재작성** (354 행 / 2036 단어) = 작전 브리핑 (지휘관·박찬호·김주영·우진혁 대화) + 던전 진입 (부대원 4 인 한 줄씩 묘사 분담) + 첫 한 합 (지휘관·정민호·박찬호 외침·신호) + D 중 한 합 (정민호 신호 + 우진혁 흘림 1·2·3·박는다) + 의무대 복기 (지휘관 + 우진혁 대화) + 우아진 문자 대화 (e) **mob-pool ep-03 단역 5 추가** = 작전 지휘관 / 김주영 / 정민호 / 부대 의무관 / 던전 마수 3 마리 (D 상위 #1·D 중·D 상위 #2) (f) **manifest.json chapters[2]** = ep-03 등재 (g) **`thumbnails/PROMPT.md` ep-03 컷** = D 급 폐쇄 던전 좁은 통로 + 5 인 진형 wedge + 푸른 형광 이끼 + 첫 마수 silhouette 한 박자 직전 톤. **검증**: typecheck 0 / build 3.32s (10 verbatim, 17 masked, 누수 0) / ep-01 / ep-02 / ep-03 dist 정상 노출 | `worldbuilding/writing-principles.md` (§ 3 / § 4 갱신), `characters/2-major-supporting/rim-woo-gyeong.md` (§능력 작가 감지 항목), `chapters/{ep-01-prologue.md, ep-03-first-mission.md}` (대화형 재작성), `characters/4-minor/_mob-pool.md` (ep-03 단역 5 추가), `manifest.json` (chapters[2]), `thumbnails/PROMPT.md` (ep-03 컷), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = *작가 톤 결정적 전환*. 이전 *제 3 자 서술 위주* 챕터를 *대화형 중심* 으로 재작성. ep-01 단어 수 감소 (2321 → 1686, -27%) = 회상 4 단락이 우아진 식탁 대화 1 단락으로 압축됨 — 일부 정보는 후속 챕터의 대화 안으로 흡수 예정. ep-03 단어 수 감소 (2259 → 2036, -10%) = 제 3 자 전투 묘사가 외침·신호 + 한 합 분해로 변환됨, 전투의 박진감 한 박자 더 강해진 결. 림우경의 *작가 감지* 능력 = 페이즈 2 작가 토벌의 첫 단서 + 페이즈 1 강제 소환 박자에 그가 *그 박자 = 우리가 만든 것이 아니다* 정리하는 자리. 다음 사이클 후보: (1) ep-02 미세 정리 (이미 대화 비중 OK 수준) (2) ep-04 *죽음의 반복* 작성 (3) ep-09 *원형의 무대 강제 소환* 시 림우경 작가 감지 첫 발현 자리 강조. 변경 이력 hot 8행 / 한도 20 — 여유 12 |
| 2026-05-13 | **ep-02 *던전이라는 단어의 첫 줄* + 박찬호 (첫 동료) 단독 카드 + 3-antagonist 골격 카드 (작가·편집자) + 마스킹 강화** — 사용자 *자동 진행* 명시 후 큰 사이클. 산출: (a) **ep-02 신규** = `chapters/ep-02-recruitment.md` (198 행 / 2259 단어 / 118 단락, 기승전결 4 단 = 起 모집소 정문 / 承 접수 + 헌터 차원 입문서 + 박찬호 첫 동료 / 轉 신체 검사 + 면접 + 합격 / 結 모집소 밖 우아진 만남 + 다음 주 월요일 입대) — phase-1-overview.md ep-02 계획 정합 (b) **박찬호 (朴贊浩) 단독 카드** = `4-minor/park-chan-ho.md` (role: minor-supporting, arc_span: arc). *살아 돌아오면 한 잔 하자* 의 한 줄 + 야구 선수 동명이인. 페이즈 1 중반 죽음 가능성 (작가 결정) = 우진혁 각성 트리거 동료 후보 (c) **mob-pool 5 추가** = 모집소 정문 안내자 + 모집 담당관 + 종합 진단 의사 + 면접관 3 인 + 헌터 차원 입문서 책자 (d) **3-antagonist/ 골격 카드 2** = `author.md` (페이즈 2 메인 빌런, antagonist-major + series-long) + `editor.md` (페이즈 2 후반 + 페이즈 3 가디언직 제안자, mentor + series-long) — 페이즈 2 진입 시 본격 작성, 현재는 시놉시스 메타만 (e) **scripts/copy-content.mjs 마스킹 강화** = `3-antagonist/` 디렉토리 reader 빌드 스킵 (페이즈 2/3 스포 보호) + characters/README.md + `_*.md` 스킵 (작가 메타 미노출) (f) **manifest.json characters 13 인** = 11 주연 + 우아진 + 박찬호. chapters[1] = ep-02 신규 등재 (g) **_series.md 단역 표** = 2 인 (우아진 + 박찬호) (h) **ep-02 frontmatter characters** = woo-jin-hyeok + woo-a-jin + park-chan-ho (i) **{{char:park-chan-ho|박찬호}} 호명** = 첫 등장 박자 적용. **검증**: typecheck 0 / reader build 499ms (10 verbatim, 16 masked, 누수 0) / author build OK (3-antagonist/ 노출 정상) / ep-02 dist 노출 정상 | `chapters/ep-02-recruitment.md` (신규), `characters/4-minor/park-chan-ho.md` (신규), `characters/4-minor/_mob-pool.md` (ep-02 단역 5 추가), `characters/3-antagonist/{author.md, editor.md}` (신규 골격), `scripts/copy-content.mjs` (3-antagonist 스킵 + 마스킹 강화), `manifest.json` (13 인 + chapters[1]), `_series.md` (단역 2 표), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 사용자 *물어보지 말고 자동진행* 명시 후 큰 작업. 페이즈 1 본격 진입 (ep-02 = 두 번째 챕터). 작가 원칙 SSOT (writing-principles.md) 정합 = 기승전결 4 단 + 묘사 자세히 + 모든 등장 인물 정의 의무 (mob-pool 5 추가 + 박찬호 단독). 3-antagonist 골격은 *페이즈 2 진입 전 미리 준비* 의도 — reader 빌드에서 스킵하여 스포 보호. *commit/push 금지* 사용자 명시 = 본 사이클 모든 산출물 working copy 만 유지. 다음 사이클 후보: (1) ep-03 *첫 작전, 첫 마수, 첫 동료의 마지막* (전투씬 본격 첫 등장 — 작가 원칙 *전투씬 특히 자세히* 첫 적용 시점) (2) ep-02 PROMPT.md 썸네일 추가 (3) 박찬호 등 첫 작전 부대원 단독 카드 신규. 변경 이력 hot 7행 / 한도 20 — 여유 13 |
| 2026-05-13 | **ep-01 시놉시스적 압축 폐기 + 페이즈 1 분할 + 마수 없는 지구 프롤로그 + 등장 인물 디렉토리 4 구조 + 작가 원칙 SSOT 신설** — 사용자 진단: 현 ep-01 (313 행, 13 사건 압축) = *시놉시스처럼 보임*. 작가 결정 누적: (1) **페이즈 1 = 10+ 화 분할** (한 챕터 한 사건 깊이) (2) **첫 화 = 마수 없는 지구 프롤로그** (시나리오 B *운동장의 마지막 한 바퀴*, 17 세 우진혁 운동선수 vs 군문 결정 박자) (3) **모든 화 기승전결 4 단 구조 강제** (4) **묘사 자세히 + 전투씬 특히 자세히** (그림 없는 소설) (5) **등장 인물 = 미리 정의 X 그때그때 + 짧게라도 정의** (단독 카드 or _mob-pool 1~2 줄) (6) **여동생 이름 = 우아진 (禹娥珍)**. 산출: (a) 현 ep-01 → `timeline/phase-1-우진혁-시놉시스.md` 이동 (332 행, 작가 전용 시놉시스 깊이판) (b) 새 ep-01 *프롤로그 — 운동장의 마지막 한 바퀴* (223 행 / 2320 단어 / 118 단락, 기승전결 4 단 = 起 운동장 입장 / 承 한 바퀴 + 4 회상 (부모·운동선수 꿈·매달 송금·위험수당 통계) / 轉 스카웃 담당 결정 박자 / 結 출구·지원서·문자) (c) `timeline/phase-1-overview.md` 신규 (페이즈 1 ep-01 ~ ep-11+ 분할 골격 + 챕터별 사건·기승전결·등장 인물 매트릭스 + 작가 토벌 떡밥 매설 가이드) (d) `worldbuilding/writing-principles.md` 신규 (작가 원칙 SSOT 9 절 — 외부 IP ZERO·기승전결·묘사·전투씬·등장 인물 정의·시놉시스 보존·한 챕터 한 사건·char 호명·시간 표기·페이즈 골격) (e) **등장 인물 디렉토리 4 구조** = `1-protagonist / 2-major-supporting / 3-antagonist / 4-minor` (3-antagonist + 4-minor 신규) (f) `characters/README.md` 신규 (분류 가이드 = role 8 종 + arc_span 5 종 + 단독 카드 vs 공동 풀 기준) (g) `characters/4-minor/woo-a-jin.md` 신규 (우아진 카드 = `role: cameo` + `arc_span: cameo-recurring`) (h) `characters/4-minor/_mob-pool.md` 신규 + ep-01 등장 단역 3 추가 (코치·스카웃 담당·부모 회상) (i) `_series.md` 등장 인물 표 = 주연 11 + 단역 (우아진 1) (j) `manifest.json` characters 12 인 + chapters[0] 제목·날짜 갱신 (k) `thumbnails/PROMPT.md` ep-01 프롬프트 새 컷 (운동장 트랙 + 우아진 응원석 + 7 월 한낮) + 대안 컷 + 페이즈 1 향후 챕터 매트릭스 (l) **`.claude/CLAUDE.md` 원칙 #10 추가** = 작가 원칙 SSOT 참조 강제 (m) `scripts/copy-content.mjs` 마스킹 누수 수정 = `characters/README.md` + `characters/**/_*.md` reader 스킵 (작가 메타 파일 = 운영 디테일 미노출) (n) handoff/CURRENT.md 덮어쓰기. **검증**: typecheck 0 / build 532ms / reader 11 verbatim + 14 masked / dist 누수 0 (_mob-pool·README·timeline·worldbuilding 모두 스킵) | `content/series/clash-of-multiverses/{chapters/ep-01-prologue.md, timeline/{phase-1-우진혁-시놉시스.md, phase-1-overview.md}, worldbuilding/writing-principles.md, characters/{README.md, 3-antagonist/.gitkeep, 4-minor/{woo-a-jin.md, _mob-pool.md, .gitkeep}}, _series.md, manifest.json, thumbnails/PROMPT.md}`, `.claude/CLAUDE.md` (원칙 #10), `.claude/handoff/CURRENT.md` (덮어쓰기), `scripts/copy-content.mjs` (마스킹 규칙 2 추가) | 본 사이클 = *시놉시스적 압축 챕터* 작가 진단 직후 큰 구조 전환. 페이즈 1 분할 + 작가 원칙 SSOT + 등장 인물 디렉토리 + 마스킹 강화. *commit/push 금지* 사용자 명시 = 본 사이클 모든 산출물 working copy 만, 사용자 직접 commit 대기. 다음 사이클 후보: (1) ep-02 *군 모집소* 작성 (phase-1-overview.md ep-02 계획 기반) (2) 페이즈 2 빌런 단독 카드 (3-antagonist/ 작가·편집자) (3) 변경 이력 archive 압축 (현 hot 6 행 / 한도 20 — 여유 14, 임박 X). 변경 이력 hot 6행 / 한도 20 — 여유 14 |
| 2026-05-12 | **11 인 자작 카드 본문 1차 패스 + manifest 등재 + 이미지 압축 + 2 분리 commit** — H-eries-orchestrator skill 호출 → general-purpose subagent (model: opus) 통해 lorekeeper agent 정의 inline 위임 (Agent subagent_type 'H-eries-lorekeeper' 미등록으로 우회). 본 사이클 산출: (1) **11 카드 신규** = `content/series/clash-of-multiverses/characters/1-protagonist/hyeon-woo-jin.md` + `2-major-supporting/{eira, yamura-tou, seo-un-hyeok, ryeong-geuk, go-cheon-han, yu-baek-gyeong, bi-hyeon, rim-woo-gyeong, hyeon-woo, baek-mu-jin}.md`. (2) **manifest.json** characters 배열 11 인 등재 (status: 재구축 중 유지). (3) **이미지 압축** = `content/_shared/{H-eries-mark, thumbnail-placeholder}.webp` 4302 → 295 KB (-93%), 빌드 게이트 500 KB/이미지 통과. (4) **2 분리 commit** = `dd7f170` chore(images) 이미지 + `09c35bb` feat(characters) 11 카드 + manifest. **검증**: (a) 카드 평균 53 줄 (50~67 범위, 백무진 67 = 모방 가능/불가 분리 표) (b) 외부 IP grep 점검 6 항목 모두 0 매칭 (그림자 군주·차크라·매화검법·수라혈천도·접촉 발동·모노마 등) (c) 모든 카드 `origin: original` + 저작권 고지 1줄 + 공개 절·작가 분기 절 분리 + heries_arc 마스킹 필드 (d) 핵심 정정 일관 = 백무진 *기예 모사* (능력 자체 X, 기술만 O) / 림우경 한국 외형 + 조상 혈통 작가 분기 마스킹 / 에이라 비-한국 여성 / 인간형 외형 필수. **typecheck/build 실패** = 본 사이클 무관 환경 이슈 (node_modules/vite 미설치 + `npm run typecheck` 의 `tsc -b --noEmit` 충돌 TS5094) — frontend-engineer 별도 사이클 처리 권장 | `content/series/clash-of-multiverses/characters/{1-protagonist,2-major-supporting}/*.md` (11 신규), `content/series/clash-of-multiverses/manifest.json` (11 인), `content/_shared/{H-eries-mark,thumbnail-placeholder}.webp` (압축) | 본 사이클 = 작품 컨셉 전면 개편 (2026-05-12) 후 *첫 카드 본문 작성 사이클*. lorekeeper 위임 패턴 = orchestrator skill 라우팅 + general-purpose subagent inline lorekeeper 정의 (Agent type 미등록 우회) 검증 완료 — 다음 사이클부터 동일 패턴 적용. 다음 사이클 후보 = (a) worldsmith 진영 SSOT 11 본문 작성 + `_series.md` 10 → 11 인 동기화 (b) 추가 결정 4 항목 (진영 간 관계 그리드 / 페이즈 2 작가 정체 단서 일관성 6 단서 수렴 여부 / 현우진-에이라 동맹 or 라이벌 / 백무진 *모든 기술 본 자* 떡밥 페이즈 2 발현 형식) (c) frontend-engineer 환경 복구 (`npm install` + typecheck 스크립트 정정) (d) ep-01~04 자작 변환 (legacy 본문에서 사건·구성·문체 보존, 등장인물·세계관 표현만 자작 치환). 변경 이력 hot 18행 / 한도 20 — 여유 2, 다음 사이클 후 임계 임박 보고 필요 |
| 2026-05-12 | **대규모 통합 사이클 — orphan squash (history 초기화) + SPA 전환 + NOTICE 페이지 + 옵션 C 11 카드 fix + 라이선스 All Rights Reserved 통일 + ZERO 정책 표현 통일** — 사용자 결정 5건: (1) *원격 GitHub commit 기록 다 초기화 (병렬)* (2) *SPA 로 진행* (3) *코드도 저작권 가장 강한 것* (4) *NOTICE 따로 페이지 + 전체 프론트엔드 개선* (5) 옵션 C (11 카드 렌더링 차단 fix). 단일 메가 사이클 산출: (a) **git history rewrite** = orphan branch + root commit `e394480` + force push origin main. 이전 39 commit (e00ba18 부터, *non-commercial cross-fanfic·sungjinwoo·14-original list·spoiler masking* 등 차용 컨셉 흔적 다수) → root 1 commit squash. GitHub reachable history 차용 흔적 0. dangling commit 은 자동 gc 대기 (수 주~수 개월) — 사용자 결정 *repo 재생성 안 함*. (b) **SPA 전환** (`b68a233`) = HashRouter → BrowserRouter + basename `import.meta.env.BASE_URL.replace(/\/$/, '')` + vite.config base 분기 (production `/H-eries/` / dev `/`) + publicDir 활성화 + public/404.html 신규 (spa-github-pages redirect) + index.html replaceState 복원 inline script + meta description 갱신. (c) **NOTICE 페이지** = `src/pages/notice/{notice.tsx,index.ts}` 신규 + `<Route path="/notice">` 등록 + footer NOTICE 외부 GitHub URL → 내부 `<Link to="/notice">` 전환 (2곳) + `content/notice.md` dev 미러 + `scripts/copy-content.mjs` 가 build 시 루트 NOTICE.md → dist/content/notice.md 자동 복사 (SSOT = 루트 NOTICE.md). (d) **환경 복구** = `npm install` 73 packages 0 vulnerabilities + `package.json` typecheck `tsc -b --noEmit` → `tsc --noEmit` (TS5094 충돌 제거). (e) **footer `.site-footer .meta` CSS 정의 8행 제거**. (f) **옵션 C 11 카드 fix** (`1e3aa79`) = manifest.json characters `string[]` → `CharacterIndex[]` 객체 배열 (11 인 `{id, folder, name}`) + types.ts CharacterFolder union 에 `'1-protagonist'` 추가 (legacy `'1-main-character'` 보존) + manifest.ts `normalizeSeriesManifest` + `normalizeCharacters` 헬퍼 (string[] 레거시도 graceful) + character.tsx FOLDER_LABEL `'1-protagonist': '주인공'` + character-list.tsx GROUP_ORDER 선두 추가. (g) **라이선스 통일** (`736d12e`) = LICENSE MIT scope 폐기 → 전체 단일 All Rights Reserved + NOTICE §코드 라이선스 (구분)·§이력 절 제거 + README §저작권 *코드 MIT 별도* 제거. (h) **표현 통일** (`b73ff5c`) = *외부 IP 차용 0* → *외부 IP 차용 ZERO 정책* (NOTICE/content/notice/CLAUDE.md/CURRENT.md/footer disclaimer/state.md 일관) + README HashRouter 잔존 3 곳 → BrowserRouter + content/about.md FAQ heading 형식 (`**Q.**` → `### Q.` 사용자 직접). (i) **scripts/copy-content.mjs (`0b2adf4`)** = 미사용 `stat` import 제거 (NOOP cleanup). **commit** = root `e394480` + 6 commit (`b68a233` SPA + `07756b0` footer 링크 + `9cfe194` NOTICE 표현 + `1e3aa79` 옵션 C + `0b2adf4` stat 정리 + `b73ff5c` 문서 표현 통일) + 사전 3 commit (`736d12e` 라이선스 + `4b04113` footer meta + `6c3d3bf` 핸드오프 — orphan squash 전, root commit 에 흡수). **검증**: typecheck 0 / build 1.11s 0 에러 / 11 카드 dist 정상 + loadCharacter find 11/11 매칭 / 마스킹 누수 0 (H-eries 분기 0건, heries_arc 0건) / FSD 위반 0 / SPA 라우팅 흐름 GitHub Pages 호환 (404.html → ?/path → replaceState → React Router 매칭) | **메가 사이클** = root `e394480` 99 files + 6 후속 commit. 주요 = LICENSE / NOTICE.md / README.md / content/notice.md / content/about.md / .claude/CLAUDE.md / .claude/handoff/CURRENT.md / .claude/harness/harness-state.md / content/series/clash-of-multiverses/manifest.json / src/app/main.tsx / src/pages/notice/{notice.tsx,index.ts} / src/widgets/footer/footer.tsx / src/shared/lib/{types,manifest}.ts / src/pages/character/character.tsx / src/widgets/character-list/character-list.tsx / src/shared/styles/style.css / scripts/copy-content.mjs / vite.config.ts / index.html / public/404.html / package.json | 본 사이클 = H-eries 최대 통합 사이클. *원격 history 초기화* 가장 destructive (사용자 명시 권한). agent 위임 패턴 추가 검증 = (1) lorekeeper (옵션 C 콘텐츠) + frontend (옵션 C 코드) 병렬 분리 충돌 0 (2) agent 미커밋 stash + orphan checkout + stash pop (3) Agent type 미등록 → general-purpose + agent 정의 inline 우회 안정. **잔여 결정** = (a) GitHub UI repo 재생성 보류 (자동 gc 대기) (b) 11 카드 추가 SSOT 4 항목 (진영 간 관계 / 페이즈 2 작가 정체 6 단서 / 현우진-에이라 / 백무진 떡밥 발현) 보류. **다음 사이클 후보** = (1) worldsmith 진영 SSOT 11 본문 + _series.md 10 → 11 인 동기화 (2) build:author base 분기 (`--base=/`) (3) ep-01~04 자작 변환. 변경 이력 hot **19행 / 한도 20 — 여유 1**. **다음 사이클 시작 직후 압축 임계 도달 (20행) — archive 압축 발동 의무** |
| 2026-05-12 | **메가 사이클 후속 마무리 — 이미지 재압축 + favicon 교체 + 세레나 재등록 + ErrorBoundary + build:author base 분기 + 프론트 정리** — 사용자 명시 5건: (1) *이미지 압축* (2) *favicon = H-eries-mark 로 설정 / 기존 차원의 격돌 이미지 어디?* (3) *세레나 연동* (4) *전체 프론트엔드 검토 + 에러 바운더리* (5) *알아서 커밋·푸시*. 단일 후속 마무리 사이클: (a) **이미지 재압축** (`f9fbcf2`) = _shared 2장 = H-eries-mark 2248 → 91 KB (-96%, 사용자 신규 이미지) + thumbnail-placeholder 230 → 220 KB (-5%) = 합 2478 → 311 KB (-87%). (b) **favicon 교체** (`914cba8`) = `src/shared/img/favicon.webp` 를 H-eries-mark.webp (보라색 h 마크 + 다중우주 모티프) 로 덮어쓰기. (c) **세레나 MCP 재등록** = `claude mcp add serena-H-eries` 경로 `/Users/hongyeongjune/IdeaProjects/H-eries` (이전 stale 경로 `/Users/홍도산/onion-workspace/H-eries` 폐기, 시스템 username 정정). 검증 `serena-H-eries: ✓ Connected`. 첫 LSP 인덱싱 5~15분 백그라운드 → 다음 세션부터 도구 가용. (d) **ErrorBoundary 전역 도입** (`1f351d8`) = `src/shared/ui/error-boundary/{error-boundary.tsx, index.ts}` 신규 (React 19 Class Component 직접 구현, 의존성 0 정책 = react-error-boundary 미사용). `src/app/main.tsx` 의 `<BrowserRouter>` 내부 `<Header>` 와 `<Routes>` 사이 전역 wrap (옵션 A). fallback 분기 = dev (`import.meta.env.DEV`) → error.message + stack + component stack `<details open>` / production → "문제가 발생했습니다" + 사용자 친화. 둘 다 console.error. 「홈으로」 = `window.location.assign(import.meta.env.BASE_URL)` (basename 정합). CSS `.error-boundary` 절 신규. (e) **build:author base 분기** (`6d7bcd9`) = `vite.config.ts` 에 `VITE_AUTHOR_MODE` env 분기 = reader build production `/H-eries/` / author build `/` / dev `/`. dist-author/index.html asset 경로 `/assets/...` (no /H-eries) → `npx serve dist-author` 즉시 동작. dist (reader) 는 `/H-eries/assets/...` 유지. agent 2 이전 부차 발견 해소. (f) **프론트엔드 정리** (`6c7c4db`) = `pages/chapter/chapter.tsx:2` import 명시 (`'../../entities/chapter' → '../../entities/chapter/index.js'`, FSD 일관성) + `widgets/header/header.tsx` theme-toggle aria-label + title 추가 (a11y, accessible name 누락 정정) + `style.css` stale class 4 영역 삭제 (`.theme-toggle-text` × 2 / `.header-contact-arrow` × 2 / `.character-rights-notice` × 2 / `.sr-only`) + undefined var 정정 (`--bg-2` → `--bg-soft` / `--rule-soft` → `--rule` / `--shadow-1` fallback → `--shadow`). **검증**: typecheck 0 / reader build 0 에러 + 마스킹 누수 0 (9 verbatim, 12 masked) / author build 0 에러 (24 verbatim, 0 masked) / check-images OK / FSD 위반 0 / 마크다운 렌더러 11+ 케이스 통과. **legacy 차원의 격돌 이미지 복구 불가** = dangling commit·blob 어디에도 cover.webp / ep-01~04 thumbnails 없음 (직전 main `6c3d3bf` tree 도 빈 상태 = orphan squash 이전부터 이미 제거). 복구 가능 자산 = unreachable PNG 1개 (`be9b36f` 1254×1254 RGBA 2.3 MB) — 사용자 결정 보류. 백업 경로 `/Users/홍도산/onion-workspace/H-eries-archive/` 도 stale (시스템 username `hongyeongjune` vs 작가명 `홍도산` 혼동의 결과 추정). **commit** = 5 분리 (f9fbcf2 이미지 재압축 + 914cba8 favicon + 1f351d8 ErrorBoundary + 6d7bcd9 base 분기 + 6c7c4db 프론트 정리) | `src/shared/ui/error-boundary/{error-boundary.tsx,index.ts}` (신규), `src/app/main.tsx` (ErrorBoundary wrap), `vite.config.ts` (VITE_AUTHOR_MODE base 분기), `src/widgets/header/header.tsx` (a11y), `src/pages/chapter/chapter.tsx` (FSD), `src/shared/styles/style.css` (stale class + undefined var + .error-boundary), `src/shared/img/favicon.webp` (H-eries-mark 교체), `content/_shared/{H-eries-mark,thumbnail-placeholder}.webp` (재압축), `~/.claude.json` (serena-H-eries 등록), `.claude/handoff/CURRENT.md` (덮어쓰기), `.claude/harness/harness-state.md` (본 행) | 본 사이클 = 메가 사이클 (직전 통합) 후속 마무리. **agent 위임 패턴 4회 검증** = lorekeeper × 2 + frontend-engineer × 4 모두 general-purpose inline 우회로 안정. ErrorBoundary 는 사이트 전역 에러 격리 첫 도입 — 향후 페이지별 wrap 추가 시 더 세밀한 격리. build:author base 분기로 *작가 로컬 검수 워크플로우* 가 npx serve / file:// 등 다양한 환경 호환. **legacy 이미지 복구 불가 = 작품 컨셉 전환 사이클의 누락** — 다음 사이클부터 *백업 경로 점검 strict + 정책 SSOT 유지* 필요. **다음 사이클 후보** = (1) 변경 이력 archive 압축 (hot 20 도달 = 필수 발동) (2) worldsmith 진영 SSOT 11 본문 + `_series.md` 10 → 11 인 동기화 (3) ep-01~04 자작 변환 (4) frontend 부차 발견 항목 (useAsync AbortController·ChapterPage 분해·페이지별 ErrorBoundary·외부 링크 rel) (5) legacy dangling PNG `be9b36f` 복구 결정 (6) 천기망 Serena MCP (별도 프로젝트, 절대 경로 미회신). 변경 이력 hot **20행 / 한도 20 — 도달**. **다음 사이클 시작 직후 archive 압축 발동 의무** |
| 2026-05-12 | **11차 archive 압축 + UX 장애 5종 fix + 레거시 18 ref 보존 + 4 차 이름 일괄 + 5 카드 컨셉 보강 + IntelliJ 19/30** — 사용자 명시 다건: (1) *archive 압축* (2) *UX 장애 해결* (3) *레거시 복구 + gitignore* (4) *등장인물 안 보임 / 차원의 격돌 페이지 버그 해결* (5) *현우진 → 현진혁 → 현우혁 → 우진혁 + 서운혁 → 서운룡 + 령극 → 천령극 + 비현 → 막무련* 4 차 이름 일괄 (6) *유백경 + 백무진 + 우진혁 + 서운룡 + 막무련* 5 카드 컨셉 전면 보강 (7) *IntelliJ 권장 경고 모두 해결* (8) *자율 권한 위임 — 알아서 커밋·푸시*. 메가 사이클 산출: (a) **archive 압축** = hot 20행 → 3 kept + 본 메타 = 4 → 5 행. archive 17 bullets 누적 (`harness-state-archive.md` 80행). (b) **레거시 복구 + gitignore 보장** = `content/_legacy_recovery_2026-05-12/` 신규 (`_legacy_*` gitignore, 98 파일 / 8.0 MB / git status clean). 회수 = 15 legacy 카드 (sungjinwoo·naruto·luffy 등 from `d371fd74`) + legacy `_series.md` + 14 사이클별 핸드오프 + raw-bundle (`legacy-all.bundle` 6.8 MB, `git bundle --all`, refs/recovered/* 18개 unreachable→reachable 승격). 회수 불가 = ep-01~04 본문 / 22-card 완성본 (어떤 tree 에도 staged 안 됨). 레거시 시놉시스 구조 파악 = 페이즈 1 (1막 3 추락 / 2막 5 추락 / 3막 단독 주인공 군단 호출 + 임시 휴전 협공 cliffhanger). 본문 카피 X. (c) **UX 장애 5종 fix**: 1) `src/pages/home/home.tsx` HERO_ALT + eyebrow + h1 → 크로스오버 팬픽 폐기 → MULTIVERSE · ORIGINAL · WEB SERIES + *오리지널 다중/평행 세계 시리즈* (외부 IP ZERO 직접 위반 해소). 2) `src/widgets/header/header.tsx` `.meta` + aria-label + stale 주석 정정. 3) `_series.md` 등장인물 표 10인 tba → 11인 실제 카드 + 원형 매핑 + status `자작 매핑 완료 — 챕터 집필 대기`. 4) `manifest.json` + `series.json` status 일관성. 5) **★ 핵심 — BrowserRouter 상대경로 fetch 실패** = `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`. 원인 = `./content/...` 상대경로가 SPA route 기준으로 resolve. 수정 = `src/shared/lib/env.ts` 에 **`assetUrl(rel)` 헬퍼** 신규 (BASE_URL prefix + `^\.?\/` 정리), 13 호출처 일괄. dev 8 endpoint 200 OK. (d) **Notice 외부 URL 정정** = `github.com/홍도산/H-eries` (한글화 부작용) → `github.com/hongdosan/heries` (실제 repo) + about.md 의 NOTICE 외부 GitHub → 내부 `./notice` 라우트. (e) **4 차 이름 일괄** = 현우진 (玄祐眞) → 현진혁 (玄鎭赫) → 현우혁 (玄祐赫) → **우진혁 (禹鎭赫)** [woo-jin-hyeok] / 서운혁 (徐雲赫) → **서운룡 (徐雲龍)** [seo-un-ryong] / 령극 (靈極) → **천령극 (天靈極)** [cheon-ryeong-geuk] / 비현 (鼻玄) → **막무련 (莫武連)** [mak-mu-ryeon]. 파일 rename + slug + name + 한자 + manifest + _series.md row + 9 카드 인간관계 표현 모두 일관 정정. hyeon-woo 모티프 = *현 성씨 우연* → *우 글자 공유 우연* 강화. (f) **5 카드 컨셉 전면 보강**: 우진혁 (가족 약값·단검 폐기 → 부모 부재 + 똑똑한 여동생 + UDT 군문 + 격투칼 + 명부 호흡 무한 재생 + *마음에서 우러나는 군주적 충성* 회로 + 카피 임계 안배) / 유백경 (청람검문 → **종남파** + **천하일대검수** + 정·중·후 묵직 단일 + **천하삼십육검 (天下三十六劍) — 천하 삼십육 방 어디에서 들어오는 공격도 막지 못할 방위가 없다**) / 백무진 (무명자 → 평범한 학생 + *눈이 좋은 편* 자기 인식 + **카피 임계 — 신체 자체 최적화 변형** + **다중우주 분기 떡밥** *모든 세계관 신체 능력 카피하는 상위 분기 백무진*) / 서운룡 (전면 재작성: 혈교 역대 혈마 + 비사실적 외모 + 환술·사기·피 + 혈교 무공 배운 자 전율·무릎 회로 + ★ **신체 강탈 강림 안배** 페이즈 2~3 떡밥) / 막무련 (전면 재작성: 녹림 역대 녹림왕 + 외공의 극 + **만수파천권 (萬獸破天拳)** 만 마리 짐승 권법 + 자연 가호 동물 회로 + *곰의 가죽 여우의 결* 호탕 + 영리). (g) **IntelliJ 권장 경고 19/30 해결** = import shorten 16 (`/index.js` → 디렉토리, main/series/chapter/character/home/chapter-character-strip) + regex redundant escape 3 (markdown.ts `\]` `\}`) + scripts process import 3 (check-images/copy-content/optimize-images) + var → const 3 (index.html L22, 404.html L17·18) + package.json `name` 표준 (`H-eries` → `heries` 소문자 npm 규약) + `homepage` URL 정정 (한글 → hongdosan/heries) + vite.config base (`/H-eries/` → `/heries/`). index.html `Cannot resolve 'src'` 11건은 Vite dev/build 동적 경로 IDE false positive (코드 차원 해결 불가능, `.idea/` source root 영역). | `.claude/harness/harness-state.md` (본 행, 17행 archive 이동), `.claude/harness/harness-state-archive.md` (17 bullets append), `content/_legacy_recovery_2026-05-12/**` (gitignored 98 파일 / 8 MB), `src/shared/lib/env.ts` (assetUrl 헬퍼), `src/shared/lib/{manifest,use-img-fallback}.ts` (assetUrl 적용), `src/pages/{home,series,chapter,about,notice}/*.tsx` (assetUrl 적용), `src/widgets/{chapter-toc,series-list}/*.tsx` (assetUrl 적용), `src/widgets/header/header.tsx` (UX), `content/series/clash-of-multiverses/_series.md` (11인 표), `content/series/clash-of-multiverses/manifest.json` (status), `content/series.json` (status) | 본 사이클 = (1) 정책 의무 (archive 압축 hot 20 도달) + (2) 사용자 직접 버그 보고 4건 동시 해결. **★ BrowserRouter 상대경로 버그** = 메가 통합 사이클 (HashRouter → BrowserRouter, `b68a233`) 의 *부작용 잔존* — 당시 SPA redirect 와 basename 만 다뤘으나 fetch 상대경로는 누락. 본 사이클이 *5월 12일 메가 사이클 후속 결산*. **다음 사이클 후보** = (1) worldsmith 진영 SSOT 11 본문 (`worldbuilding/factions/*.md`) (2) ep-01~04 자작 변환 (author → continuity-reviewer 파이프라인) (3) frontend 부차 발견 (useAsync AbortController / ChapterPage 분해 / 페이지별 ErrorBoundary / 외부 링크 rel) (4) 추가 SSOT 4 항목 (진영 그리드 / 페이즈 2 작가 정체 6 단서 / 현우진-에이라 / 백무진 떡밥). 변경 이력 hot **4행 / 한도 20** (3 kept + 1 meta = 4). 다음 압축 임계 = 21행 (16 사이클 후 발동). |

| 2026-05-13 | **ep-01 본문화 + 명부 시스템 SSOT 확정 + 다수 가독성·톤 사이클** — 사용자 자율 권한 위임 + 단일 세션 12+ commit 누적. (1) ★ **ep-01 *프롤로그 — 죽음을 거두는 자*** 본문화 (11 절, 우진혁 단독 주인공 서사). 레거시 시놉시스 구조 참조 (본문 카피 0). 다수 사용자 피드백 일괄 반영: 헤더 번호·인물명 제거 / 호흡 단어 빈도 감소 (들숨·한순간·움직임 분산) / 박스 인용구 → 따옴표 / em dash 풀이 → abbr `{term|description}` 호버 / 메타 안내 문장 제거 / 군 vs 던전 모순 해소 (헌터 차원 군문 = 마수 토벌 헌터 특수부대) / 시점 omniscient 누설 제거 / 각성 처절함 강화 (좌절·분노·슬픔 삼킨 무언가) / 운영 용어 *시그니처* 제거 (서사 톤 정제). (2) ★ **명부 시스템 SSOT 확정** (woo-jin-hyeok.md §능력): 영혼 추출 시그니처 `"내게 오라."` (손바닥+한 호흡+한 줄, 무방비) + 호출 명령 `"강림하라."` (접촉 불필요, 마나 자릿수 비례) + **6 단계 자작 위계** 명단 → 명사 → 명관 → 명존 (이름 부여) → 명조 (페이지 받음) → 명장 (군단장 최대 3). 초기 자리 = 생전 강함 대체로 결정. **영혼 능력 = 생전 70% + 누적 랭크업** (싸울수록 생전보다 강해질 수 있음). **인격 = 랭크 비례** (명단·명사 거의 없음, 명관부터 본격 발현). **호칭 다양성** = 강제 X — 우진혁 형 / 주군 / 주(主) / 우진혁 님 / 형님 등 각자 결로. **CQC + 격투칼** = 군 *세 번 흘려 한 번에 가른다* 한 호흡 극 + 갈라진 자리 손바닥 → 1회 등록. **레벨업 자유도** = 4 능력치 자유 분배 (초반 신체 → 깨달음 후 마나). (3) **카드 톤 정합** = 서운룡 *완전한 한량* (술잔 상시, 어깨 흘러내린 외포, 작년 끝낸 강림 안배는 별 흥미 없는 일과) / 림우경 *찰나의 결의 부산물로서의 회귀자 자각* (결 닫히면 평범한 한국인) / 우진혁 CQC 극 + 격투칼 + 마나 자유 분배. (4) **features/character-mention 슬라이스** = `{{char:id|name}}` 마크다운 syntax + `<span class="character-mention">` 호버 lazy fetch summary + localStorage 캐싱. 클릭 X (맥락 정보 전용). ChapterCharacterStrip 제거. 본문 내 캐릭터 mention *유일 공식 표현*. (5) **시리즈 cover.webp + ep-01-prologue.webp** = 작가 생성·압축 (233 KB / 85 KB, -94%/-97%) + manifest 등록. PROMPT.md 재작성 (1화 *마수 앞 손이 얹힌 순간* 컷). (6) **UX 추가** = 작가 모드 시각 마킹 톤 다운 (배경색 X, AUTHOR 배지만) / 시리즈 작가 전용 탭 / 챕터 정렬 localStorage 캐싱 / scroll-nav 본문 옆 위치 / 작품 카드 placeholder fallback / scripts/check-masking.mjs 자동 게이트. (7) **시그니처 단어 진화** = "오라" → "내게 오라" (등록) + "강림하라" (호출). 외부 IP 식별 표현 *깨어나라·일어나라* 모두 회피. **검증**: typecheck 0 / reader build 0 (✓ masking OK, 13 masked, 10 verbatim) / 외부 IP 0 / FSD 0 / 본문 운영 용어 0. | `content/series/clash-of-multiverses/chapters/ep-01-prologue.md` (★ 11 절 본문), `content/series/clash-of-multiverses/characters/1-protagonist/woo-jin-hyeok.md` (★ 명부 SSOT), `content/series/clash-of-multiverses/characters/2-major-supporting/{seo-un-ryong, rim-woo-gyeong}.md` (한량·찰나 부산물), `content/series/clash-of-multiverses/thumbnails/{cover.webp, ep-01-prologue.webp, PROMPT.md}`, `content/series/clash-of-multiverses/manifest.json` (chapter 1 + cover thumbnail), `content/series.json` (cover), `src/features/character-mention/*` (신규 슬라이스), `src/shared/lib/markdown.ts` ({{char}} syntax), `src/pages/{chapter,series}/*.tsx`, `src/widgets/chapter-toc/chapter-toc.tsx` (localStorage 캐싱), `src/shared/styles/style.css` (.character-mention + author-only 톤 다운 + author-tab + scroll-nav 위치), `src/widgets/series-list/series-list.tsx` (placeholder fallback), `scripts/check-masking.mjs` (신규 게이트), `vite.config.ts` (outDir 분기), `.claude/handoff/CURRENT.md` (덮어쓰기) | 본 사이클 = 단일 세션 megacycle. *작품 본문 첫 발행* + 명부 시스템 SSOT 확정. 다음 사이클 = ep-02 *1막 첫 격돌* (호출 "강림하라" 본격 등장) + worldsmith 진영 11 SSOT. 변경 이력 hot **5행 / 한도 20** (여유 15). |

> 다음 진화 트리거: `agent-lorekeeper` 시범 생성 후 §에이전트 인벤토리·구성 요소 표 갱신.

## 참고

- 도입 가이드: [harness-setup.md](harness-setup.md)
- 설치·적용: [harness-install.md](harness-install.md)
- harness 저장소: https://github.com/revfactory/harness
- harness SKILL.md: https://github.com/revfactory/harness/blob/main/skills/harness/SKILL.md
