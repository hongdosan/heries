import {AuthorModeToggle} from '../author-mode-toggle'
import {HeaderContact} from '../header-contact'
import {ThemeToggle} from '../theme-toggle'

/**
 * 헤더 우측 액션 토글 그룹.
 *
 * **묶음 기준**: 모두 *다이얼로그/상태 토글* 액션이라 한 그룹으로 묶음. 내부 모두
 * 아이콘-only 버튼 (자물쇠 SVG / 메일 SVG / 테마 글리프). 배경/border 없는 미니멀 그룹 —
 * 각 토글의 hover bg 가 독립적으로 발화.
 *
 * 내부 토글들은 본 그룹 안에서 수직·수평 가운데 정렬 (`items-center`).
 *
 * 묶음 대상:
 * - {@link AuthorModeToggle} — 작가 모드 진입/잠금
 * - {@link ThemeToggle} — 라이트/다크/시스템 테마 순환
 * - {@link HeaderContact} — 작가 문의 (이메일 복사 / 메일 보내기 다이얼로그)
 */
export function HeaderActions() {
  return (
    <div className="inline-flex items-center gap-1">
      <ThemeToggle/>
      <HeaderContact/>
      <AuthorModeToggle/>
    </div>
  )
}
