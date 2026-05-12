<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->

# heries — 현재 핸드오프 (단일 파일)

> 본 파일이 **유일한 핸드오프 파일**. 세션 종료 직전 / 컨텍스트 60% 초과 시 본 파일을 *덮어쓴다*. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md`.

**Last updated**: 2026-05-12

## Summary

**메가 사이클 후속 마무리 사이클**. 직전 메가 사이클 (orphan squash + SPA + NOTICE 페이지 + 옵션 C 11 카드 fix + 라이선스 통일) 직후 다음 통합 완료: (1) **이미지 재압축** = _shared 2장 2478 → 311 KB (-87%, `f9fbcf2`). (2) **favicon 교체** = heries-mark.webp (보라색 h 마크 + 다중우주 모티프) 로 src/shared/img/favicon.webp 교체 (`914cba8`). (3) **세레나 MCP 재등록** = `serena-heries: ✓ Connected`, 경로 `/Users/hongyeongjune/IdeaProjects/heries` (이전 stale 경로 `/Users/hongdosan/onion-workspace/heries` 폐기). (4) **ErrorBoundary 전역 도입** (`1f351d8`) = React 19 Class Component 직접 구현 (의존성 0 정책), dev/prod fallback 분기, console.error 로깅, 홈으로 = `BASE_URL` basename 정합. (5) **build:author base 분기** (`6d7bcd9`) = vite.config 에 `VITE_AUTHOR_MODE` env 분기 → author build base `/` (npx serve dist-author 즉시 동작), reader build base `/heries/` 유지. (6) **프론트엔드 정리** (`6c7c4db`) = chapter.tsx FSD import 명시 일관성 + theme-toggle aria-label + CSS stale class 4 영역 삭제 + undefined var 정정 (`--bg-2` → `--bg-soft` 등). 검증: typecheck 0 / reader+author build 0 에러 / 마스킹 누수 0 / FSD 위반 0. **legacy 차원의 격돌 이미지** = dangling commit·blob 어디에도 cover.webp / ep-01~04 thumbnails 없음 (orphan squash 이전 시점에 이미 git tree 에서 제거). 복구 가능 자산 = unreachable PNG 1개 (`be9b36f` 1254×1254 RGBA) — 사용자 결정 보류.

## Key Decisions (현행)

- **작품 정체성** = 작가 `hongdosan` 의 **100% 오리지널 다세계관 배틀로얄 · 다크 판타지**. *차원의 격돌* (`clash-of-multiverses`). 등장인물·세계관 모두 자작 창작.
- **저작권** = `© 2026 hongdosan. All Rights Reserved.` 단일 scope (코드·구조 + 서사 콘텐츠 동일). **외부 IP 차용 ZERO 정책**. 일반 명사 (닌자·헌터·정파 등 장르 원형) 만 사용.
- **라우팅** = **BrowserRouter** + basename `import.meta.env.BASE_URL.replace(/\/$/, '')`. SPA 호환 = `public/404.html` redirect + `index.html` replaceState 복원.
- **build base 분기** = production reader `/heries/` / author `/` / dev `/` (`VITE_AUTHOR_MODE` env). dist-author 는 정적 서버 즉시 동작.
- **ErrorBoundary** = 전역 1개 (`src/shared/ui/error-boundary/`). dev 모드 stack/component-stack 노출, production 모드 사용자 친화 메시지. console.error 로깅 (외부 보고 채널 없음).
- **NOTICE 페이지** = `/notice` 내부 라우트. SSOT = 루트 `NOTICE.md`. build 시 dist 자동 미러.
- **11 인 SSOT 매핑** = 현우진 / 에이라 / 야무라 토우 / 서운혁 / 령극 / 고천한 / 유백경 / 비현 / 림우경 / 현우 / 백무진. 한국 9 + 일본 1 + 비-한국 1. 모두 인간형 외형.
- **백무진 카피 한계** = *기예 모사*. 기술만 모방, 시스템 능력·체질·이능 자체는 모방 불가.
- **manifest.json characters** = `CharacterIndex[]` 객체 배열. `normalizeSeriesManifest` 정규화 안전망 (string[] 레거시도 graceful).
- **하네스 라우팅** = `heries-orchestrator` skill 라우터. agent 호출 = `general-purpose + agent 정의 inline` 우회 패턴.
- **Serena MCP** = `serena-heries: Connected`. 경로 `/Users/hongyeongjune/IdeaProjects/heries`. 첫 LSP 인덱싱 5~15분 (백그라운드, 다음 세션부터 도구 가용).

## Traps to Avoid

- **외부 IP 식별 표현 금지** — *그림자 군주·일어나라·상태창·화산·매화검법·차크라·인술·접촉 발동·모노마·가로우* 등 회피.
- **legacy 디렉토리** = 작가 참조용 (`content/_legacy_*/` gitignored). 단 **현재 working tree 에 legacy 디렉토리 자체 없음** — 작품 컨셉 전환 사이클 시점에 누락된 상태. 복구 불가 (백업 경로도 stale).
- **인간형 외형 필수**.
- **카피 능력 한계** — 백무진 §기예 = 기술만, 능력 자체 X.
- **모든 카드 `origin: original`**.
- **`_legacy_*` 빌드 누수 방지** — `copy-content.mjs` skip 규칙.
- **변경 이력 hot 20 / 한도 20 — 압축 임계 도달**. 다음 사이클 시작 직후 archive 압축 발동 의무 (CLAUDE.md §누적 산출물).
- **GitHub dangling commit** — force push 후 옛 SHA 잔존 (자동 gc 대기, 사용자 결정 = repo 재생성 안 함).
- **세레나 첫 인덱싱** = 등록 직후 5~15분 백그라운드. 본 세션은 등록 직후라 도구 노출 안 됨 — *다음 세션부터* 도구 가용.

## Working Agreements

- main 브랜치 only / **Claude 자동 commit + push 권한 부여**. 신규 작업 시작 시 사전 통지.
- 작가 표기 = **hongdosan** (시스템 username 은 `hongyeongjune`, 작가명과 다름).
- 커밋 메시지 = 본문 한글, `type(scope):` prefix 영어. co-author = `Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- 모든 .md 첫 줄 = `<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->`.
- 누적 산출물 정책 v3: 변경 이력 hot 20 / 핸드오프 단일 파일 덮어쓰기.
- Serena MCP 우선 (`mcp__serena-heries__*`) for `src/` 코드 탐색.
- agent 호출 = `general-purpose + agent 정의 inline` (model: opus).

## Relevant Files

- `src/shared/ui/error-boundary/{error-boundary.tsx, index.ts}` (전역 ErrorBoundary)
- `src/app/main.tsx` (BrowserRouter + ErrorBoundary wrap)
- `vite.config.ts` (VITE_AUTHOR_MODE → base 분기)
- `src/shared/img/favicon.webp` (heries-mark 교체)
- `src/widgets/header/header.tsx` (theme-toggle a11y)
- `src/pages/chapter/chapter.tsx` (FSD index.js 명시)
- `src/shared/styles/style.css` (stale class 정리 + .error-boundary 절)
- `content/_shared/{heries-mark, thumbnail-placeholder}.webp` (재압축 311 KB)
- `content/series/clash-of-multiverses/{manifest.json, characters/, _series.md}` (11 카드, _series.md 10 → 11 인 동기화 필요)
- `content/notice.md` + `NOTICE.md` (루트 SSOT, build 자동 미러)
- `src/pages/notice/{notice.tsx, index.ts}` (/notice 라우트)
- `src/shared/lib/{types, manifest}.ts` (CharacterFolder 확장 + normalize)
- `public/404.html` + `index.html` (SPA redirect + replaceState 복원)
- `.claude/CLAUDE.md` + `.claude/agents/heries-*.md` (6 정의) + `.claude/skills/heries-orchestrator/SKILL.md`

## Open Work

### 보류 결정 사항

1. **legacy 차원의 격돌 이미지 (dangling PNG 1개 `be9b36f` 1254×1254)** — 사용자 결정 시 추출 가능 (`git cat-file -p be9b36f > /tmp/recover.png`).
2. **추가 SSOT 4 항목** = 진영 간 관계 그리드 / 페이즈 2 작가 정체 6 단서 수렴 / 현우진-에이라 관계 / 백무진 떡밥 발현 형식.
3. **천기망 (cheongiman) Serena MCP 연동** — 사용자 명세 받음 (별도 프로젝트). 천기망 절대 경로 미회신.

### 다음 사이클 후보

- **변경 이력 archive 압축** = 다음 사이클 시작 직후 의무 (hot 20 → 21 도달).
- **worldsmith** — 진영 SSOT 11 본문 (`worldbuilding/factions/*.md`) + `_series.md` 10 → 11 인 동기화.
- **ep-01~04 자작 변환** = legacy 본문에서 사건·구성 보존, 등장인물·세계관 표현만 자작 치환. author → continuity-reviewer 파이프라인.
- **추가 부차 발견 (frontend agent 보고)** — useAsync AbortController 보강 / ChapterPage 컴포넌트 분해 / 페이지별 ErrorBoundary 추가 / 마크다운 외부 링크 `rel="noopener"` 자동 부착 — 모두 사용자 결정 대기.

## Prompt for New Chat

```
heries (단일 작가 hongdosan, 오리지널 다세계관 정적 웹 시리즈) 작업을 이어간다.

1. .claude/handoff/CURRENT.md Read.
2. §Relevant Files 점검 + 변경 이력 hot (20 / 한도 20). **세션 시작 직후 archive 압축 발동 의무** (CLAUDE.md §누적 산출물).
3. .claude/CLAUDE.md → agents/ → skills/ → src/README.md → harness/ 진입.
4. 자동 commit + push 권한. 신규 작업 사전 통지.
5. agent 호출 = general-purpose + agent 정의 inline (model: opus).
6. 자작 캐릭터 = origin: original / 외부 IP 식별 표현 0 / 인간형 외형 / 백무진 카피 한계 (기예만).
7. 라우팅 = BrowserRouter + basename. SPA = public/404.html. build base = reader /heries/ / author /.
8. ErrorBoundary 전역 적용 (src/shared/ui/error-boundary). 에러 throw → fallback UI.
9. manifest = CharacterIndex[] 객체 배열 + normalize 안전망.
10. Serena MCP = serena-heries:Connected. 첫 인덱싱 완료 시 mcp__serena-heries__* 가용.
11. 챕터 작성 = 시놉시스 3 페이즈 보존. author → continuity-reviewer.
12. legacy 이미지 = 복구 불가 (dangling 어디에도 없음, 백업 경로 stale).

CLAUDE.md / agents/ / skills/ / harness/ 재기술 금지.
```
