<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# Changelog

H-eries 의 *작품 + 코드* 모든 변경을 tag 단위로 기록한다.

형식 = [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) + [SemVer](https://semver.org/lang/ko/).

브랜치·release 운영 규약 = [`.claude/harness/git-strategy.md`](./.claude/harness/git-strategy.md).

---

## [Unreleased]

(다음 release 후보 — develop 안 누적 변경)

---

## [v0.2.0] — 2026-05-16

### Added (작품)
- 챕터 ep-01 *마수의 등장* 발행 (직전 사이클 누적, tag 0.1.x 미부여 분 포함)
- 챕터 ep-02 *마수와 사람 사이* 발행
- 챕터 ep-03 *입소* 발행
- 우진혁 카드 작가 백엔드 32+ 절 + reader_snapshot ep-03

### Added (코드 · 게임)
- **광살검 (stickman-murim) 미니 게임 신규** — 가로형 검술·장풍·이형환위·광살 액션
  - sprite 11장 (hero / hero-attack / hero-qi / hero-dash / assassin / elite / impact / impact-elite / death / gwangsal / dash-burst)
  - 메커닉: 베기 (Space) / 장풍 (Z, 내공 14 관통) / 이형환위 (Shift, 내공 31 + 3초 무적 + 경로 적 일소) / 광살 (내공 234 가득 시 자동, 적 전체 즉사)
  - dialog `mini-game-frame--landscape` modifier (가로형 dialog 수용)
- **디자인 토큰 (`--sm-*`) 20 토큰** 도입 (검기생존록 `--mg-*` 패턴 정합)
- **CHANGELOG.md + .claude/harness/git-strategy.md** 신규 (브랜치 전략 SSOT)

### Changed (코드 구조)
- **이미지 자산 폴더 이동** — `content/_shared/images/` → `src/shared/images/` (FSD 정합)
  - vite `?url` import 전환 → 자동 hash + cache-busting
  - 14장 이동 (mini-game sprite + heries-mark + thumbnail-placeholder + favicon)
- `scripts/check-images.mjs` + `optimize-images.mjs` 스캔 경로 갱신
- 시리즈 페이지에도 mini-game launcher 추가 (home + series 양쪽)
- 검기생존록 sprite 경로도 새 위치 정합
- `index.html` favicon 경로 정합

### Fixed
- `dashCdFraction = NaN` 버그 (DASH_COOLDOWN_MS=0 일 때 0/0) → ki 잔량 기반 게이지로 전환
- 광살검 sprite 본체 위치와 보호막 mismatch — ring 폐기 + sprite 자체 cyan drop-shadow glow
- `flipped` 로직 반전 (피격 sprite 방향)
- 장풍 hit knockback 제거 + wave `hitIds` per-wave 추적 (같은 적 중복 hit 차단)

### Removed (cleanup)
- 광살검 dead CSS ~120줄 (SVG 시절 잔존 룰 + ring `::before` fallback)
- TSX 미사용 import / 상수 (`SPRITE_DASH_BURST`, `DashGhost`, `KI_PER_QI_KILL`, `cx`)
- stale 주석 (졸라맨 무협 → 광살검, 천검기 폐기, 無影步 → 이형환위, 이형화위 오타)

### Refactored
- Magic number 9곳 상수화 (`HURT_FLASH_MS`, `QI_CAST_POSE_MS`, `GWANGSAL_FX_MS`, `DASH_PATH_PAD_RATIO`, `PARTICLE_LIFE_JITTER_*`, `PARTICLE_VY_BIAS_RATIO`, `GWANGSAL_HITSTOP_MS`, `ENEMY_KNOCKBACK_ON_DAMAGE`)
- nested ternary → if/else 추출 (광살검 2곳)
- React UMD global → 명시 import (`ReactNode`, `MouseEvent`, `CSSProperties`)
- `role="application" + tabIndex` 위치 정합 (광살검 ↔ 검기생존록 자매 게임 패턴 통일)

### Verified
- typecheck 0 / vite build 통과 (126 modules)
- dist css **11.33 KB gzip** / js **97.31 KB gzip**
- 이미지 budget OK (34 files, all ≤ 500 KB)
- check-secrets 0 누수

---

## [v0.1.0] — 2026-05-14

### Added (초기화 사이클 + 브랜치 전략 도입 전 누적)
- H-eries 프로젝트 초기 구조 (FSD 6 레이어, React 19 + Vite + Storybook)
- 작품 #1 *차원의 격돌* (clash-of-multiverses) 골격
- 우진혁 카드 작가 백엔드 700+ 줄
- 미니 게임 *검기생존록 (swordsman-survival)* 신규
- 작가 모드 unlock 정책 v2 (단일 빌드 + runtime `/unlock` + `?unlock=KEY`)
- 빌드 게이트 — `check-images.mjs` + `check-secrets.mjs`
- 디자인 토큰 (`tokens.css`) + 다크 모드 자동 전환
- mini-game dialog launcher (catalog + games/)
- 콘텐츠 마크다운 렌더러 (`shared/lib/markdown.ts`)
- 컴포넌트 storybook (`shared/ui/` + 일부 `widgets/`)

### Notes
- v0.1.0 이전 git history = 본 tag 의 누적 변경. 자세한 commit 단위는 git log 참조.
- 본 release 직전 = 브랜치 전략 도입 (v0.2.0 부터 develop / release / main 3 branch + tag).
