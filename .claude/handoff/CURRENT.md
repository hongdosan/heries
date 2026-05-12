<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->

# heries — 현재 핸드오프 (단일 파일)

> 본 파일이 **유일한 핸드오프 파일**. 세션 종료 직전 / 컨텍스트 60% 초과 시 본 파일을 *덮어쓴다*. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md`.

**Last updated**: 2026-05-12

## Summary

**메가 통합 사이클 완료**. (1) **원격 GitHub history 초기화** = orphan squash + force push → root commit `e394480` 단일 (39 commit 의 차용 컨셉 시대 message 흔적 제거). dangling commit 자동 gc 대기 (사용자 결정 = repo 재생성 안 함). (2) **SPA 전환** (`b68a233`) = HashRouter → BrowserRouter + basename + vite.config base 분기 + public/404.html (spa-github-pages redirect) + index.html replaceState. (3) **NOTICE 페이지** = `/notice` 라우트 신규 + footer 외부 GitHub URL → 내부 Link 전환 + 루트 NOTICE.md SSOT + build 시 자동 dist 복사. (4) **환경 복구** = npm install 73 packages + typecheck 스크립트 정정 (TS5094 충돌 제거). (5) **옵션 C 11 카드 fix** (`1e3aa79`) = manifest 객체 배열 + types CharacterFolder 확장 + normalizeSeriesManifest 안전망 → 11/11 카드 정상 진입. (6) **라이선스 통일** (`736d12e`) = LICENSE MIT scope 폐기, 전체 단일 All Rights Reserved. (7) **표현 통일** = 외부 IP 차용 0 → ZERO 정책 일관. (8) **footer meta + .meta CSS 정리** + scripts stat import 제거 + README HashRouter 잔존 정정 + about FAQ heading 형식. 총 7 commit (root + 6) + 사전 3 commit. typecheck 0 / build 1.11s 0 에러 / 마스킹 누수 0 / FSD 위반 0.

## Key Decisions (현행)

- **작품 정체성** = 작가 `hongdosan` 의 **100% 오리지널 다세계관 배틀로얄 · 다크 판타지**. *차원의 격돌* (slug: `clash-of-multiverses`). 등장인물·세계관 모두 자작 창작.
- **저작권** = `© 2026 hongdosan. All Rights Reserved.` 단일 scope (코드·구조 + 서사 콘텐츠 동일, MIT 폐기). **외부 IP 차용 ZERO 정책** = 캐릭터·고유명사·고유 능력·진영명·고유 표현 일체 차용 금지. 일반 명사 (닌자·헌터·정파·사파·천마신교·혈교 등 장르 원형) 만 사용.
- **라우팅** = **BrowserRouter** + basename `import.meta.env.BASE_URL.replace(/\/$/, '')` (production `/heries`, dev `''`). GitHub Pages SPA 호환 = `public/404.html` redirect + `index.html` replaceState 복원.
- **NOTICE 페이지** = `/notice` 내부 라우트. SSOT = 루트 `NOTICE.md`. `scripts/copy-content.mjs` 가 build 시 dist 에 자동 미러. footer 링크는 내부 `<Link to="/notice">`.
- **11 인 SSOT 매핑 확정** = #1 현우진 (한국, 명부 시스템 주인공) / #2 에이라 (북방 헌터 길드 여, 비-한국) / #3 야무라 토우 (일본 닌자, 부영 마을) / #4 서운혁 (혈교, 적련궁) / #5 령극 (천마신교, 천룡신교) / #6 고천한 (사파, 흑익회) / #7 유백경 (정파, 청람검문) / #8 비현 (사대악인, 천하사악) / #9 림우경 (회귀자, 한국 외형 + 조상 고대 차원 혈통 + 나노초 시간 감각) / #10 현우 (환생자, 전생 검신) / #11 백무진 (무능력자 카피 = 기예 모사). 한국 9 + 일본 1 + 비-한국 1. 11 인 모두 인간형 외형.
- **백무진 카피 한계** = *기예 모사 (技藝摹寫)*. **기술 (수련 기예) 만 모방, 시스템 능력·체질·이능 자체는 모방 불가**. 발동 = 관찰·이해 (접촉 아님).
- **manifest.json characters** = `CharacterIndex[]` 객체 배열. 정규화 안전망 (`normalizeSeriesManifest`) 으로 string[] 레거시도 graceful 처리.
- **하네스 라우팅** = `heries-orchestrator` skill 라우터. Agent subagent_type 미등록 → general-purpose + agent 정의 inline 우회 패턴 검증 완료 (lorekeeper 3 회 + frontend-engineer 4 회 검증).

## Traps to Avoid

- **외부 IP 식별 표현 금지** — *그림자 군주·일어나라·상태창·화산·무당·매화검법·수라혈천도·차크라·인술·접촉 발동·모노마·가로우* 등 회피.
- **legacy 디렉토리 = 작가 참조용** — `content/_legacy_clash-of-multiverses/` 22 카드 + 4 챕터는 *구조·사건 흐름 참조* 만. 본문 표현·고유명사 직접 차용 절대 금지.
- **인간형 외형 필수** — 비현 (사대악인) 도 인간형. 림우경 조상 혈통은 작가 분기 절에 마스킹.
- **카피 능력 한계** — 백무진 §기예 절은 *모방 가능 (기술)* vs *모방 불가 (시스템 능력·체질·이능)* 명확 분리.
- **모든 카드 `origin: original`** — 외부 IP 출처 기재 절대 금지.
- **변경 이력 hot 19 / 한도 20 — 다음 사이클 시작 직후 압축 임계 도달** — archive 압축 발동 의무 (CLAUDE.md §누적 산출물 정책).
- **GitHub dangling commit 잔존** — force push 후 옛 SHA 들이 GitHub 서버에 unreachable 로 잔존 (수 주~수 개월 자동 gc 대기). 사용자가 SHA 직접 URL 접근 시 옛 commit 노출 가능 (단 reachable history 는 깨끗).

## Working Agreements

- main 브랜치 only / **Claude 자동 commit + push 권한 부여** (사용자 명시 *알아서 커밋·푸시까지*). 신규 작업 시작 시 사전 통지.
- 작가 표기: 모든 영역 = **hongdosan**.
- 커밋 메시지 = 본문 한글, `type(scope):` prefix 만 영어. co-author 라인 = `Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- 모든 .md 첫 줄 (frontmatter 직후) = `<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->`.
- 누적 산출물 정책 v3: 변경 이력 hot 20행 / 핸드오프 = `CURRENT.md` 단일 파일 덮어쓰기.
- Serena MCP 우선 (`mcp__serena-heries__*`) for `src/` 코드 탐색.
- agent 호출 = `Agent subagent_type='heries-*' 미등록` → `general-purpose` + agent 정의 inline (model: opus).

## Relevant Files

- `content/series/clash-of-multiverses/manifest.json` — characters 객체 배열 (11 인)
- `content/series/clash-of-multiverses/characters/1-protagonist/hyeon-woo-jin.md` (#1)
- `content/series/clash-of-multiverses/characters/2-major-supporting/*.md` (#2-#11)
- `content/series/clash-of-multiverses/_series.md` — **10 인 표 → 11 인 표 동기화 필요** (다음 worldsmith 사이클)
- `content/notice.md` + `NOTICE.md` (루트 SSOT, build 시 자동 미러)
- `src/app/main.tsx` (BrowserRouter + basename)
- `src/pages/notice/{notice.tsx,index.ts}` (신규)
- `src/shared/lib/{types,manifest}.ts` (CharacterFolder 확장 + normalize)
- `src/pages/character/character.tsx` + `src/widgets/character-list/character-list.tsx` (FOLDER_LABEL + GROUP_ORDER)
- `vite.config.ts` (base 분기 + publicDir) + `public/404.html` (SPA redirect) + `index.html` (replaceState 복원)
- `scripts/copy-content.mjs` (NOTICE 미러 + `_legacy_` skip + stat 제거)
- `.claude/CLAUDE.md` + `.claude/agents/heries-*.md` (6 정의) + `.claude/skills/heries-orchestrator/SKILL.md`

## Open Work

### 추가 SSOT 결정 4 항목 (lorekeeper 보고, 보류 중)

1. **진영 간 관계 그리드** — 적련궁 (서운혁) 멸문 합공 명단에 청람검문 (유백경) / 흑익회 (고천한) 포함 여부.
2. **페이즈 2 작가 정체 단서 일관성** — 6 단서 (부영 마을 멸문·적련궁 합공 명단·청람검문 가전 첫 줄·천룡신교 첫 신앙·흑익회 비급 공백·림우경 고대 차원 멸망) 가 *단일 작가 수렴* vs *서로 다른 작가의 여러 작품*.
3. **현우진-에이라 관계** = 동맹·라이벌 중 결정. *룬 한 거점 영구 침묵 거래* 상대.
4. **백무진 *모든 기술 본 자* 떡밥 페이즈 2 발현 형식** = 어느 시점·인물 발언으로 표면화. 림우경 협업 떡밥 가능성.

### 다음 사이클 후보

- **worldsmith** — 진영 SSOT 11 본문 (`worldbuilding/factions/*.md`) + `_series.md` 10 → 11 인 표 동기화.
- **frontend-engineer** — `build:author` base 분기 (`--base=/`) — 로컬 정적 서버 자산 깨짐 해소 (agent 2 부차 발견).
- **ep-01~04 자작 변환** — legacy 본문에서 사건·구성 보존, 등장인물·세계관 표현만 자작 치환. author → continuity-reviewer 파이프라인.

## Prompt for New Chat

```
heries (단일 작가 hongdosan, 오리지널 다세계관 정적 웹 시리즈) 작업을 이어간다.

1. .claude/handoff/CURRENT.md Read. 본 파일이 유일한 핸드오프.
2. §Relevant Files 의 모든 경로 Read 점검 + 변경 이력 hot (19 / 한도 20). **세션 시작 직후 압축 임계** — archive 발동 의무 (CLAUDE.md §누적 산출물).
3. .claude/CLAUDE.md → .claude/agents/heries-*.md → .claude/skills/heries-orchestrator/SKILL.md → src/README.md → .claude/harness/ 진입.
4. 자동 commit + push 권한 부여 (사용자 메모리). 신규 작업 시작 시 사전 통지.
5. agent 호출 = general-purpose + agent 정의 inline (model: opus).
6. 자작 캐릭터 = origin: original / 외부 IP 식별 표현 0 / 인간형 외형 / 백무진 카피 한계 (능력 X, 기예 O) / 림우경 한국 외형 + 조상 혈통 마스킹.
7. 라우팅 = BrowserRouter + basename. SPA 호환 = public/404.html redirect.
8. NOTICE = 내부 /notice 라우트. SSOT = 루트 NOTICE.md.
9. manifest.json = CharacterIndex[] 객체 배열. normalize 안전망 보유.
10. 챕터 작성 = 시놉시스 3 페이즈 보존. author → continuity-reviewer.
11. src/ 탐색 = mcp__serena-heries__*.

CLAUDE.md / agents/ / skills/ / harness/ 재기술 금지.
```
