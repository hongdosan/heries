import { useEffect } from 'react'

const SITE_NAME = 'H-eries'

/**
 * 페이지별 `document.title` 갱신 hook (브라우저 탭 제목 + SEO).
 *
 * **포맷**:
 * - `title === ''` → `"H-eries"` (홈)
 * - `title === '소개'` → `"소개 · H-eries"`
 *
 * **cleanup**: 컴포넌트 unmount 시 직전 title 복원 → 다음 페이지가 set 하기 전 일관 유지.
 *
 * **사용처**: 각 페이지 (about / notice / series / chapter / character 등) top-level 에서
 * 1회 호출. 동적 title (예: `${chapter.title} · ${series.title}`) 도 가능.
 *
 * @param title  페이지 제목 (빈 string 시 사이트명만).
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    return () => {
      document.title = previous
    }
  }, [title])
}
