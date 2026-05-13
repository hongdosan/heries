<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# heries — 현재 핸드오프 (단일 파일)

> 본 파일이 **유일한 핸드오프 파일**. 세션 종료 직전 / 컨텍스트 60% 초과 시 본 파일을 *덮어쓴다*. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md`.

**Last updated**: 2026-05-13

## Summary

**ep-01 재작성 + 페이즈 1 분할 골격 + 등장 인물 디렉토리 4 구조 + 작가 원칙 SSOT 신설**. 본 사이클 큰 작가 결정 통합:

1. **현 ep-01 시놉시스적 압축 진단** → 페이즈 1 = 6~10 화 분할 + 한 챕터 한 사건 깊이로 전환
2. **새 ep-01 = *운동장의 마지막 한 바퀴*** = *마수 없는 지구* 의 17 세 우진혁. 운동선수 vs 군문 결정 박자. 우아진 첫 등장. 기승전결 4 단 구조 + 자세한 묘사 (206 행 / 2320 단어 / 118 단락)
3. **현 ep-01 → `timeline/phase-1-우진혁-시놉시스.md`** = 작가 전용 시놉시스 깊이판 (332 행, 페이즈 1 전 흐름 압축 보존)
4. **`timeline/phase-1-overview.md` 신규** = ep-01 ~ ep-11+ 분할 골격 + 챕터별 사건·기승전결·등장 인물 매트릭스
5. **등장 인물 디렉토리 4 구조** = `1-protagonist / 2-major-supporting / 3-antagonist / 4-minor`. `characters/README.md` = 분류 가이드 (role 8 종 + arc_span 5 종 + 단독 카드 vs 공동 풀)
6. **우아진 (禹娥珍) 카드 신규** = 우진혁 여동생, `role: cameo` + `arc_span: cameo-recurring`
7. **`4-minor/_mob-pool.md` 신규** = 이름 없는 단역 1~2 줄 누적. ep-01 등장 = 코치 / 스카웃 담당 / 부모 회상
8. **`worldbuilding/writing-principles.md` 신규** = 작가 원칙 SSOT (외부 IP ZERO + 기승전결 + 자세한 묘사 + **전투씬 특히 자세히** + 등장 인물 정의 의무 + 한 챕터 한 사건 + char 호명 + 시간 표기 + 페이즈 골격)
9. **CLAUDE.md 원칙 #10 추가** = 작가 원칙 SSOT 참조 강제

## Key Decisions (현행)

- **작품 정체성** = 작가 `홍도산` 의 100% 오리지널 다세계관 배틀로얄·다크 판타지. 차원의 격돌 슬러그·다중우주 전제 유지.
- **저작권** = © 2026 홍도산. All rights reserved. 외부 IP 차용 ZERO.
- **시놉시스 3 페이즈 골격** = 페이즈 1 *주인공 봉인* / 페이즈 2 *작가 토벌* / 페이즈 3 *가디언화*.
- **페이즈 1 분할** = 10+ 챕터. ep-01 (마수 없는 지구) → ep-02 (군 모집소) → ep-03 (첫 작전) → ep-04 (죽음의 반복) → ep-05 (각성) → ep-06 (분류 불가) → ep-07 (군단주) → ep-08 (다른 세계 단면) → ep-09 (원형의 무대) → ep-10 (1 막 첫 추락) → 페이즈 1 말 (봉인).
- **작가 원칙** = (a) 기승전결 4 단 강제 (b) 묘사 자세히 (c) 전투씬 *특히* 자세히 (d) 모든 등장 인물 정의 의무 (e) 한 챕터 한 사건 (f) 외부 IP ZERO.
- **등장 인물 카드** = 단독 카드 (이름 있는 인물) + 공동 풀 (이름 없는 단역). 미정의 인물 등장 시 챕터 reject.

## Traps to Avoid

- **시놉시스 압축 챕터 금지** — 현 ep-01 (운동장 한 바퀴) 같이 한 사건 깊이 필수. 여러 사건 압축 = reject (예전 ep-01 = 13 사건 1 챕터 = 시놉시스적 압축으로 폐기됨)
- **전투씬 짧게 처리 금지** — 한 합 분해 + 호흡 단위 + 공간 좌표 + 부상·결과 명시
- **외부 IP 식별 표현 금지** — 캐릭터 이름·고유 기술·진영명 등이 *기존 작품* 과 직접 연상되면 reject
- **frontmatter `origin` = 모든 카드 `original` 강제**
- **mob-pool 누락 금지** — 챕터 등장 단역 = 반드시 `_mob-pool.md` 1~2 줄 추가
- **`{{char:slug|이름}}` 첫 등장 호명 강제** — 단독 카드 인물 한정. mob 은 호명 X
- **timeline / worldbuilding / glossary 디렉토리 = reader 빌드 스킵** — 작가 전용 영역

## Working Agreements

- main 브랜치 only / 사용자 직접 commit / Claude 자동 commit X / push 항상 사용자 직접
- 본 사이클 *commit/push 금지* 명시 — 개선/개발만 계속
- 작가 표기: 홍도산 (모든 영역)
- 모든 .md 첫 줄 (frontmatter 직후) = `<!-- © 2026 홍도산. All rights reserved. Original creator work. -->`
- 누적 산출물 정책 v3: 변경 이력 hot 20행 / 핸드오프 단일 파일

## Relevant Files

- `content/series/clash-of-multiverses/chapters/ep-01-prologue.md` — *운동장의 마지막 한 바퀴* (206 행 / 2320 단어, 기승전결 4 단)
- `content/series/clash-of-multiverses/timeline/phase-1-우진혁-시놉시스.md` — 페이즈 1 시놉시스 깊이판 (332 행, 작가 전용)
- `content/series/clash-of-multiverses/timeline/phase-1-overview.md` — 페이즈 1 챕터 분할 계획 (ep-01 ~ ep-11+, 신규)
- `content/series/clash-of-multiverses/worldbuilding/writing-principles.md` — 작가 원칙 SSOT (신규)
- `content/series/clash-of-multiverses/characters/README.md` — 분류 가이드 (신규)
- `content/series/clash-of-multiverses/characters/4-minor/woo-a-jin.md` — 우아진 카드 (신규)
- `content/series/clash-of-multiverses/characters/4-minor/_mob-pool.md` — 단역 풀 (신규)
- `content/series/clash-of-multiverses/characters/3-antagonist/` — 작가·편집자 카드 자리 (페이즈 2 진입 시 작성)
- `content/series/clash-of-multiverses/_series.md` — 등장 인물 표 12 인 (11 주연 + 1 카메오)
- `content/series/clash-of-multiverses/manifest.json` — chapters[] 갱신 + characters[] 12 인
- `.claude/CLAUDE.md` — 원칙 #10 작가 원칙 SSOT 참조

## Open Work

### 즉시 진행 가능 (commit/push 금지 상태)
- **ep-01 묘사 보강** — 현 206 행 / 2320 단어. 분량 충분하나 *轉 결정 박자* + *結 출구·지원서* 추가 보강 여지
- **mob-pool 형식 통일** — ep-01 외 다른 챕터 진행 시 누적
- **3-antagonist/ 디렉토리 골격** = 페이즈 2 진입 시 작가·편집자 카드 작성. 현재는 `.gitkeep` 만

### 챕터 작성 대기 (사용자 사이클)
- **ep-02 — 군 모집소** = 페이즈 1 두 번째 챕터. timeline/phase-1-overview.md ep-02 계획 참조
- 챕터 작성 시 = 새 등장 인물 단독 카드 + mob-pool 추가 + 시놉시스 깊이판 (phase-1-우진혁-시놉시스.md) 참조

### 본 사이클 미해소
- 본 사이클 = ep-01 완료 + 디렉토리 + 작가 원칙. 다음 사이클 = ep-02 진입 또는 ep-01 추가 보강

## Prompt for New Chat

```
heries (단일 작가 홍도산, 오리지널 다세계관 소설 정적 웹 시리즈) 작업을 이어간다.

1. .claude/handoff/CURRENT.md Read. 본 파일이 유일한 핸드오프.
2. content/series/clash-of-multiverses/worldbuilding/writing-principles.md = 작가 원칙 SSOT. 챕터 작성 전 반드시 Read.
3. content/series/clash-of-multiverses/timeline/phase-1-overview.md = 페이즈 1 챕터 분할 계획. 챕터 작성 진입점.
4. 챕터 작성 = 기승전결 4 단 + 자세한 묘사 + 전투씬 특히 자세히 + 모든 등장 인물 정의 의무.
5. 새 등장 인물 = 단독 카드 (이름 있음) 또는 4-minor/_mob-pool.md 1~2 줄 (이름 없음).
6. char 호명 = {{char:slug|이름}} 첫 등장 시.
7. 사이트 = npm run dev / dev:author / build. 빌드 검증 후 사용자에게 commit/push 요청.

CLAUDE.md / writing-principles.md / phase-1-overview.md / 11 카드 + 우아진 카드 모두 SSOT.
사용자가 명시 안 한 한 commit/push X.
```
