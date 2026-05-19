import {Link} from 'react-router-dom'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'

export function NotFoundPage() {
  useDocumentTitle('페이지를 찾을 수 없습니다')
  return (
    <main className="flex-1 w-full max-w-page mx-auto pt-7 px-[clamp(16px,4vw,32px)] pb-9">
      <h1 className="m-0 mb-4 text-[clamp(28px,4vw,40px)] font-normal tracking-[-0.02em]">페이지를 찾을 수 없습니다</h1>
      <p className="m-0 mb-6 text-fg-3">요청한 주소가 사라졌거나 잘못 입력됐습니다.</p>
      <p className="m-0 text-sm">
        <Link to="/" className="text-fg-2 hover:text-accent border-b border-rule pb-px transition-colors">홈으로
          돌아가기 →</Link>
      </p>
    </main>
  )
}
