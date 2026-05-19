import type {HTMLAttributes} from 'react'
import {Link} from 'react-router-dom'
import {cn} from '../../shared/lib/cn.js'

// 저작권 시작 연도. 사이트 발행이 2026년이라 고정.
const COPYRIGHT_START = 2026

function copyrightRange(): string {
  const now = new Date().getFullYear()
  return now <= COPYRIGHT_START ? `${COPYRIGHT_START}` : `${COPYRIGHT_START}–${now}`
}

export type FooterProps = HTMLAttributes<HTMLElement>

export function Footer({className, ...rest}: Readonly<FooterProps>) {
  return (
    <footer
      className={cn(
        'max-w-page mx-auto mt-3 px-[clamp(16px,4vw,32px)] py-6 border-t border-rule text-sm text-fg-3',
        className,
      )}
      {...rest}>
      <p
        className="bg-bg-soft border-l-[3px] border-rule-strong p-3 pl-4 mb-3 rounded-r-md text-fg-3 text-xs leading-[1.7]">
        본 사이트의 모든 소설 본문·등장인물·세계관·시각 자산은 홍도산의 100% 오리지널 창작입니다.
        복제·배포·번역·각색·기계학습 학습 데이터 사용 등 모든 사용에는 사전 서면 허가가 필요합니다.
        문의는 {' '}<Link to="/notice"
                       className="text-accent hover:text-accent-hover">NOTICE</Link>{' '} 또는 상단 메일
        주소로.
      </p>
      <div className="flex justify-between items-center flex-wrap gap-3 text-sm">
        <Link to="/about"
              className="text-fg-2 no-underline border-b border-rule pb-px transition-colors hover:text-accent hover:border-accent">H-eries
          소개</Link>
        <Link to="/notice"
              className="text-fg-2 no-underline border-b border-rule pb-px transition-colors hover:text-accent hover:border-accent">© {copyrightRange()} 홍도산.
          All rights reserved.</Link>
      </div>
    </footer>
  )
}
