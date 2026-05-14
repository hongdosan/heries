<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# CURRENT 핸드오프 (2026-05-14, 정책 v2 unlock 사이클 C1-C5 완료)

## 한 줄

작가 모드 정책 v2 — 단일 빌드 + runtime `/unlock` 진입. C1 (CLAUDE.md #9 갱신 + #13 신설 + character-doctrine SSOT) → C2 (env/spoiler/scripts/CI) → C3 (/unlock 페이지) → C4 (캐릭터 카드 + 주인공 외 라우트 가드) → C5 (README/핸드오프 동기화). 우진혁 등장인물 디테일 논의는 별도 작업으로 분리.

## 사용자 commit 정책

C1-C5 각 사이클을 분리 commit (사용자 정책 준수, main 브랜치 + 직접). 사용자 사인오프 후 `git push`.

## 현 상태

### 정책 (CLAUDE.md v2)
- 원칙 #9 = 단일 빌드 + sessionStorage `heries:author=1`. `/unlock` 페이지 + `?unlock=KEY` 쿼리. devtools 우회 = 독자 자기 책임.
- 원칙 #13 신설 = 개인 정보·시크릿·`VITE_AUTHOR_KEY` 코드/git 노출 금지. `scripts/check-secrets.mjs` 가 빌드 게이트.

### 코드
- `src/shared/lib/env.ts` = `isAuthorMode/setAuthorMode/verifyAuthorKey` 함수 (`IS_AUTHOR_MODE` const 폐기).
- `src/shared/lib/use-author-mode.ts` 신규 hook — custom event `heries:author-mode-changed` + `storage` event 구독.
- `src/pages/unlock/` 신규 슬라이스. 폼 + 쿼리 자동 검증 + 잠그기.
- `src/widgets/character-list/` = 카드 그리드. 주인공만 Link, 나머지 정적 카드. summary 표시.
- `src/pages/character/character.tsx` = 비-작가 비-주인공 진입 시 잠금 화면.
- `scripts/copy-content.mjs` = 마스킹 로직 제거 (단순 복사). `scripts/check-secrets.mjs` 신규 (check-masking 대체).
- `vite.config.ts` / `package.json` / `.github/workflows/deploy.yml` = 단일 빌드 정합.

### 콘텐츠
- 우진혁 카드 = 종전 그대로 (별도 작업 분리). manifest.json 에 summary 1줄 추가.
- `worldbuilding/character-doctrine.md` = 캐릭터 정책 SSOT.

### 빌드 검증
- typecheck 0 / build 0 / build-storybook 0 / check-secrets 0 누수.
- dist css 43.30 KB / js 286.36 KB.

## 다음 세션 진입 체크리스트

1. **`git status` / `git log --oneline -8`** — C1-C5 5 commits 확인. main 에 push 여부 확인.
2. **GitHub Repository Secret 등록** — `VITE_AUTHOR_KEY=<임의문자열>` 추가 (settings → secrets and variables → actions). 미설정 시 라이브 사이트 작가 모드 영구 잠금.
3. **로컬 `.env.local` 작성** — `VITE_AUTHOR_KEY=<동일문자열>` (gitignore 확인 — `.env*` 패턴 이미 차단됨).
4. **우진혁 등장인물 논의 재개** — 능력 큰 틀 (사령 권속) 보존 + 분기·인간관계·외형·서사 디테일 채우기. SSOT 골격만 박고 챕터 작성 중 점진 동기화 (메모리 정책).
5. **다음 트랙 결정** — 첫 챕터 작성 / 미니 게임 폴리시 / 새 무대 컨셉 중 사용자 결정.

## Relevant Files

- `.claude/{CLAUDE.md, harness/harness-state.md, handoff/CURRENT.md}`
- `content/series/clash-of-multiverses/{manifest.json, worldbuilding/character-doctrine.md, characters/1-protagonist/woo-jin-hyeok.md}`
- `src/pages/unlock/`, `src/widgets/character-list/`, `src/pages/character/character.tsx`
- `src/shared/lib/{env.ts, spoiler.ts, use-author-mode.ts}`
- `scripts/{copy-content.mjs, check-secrets.mjs}` (구 check-masking.mjs git rm)
- `vite.config.ts`, `package.json`, `.github/workflows/deploy.yml`
- `README.md`, `src/README.md`
