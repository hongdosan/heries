import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'

export function NotFoundPage() {
  useDocumentTitle('페이지를 찾을 수 없습니다')
  return (
    <main>
      <p className="empty">페이지를 찾을 수 없습니다.</p>
      <p className="not-found-back">
        <Link to="/">홈으로</Link>
      </p>
    </main>
  )
}
