<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries — 현재 핸드오프 (단일 파일)

> 본 파일이 **유일한 핸드오프 파일**. 세션 종료 직전 / 컨텍스트 60% 초과 시 본 파일을 *덮어쓴다*. 이전 사이클 본문 회수 = `git log -p .claude/handoff/CURRENT.md`.

**Last updated**: 2026-05-13

## Summary

**ep-01 본문화 사이클 + 명부 시스템 SSOT 확정**. 사용자 자율 권한 위임 + 다수 동시 피드백 통합. 본 사이클 12+ commit 누적 (`039cc20` ~ `a29a418` + 본 사이클 추가).

(1) **★ ep-01 *프롤로그 — 죽음을 거두는 자*** = 우진혁 단독 주인공 서사로 본문화. 11 절 구성: 군문 입대 → 죽음의 반복 → 마수 출현 + 동료의 가슴 위 손 + 각성 → 명부 (인격·호칭 다양성) → 분류 불가 + 레벨업 자유도 → 깨달음 (신체→마나 전환) → 군단주 6 단계 → CQC + 명부 흐름 → 다른 세계 단면 (10인 짧은 cut) → 림우경 찰나의 결 → 11인 한자리 → 그 침묵. 다수 사용자 피드백 (가독성·시점·운영용어 제거·처절함·호칭 다양성) 일괄 반영. 본문 카피 X (레거시 시놉시스 구조만 참고). (2) **★ 명부 시스템 SSOT 확정** = 우진혁 카드 §능력에 운영 규약 명시:
- **영혼 추출 시그니처** = `"내게 오라."` (손바닥 + 한 호흡 + 한 줄. 1회 등록 절차. 한 호흡 무방비)
- **호출 명령** = `"강림하라."` (이미 등록된 영혼 군단 깨움. 접촉 불필요)
- **6 단계 자작 영혼 위계** = 명단 → 명사 → 명관 → **명존 (이름 부여)** → **명조 (페이지 받음)** → **명장 (군단장 최대 3)**. 초기 자리 = 생전 강함으로 *대체로* 결정.
- **영혼 능력 = 생전의 70% + 누적 랭크업**. 명부 안에서 싸울수록 생전보다 강해질 수 있음.
- **인격 = 랭크 비례**. 명단/명사 = 거의 인격 없음, 말도 못함. 명관부터 본격 인격 발현.
- **호칭 다양성** = 인격 발현 후 자기 결로 다양 (*우진혁 형* / *주군* / *주(主)* / *우진혁 님* / *형님*). 강제 X.
- **CQC + 격투칼** = 군 *세 번 흘려 한 번에 가른다* 한 호흡 극. 갈라진 자리에 손바닥 → 1 회 등록.
- **레벨업 자유도** = 일반 헌터 자동 분배와 달리 우진혁만 민첩·힘·체력·마나 자유 분배. 초반 신체 → 깨달음 후 마나 위주.

(3) **카드 톤 정합** = 서운룡 *완전한 한량* (술잔 상시, 어깨 흘러내린 외포, 작년에 끝낸 강림 안배는 별 흥미 없는 일과의 한 줄) / 림우경 *찰나의 결의 부산물로서의 회귀자 자각* (결 닫히면 평범한 한국인). (4) **시리즈 cover.webp + ep-01 thumbnail** = 233 KB / 85 KB (-94%/-97%) 압축 + manifest 등록. PROMPT.md 재작성 (1화 *마수 앞 손이 얹힌 순간* 컷). (5) **UX 개선** = author 톤 다운 (배경색 제거, 작은 AUTHOR 배지) / 시리즈 작가 전용 탭 / 챕터 정렬 localStorage 캐싱 / scroll-nav 본문 옆 위치 정렬 / 마스킹 자동 검증 게이트 (`scripts/check-masking.mjs`). (6) **features/character-mention** 슬라이스 = `{{char:id|name}}` 마크다운 syntax + 호버 lazy fetch summary 툴팁 + localStorage 캐싱. 클릭 기능 없음 (맥락 정보 전용). ChapterCharacterStrip 제거. 본문 내 캐릭터 mention 의 *유일 공식 표현*. (7) **assetUrl + BrowserRouter** = SPA 라우트 상대경로 fetch 버그 fix (`Unexpected token '<'`). 모든 자산 경로 `assetUrl('content/...')`. (8) **빌드 격리** = reader → dist / author → dist-author. masking 게이트 통과.

## Key Decisions (현행)

- **11 인 자작 매핑** = **우진혁** (1-protagonist, 단독 주인공) / 에이라 / 야무라 토우 / 서운룡 (혈교 한량 혈마) / 천령극 / 고천한 / 유백경 (천하일대검수) / 막무련 (녹림왕) / 림우경 (찰나의 결) / 현우 (전생 검신) / 백무진 (평범 학생 카피).
- **자작 메커니즘 명명** = 마나 (명부 호흡 폐기, 일반 명사 채택) / 영혼 추출 *"내게 오라"* / 호출 *"강림하라"* / 6 단계 영혼 위계 (명단·명사·명관·명존·명조·명장) / 천하삼십육검 / 만수파천권 / 찰나의 결 / 피의 결 / 신체 강탈 강림 안배. **외부 IP 식별 표현 0**.
- **본문 vs 카드 운영 분리** = 카드 SSOT 에는 운영 용어 (시그니처·6 단계 위계명·호출 한 줄) 명시. 본문은 *읽히는 서사* 만 — 운영 용어 직접 노출 X.
- **자산 경로** = `assetUrl('content/...')` (src/shared/lib/env.ts) 만 사용. raw './content/...' 금지.
- **build outDir** = reader → `dist` / author → `dist-author`.
- **author = reader superset** = 코드 1 벌 공유.
- **하네스 라우팅** = `heries-orchestrator` skill / agent 호출 = `general-purpose + 정의 inline + model: opus`.

## Traps to Avoid

- **외부 IP 식별 표현 금지** — *그림자 군주·일어나라·깨어나라(나혼렙)·차크라·매화검법·수라혈천도·접촉 발동·모노마·가로우* 등 회피.
- **본문에 운영 용어 직접 노출 X** — *시그니처·6 단계 명·호출 한 줄* 은 카드 SSOT 에만. 본문은 서사 흐름만.
- **자산 경로 raw 작성 금지** — `assetUrl('content/...')` 경유.
- **이름 변경 시 정합 체크리스트** = (1) git mv (2) frontmatter slug + name + 한자 (3) `# 제목` (4) 본문 자기 언급 (5) manifest.json (6) _series.md 행·링크 (7) 다른 카드 인간관계 (8) build/typecheck 0.
- **빌드 outDir 충돌 금지** — author 빌드는 항상 `dist-author/`.
- **GitHub URL 한글 username 금지** — 실제 = `hongdosan/heries`.
- **인간형 외형 필수** + **모든 카드 origin: original**.
- **`_legacy_*` 빌드 누수 방지** — `copy-content.mjs` skip 규칙.
- **호칭 단일화 금지** — 영혼 호칭은 *우진혁 형 / 주군 / 주(主) / 형님* 등 인격에 따라 다양. *모두가 주(主) 라고 부른다* 같은 단일화는 강제 톤 위반.

## Working Agreements

- main 브랜치 only / **Claude 자동 commit + push 권한** (사용자 자율 위임 명시 시).
- 작가 표기 = `홍도산` (.md 고지문) / `hongdosan` (GitHub username).
- 커밋 메시지 = 본문 한글, `type(scope):` prefix 영어. co-author = `Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- 모든 .md 첫 줄 = `<!-- © 2026 홍도산. All rights reserved. Original creator work. -->`.
- 누적 산출물 정책 v3.
- Serena MCP 우선 (`mcp__serena-heries__*`) for `src/`.
- agent 호출 = `general-purpose + 정의 inline` (model: opus).
- 캐릭터 카드 구조 = 공개 절 vs 작가 분기 절 (`## H-eries 분기` 이하 + heries_arc 마스킹).

## Relevant Files

- `src/features/character-mention/{character-mention.tsx, index.ts}` ({{char:id|name}} hydration + 호버 툴팁 + localStorage 캐싱)
- `src/shared/lib/env.ts` (`assetUrl` + `IS_AUTHOR_MODE`)
- `src/shared/lib/markdown.ts` (`{{char:id|name}}` syntax + `{term|description}` abbr + author-only-heading 클래스 자동 부여)
- `src/shared/lib/{manifest, use-img-fallback, spoiler}.ts`
- `src/pages/{home,about,notice,series,chapter,character}/*.tsx`
- `src/widgets/{chapter-toc,series-list,header,footer}/*.tsx` (chapter-character-strip 제거됨)
- `src/app/main.tsx` (ErrorBoundary + BrowserRouter + import shorten)
- `src/shared/ui/error-boundary/*`
- `src/shared/styles/style.css` (character-mention + author-only + scroll-nav 본문 옆 위치)
- `vite.config.ts` (`VITE_AUTHOR_MODE` → base + outDir 분기)
- `package.json` (name `heries` + homepage + check-masking 게이트)
- `scripts/{check-images,copy-content,optimize-images,check-masking}.mjs`
- `content/series/clash-of-multiverses/_series.md` (11 인 표 + status)
- `content/series/clash-of-multiverses/manifest.json` (11 인 + cover.webp + ep-01 chapter)
- `content/series/clash-of-multiverses/thumbnails/{cover.webp, ep-01-prologue.webp, PROMPT.md}` (작가 직접 생성, 압축됨)
- `content/series/clash-of-multiverses/characters/1-protagonist/woo-jin-hyeok.md` (★ 명부 시스템 SSOT)
- `content/series/clash-of-multiverses/characters/2-major-supporting/{eira, yamura-tou, seo-un-ryong, cheon-ryeong-geuk, go-cheon-han, yu-baek-gyeong, mak-mu-ryeon, rim-woo-gyeong, hyeon-woo, baek-mu-jin}.md`
- `content/series/clash-of-multiverses/chapters/ep-01-prologue.md` (★ 11 절 본문화)
- `content/series.json` (clash-of-multiverses 메타 + cover thumbnail)
- `content/{about,notice}.md` + `NOTICE.md`
- `.claude/CLAUDE.md` + agents/ + skills/ + harness/
- `content/_legacy_recovery_2026-05-12/**` (gitignored)

## Open Work

### 보류 결정 사항

1. **명장 (冥將) 3 자리 후보** = 옛 작전 동료 (첫 줄 확정) + ? (중심 줄, 페이즈 1 진행 중) + ? (마지막 줄, 페이즈 1 말). 11 인 중 누가 양보 없이 자리하는지가 페이즈 1 핵심 떡밥.
2. **서운룡 신체 강탈 강림 안배 대상** = 미특정. 후보 = 우진혁 / 유백경 / 고천한 / 막무련.
3. **legacy 차원의 격돌 이미지** (dangling PNG `be9b36f`) — 사용자 결정 보류.

### 다음 사이클 후보

- **ep-02 1막, 첫 격돌** — 무대 위 첫 피 + 그 피의 영혼이 우진혁의 명부에서 어디로 가는지. 호출 명령 *"강림하라."* 본격 등장.
- **worldsmith 진영 SSOT 11 본문** = 명부·룬 각인·은신 마을·혈교·천룡신교·흑익회·종남파·녹림·찰나의 결·환생자·평범한 학생 11 진영.
- **CLAUDE.md 11 인 매핑 반영** = 현재 핸드오프·_series.md 에만. CLAUDE.md §핵심 원칙 또는 §하네스 트리거 영역에 11 인 SSOT 요약 1 절 추가 검토.
- **부차 발견** = useAsync AbortController / ChapterPage 컴포넌트 분해 / 페이지별 ErrorBoundary / 외부 링크 `rel="noopener"` 자동 부착.

## Prompt for New Chat

```
H-eries (단일 작가 hongdosan / 표기 홍도산, 오리지널 다중/평행 세계 정적 웹 시리즈) 작업 이어감.

1. .claude/handoff/CURRENT.md Read.
2. §Relevant Files 점검 + 변경 이력 hot (현재 5 / 한도 20, archive 80 행).
3. .claude/CLAUDE.md → agents/ → skills/ → src/README.md → harness/ 진입.
4. 자동 commit + push 권한 (사용자 자율 위임 명시 시).
5. 11 인 매핑 = 우진혁 / 에이라 / 야무라 토우 / 서운룡 (한량 혈마) / 천령극 / 고천한 / 유백경 / 막무련 / 림우경 / 현우 / 백무진.
6. 명부 시스템 SSOT (우진혁 카드 §능력):
   - 영혼 추출 "내게 오라" / 호출 "강림하라"
   - 6 단계: 명단·명사·명관·명존(이름 부여)·명조(페이지)·명장(군단장 3)
   - 능력 = 생전 70% + 누적 랭크업 / 인격 = 랭크 비례 / 호칭 = 자기 결로 다양
   - CQC 격투칼 + 마나 자유 분배
7. 자작 메커니즘 = 마나 / 천하삼십육검 / 만수파천권 / 찰나의 결 / 피의 결 / 강림 안배.
8. 본문 vs 카드 = 운영 용어 (시그니처·랭크명·호출 한 줄) 는 카드 SSOT 에만. 본문은 서사만.
9. 자산 경로 = assetUrl('content/...'). raw 금지.
10. 마크다운 캐릭터 mention = {{char:id|name}} (호버 툴팁만, 클릭 없음).
11. 챕터 작성 = 시놉시스 보존 + 카드 SSOT 사실화 + 본문 카피 X. author → continuity-reviewer.

CLAUDE.md / agents/ / skills/ / harness/ 재기술 금지.
```
