import { useEffect } from 'react'

const SITE_NAME = 'H-eries'

// 페이지별 document.title 갱신.
// `title` 가 빈 문자열이면 사이트명만. 그 외에는 `${title} · ${SITE_NAME}`.
// 컴포넌트 unmount 시 직전 title 복원 (다음 페이지가 set 하기 전 일관).
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    return () => {
      document.title = previous
    }
  }, [title])
}
