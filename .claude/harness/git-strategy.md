<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries Git 브랜치 전략

본 문서는 `H-eries` 프로젝트의 **브랜치 운영 규약 + tag/release 흐름** SSOT 다. 단일 작가 (`hongdosan`) 가 직접 commit 하는 가벼운 [Git Flow 변형] 을 채택한다.

## 1. 3 branch 구조

| branch | 목적 | 직접 commit | 자동 배포 | 보호 수준 |
|---|---|---|---|---|
| **`develop`** | 활발 개발의 기본 작업 branch — 챕터·미니 게임·코드 변경 모두 여기서 시작 | ✅ (작가 직접) | ❌ | 자유 |
| **`release`** | release candidate — `develop` 안정 시점을 옮겨 사전 검수 (빌드·시각 확인) | ⚠️ hotfix 만 (예외) | ❌ | merge 대상 |
| **`main`** | 배포 대상 — GitHub Pages auto-deploy 트리거. **tag 가 붙는 시점** | ⚠️ 사용자 명시 시 직접 commit 가능 (긴급 patch / 단축 사이클). 기본 = release → main merge | ✅ `deploy.yml` (push 트리거) | merge + tag 또는 사용자 명시 직접 commit |

> **사용자 commit 정책 (메모리 정합)**: main push 는 *사용자 명시 시에만* (예: "main 브랜치 0.2.4 진행"). 에이전트의 자율 해석 X. "develop 진행", "release 사이클" 등은 main 자동 위임 아님.

## 2. 흐름

```
develop ────●────●────●────●  (일상 작업 commit 누적)
                       │
                       └─ checkout → release
                                       │
                                       ●  release/vX.Y.Z (검수: build 통과·시각 확인·broken link 0)
                                       │
                                       └─ merge → main + tag vX.Y.Z + push
                                                            │
                                                            └─ GitHub Pages 자동 배포
```

### 2-1. 일상 작업 (대다수)

```bash
git checkout develop
# … 챕터 작성 / 코드 변경 / mini-game 정정 …
git add (specific files)
git commit -m "type(scope): 한글 본문"
git push origin develop
```

`develop` push = 배포 X. 빌드 CI 만 통과 확인.

### 2-2. Release 사이클 (milestone 단위)

다음 중 하나라도 충족 시 release:

- **챕터 발행** (ep-NN.md 신규 + manifest 등록)
- **새 기능 / 큰 정정** (mini-game 신규, 정책 v 변경, 작품 추가 등)
- **버그 fix 누적 ≥ 3건** (PATCH 단위)

흐름:

```bash
# 1. release branch 생성 (develop 의 현재 시점에서)
git checkout develop
git pull origin develop
git checkout -B release   # 기존 release 덮어쓰기

# 2. 검수 — npm run build / 시각 확인 / broken link 0 / check-secrets 0
npm run build
# (수동 시각 검수)

# 3. main 으로 merge + tag
git checkout main
git merge --ff-only release   # ff-only 강제 (commit 추가 X)
git tag -a vX.Y.Z -m "한글 release note 요약"
git push origin main --follow-tags
```

`main` push = `deploy.yml` GitHub Actions 트리거 → GitHub Pages 빌드 + 배포.

### 2-3. Hotfix (예외)

배포 후 critical 버그 발견 시:

```bash
git checkout main
git checkout -b hotfix/vX.Y.Z+1
# … 정정 …
git commit -m "fix(scope): 한글 본문"
git checkout main && git merge --ff-only hotfix/vX.Y.Z+1
git tag -a vX.Y.Z+1 -m "한글 hotfix 요약"
git push origin main --follow-tags
# hotfix → develop 으로 back-merge
git checkout develop && git merge main
git push origin develop
```

Hotfix 도 PATCH 증분만 (보안 fix·broken link 등 즉시 정정 트랙).

## 3. SemVer tag 규약

`vMAJOR.MINOR.PATCH` 형식. 작품 + 코드 일원 관리.

| 증분 | 사유 | 예시 |
|---|---|---|
| **MAJOR** | 정책 v 변경 / 작품 폐기 / 사이트 전면 재설계 / breaking change | 정책 v3 → v4 도입, 코드 의존 규약 변경 |
| **MINOR** | 새 챕터 발행 / 새 캐릭터 추가 / 새 mini-game / 새 컴포넌트 | ep-NN 발행, 광살검 신규, 새 페이지 |
| **PATCH** | 정정·버그 fix·문구 정정·시각 정렬·미세 UX 정정 | typo, sprite 위치 정정, fit 로직 정합 |

**작품 이벤트 별도 tag 권장**: `chapter-04`, `mini-game-stickman-murim` 같은 *작품 단위* tag 도 부여 가능 (`v0.4.0` 과 병행). git 사이트에서 *이번 release 가 어떤 작품 이벤트* 인지 인간 가독성 ↑.

## 4. package.json version 동기화

`vX.Y.Z` tag 부여 시 `package.json` 의 `"version"` 필드도 정합:

```bash
# release 사이클 첫 단계
npm version X.Y.Z --no-git-tag-version   # tag 는 수동으로
git add package.json package-lock.json
git commit -m "chore(release): vX.Y.Z 버전 정합"
```

## 5. CHANGELOG.md

루트의 `CHANGELOG.md` 에 tag 별 변경 누적. Keep a Changelog 형식.

```markdown
## [v0.4.0] — 2026-05-16

### Added
- 광살검 (stickman-murim) 미니 게임 신규
- 디자인 토큰 (`--sm-*`) 도입

### Changed
- 이미지 자산 폴더 `content/_shared/images/` → `src/shared/images/` (FSD 정합)

### Fixed
- dashCdFraction NaN (이형환위 게이지 오동작)
```

## 6. 자동 배포 (`deploy.yml`)

현 `deploy.yml` = `main` push 트리거. develop / release push = 배포 X.

배포 흐름:
1. `main` push 또는 `vX.Y.Z` tag push
2. GitHub Actions → typecheck → vite build → check-secrets → GitHub Pages 배포
3. 사이트 = `https://hongdosan.github.io/heries/`

## 7. 사용자 메모리 정합

- **main 브랜치만 + 사용자 직접 commit** (메모리 `feedback_main_only_user_commits.md`) 정책은 **본 문서로 갱신**:
  - *작가가 작업할 때는 `develop` 에서 직접 commit*
  - *release 사이클 = 작가가 직접 `release` 생성 + `main` merge + tag 부여*
  - *에이전트가 자동 commit X — 본 정책 유지*

## 8. 워크트리 정책

워크트리 미사용 (메모리 정합). 모든 작업은 단일 working tree 의 branch 전환으로.

## 9. 본 정책 도입 시점

- **v0.2.0** (2026-05-16) — 광살검 신규 + 이미지 이동 + 디자인 토큰 + 브랜치 전략 도입 milestone
- 본 commit 이전 = main 단일 branch 운영 (git history 보존)
- 본 commit 이후 = develop 기본, release/main tag 흐름

## 10. 참고

- 본 문서 SSOT: `.claude/harness/git-strategy.md`
- 변경 이력: `CHANGELOG.md`
- 운영 자동화: `.github/workflows/deploy.yml`
- 정책 합의: [메모리 `feedback_main_only_user_commits.md`](file:///Users/hongdosan/.claude/projects/-Users-hongdosan-onion-workspace-heries/memory/feedback_main_only_user_commits.md) → 본 문서로 갱신
