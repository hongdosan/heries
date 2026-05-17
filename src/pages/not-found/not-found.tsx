import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'

export function NotFoundPage() {
  useDocumentTitle('페이지를 찾을 수 없습니다')
  return (
    <main>
      <p className="empty">페이지를 찾을 수 없습니다.</p>
      <p className="text-center mt-5 text-sm">
        <Link to="/" className="text-fg-3 hover:text-accent">홈으로</Link>
      </p>
    </main>
  )
}
