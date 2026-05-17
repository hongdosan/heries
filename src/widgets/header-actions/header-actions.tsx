import {AuthorModeToggle} from '../author-mode-toggle'
import {ThemeToggle} from '../theme-toggle'

/**
 * 헤더 우측 액션 토글 그룹.
 *
 * **묶음 기준**: 모두 사용자 *세션 토글* (상태 변경 + 즉시 반영) 액션이라
 * segmented-control 패턴으로 시각 묶음 (subtle 배경 + 얇은 border + rounded).
 *
 * 내부 토글들은 본 그룹 안에서 수직·수평 가운데 정렬 (`items-center`).
 * 토글 hover 시 segment 가 강조되는 효과 (각 토글의 hover bg 가 그룹 배경 위로 떠 보임).
 *
 * 묶음 대상:
 * - {@link AuthorModeToggle} — 작가 모드 진입/잠금
 * - {@link ThemeToggle} — 라이트/다크/시스템 테마 순환
 */
export function HeaderActions() {
  return (
    <div className="inline-flex items-center bg-bg-soft border border-rule rounded-md p-0.5 gap-0.5">
      <AuthorModeToggle />
      <ThemeToggle />
    </div>
  )
}
