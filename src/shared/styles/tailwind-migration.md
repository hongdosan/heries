<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# CSS 아키텍처 — Tailwind v4 utility-first (전면 전환)

## 0. 정책 (2026-05-17, 사용자 명시)

**Tailwind 만 사용 가능하면 Tailwind 로 전환**. 프론트엔드 트렌드 = *Utility-first + Design tokens centralized*. 슬라이스 옆 `.css` 파일 = 점진 폐기.

예외 (CSS 파일 유지):
1. **`src/shared/styles/`** = 전역 reset / typography / utility / responsive / author-mode / scrollbar — Tailwind utility 로 표현 어려운 *전역 동작* 및 *디자인 토큰*.
2. **게임 슬라이스** (`features/mini-game/*.css`, `features/mini-game/games/*/*.css`) = 게임 좌표계 (`px` 고정), `@keyframes`, `transform: scale(var(--mg-scale))`, `::-webkit-scrollbar-thumb` 등 Tailwind 가 표현 안 하는 패턴 다수. 점진 보류.
3. **마크다운 본문** = `.article-prose` 등 → typography 슬라이스 + Tailwind 의 `prose` plugin 도입 검토.

## 1. 차용 아키텍처

### 1-1. ITCSS (Inverted Triangle CSS) — CSS 메인 아키텍처

CSS specificity 가 *낮음 → 높음* 으로 점진 증가하는 7 레이어 (Harry Roberts 발표, 2014 — 프론트엔드 표준 중 하나):

| ITCSS layer | 본 프로젝트 매핑 | 특징 |
|---|---|---|
| **1. Settings** | `tokens.css :root var` + `tailwind.css @theme` | 디자인 토큰 (색·spacing·font·radius). 정적 값. specificity 0. |
| **2. Tools** | (미사용) | Sass mixin 등. Tailwind v4 + CSS var 로 대체 가능 → 도입 X. |
| **3. Generic** | `base.css` *reset* (`box-sizing`, `margin: 0` 등) + Tailwind preflight | 브라우저 reset. element selector. |
| **4. Elements** | `base.css` 의 `a / button / img` + `typography.css` 의 `h1~h6 / main h*` | unstyled HTML element 기본 룰. |
| **5. Objects** | `layout.css` (`main`, `.breadcrumb`) + `utilities.css` (`.empty`, `.skip-link`, `.route-transition`) | layout pattern (cosmetic 없음). 재사용 가능 시맨틱. |
| **6. Components** | 슬라이스 별 `.css` (게임 = mini-game.css / stickman-murim.css 등) + shadcn 형 컴포넌트 시맨틱 class | UI 컴포넌트 구체 룰. |
| **7. Utilities** | **Tailwind utility class** (`bg-accent`, `p-4`, `flex` 등) | 가장 높은 specificity. 빈번한 직접 적용. atomic. |

**원칙**: 컴포넌트는 utility (layer 7) 우선 → 표현 안 되면 component class (layer 6) → 그래도 안 되면 object / element / generic 으로 내려감. Settings (token) 은 모든 layer 의 SSOT.

### 1-2. 보조 아키텍처 / 패턴

| 아키텍처 / 패턴 | 차용 부분 |
|---|---|
| **Utility-first (Tailwind v4)** | ITCSS layer 7 의 구체화. 모든 컴포넌트 슬라이스에서 `className` 직접 사용. |
| **shadcn/ui 패턴** | `cn()` helper (조건부 class 조합) + headless 컴포넌트 + variants. `src/shared/lib/cn.ts` 신규. |
| **Design tokens centralized** | `tokens.css` 가 SSOT (Settings layer). `tailwind.css @theme` 가 정적 동기화. 다크 모드 = tokens.css 의 `[data-theme="dark"]` 가 :root var override → utility 가 자동 반영. |
| **FSD (Feature-Sliced Design)** | 프론트엔드 코드 6 레이어 (정책 #4). CSS 측면에서는 *슬라이스 옆 .css* = ITCSS Components layer. |

## 2. cn() helper

```ts
import { cn } from '@/shared/lib/cn'

<button className={cn(
  'inline-flex items-center px-4 py-2 rounded-md font-semibold',
  variant === 'primary' && 'bg-accent text-white hover:bg-accent-hover',
  variant === 'secondary' && 'bg-bg-soft text-fg-2 hover:bg-bg-sunken',
  disabled && 'opacity-50 cursor-not-allowed',
  className,  // 외부에서 prop 으로 받은 추가 class
)} />
```

`clsx` / `classnames` 같은 npm lib 미사용 — *런타임 의존 0 정책* 정합 (자체 구현 0.2 KB).

## 3. 토큰 매핑 (기존 → Tailwind utility)

`tailwind.css` 의 `@theme` = 정적 값. tokens.css `:root` var 와 *수동 동기화* (작가 책임). 다크 모드 = tokens.css 의 `[data-theme="dark"]` 가 :root var override → `bg-bg`/`text-fg` 같은 utility 가 자동 다크 반영 (Tailwind class 자체는 light 값 정의이지만 CSS resolution 단계에서 var 가 다크 값으로).

| 기존 var | Tailwind utility |
|---|---|
| `var(--bg)` / `--bg-soft` / `--bg-sunken` / `--surface` | `bg-bg` / `bg-bg-soft` / `bg-bg-sunken` / `bg-surface` |
| `var(--fg)` / `--fg-2/3/4` | `text-fg` / `text-fg-2/3/4` |
| `var(--accent)` / `--accent-soft` / `--accent-ring` | `bg-accent` / `text-accent` / `border-accent` / `bg-accent-soft` / `ring-accent-ring` |
| `var(--rule)` / `--rule-strong` | `border-rule` / `border-rule-strong` |
| `var(--warn-*)` | `bg-warn-bg` / `text-warn-fg` / `border-warn-rule` |
| `var(--code-bg)` | `bg-code-bg` |
| `var(--s-1)` ~ `var(--s-9)` (4~96px) | `p-1` / `m-2` / `gap-4` 등 (spacing-N) |
| `var(--font)` / `--font-mono` | `font-sans` / `font-mono` |
| `var(--fs-xs)` ~ `var(--fs-display)` | `text-xs` / `text-sm` / `text-base` / `text-md` / `text-lg` / `text-xl` / `text-display` |
| `var(--r-sm)` ~ `var(--r-pill)` | `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-pill` |
| `var(--shadow)` | `shadow-soft` |
| `var(--w-page)` | `max-w-page` |
| `var(--gutter)` | `px-[clamp(16px,4vw,32px)]` (clamp arbitrary value) |

## 4. 반응형 (breakpoint)

Tailwind v4 의 기본:
- `sm:` = min-width: 640px 이상
- `md:` = 768px+, `lg:` = 1024px+, `xl:` = 1280px+

본 프로젝트 모바일 break = 640px → `sm:` 와 정합.

**모바일 hidden / desktop visible** = `max-sm:hidden` (mobile 미만 hidden) 또는 `hidden sm:block` (default hidden, sm 이상 block).

## 5. 마이그레이션 진행 상태 (2026-05-17 PM 갱신)

| 슬라이스 | 상태 |
|---|---|
| `widgets/footer` | ✅ Tailwind 전환 (footer.css 폐기) |
| `widgets/header` | ✅ Tailwind 전환 (header.css 폐기) |
| `widgets/series-list` | ✅ Tailwind 전환 (home.css 안 룰 폐기) |
| `widgets/chapter-toc` | ✅ Tailwind 전환 (series.css 안 룰 폐기) + cn() helper 첫 사용 |
| `widgets/character-list` | ✅ Tailwind 전환 (series.css 안 룰 폐기) |
| `pages/not-found` | ✅ Tailwind 전환 (not-found.css 폐기) |
| `pages/about` | ✅ wrapper Tailwind |
| `pages/notice` | ✅ wrapper Tailwind |
| `pages/home` | ✅ Tailwind 전환 (home.css 폐기) |
| `pages/series` | ✅ Tailwind 전환 (series.css 폐기) |
| `pages/character` | ✅ Tailwind 전환 (character.css 폐기, sticky aside + dl child selector) |
| `pages/chapter` | ⚠️ 보류 — `.article` / `.article-prose` body typography 룰 40+ (h2/h3/p/ol/ul/blockquote/hr 등 markdown 결과) |
| `pages/unlock` | ⚠️ 보류 — `author-mode.css` 안 정의 (작가 모드 전용) |
| `shared/ui/error-boundary` | ✅ Tailwind 전환 (error-boundary.css 폐기) |
| `shared/ui/empty` (신규) | ✅ Tailwind utility 컴포넌트 (정책 #11 stories 포함) |
| `shared/ui/loading` (신규) | ✅ Tailwind utility 컴포넌트 (정책 #11 stories 포함) |
| `features/mini-game/**` | ⚠️ 보류 — 게임 좌표계·keyframe·scale var Tailwind 가치 작음 |
| `shared/styles/{tokens, base, typography, layout, utilities, author-mode, responsive}.css` | **보존** — ITCSS layer 1-5 (Settings/Generic/Elements/Objects). Tailwind 가 표현 안 하는 패턴 (scrollbar autohide / a11y focus-visible / keyframe / typography for markdown). |

## 6. 빌드·번들 영향

- Tailwind v4 = 사용 utility 만 추출 (purge 자동)
- 현 상태 (v0.3.0) = dist css 14.96 KB gzip (v0.2.7 = 11.65 → +3.3 KB Tailwind preflight + 초기 utility)
- 마이그레이션 누적 시 = 슬라이스 .css 폐기 + utility 공유 → 추가 증가 미미

## 7. 측정·검증

- 매 슬라이스 마이그레이션 = `npm run validate` + 시각 검증 (사용자 시연 or storybook variant)
- dist css gzip 추이 monitoring
- 시각 회귀 확인 후 .css 폐기 + index.ts 의 import 제거

## 8. 참고

- Tailwind v4 docs: https://tailwindcss.com/docs/v4-beta
- shadcn/ui (디자인 패턴 차용): https://ui.shadcn.com
- 본 프로젝트 디자인 토큰 SSOT: [`tokens.css`](./tokens.css)
- 게임 토큰 (`--mg-*`): [`../../features/mini-game/mini-game.css`](../../features/mini-game/mini-game.css)
- 게임 토큰 (`--sm-*`): [`../../features/mini-game/games/stickman-murim/stickman-murim.css`](../../features/mini-game/games/stickman-murim/stickman-murim.css)
- cn() helper: [`../lib/cn.ts`](../lib/cn.ts)
