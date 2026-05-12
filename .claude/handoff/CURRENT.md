<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->

# heries — 현재 핸드오프 (단일 파일)

> 본 파일이 **유일한 핸드오프 파일**. 세션 종료 직전 / 컨텍스트 60% 초과 시 본 파일을 *덮어쓴다*. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md`.

**Last updated**: 2026-05-12

## Summary

**Phase 2 — 11 인 자작 카드 본문 1차 패스 완료**. 작품 컨셉 전면 개편 (오리지널 다세계관) 후 첫 카드 본문 작성 사이클. heries-orchestrator skill 라우팅 → general-purpose subagent (model: opus) 통해 lorekeeper agent 정의 inline 위임 패턴 검증 완료. 11 카드 신규 (1-protagonist/1 + 2-major-supporting/10) + manifest.json 11 인 등재 + 이미지 압축 _shared 2 장 (-93%). 2 분리 commit = `dd7f170` chore(images) + `09c35bb` feat(characters). 카드 평균 53 줄, 외부 IP grep 점검 6 항목 모두 0 매칭. 본 사이클 SSOT 결정 = 백무진 *기예 모사* (능력 자체 모방 불가, 기술만 모방) / 림우경 한국 외형 + 조상 1 인이 멸망한 고대 차원 마지막 후예 (혈통 잔류, 나노초 시간 감각) / 에이라 비-한국 여성 (북방 헌터 길드) / 11 인 모두 인간형 외형 필수. **typecheck/build 환경 이슈** = node_modules/vite 미설치 + `npm run typecheck` 의 `tsc -b --noEmit` 충돌 (TS5094), 본 사이클 무관 (마크다운 + JSON 만 추가), frontend-engineer 별도 사이클 처리 필요.

## Key Decisions (현행)

- **작품 정체성** = 작가 `hongdosan` 의 **100% 오리지널 다세계관 배틀로얄 · 다크 판타지**. *차원의 격돌* 제목·`clash-of-multiverses` 슬러그. 다중우주·평행우주 전제. 등장인물·세계관 모두 자작 창작.
- **저작권** = `© 2026 hongdosan. All rights reserved.` 단독 귀속. 코드/구조는 MIT. 외부 IP 차용 0 정책 = 캐릭터·고유명사·고유 능력·진영명·고유 표현 일체 차용 금지. 일반 명사 (닌자·헌터·정파·사파·천마신교·혈교 등 *장르 원형*) 만 사용.
- **시놉시스 3 페이즈 골격** = 페이즈 1 *주인공 봉인* (배틀로얄 → 죽은 자 살리는 헌터 주인공 모두 군단화 → 봉인) / 페이즈 2 *작가 토벌* (작가 처치 → 귀환 불가 → 편집자 임시 조력 → 귀환) / 페이즈 3 *가디언화* (편집자가 주인공에게만 다중우주 가디언 부탁).
- **11 인 SSOT 매핑 확정** = #1 현우진 (한국, 명부 시스템 주인공) / #2 에이라 (Eira) (북방 헌터 길드 여, 비-한국) / #3 야무라 토우 (일본 닌자, 부영 마을) / #4 서운혁 (혈교, 적련궁) / #5 령극 (천마신교, 천룡신교) / #6 고천한 (사파, 흑익회) / #7 유백경 (정파, 청람검문) / #8 비현 (사대악인, 천하사악) / #9 림우경 (회귀자, 한국 외형 + 조상 고대 차원 혈통 잔류 + 나노초 시간 감각) / #10 현우 (환생자, 전생 검신) / #11 백무진 (무능력자 카피 = 기예 모사). 한국 9 + 일본 1 + 비-한국 1.
- **백무진 카피 한계** = *기예 모사 (技藝摹寫)*. **기술 (수련 기예 = 검술·도법·결인술·암기·체술) 만 모방, 시스템 능력·체질·이능 (시간 회귀·전생 본능·각인 룬·시스템 영향·고대 종족 특질) 자체는 모방 불가**. 본인 기량 한계 내, 발동 조건 = 관찰·이해 (접촉 아님).
- **인간형 외형 필수** = 11 인 모두 인간 모습. 림우경 조상 혈통은 외형 미발현 (작가 분기 절 마스킹).
- **하네스 라우팅** = `heries-orchestrator` 스킬이 6 에이전트 라우터. Agent subagent_type 미등록으로 *general-purpose + agent 정의 inline 전달* 우회 패턴 검증 완료.
- **스포일러 분리** (CLAUDE.md §9) = reader 빌드 마스킹 = (a) `_series.md` §시놉시스 (b) 캐릭터 카드 §heries 분기 이하 (c) frontmatter `heries_arc` (d) `worldbuilding/timeline/glossary/`. `_legacy_*` prefix 디렉토리 = 빌드 시 항상 스킵.

## Traps to Avoid

- **외부 IP 식별 표현 금지** — 캐릭터 이름·고유 기술명·진영명·세계관 명·작품 제목 등이 *기존 작품* 과 직접 연상되면 안 됨. *그림자 군주·일어나라·상태창·화산·무당·매화검법·수라혈천도·차크라·인술·접촉 발동·모노마·가로우* 등 식별 표현 회피.
- **legacy 디렉토리 = 작가 참조용** — `content/_legacy_clash-of-multiverses/` 22 카드 + 4 챕터는 *구조 (frontmatter 필드·절 구성·tier 분류) 참조* 에만. 본문 표현·캐릭터명·고유명사 직접 차용 절대 금지.
- **인간형 외형 필수** — 비현 (사대악인) 절대 빌런이라도 인간형. 림우경 조상 혈통은 *작가 분기 절* 에 마스킹 (공개 절 §외형 = 평범한 한국인).
- **카피 능력 한계** — 백무진 §기예 절 작성 시 *모방 가능 (기술)* vs *모방 불가 (시스템 능력·체질·이능)* 명확 분리. 시간 회귀·전생 본능·각인 룬·시스템 영향·고대 종족 특질 = 모방 불가.
- **시놉시스 사건·결과·인물 변경 금지** — 작가 플롯 결정권 보존. 3 페이즈 골격 사건 순서·결과 보존.
- **모든 카드 `origin: original`** — 외부 IP 출처 기재 절대 금지.
- **`_legacy_*` 빌드 누수 방지** — `copy-content.mjs` 의 `_legacy_` prefix skip 규칙 유지.

## Working Agreements

- main 브랜치 only / 사용자 직접 commit / Claude 자동 commit X (단 사용자 명시 권한 부여 시 실행 — 본 사이클의 이미지 + 카드 commit 은 사용자 명시 *커밋해* 권한으로 Claude 실행 완료).
- 작가 표기: 모든 영역 = **hongdosan**.
- 커밋 메시지 = 본문 한글, `type(scope):` prefix 만 영어.
- 모든 .md 첫 줄 (frontmatter 직후) = `<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->`.
- 누적 산출물 정책 v3: 변경 이력 hot 20행 / 핸드오프 = `CURRENT.md` 단일 파일 덮어쓰기.
- Serena MCP 우선 (`mcp__serena-heries__*`) for `src/` 코드 탐색.

## Relevant Files

- `content/series/clash-of-multiverses/characters/1-protagonist/hyeon-woo-jin.md` (#1 주인공)
- `content/series/clash-of-multiverses/characters/2-major-supporting/{eira,yamura-tou,seo-un-hyeok,ryeong-geuk,go-cheon-han,yu-baek-gyeong,bi-hyeon,rim-woo-gyeong,hyeon-woo,baek-mu-jin}.md` (#2-#11)
- `content/series/clash-of-multiverses/manifest.json` — characters 배열 11 인 등재
- `content/series/clash-of-multiverses/_series.md` — *10 인 표 → 11 인 표* 동기화 필요 (다음 worldsmith 사이클)
- `content/_shared/{heries-mark,thumbnail-placeholder}.webp` — 압축 완료 (commit `dd7f170`)
- `content/_legacy_clash-of-multiverses/` — 작가 참조용 (gitignored, 빌드 스킵)
- `.claude/CLAUDE.md` — 원칙 #1·#2 = 오리지널 + 외부 IP 차용 0
- `.claude/agents/heries-{lorekeeper,worldsmith,author,continuity-reviewer,frontend-engineer,publisher}.md` — 6 agent 정의 (Agent type 미등록 — general-purpose inline 우회)
- `.claude/skills/heries-orchestrator/SKILL.md` — 라우터 skill (검증 완료)
- 영구 백업 = `/Users/hongdosan/onion-workspace/heries-archive/clash-of-multiverses` (1.7 MB)

## Open Work

### 추가 SSOT 결정 4 항목 (lorekeeper 보고)

1. **진영 간 관계 그리드** — 적련궁 (서운혁) 멸문 합공 명단에 *청람검문 (유백경)* 또는 *흑익회 (고천한)* 가 포함되는지. 11 인 §인간관계 절이 *경계·호기심·거리감* 수준이라 합공 명단은 worldsmith 가 확정 필요.
2. **페이즈 2 작가 정체 단서 일관성** — 부영 마을 멸문 시기 / 적련궁 합공 명단 마지막 줄 / 청람검문 가전 첫 줄 원저자 / 천룡신교 첫 신앙 대상 / 흑익회 광혈도법 비급 첫 페이지 공백 / 림우경 고대 차원 멸망 원인. *6 단서가 단일 작가로 수렴* vs *서로 다른 작가의 여러 작품* 결정.
3. **현우진-에이라 관계** = *동맹·라이벌* 둘 다 후보. *룬 한 거점 영구 침묵 거래* 의 상대가 누구인지 결정.
4. **백무진 *모든 기술 본 자* 떡밥 페이즈 2 발현 형식** — *작가가 그를 역설계* 가설이 페이즈 2 어느 시점·어느 인물 발언으로 표면화. 림우경 (작가 정체 *먼저 의심*) 협업 떡밥 가능성.

### 다음 사이클 후보

- **worldsmith — 진영 SSOT 11 본문 작성** (`worldbuilding/factions/*.md` × 11) + `_series.md` *10 인 표 → 11 인 표* 동기화. lorekeeper 보고의 §6 진영 SSOT 11 일람 활용.
- **frontend-engineer — 환경 복구** = `npm install` 실행 + `npm run typecheck` 스크립트 `tsc -b --noEmit` 충돌 (TS5094) 수정 (`tsc -b` 만 또는 `tsc --noEmit` 만). 본 사이클 카드 작성과 무관한 환경 이슈.
- **ep-01~04 자작 변환** — legacy 본문에서 *사건·구성·문체 보존*, 등장인물·세계관 표현만 자작 치환. author → continuity-reviewer 파이프라인.
- **사이트 임시 zero-state 상태 유지** — manifest 11 카드 등재됐으나 chapters 빈 배열. ep-01~04 자작 변환 후 chapters 채움.

## Prompt for New Chat

```
heries (단일 작가 hongdosan, 오리지널 다세계관 정적 웹 시리즈) 작업을 이어간다.

1. .claude/handoff/CURRENT.md Read. 본 파일이 유일한 핸드오프.
2. §Relevant Files 의 모든 경로 Read 점검 + 변경 이력 hot (한도 20, 현재 18) 점검.
3. .claude/CLAUDE.md → .claude/agents/heries-*.md → .claude/skills/heries-orchestrator/SKILL.md → .claude/handoff/handoff.md → src/README.md → .claude/harness/ 진입.
4. 11 인 카드 1차 패스 (commit 09c35bb) 의 SSOT 활용. §Open Work 4 결정 항목 사용자 회신 받아 worldsmith 진영 SSOT 본문 작성 진입.
5. agent 호출 패턴 = Agent subagent_type='heries-*' 미등록 → general-purpose + 해당 agent 정의 inline 전달 (model: opus). orchestrator skill 라우팅 그대로.
6. 자작 캐릭터 작성 = origin: original 일괄 / 외부 IP 식별 표현 0 / 인간형 외형 필수 / 백무진 카피 한계 (능력 X, 기예 O) 일관.
7. 챕터 작성 = 시놉시스 3 페이즈 골격 보존 + 등장 카드 풀 Read → 자작 모티프 기반 재작성. author → continuity-reviewer 파이프라인.
8. 사이트 = `npm run dev` (reader) / `npm run dev:author` (스포 해제). 빌드 전 `npm install` 필요 (node_modules/vite 미설치 상태).
9. src/ 코드 탐색은 mcp__serena-heries__* 우선.
10. 커밋 = main 직접 + 사용자 명시 요청 시. push 는 항상 사용자 직접.

CLAUDE.md / agents/ / skills/ / handoff/handoff.md / harness/ 에 이미 적힌 내용 재기술 금지.
```
