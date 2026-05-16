<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# Tailwind 마이그레이션 전략

H-eries 의 CSS 운영은 *coexist* 패턴 — 기존 디자인 토큰 + 슬라이스 CSS 와 Tailwind 가 병존. 점진 마이그레이션.

## 1. 도입 배경

- **v0.3.0** (2026-05-16) — React Compiler + ESLint + Tailwind v4 도입 milestone
- 사용자 명시 = *어려워도 미리 도입* — 향후 페이지 확장 시 atomic class 생산성 + 토큰 utility 일관 가치
- *전면 마이그레이션* 일시 진입 = 회귀 위험 큼 → **점진 마이그레이션** 채택

## 2. 현 상태

| 항목 | 상태 |
|---|---|
| Tailwind v4 설치 | ✅ `tailwindcss` + `@tailwindcss/vite` (devDep) |
| Vite plugin 등록 | ✅ `vite.config.ts` |
| 토큰 통합 | ✅ `src/shared/styles/tailwind.css` 의 `@theme` 블록에 기존 디자인 토큰 노출 (bg / fg / accent / spacing / font) |
| main.tsx import | ✅ tokens.css 직후 |
| 기존 CSS | ✅ 그대로 유지 (tokens.css / base / typography / layout / utilities / author-mode / responsive / 슬라이스 .css 모두 활성) |

## 3. 사용 컨벤션

### 신규 컴포넌트
**Tailwind utility class 우선**. 예:
```tsx
<button className="bg-accent text-white px-4 py-2 rounded">
  Click
</button>
```

토큰 활용: `bg-accent`, `text-fg-2`, `bg-bg-soft` 등 (`tailwind.css` 의 `@theme` 에 정의된 var 자동 노출).

### 기존 컴포넌트
**그대로 유지**. 슬라이스 .css 의 명명 클래스 (`mini-game-launcher`, `sm-stickman` 등) 변경 X.

### 점진 마이그레이션 트리거
- 컴포넌트를 *큰 폭으로 정정* 할 때 (예: 디자인 변경 / 메커닉 추가)
- 검토 사이클에서 *시각 개선 요청* 받을 때
- 새 페이지 / 새 mini-game 신규 작성 시

기존 코드를 *마이그레이션만 목적* 으로 건드리지 않는다 (회귀 위험 > 가치).

## 4. 토큰 매핑 (기존 → Tailwind utility)

| 기존 var | Tailwind utility |
|---|---|
| `var(--bg)` | `bg-bg` |
| `var(--fg)` | `text-fg` |
| `var(--fg-2)` | `text-fg-2` |
| `var(--accent)` | `bg-accent` / `text-accent` / `border-accent` |
| `var(--rule)` | `border-rule` |
| `var(--s-4)` (16px) | `p-4` / `m-4` / `gap-4` (spacing-4) |
| `var(--font)` | `font-sans` |

mini-game (`--mg-*`) 와 광살검 (`--sm-*`) 토큰 = Tailwind `@theme` 미통합. 게임 슬라이스 안에서는 기존 var 그대로 사용 (게임 = 점진 마이그레이션 후순위).

## 5. 마이그레이션 제외 항목

- **게임 슬라이스** (`mini-game/`) — 게임 RAF loop / 동적 inline style 다수 → Tailwind 가치 작음
- **마크다운 렌더링** (`shared/lib/markdown.ts`) — 본문 자체 클래스는 typography.css 의 `.article-prose` 등 유지
- **storybook stories** — 시연만 (변경 가치 작음)

## 6. 빌드·번들 영향

- Tailwind v4 = 사용 utility 만 추출 (purge 자동)
- 현 상태 (`@theme` 정의만 / utility 사용 0) = dist css 영향 ~0 KB
- 점진 마이그레이션 시 = 새 utility 사용분만 추가, 기존 CSS 점진 제거 후 *전체 dist css size 변동 최소*

## 7. 측정·검증

- 마이그레이션 PR 단위로 *시각 회귀 검증* (Storybook variant 비교)
- dist css gzip 추이 monitoring
- 사용자 시연 (개발자 본인) 으로 *행동 회귀 0* 확인

## 8. 향후 로드맵 (예시)

| Phase | 범위 | 시점 |
|---|---|---|
| 1 (v0.3.0) | Tailwind 셋업 + 토큰 통합 + 본 문서 | 완료 |
| 2 | 신규 페이지 / 컴포넌트 = Tailwind 우선 | 진행 중 (작가 자율) |
| 3 | `widgets/` 의 작은 컴포넌트 점진 전환 (chapter-toc, character-list 등) | 사용자 결정 시 |
| 4 | `pages/` 마이그레이션 | 사용자 결정 시 |
| 5 | mini-game / markdown 등 마지막 보루 | 가치·필요성 검토 후 |

## 9. 참고

- Tailwind v4 docs: https://tailwindcss.com/docs/v4-beta
- 본 프로젝트 디자인 토큰 SSOT: [`tokens.css`](./tokens.css)
- 게임 토큰 (`--mg-*`): [`../../features/mini-game/mini-game.css`](../../features/mini-game/mini-game.css) line 349+
- 게임 토큰 (`--sm-*`): [`../../features/mini-game/games/stickman-murim/stickman-murim.css`](../../features/mini-game/games/stickman-murim/stickman-murim.css)
