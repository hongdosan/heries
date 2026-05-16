<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# CURRENT 핸드오프 (2026-05-15, 챕터 1~2 발행 + 카드 갱신)

## 한 줄

*차원의 격돌* ep-01 *마수의 등장* + ep-02 *마수와 사람 사이* 본문 발행. 우진혁 카드 reader_snapshot ep-02 갱신 + 독자 절에
ep-01·ep-02 사실 채움. 카드 §운동 시절·§시그니처 등 14 곳의 *격투기* / *종합격투기* → *킥복싱* 일괄 정정 (본문 정정 정합). _
series·series.json·manifest.json 의 status `tba` → *연재 중*, started `2026-05-15`. 챕터 1·2 의 대표 이미지 +
§1·§2·§3·§4 소제목별 이미지 생성 프롬프트도 `thumbnails/PROMPT.md` 에 작성.

## 사용자 commit 정책

본 세션 모든 변경은 *working copy* 상태. main 브랜치 + 사용자 직접 commit (현 라운드 = commit 금지 명시).

## 현 상태

### 콘텐츠

- `content/series/clash-of-multiverses/chapters/ep-01.md` = *마수의 등장*. 약 4000자. §1 회상 / §2 일상 / §3 운동
  시절 / §4 졸업식·마수.
- `content/series/clash-of-multiverses/chapters/ep-02.md` = *마수와 사람 사이*. 약 4000자. §1 강당·마수 대치 / §2
  후송·미각성자 부대 인지 (선아 시점) / §3 병원·결심 / §4 도장·입대 결정.
- `content/series/clash-of-multiverses/characters/1-protagonist/woo-jin-hyeok.md` = 작가 백엔드 700+ 줄 +
  독자 절 ep-02 시점 사실 5 절 확장. frontmatter `reader_snapshot: ep-02`.
- `content/series/clash-of-multiverses/_series.md` = status *연재 중* / started 2026-05-15.
- `content/series.json` = 시리즈 status·started 정합.
- `content/series/clash-of-multiverses/manifest.json` = chapters[] 에 ep-01·ep-02 등록 + status 정합.
- `content/series/clash-of-multiverses/thumbnails/PROMPT.md` = 시리즈 cover + ep-01 (대표 +
  §1·§2·§3·§4) + ep-02 (대표 + §1·§2·§3·§4) 프롬프트.

### 작품 톤 / 메모리

- 챕터 본문 = 평이한 한국 웹소설 산문. 시적 표현·은유적 마무리·단어 한 줄 강조 X.
- 대화 중심. 시점 묘사 짧음.
- 메모리 추가: `feedback_no_poetic_prose.md`.

### 코드

- `src/entities/chapter/chapter.ts` = 챕터 파일 경로 패턴 `ep-{NN}.md` 단순화 (구 `ep-{NN}-{slug}.md` 정정).

### 검증

- typecheck 0 / build 0 / build-storybook 통과 / check-secrets 0 누수.
- dist css 43.30 KB / js 286.29 KB.

## 다음 세션 진입 체크리스트

1. **`git status`** — 본 세션 누적 변경 확인.
2. **분할 commit 권장** (현재 commit 금지 명시 — 사용자 OK 후):
    - (a) ep-01·ep-02 본문 + manifest·_series·series.json + 카드 독자 절 확장
    - (b) 카드 §킥복싱 정정 (격투기 → 킥복싱 14 곳)
    - (c) thumbnails/PROMPT.md 시리즈 cover + ep-01·ep-02 프롬프트
    - (d) chapter loader 경로 패턴 정정 (`src/entities/chapter/chapter.ts`)
    - (e) handoff·harness-state 갱신
3. **이미지 생성** — `PROMPT.md` 의 ep-01·ep-02 프롬프트로 작가가 직접 webp 생성 → `thumbnails/` 배치 → `manifest.json`
   chapters[].thumbnail 필드 추가.
4. **다음 트랙**:
    - ep-03 시놉시스 — 군 입대 / 훈련소 / 부대 배치 / 첫 임무 (카드 §군 정합).
    - 우선아 단독 카드 승격 여부 (이름·대사·인과 모두 있음 — character-doctrine §2-6 자격 충족).
    - 챕터 1·2 등장 *킥복싱 도장 코치* / *마수 사태 헌터* 단독 카드 승격 여부.

## Relevant Files

- **챕터**: `content/series/clash-of-multiverses/chapters/ep-01.md`, `ep-02.md`
- **카드**: `content/series/clash-of-multiverses/characters/1-protagonist/woo-jin-hyeok.md`
- **시리즈 메타**: `content/series/clash-of-multiverses/_series.md`, `content/series.json`,
  `content/series/clash-of-multiverses/manifest.json`
- **이미지 프롬프트**: `content/series/clash-of-multiverses/thumbnails/PROMPT.md`
- **정책**: `.claude/CLAUDE.md`,
  `content/series/clash-of-multiverses/worldbuilding/character-doctrine.md`
- **agents**:
  `.claude/agents/heries-{lorekeeper,worldsmith,author,continuity-reviewer,frontend-engineer,publisher}.md`
- **운영**: `.claude/harness/{harness,harness-setup,harness-install,harness-state}.md`,
  `.claude/handoff/{handoff,CURRENT}.md`
- **빌드 코드**: `src/entities/chapter/chapter.ts`, `package.json`, `vite.config.ts`,
  `.github/workflows/deploy.yml`
