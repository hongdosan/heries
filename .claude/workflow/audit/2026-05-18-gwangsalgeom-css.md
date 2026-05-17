<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# Audit — gwangsalgeom (광살검) CSS

**작성**: 2026-05-18 자율 사이클
**대상**: `src/features/mini-game/games/gwangsalgeom/gwangsalgeom.css` (795 줄, 60 unique selector)
**상태**: **보고만 — 직접 수정 X** (사용자 결정 대기, 시각 회귀 risk)

## 요약

CSS 60 unique selector vs tsx className 사용 42 종 cross-check 결과:

- **확실 dead 없음** (자동 검출은 5 개 보였으나 모두 dynamic 사용으로 false positive)
- **실제 issue 1 건 확인**: tsx 의 `sm-hud-title` className 이 어떤 CSS 에도 정의 없음 (unstyled)
- CSS variable (`--sm-*`) vs class name (`.sm-*`) 혼동으로 인한 추가 false positive 4 건

## Cross-check 결과

### CSS 정의 / tsx 미사용 (1차 검출 5 개)
| selector             | 진짜 dead? | 사유                                              |
|----------------------|----------|-------------------------------------------------|
| `sm-judge-amber`     | **X**    | tsx 1192: `sm-judge-${judge.tone}` dynamic 사용 |
| `sm-judge-cyan`      | **X**    | 동상                                              |
| `sm-judge-red`       | **X**    | 동상                                              |
| `sm-judge-stone`     | **X**    | 동상                                              |
| `sm-judge-violet`    | **X**    | 동상                                              |

→ **모두 false positive**. dead 아님.

### tsx 사용 / CSS 미정의 (1차 검출 7 개)
| selector           | 진짜 미정의?  | 사유                                                                                                  |
|--------------------|----------|-----------------------------------------------------------------------------------------------------|
| `sm-accent`        | X        | tsx 147: `--sm-accent` (CSS variable, `var(...)` 참조 주석) — class 아님                                  |
| `sm-amber`         | X        | tsx 148: `--sm-amber` 주석 — CSS variable                                                              |
| `sm-cd`            | X        | tsx 1237: `style={{'--sm-cd': dashCdFraction}}` — inline CSS variable                                 |
| `sm-danger`        | X        | tsx 149: `--sm-danger` 주석 — CSS variable                                                             |
| `sm-elite-bright`  | X        | tsx 150: `--sm-elite-bright` 주석 — CSS variable                                                       |
| `sm-judge-`        | X        | tsx 1192: `sm-judge-${tone}` 의 prefix — 동적 class 의 substring 검출 (regex artifact)                  |
| **`sm-hud-title`** | **✓**    | tsx 1082: `<div className="sm-hud-title">` — gwangsalgeom.css / mini-game.css 모두 정의 없음. **unstyled** |

## 실제 발견 1 건

### **`sm-hud-title` 클래스 unstyled** (`gwangsalgeom.tsx:1082`)

```tsx
<div className="sm-hud-title">
  {/* HUD 상단 — 점수 / 콤보 등 */}
</div>
```

- CSS 정의: gwangsalgeom.css / mini-game.css 어디에도 `.sm-hud-title` 없음
- 결과: 본 div 는 default `<div>` 스타일만 적용 (block-level, no styling)
- 시각 영향: 다른 cascade 스타일 또는 child element 스타일이 시각을 채우고 있을 가능성 (사용자 시연 시 의도된 모양으로 보일 수 있음)

**판단 요청**:
- (a) 의도된 unstyled (HUD title 영역은 child 들이 스타일 책임) → className 제거 또는 의미 주석 1 줄
- (b) 누락된 CSS 정의 (디자인 의도 있음) → `.sm-hud-title { ... }` 추가

## CSS 추가 항목 — 정리 가치 있음 (선택)

### keyframes (12 개) — 모두 사용 확인됨
- `sm-walk` / `sm-attack` / `sm-qi` / `sm-dash` / `sm-pulse-*` / `sm-judge-kf` / `sm-flash-*` / `sm-shake-*` 등
- dead 0

### CSS variables (모두 mini-game.css 의 `.mini-game-frame` 안에 정의)
- `--sm-accent` `--sm-amber` `--sm-danger` `--sm-elite-bright` `--sm-cd` 등
- 모두 tsx 에서 `var(--sm-*)` 또는 inline style 로 활용 — dead 0

### 잠재 합칠 수 있는 룰 (선택)
- `.sm-judge-{cyan,red,amber,violet,stone}` 5 종 — 색만 다른 동일 구조. CSS variable 로 통합 가능:
  ```css
  .sm-judge { color: var(--judge-color); }
  .sm-judge-cyan { --judge-color: #67e8f9; }
  ```
  현재 5 행 → 6 행 (체감 효과 작음, 변경 불필요)

## 위험도 평가

| 항목              | risk    | 사유                                            |
|-----------------|---------|-----------------------------------------------|
| `sm-hud-title` 제거 | **중간**  | 시각 회귀 가능 (other cascade 의존 시), 시연 후 결정 권장 |
| keyframes / variable 정리 | **0**   | 사용 모두 확인됨, 정리 대상 없음                          |
| .sm-judge-* 통합  | **낮음**  | 동작 동일, 시각 동일. 미세한 가독성 개선                    |

## 결론

**CSS dead rule 0 건**. 자동 검출 5 건은 모두 dynamic class / CSS variable 로 인한 false positive. 진짜 issue 는 **`sm-hud-title` className 의 CSS 정의 누락 1 건** — 사용자 시연 후 (a) 제거 또는 (b) 정의 추가 결정 권장. 그 외 추가 정리 가치 작음 (CSS 자체 잘 관리되고 있음).

## 권장 사이클

1. **즉시 가능 (사용자 결정 후)**: `sm-hud-title` 처리 — 1 행 변경
2. **선택**: `.sm-judge-*` CSS variable 통합 — 작은 가독성 개선
3. **비-권장**: 그 외 CSS 변경 — 시각 회귀 risk 대비 이득 없음
