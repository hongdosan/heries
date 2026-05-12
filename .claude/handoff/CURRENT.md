<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries — 현재 핸드오프 (단일 파일)

> 본 파일이 **유일한 핸드오프 파일**. 세션 종료 직전 / 컨텍스트 60% 초과 시 본 파일을 *덮어쓴다*. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md`.

**Last updated**: 2026-05-12

## Summary

**연쇄 정합 사이클 (이름·컨셉·라우팅·IntelliJ·작가 격리 일괄)**. 사용자 자율 권한 위임 + 다수 동시 요청 통합 (단일 commit `039cc20` + 후속 `daabe88` `d52cf4d`):

(1) **★ 4 차 이름 일괄** — 현우진 → 현진혁 → 현우혁 → **우진혁 (禹鎭赫)** [woo-jin-hyeok] / 서운혁 → **서운룡 (徐雲龍)** [seo-un-ryong] / 령극 → **천령극 (天靈極)** [cheon-ryeong-geuk] / 비현 → **막무련 (莫武連)** [mak-mu-ryeon]. git mv 파일 rename + frontmatter slug·name·한자 + manifest + _series.md + 9 카드 인간관계 표현 모두 일관 정정. (2) **5 카드 컨셉 전면 보강** — 우진혁 (부모 부재 + 똑똑한 여동생 + 위험수당 군문 + 격투칼 + **명부 호흡 무한 → 무한 재생** + *마음에서 우러나는 군주적 충성* 회로) / 유백경 (청람검문 → **종남파** + **천하일대검수** + 정·중·후 묵직 단일 + **천하삼십육검 — 천하 삼십육 방 어디에서 들어오는 공격도 막지 못할 방위가 없다**) / 백무진 (무명자 → 평범한 학생 + *눈이 좋은 편* 자기 인식 + **카피 임계 → 신체 자체 최적화 변형** + **다중우주 분기 떡밥** *상위 분기 백무진은 신체 능력까지 카피*) / 서운룡 (전면 재작성: 혈교 역대 혈마 + 비사실적 외모 + 환술·사기·피 + 혈교 무공 배운 자 전율·무릎 회로 + ★ **신체 강탈 강림 안배 떡밥**) / 막무련 (전면 재작성: 녹림 역대 녹림왕 + 외공의 극 + **만수파천권 (萬獸破天拳)** 만 마리 짐승 권법 + 자연 가호 동물 회로 + *곰의 가죽 여우의 결*). (3) **★ BrowserRouter 상대경로 fetch 버그 fix** — 사용자 보고 `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`. 원인 = `./content/...` 가 SPA route 기준으로 resolve. 수정 = `src/shared/lib/env.ts` 의 `assetUrl(rel)` 헬퍼 신규 + 13 호출처 일괄. (4) **UX 5종 fix** — 홈 헤드라인·헤더 stale "크로스오버 팬픽" → 오리지널 다중/평행 세계 / _series.md 11인 표 + manifest/series.json status 일관성 / Notice 외부 URL 한글화 부작용 (`홍도산/H-eries`) → 실제 `hongdosan/heries` + about → /notice 내부 라우트. (5) **IntelliJ 권장 경고 19/30 해결** — import shorten 16 + regex escape 3 + scripts process import + var → const + package.json `name` 표준 (`heries` 소문자) + homepage 정정 + vite.config base `/heries/`. index.html `Cannot resolve 'src'` 11건은 Vite false positive (코드 해결 불가). (6) **archive 압축 11차** — hot 20 → 4 → 5 행 + 메타-기록. archive 17 bullets 누적. (7) **레거시 복구 + gitignore** — `content/_legacy_recovery_2026-05-12/` (gitignored, 98 파일 / 8.0 MB / raw-bundle 6.8 MB / refs/recovered/* 18개 unreachable→reachable 승격). (8) **작가 모드 시각 마킹 + outDir 분기** (`d52cf4d`) — 마크다운 헤더 `## 시놉시스` / `## H-eries 분기 ~` 에 `.author-only-heading` 클래스 자동 부여 (markdown.ts) + CSS `🔒 AUTHOR 전용` 라벨 + heries_arc frontmatter dt/dd 에 AUTHOR 배지. vite.config build.outDir 분기 (reader → `dist`, author → `dist-author`) — env-only build 시 충돌 방지. **검증**: typecheck 0 / build 0 (81 modules) / reader dist 마스킹 누수 0 (## H-eries 분기 헤더 0건) / author dist-author 노출 11 카드 (전수) / 외부 IP 식별 표현 0 / FSD 위반 0.

## Key Decisions (현행)

- **11 인 자작 캐릭터 매핑** = **우진혁** (1-protagonist, 단독 주인공, 명부 시스템) / **에이라** / **야무라 토우** / **서운룡** (혈교 역대 혈마) / **천령극** (천룡신교 마교 후계) / **고천한** (흑도 사파) / **유백경** (종남파 천하일대검수) / **막무련** (녹림 역대 녹림왕) / **림우경** (회귀자) / **현우** (환생자) / **백무진** (평범한 학생, 카피).
- **자작 메커니즘 자작 명명** = 명부 호흡 (冥府 呼吸) — 마나·기력 등가 자작 / 종남일대검 + 천하삼십육검 (定·重·厚) / 카피 임계 — 신체 자체 변형 + 다중우주 분기 / 신체 강탈 강림 안배 / 만수파천권 (萬獸破天拳) — 만 마리 짐승. 외부 IP 식별 표현 0건.
- **author = reader superset** = 코드 1 벌 공유 (React 컴포넌트·라우터·페이지·CSS). 빌드 시점 `copy-content.mjs` 분기 + 런타임 `IS_AUTHOR_MODE` 헤더 배지 + dev `spoiler.ts` 보조. reader 마스킹 대상 = `## 시놉시스` / `## H-eries 분기 ~` 이하 / `heries_arc` frontmatter / `worldbuilding/timeline/glossary/`.
- **build outDir** = reader → `dist` (GH Pages 배포) / author → `dist-author` (작가 로컬). vite.config + package.json 모두 분기 보장.
- **build base** = reader `/heries/` (실제 repo prefix) / author + dev `/`.
- **자산 경로** = `assetUrl('content/...')` 헬퍼 (`src/shared/lib/env.ts`) 만 사용. raw `./content/...` 금지.
- **package.json `name`** = `heries` (npm 소문자 규약) / `homepage` = `https://hongdosan.github.io/heries/`.
- **하네스 라우팅** = `heries-orchestrator` skill / agent 호출 = `general-purpose + agent 정의 inline + model: opus`.
- **Serena MCP** = `serena-heries: Connected` 경로 `/Users/hongyeongjune/IdeaProjects/heries`.

## Traps to Avoid

- **외부 IP 식별 표현 금지** — *그림자 군주·일어나라·차크라·인술·매화검법·수라혈천도·접촉 발동·모노마·가로우* 등 회피. *기예 모사* 표현은 *카피* 로 통일.
- **자산 경로 직접 작성 금지** — `./content/...` raw 사용 X. 반드시 `assetUrl('content/...')` 경유.
- **빌드 outDir 충돌 금지** — author 빌드는 항상 `dist-author/`. 동일 `dist/` 사용 시 reader 산출물 덮어쓰기 + 마스킹 누수처럼 보이는 일시 상태 발생.
- **이름 변경 시 정합 체크리스트** = (1) git mv (2) frontmatter slug + name + 한자 (3) `# 제목` (4) 본문 자기 언급 (5) manifest.json (6) _series.md 행·링크 (7) 다른 카드 인간관계 (8) build/typecheck 0.
- **GitHub URL 한글 username 금지** — 실제 계정 = `hongdosan` (소문자 영문). repo = `heries`.
- **인간형 외형 필수**.
- **모든 카드 `origin: original`**.
- **`_legacy_*` 빌드 누수 방지** — `copy-content.mjs` skip 규칙 (`/^_legacy_/`).
- **IntelliJ `index.html` Cannot resolve 'src'** 경고 = Vite false positive. 코드 해결 불가능, IDE source root 영역.

## Working Agreements

- main 브랜치 only / **Claude 자동 commit 권한 부여**. **push 는 사용자 직접** (2026-05-12 정책 확인).
- 작가 표기 = `홍도산` (.md 고지문) / `hongdosan` (GitHub username) / 시스템 username `hongyeongjune` 과 다름.
- 커밋 메시지 = 본문 한글, `type(scope):` prefix 영어. co-author = `Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- 모든 .md 첫 줄 = `<!-- © 2026 홍도산. All rights reserved. Original creator work. -->`.
- 누적 산출물 정책 v3: 변경 이력 hot 20행 / 핸드오프 단일 파일 덮어쓰기.
- Serena MCP 우선 (`mcp__serena-heries__*`) for `src/` 코드 탐색.
- agent 호출 = `general-purpose + agent 정의 inline` (model: opus).
- 캐릭터 카드 구조 = 공개 절 (`## 핵심 정체성`·`## 능력`·`## 인간관계` 등 reader 노출) vs 작가 분기 절 (`## H-eries 분기` 이하 + `heries_arc` 마스킹).

## Relevant Files

- `src/shared/lib/env.ts` (`assetUrl` 헬퍼 + `IS_AUTHOR_MODE`)
- `src/shared/lib/{manifest, use-img-fallback, markdown}.ts` (assetUrl 적용 + author-only-heading 클래스 자동 부여)
- `src/pages/{home,about,notice,series,chapter,character}/*.tsx` (assetUrl + character heries_arc AUTHOR 배지)
- `src/widgets/{chapter-toc,series-list,header,chapter-character-strip,footer}/*.tsx`
- `src/app/main.tsx` (BrowserRouter + ErrorBoundary + import shorten)
- `src/shared/ui/error-boundary/*` (전역 ErrorBoundary)
- `src/shared/styles/style.css` (author-only-heading + author-only-badge)
- `vite.config.ts` (`VITE_AUTHOR_MODE` → base + outDir 분기)
- `package.json` (name `heries` + homepage + build:author --outDir dist-author)
- `scripts/{check-images,copy-content,optimize-images}.mjs` (process import)
- `index.html` + `public/404.html` (var → const)
- `content/series/clash-of-multiverses/manifest.json` (11 인 새 이름)
- `content/series/clash-of-multiverses/_series.md` (11 인 새 표 + 새 컨셉)
- `content/series/clash-of-multiverses/characters/1-protagonist/woo-jin-hyeok.md` (★ 단독 주인공)
- `content/series/clash-of-multiverses/characters/2-major-supporting/{eira, yamura-tou, seo-un-ryong, cheon-ryeong-geuk, go-cheon-han, yu-baek-gyeong, mak-mu-ryeon, rim-woo-gyeong, hyeon-woo, baek-mu-jin}.md`
- `content/{about,notice}.md` + `NOTICE.md` (실제 GitHub URL)
- `.claude/CLAUDE.md` (사용자 직접 *오리지널 다중/평행 세계* 톤)
- `.claude/harness/harness-state.md` (변경 이력 hot 5 행, 마지막 메타 본 사이클)
- `.claude/harness/harness-state-archive.md` (80 행)
- `content/_legacy_recovery_2026-05-12/**` (gitignored, 98 파일, raw-bundle 6.8 MB, refs/recovered/* 18개)

## Open Work

### 보류 결정 사항

1. **legacy 차원의 격돌 이미지 (dangling PNG `be9b36f` 1254×1254)** — 추출 보류 (`git cat-file -p be9b36f > /tmp/recover.png`).
2. **레거시 ep-01~04 본문 회수 불가** — 어떤 tree 에도 staged 된 적 없음. 자작 변환 시 *구조만* 참고: 페이즈 1 = 1막 3 추락 / 2막 5 추락 / 3막 단독 주인공 군단 호출 + 임시 휴전 협공 cliffhanger.
3. **신체 강탈 강림 안배 대상** (서운룡 떡밥) — 미특정. 작가 결정. 후보 = 우진혁 / 유백경 / 고천한 / 막무련.
4. **사용자 직접 push** — Claude 자동 push 권한 없음. 본 사이클 3 commit (`039cc20` + `daabe88` + `d52cf4d`) 모두 사용자 push 대기.

### 다음 사이클 후보

- **worldsmith 진영 SSOT 11 본문** — 명부 시스템·룬 각인·은신 마을·혈교·천룡신교·흑익회·종남파·녹림·시간 결·환생자 차원·평범한 학생 11 진영. _series.md 의 *원형 / 키워드* 컬럼을 진영 시드로.
- **ep-01~04 자작 변환** — 레거시 시놉시스 구조 (3/5/임시휴전 cliffhanger) 참고 + 11 인 자작 캐릭터 + 우진혁의 명부 호출 cliffhanger 로 재구성. *본문 카피 절대 금지*. author → continuity-reviewer 파이프라인.
- **handoff CURRENT.md 마스킹 검증 자동화** — `scripts/check-masking.mjs` 신규 (reader dist 의 `## 시놉시스` / `## H-eries 분기` / `heries_arc` / `worldbuilding|timeline|glossary` 잔존 검사). build 후 자동 게이트.
- **부차 발견** — useAsync AbortController / ChapterPage 컴포넌트 분해 / 페이지별 ErrorBoundary / 마크다운 외부 링크 `rel="noopener"` 자동 부착.
- **외부 디스크 백업** — `raw-bundle/legacy-all.bundle` 외부 NAS/암호화 백업 (사용자 외부 경로 결정 대기).

## Prompt for New Chat

```
H-eries (단일 작가 hongdosan / 표기 홍도산, 오리지널 다중/평행 세계 정적 웹 시리즈) 작업 이어감.

1. .claude/handoff/CURRENT.md Read.
2. §Relevant Files 점검 + 변경 이력 hot (현재 5 / 한도 20, archive 80 행).
3. .claude/CLAUDE.md → agents/ → skills/ → src/README.md → harness/ 진입.
4. 자동 commit 권한. push 는 사용자 직접. 신규 작업 사전 통지.
5. agent 호출 = general-purpose + agent 정의 inline (model: opus).
6. 11 인 자작 매핑 = 우진혁 / 에이라 / 야무라 토우 / 서운룡 / 천령극 / 고천한 / 유백경 / 막무련 / 림우경 / 현우 / 백무진. origin: original / 외부 IP 식별 표현 0 / 인간형 외형.
7. 자작 메커니즘 = 명부 호흡 (군주적 충성 + 무한 재생) / 천하삼십육검 (방위 정수) / 카피 임계 신체 변형 + 다중우주 분기 / 신체 강탈 강림 안배 / 만수파천권 / 환술·사기·피.
8. 자산 경로 = assetUrl('content/...') (src/shared/lib/env.ts). raw './content/...' 금지.
9. build outDir = reader /dist / author /dist-author (vite.config + package.json 분기).
10. 작가 모드 시각 마킹 = ## 시놉시스 / ## H-eries 분기 ~ 헤더 자동 author-only-heading 클래스 + heries_arc dt/dd AUTHOR 배지.
11. author = reader superset (코드 1 벌 공유, 빌드 시점 마스킹 분기).
12. 챕터 작성 = 시놉시스 3 페이즈 보존. 레거시 시놉시스 구조만 참고, 본문 카피 절대 X.
13. 레거시 자료 = content/_legacy_recovery_2026-05-12/ (gitignored, 작가 참조 전용).

CLAUDE.md / agents/ / skills/ / harness/ 재기술 금지.
```
