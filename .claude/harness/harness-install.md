<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->

# heries 하네스 — 설치·적용 절차

[`revfactory/harness`](https://github.com/revfactory/harness) 플러그인을 `heries` 에 설치하고 첫 에이전트를 생성하기까지의 실무 절차. 상위 도입 계획·분담 원칙은 [`harness-setup.md`](harness-setup.md) 우선 참조.

## 목차

- [1. 사전 요구사항](#1-사전-요구사항)
- [2. 설치](#2-설치)
- [3. 설치 검증](#3-설치-검증)
- [4. 첫 적용 — `agent-lorekeeper` 시범 생성](#4-첫-적용--agent-lorekeeper-시범-생성)
- [5. 결과 검증 (정합성 체크)](#5-결과-검증-정합성-체크)
- [6. 후속 작업](#6-후속-작업)
- [7. 롤백·제거](#7-롤백제거)
- [8. 트러블슈팅](#8-트러블슈팅)
- [9. 참고](#9-참고)

---

## 1. 사전 요구사항

| 항목 | 요건 | 확인 방법 |
|---|---|---|
| Claude Code | 플러그인·실험 플래그 지원 버전 | `claude --version` |
| Agent Teams 실험 플래그 | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | `echo "$CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"` → `1` |
| 분담 원칙 합의 | [`harness-setup.md §2`](harness-setup.md#2-heries-도메인-분담-원칙) 매트릭스 확정 | 본 저장소 git 추적 |
| GitHub 공개 저장소 | `gh` CLI 인증 + 저장소 연결 | `gh repo view` |
| `.gitignore` 에 `_workspace/` | 하네스 중간 산출물 추적 차단 | `grep _workspace .gitignore` |

### 1.1 환경 플래그 활성화

```bash
# 단발성 (현 셸에서만)
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# 영구 (zsh 예시)
echo 'export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1' >> ~/.zshrc
source ~/.zshrc
```

> 미활성화 시 harness 가 *팀 모드* 산출물을 생성하지 못하거나 일부 절차 동작 불가.

---

## 2. 설치

두 옵션. **`heries` 는 옵션 A(Marketplace) 권장** — 업데이트·제거 표준화.

### 옵션 A — Marketplace (권장)

```
/plugin marketplace add revfactory/harness
/plugin install harness@harness-marketplace
```

> 위 명령은 Claude Code CLI 내부 슬래시 커맨드. 셸이 아닌 Claude Code 세션에서 실행.
>
> **마켓플레이스 등록명 주의** — `/plugin marketplace add revfactory/harness` 가 등록명 `harness-marketplace` 로 부여한다 (`/plugin marketplace list` 로 확인). 따라서 install 인자는 `harness@harness-marketplace`.

### 옵션 B — Direct (글로벌 스킬)

```bash
# harness 저장소 클론 후
cp -r skills/harness ~/.claude/skills/harness
```

> 모든 프로젝트에서 공통 사용. `heries` 한정이라면 옵션 A 권장.

### 2.1 산출물 디렉토리 정합

`heries` 는 **`.claude/`** 가 그대로 git 추적된다 (서브모듈·symlink 없음 — 단일 공개 저장소). harness 산출물은 다음 위치에 직접 생성:

| 디렉토리 | 처리 |
|---|---|
| `.claude/agents/` | 그대로 git 추적 |
| `.claude/skills/` | 그대로 git 추적 |
| `.claude/CLAUDE.md` | 하네스 트리거 등록 — 수동 검토 후 commit |
| `_workspace/` | harness 중간 산출물 — **`.gitignore`** 에 추가 |

`.gitignore` 에 다음 항목 보장:

```
_workspace/
```

> Marketplace 옵션 A 로 설치된 plugin 자체는 글로벌 위치(`~/.claude/plugins/marketplaces/harness-marketplace/skills/harness/SKILL.md`)에서 로드된다. 본 저장소 root 의 `.claude/skills/` 가 자동 생성되지 **않는다**. plugin 설치만으로 root 가 변경되지 않으니 §2.1 처리는 *harness 가 산출물을 root 에 처음 쓸 때* 발동한다.

---

## 3. 설치 검증

### 3.1 플러그인 로드 확인

```
/plugin list
```

`harness` 항목 노출 여부 확인.

### 3.2 환경 플래그 확인

```bash
echo "$CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"   # 1 출력되어야 정상
```

### 3.3 SKILL.md 위치 확인

```bash
find . ~/.claude -name "SKILL.md" -path "*harness*" 2>/dev/null
```

옵션 A: `~/.claude/plugins/marketplaces/harness-marketplace/skills/harness/SKILL.md`
옵션 B: `~/.claude/skills/harness/SKILL.md`

---

## 4. 첫 적용 — `agent-lorekeeper` 시범 생성

`heries` 의 첫 하네스 도입 대상은 **`agent-lorekeeper`** (등장인물·세계관 SSOT 관리). 우선순위 근거: [`harness-setup.md §2.1`](harness-setup.md#21-하네스-대상-매트릭스).

### 4.1 트리거 프롬프트 (예시)

Claude Code 세션에서 다음 자연어 프롬프트 입력:

```
하네스 구성해줘.

도메인: 비상업적 크로스팬픽 웹 시리즈 'heries' 의 등장인물·세계관·연표·용어집을 markdown SSOT 로 관리·검증하는 에이전트.
첫 작품: series/clash-of-multiverses/ (차원의 격돌).
등장인물 .md 스키마: frontmatter (name, origin, affiliation, role, first_appearance, aliases) + 서술 본문.
원작 차용 캐릭터는 origin 필드 필수 — 누락 시 reject.
오리지널 캐릭터는 origin: original 명시.
정적 사이트는 라이브러리 의존성 0 — markdown / HTML 만 사용. GitHub Pages raw static (`.nojekyll`).
모든 .md 산출물 첫 줄에 비상업적 팬픽 고지 부착:
  <!-- © 2026 hongdosan. All rights reserved. Original creator work. -->
이름 규약: 파일 agent-lorekeeper.md, frontmatter name: heries-lorekeeper.
산출물 위치: .claude/agents/.
단일 작가 가정 — 다인 협업 분기 미포함.
GitHub 공개 저장소 — 비공개 토큰·시크릿 산출물 포함 금지.
```

### 4.2 harness 자동 실행 단계 (Phase 0–6)

harness 가 다음 phase 를 자동 진행 (대화형):
- Phase 0 현황 감사 → 신규 모드 (현재 zero-state)
- Phase 1 도메인 분석
- Phase 2 팀 아키텍처 설계 (예상: 단일 에이전트 또는 생성-검증 짝꿍)
- Phase 3 에이전트 정의 → `.claude/agents/agent-lorekeeper.md`
- Phase 4 스킬 생성 → `.claude/skills/character-bible/SKILL.md` (예상 명칭)
- Phase 5 통합·오케스트레이션 → `.claude/CLAUDE.md` 트리거 추가
- Phase 6 검증 (구조/모드/실행/트리거/드라이런/시나리오)

### 4.3 산출물 확인

```bash
ls -la .claude/agents/agent-lorekeeper.md
ls -la .claude/skills/
cat .claude/CLAUDE.md   # 하네스 트리거 항목 추가 여부
```

---

## 5. 결과 검증 (정합성 체크)

[`harness-setup.md §3 Phase 3`](harness-setup.md#phase-3--산출물-정합성-검증) 7항목 통과 여부 확인.

| # | 항목 | 통과 조건 |
|---|------|----------|
| 1 | 비상업적 팬픽 고지 | frontmatter 다음 줄에 `<!-- © 2026 hongdosan. All rights reserved. Original creator work. -->` |
| 2 | SSOT 위치 인용 | `content/series/{slug}/characters/` 등 명시 |
| 3 | 라이브러리 의존성 도입 시도 | 시도 시 사용자 확인 요청, 자동 도입 금지 |
| 4 | `origin` 필드 강제 | 등장인물 카드에 `origin` 누락 시 reject |
| 5 | 단일 작가 가정 | 다인 협업 분기 미포함 |
| 6 | GitHub 공개 저장소 인지 | 비공개 토큰·시크릿 포함 금지 |
| 7 | frontmatter `name` | `heries-lorekeeper` 패턴 |

검증 실패 항목 → 수동 보정 → [`harness-state.md`](harness-state.md) 변경 이력 기록.

---

## 6. 후속 작업

### 6.1 변경 이력 기록

신규 에이전트 도입 사실을 [`harness-state.md`](harness-state.md) 변경 이력에 추가:

```markdown
| 2026-MM-DD | agent-lorekeeper 신규 (harness 시범 생성) | .claude/agents/agent-lorekeeper.md | 첫 harness 적용 — 등장인물 SSOT 관리 |
```

### 6.2 인벤토리 갱신

[`harness-state.md`](harness-state.md) §에이전트 인벤토리 — `agent-lorekeeper` 행 "미작성" → "완성 (harness 생성)".

### 6.3 첫 SSOT 시드

`content/series/clash-of-multiverses/_series.md` 작성:
- 시리즈 제목·시놉시스
- **차용 원작 목록** (작품명 · 원저작자 · 차용 범위)
- 연재 상태 (계획/연재 중/완결/휴재)
- 비상업적 팬픽 고지 1줄

### 6.4 다음 도입 후보

| 순서 | 에이전트 | 도입 트리거 |
|---|---|---|
| 2 | `agent-author` | 첫 챕터 집필 시 |
| 3 | `agent-continuity-reviewer` | 두 번째 챕터 진입 직전 |
| 4 | `agent-publisher` | 첫 GitHub Pages 발행 직전 |

---

## 7. 롤백·제거

harness README 에 공식 제거 절차 미명시. 실무적 절차:

### 7.1 옵션 A (Marketplace) 설치 시

```
/plugin uninstall harness@harness-marketplace
/plugin marketplace remove harness-marketplace
```

### 7.2 옵션 B (Direct) 설치 시

```bash
rm -rf ~/.claude/skills/harness
```

### 7.3 생성된 산출물 처리 결정 트리

- **보존** → 그대로 두고 사람이 유지보수
- **폐기** → 해당 에이전트/스킬 파일 삭제
   ```bash
   rm .claude/agents/agent-lorekeeper.md
   rm -r .claude/skills/character-bible/
   ```
- 변경 이력에 *제거 사유* 기록.

---

## 8. 트러블슈팅

### 8.1 `_workspace/` 가 git 추적됨
**원인**: §2.1 의 `.gitignore` 등록 누락.
**해결**: `.gitignore` 에 `_workspace/` 추가 후 `git rm -r --cached _workspace/`.

### 8.2 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 미적용 증상
**증상**: harness 가 단일 에이전트만 생성, 팀 모드 불가.
**해결**: `source ~/.zshrc` 후 Claude Code 재기동. `echo "$CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"` → `1` 확인.

### 8.3 생성된 에이전트의 `name` 이 패턴 미준수
**원인**: harness 가 도메인에 맞춰 즉흥 명명.
**해결**: 트리거 프롬프트에 명명 규약 명시 (§4.1). 사후 수동 보정도 가능.

### 8.4 산출물에 라이브러리 의존성 도입 시도
**원인**: harness 가 일반 정적 사이트 빌더 (Astro / Eleventy / Jekyll 등) 추천.
**해결**: 트리거 프롬프트에 *라이브러리 의존성 0 — markdown / HTML 만* 명시. 결과물에 `package.json` / `requirements.txt` / 빌드 스크립트 발견 시 수동 제거 + 변경 이력 기록.

### 8.5 등장인물 카드에 `origin` 필드 누락
**원인**: 사용자가 직접 작성 시 누락 가능.
**해결**: `agent-lorekeeper` 가 reject 하도록 트리거 프롬프트에 명시 (§4.1). 사후 검출 시 수동 보정.

### 8.6 비상업적 팬픽 고지 미부착
**원인**: harness 산출물의 frontmatter 직후 라인 누락.
**해결**: `.claude/CLAUDE.md` 에 *모든 .md 산출물 첫 줄에 고지 부착* 을 명시. 검출 도우미 1줄 스크립트:
```bash
grep -L "© 2026 hongdosan" $(find . -name "*.md" -not -path "./_workspace/*" -not -path "./node_modules/*")
```

### 8.7 `.claude/CLAUDE.md` 변경 충돌
**원인**: harness 가 자동 추가하는 트리거 항목이 기존 항목과 위치 충돌.
**해결**: harness 산출물을 별도 섹션 `## 하네스: {도메인}` 으로 격리.

### 8.8 BE/FE 같은 천기망 잔재가 산출물에 섞임
**원인**: harness 가 일반 풀스택 패턴을 가정.
**해결**: 트리거 프롬프트에 *단일 작가 가정 / FE·BE 분담 없음* 명시. 검출 시 수동 제거.

---

## 9. 참고

- harness 저장소: https://github.com/revfactory/harness
- harness SKILL.md: https://github.com/revfactory/harness/blob/main/skills/harness/SKILL.md
- 도입 가이드 (상위): [`harness-setup.md`](harness-setup.md)
- 현 상태 SSOT: [`harness-state.md`](harness-state.md)
