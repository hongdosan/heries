<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 프라이빗 설정 (`.private-config` 서브모듈)

작가 운영 내부 자료 (세션 핸드오프·작업 계획·커스텀 프롬프트) 는 별도 프라이빗 저장소 [`martial-arts-config`](https://github.com/hongdosan/martial-arts-config) 의 `heries/` 폴더에 분리 보관하고, Git **서브모듈** 로 본 repo 에 연결한다.

본 문서는 H-eries 의 서브모듈 운영 SSOT. 천기망 (`martial-arts`) 의 [private-config 문서](https://github.com/hongdosan/martial-arts/blob/develop/docs/readme/private-config.md) 와 같은 패턴을 H-eries 정합으로 적용.

## 1. 현재 구조

| 메인 경로 (심링크) | → | 실제 위치 (`.private-config/heries/` 안) |
|---|---|---|
| `.claude/handoff/` | → | `.private-config/heries/claude/handoff/` |
| `.claude/workflow/plan/` | → | `.private-config/heries/claude/workflow/plan/` |
| `.claude/workflow/prompt/custom/` | → | `.private-config/heries/claude/workflow/prompt/custom/` |

`.gitignore` 가 위 3 심링크를 무시 — 본 repo (공개) 에 노출되지 않음.

## 2. 분리 자료 / 미분리 자료

### 분리 (`.private-config/heries/` 안)
- **세션 핸드오프** (`CURRENT.md`) — 작업 상태·다음 단계 등 내부 메모
- **작업 계획** (`workflow/plan/ep-NN/*`) — 챕터 작성 단계·시놉시스 협의·검토 사이클 디테일
- **커스텀 프롬프트** (`workflow/prompt/custom/*`) — 작가 운영 노하우, 시리즈별 프롬프트 변형

### 미분리 (공개 repo 그대로)
- `.claude/agents/heries-*.md` — 에이전트 정의 (운영 SSOT, 외부 참고 가치)
- `.claude/skills/` — 스킬 정의
- `.claude/CLAUDE.md`, `.claude/harness/` — 핵심 정책 + 본 문서 포함
- `.claude/workflow/{workflow.md, template/}` — 일반 워크플로우 + 템플릿
- 콘텐츠 (`content/series/.../{chapters,characters,worldbuilding,...}`) — 작품 본문. 작가 분기 절은 runtime 마스킹 (`/unlock` 게이트) 으로 별도 보호

## 3. 흐름 (작가 직접 작업)

### 3-1. 처음 clone 후

```bash
git clone --recursive https://github.com/hongdosan/heries.git
cd heries
./scripts/init-private.sh   # 심링크 자동 생성
npm install
npm run dev
```

서브모듈 권한 없으면 (외부 기여자 등):

```bash
git clone https://github.com/hongdosan/heries.git
cd heries
./scripts/init-private.sh   # 안내만 출력, Mock 모드 진입
npm install
npm run dev                 # handoff·plan·prompt 미반영 상태로 빌드 가능
```

### 3-2. 핸드오프·계획·프롬프트 변경 시

```bash
# 1. 심링크 경유로 평소처럼 수정
vim .claude/handoff/CURRENT.md
# ↑ 실제로는 .private-config/heries/claude/handoff/CURRENT.md 가 수정됨

# 2. 서브모듈 안에 commit + push (프라이빗 저장소로 전송)
cd .private-config
git add heries/claude/handoff/CURRENT.md
git commit -m "docs(heries): 핸드오프 갱신"
git push origin main

# 3. 메인 repo 의 서브모듈 포인터 갱신
cd ..
git add .private-config
git commit -m "chore: bump .private-config (heries 핸드오프 갱신)"
git push
```

자동화 — 한 번에 push (메인 repo 1회 설정):

```bash
git config push.recurseSubmodules on-demand
```

이후 메인 `git push` = 서브모듈 미푸시 시 함께 push.

### 3-3. 폴더 구조 변경 (예: prompt/custom → prompt/private)

```bash
cd .private-config
git mv heries/claude/workflow/prompt/custom heries/claude/workflow/prompt/private
git commit -m "refactor(heries): prompt 폴더명 변경"
git push origin main
cd ..

# 본 repo 의 심링크 재생성
rm .claude/workflow/prompt/custom
ln -s ../../../.private-config/heries/claude/workflow/prompt/private .claude/workflow/prompt/private

# .gitignore 갱신 + scripts/init-private.sh 매핑 정정
# 본 repo commit
git add .gitignore scripts/init-private.sh .private-config
git commit -m "chore: 심링크·init 스크립트 정합"
git push
```

## 4. 서브모듈 동작 원리 (핵심)

`.private-config` 는 *본 repo 의 일부* 가 아닌 **별개의 git 저장소** 가 본 위치에 끼워 넣어진 상태. 본 repo 의 git history 에는 `.private-config` 의 **포인터 SHA** 만 기록 — 실제 파일 변경 내역은 `martial-arts-config` repo 의 history 에만 누적.

**메인 로그에서 서브모듈 변경 내역까지 보고 싶다면**:

```bash
git config diff.submodule log
git config status.submoduleSummary true
# 또는 일회용
git log --submodule=log
```

자세한 원리·시나리오·트러블슈팅 = 천기망의 [`private-config.md`](https://github.com/hongdosan/martial-arts/blob/develop/docs/readme/private-config.md) 참고.

## 5. 보안 / 접근 권한

- `martial-arts-config` repo = private. clone 권한은 작가 + 합의된 협업자만
- H-eries 의 *민감 정보* 자체는 기본적으로 *작가 운영 노트 수준* — 천기망의 .env.dev / OAuth secret 같은 *고감도 키* 는 H-eries 에 없음
- 작가 분기 카드 본문 + `_series.md` 시놉시스 = `/unlock` runtime 마스킹으로 별도 보호 (정책 #9, v2)
- `VITE_AUTHOR_KEY` = `.env.local` (gitignore) + GitHub Secret — 본 서브모듈에 X

## 6. 본 정책 도입 시점

- **v0.2.x** (2026-05-16) — 광살검 release 후 develop 사이클에서 도입
- 본 도입 이전 = `.claude/handoff/` `.claude/workflow/plan/` `.claude/workflow/prompt/custom/` 가 본 repo 에 직접 commit 됨 (git history 보존)
- 본 도입 이후 = 위 3 경로의 신규 변경은 서브모듈에만 누적

## 7. 사용자 메모리 정합

`feedback_main_only_user_commits.md` (3 branch 전략 v2) 와 정합:
- 서브모듈 변경도 `develop` 에서 진행 (release 사이클까지)
- 에이전트 자동 commit 정책 동일 (사용자 명시 시에만)
- 워크트리 미사용 (단일 working tree + branch 전환)

## 8. 참고

- 본 문서 SSOT: `.claude/harness/private-config.md`
- 브랜치 전략: [`.claude/harness/git-strategy.md`](./git-strategy.md)
- init 스크립트: [`scripts/init-private.sh`](../../scripts/init-private.sh)
- 천기망 원본 패턴: [martial-arts/docs/readme/private-config.md](https://github.com/hongdosan/martial-arts/blob/develop/docs/readme/private-config.md)
