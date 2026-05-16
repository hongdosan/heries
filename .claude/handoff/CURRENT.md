<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# CURRENT 핸드오프 (2026-05-16, 헌터→각성자 일괄 + ep-04 시놉시스 골격 v2 합의 진행)

## 한 줄

어휘 SSOT *헌터* → *각성자* 일괄 통일 (5 파일 / 37+ 곳) + ep-04 시놉시스 골격 v2 사용자 피드백 3 항 반영 (군대 톤·헌터→각성자·선아 증명사진). v2
사용자 최종 승인 시 author 파이프라인 진입 예정.

## 사용자 commit 정책

main 브랜치만 + 사용자 직접 commit. 본 라운드 변경은 working tree 상태 (commit 대기).

## 현 상태

### 어휘 SSOT (2026-05-16 신규 결정)

- *헌터* → ***각성자*** 일괄. 본 세계의 *마수 사냥* 주체 명칭은 *각성자* 로 통일. *헌터* 어휘 일체 폐기.
- 비-각성자 = ***비각성자*** (이전 라운드 SSOT, 유지).
- 신규 챕터·카드 작성 시 두 어휘만 사용.

### 콘텐츠 (헌터→각성자 일괄 반영)

- `chapters/ep-01.md` = 영향 없음 (헌터 어휘 0).
- `chapters/ep-02.md` = §2 사체 정리 장면 *헌터들 → 각성자들* (3 곳).
- `chapters/ep-03.md` = 영향 없음.
- `characters/1-protagonist/woo-jin-hyeok.md` = 32+ 곳 일괄. §자작 매커니즘 *마수 / 각성자 / 헌터 / 길드 / 랭크* → *마수 / 각성자 / 길드 /
  랭크* 중복 제거. §능력 노출·감춤 *다른 헌터 중 같은 계열 각성자* → *같은 계열의 다른 각성자* 표현 정합.
- `_series.md` = 무대·각성 사건·핵심 분기 절 헌터 어휘 3 곳 정정.

### 운영 정책 동기화

- `.claude/CLAUDE.md` 원칙 #2 자작 명명 SSOT 의 *장르 원형* 예시 헌터 → 각성자.
- `.claude/agents/heries-worldsmith.md` 동일 정정.

### ep-04 시놉시스 골격 v2 (사용자 합의 진행 중)

**가제 *자대*.** ep-03 면회실 (입소 4 주차) → 약 2~3개월 뒤 (수료 + 자대 배치).

- §1. 수료 — 짧은 수료식 / 햇빛 각도 잠깐 멈춤 (트리거 환경 복선) / 수료 동기와 짧은 인사.
- §2. 자대 도착 — 비각성자 부대 막사 / 분대장 브리핑 (*각성자가 사냥을 맡는다. 우리는 그 옆을 지킨다*) / 진혁 *예. 알겠습니다.*
- §3. 동기 — 4 인 1조 편성 / 각성 트리거 인물 처음 등장 (윤곽만, 운명 비밀) / 첫 식사 / 손 흉터 한 번 보지만 묻지 않음 / 진혁 *고맙다* 한 박자.
- §4. 첫 출동 명령 — 야간 비상 사이렌 / 진혁 분대 출동 / 군장 챙기는 손 한 번 멈춤 (트라우마 앵커 짧게) / 동기가 어깨 짧게 침 / **차에 오르기 직전 군장 안쪽 주머니에서
  선아 학생증 증명 사진 한 장 꺼내 짧게 보고 다시 넣는다** / 사이렌 + 도시 야경.

**전체 톤 원칙 (사용자 피드백 반영).**
- 상관·선임 앞에서 *끄덕임만으로 답하는 장면 0*. *예 / 알겠습니다* 항상 동반.
- 내면 한 줄 대신 *행동·소품* 으로 마음 표현 (§4 사진 행동).

**미결정 3 항 (사용자 결정 대기).**
1. 자대 = 수료 직후 바로 배치 vs ep-04 는 수료까지만 / 자대는 ep-05.
2. 각성 트리거 인물 = ep-04 윤곽 등장 vs 더 뒤로 미뤄 관계 누적 후.
3. §4 마무리 = 차에 오름 컷 vs 현장 도착·교전 일부까지.

### 검증

- typecheck 0 / vite build 0 / check-secrets 0 누수.
- dist css 54.57 KB / js 302.49 KB / image budget OK (22 파일).

## 다음 세션 진입 체크리스트

1. **사용자 시놉시스 v2 결정 받기** — 미결정 3 항 회신 시 v3 으로 굳히고 author 파이프라인 진입.
2. **`git status`** — 본 세션 누적 변경 (헌터→각성자 일괄 + 운영 문서 + 핸드오프 + harness-state) 확인 후 사용자 commit.
3. **운영**:
    - harness-state hot 15행 / 한도 20 (압축 불필요, 여유 5행).
    - 다음 사이클 후보: ep-04 본문 작성 → continuity-reviewer / 우선아·킥복싱 도장 코치·훈련소 교관·동기 단독 카드 승격 여부.

## Relevant Files

- **챕터**: `content/series/clash-of-multiverses/chapters/ep-01.md`, `ep-02.md`, `ep-03.md`
- **카드**: `content/series/clash-of-multiverses/characters/1-protagonist/woo-jin-hyeok.md`
- **시리즈 메타**: `content/series/clash-of-multiverses/_series.md`, `content/series.json`,
  `content/series/clash-of-multiverses/manifest.json`
- **이미지**: `content/series/clash-of-multiverses/thumbnails/{cover.webp, ep-01/, ep-02/, ep-03/}`,
  `thumbnails/PROMPT.md`
- **정책**: `.claude/CLAUDE.md`,
  `content/series/clash-of-multiverses/worldbuilding/character-doctrine.md`
- **agents**:
  `.claude/agents/heries-{lorekeeper,worldsmith,author,continuity-reviewer,frontend-engineer,publisher}.md`
- **운영**: `.claude/harness/{harness,harness-setup,harness-install,harness-state}.md`,
  `.claude/handoff/{handoff,CURRENT}.md`
- **빌드 코드**: `src/entities/chapter/chapter.ts`, `package.json`, `vite.config.ts`,
  `.github/workflows/deploy.yml`
