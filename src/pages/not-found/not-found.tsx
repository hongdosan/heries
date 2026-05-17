import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../shared/lib/use-document-title.js'
import { Empty } from '../../shared/ui/empty'

export function NotFoundPage() {
  useDocumentTitle('페이지를 찾을 수 없습니다')
  return (
    <main>
      <Empty>페이지를 찾을 수 없습니다.</Empty>
      <p className="text-center mt-5 text-sm">
        <Link to="/" className="text-fg-3 hover:text-accent">홈으로</Link>
      </p>
    </main>
  )
}
