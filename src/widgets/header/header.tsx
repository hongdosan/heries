import {Link} from 'react-router-dom'
import {HeaderActions} from '../header-actions'
import {HeaderContact} from '../header-contact'

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[10px] backdrop-saturate-[1.8] border-b border-rule">
      <div className="max-w-page mx-auto px-[clamp(16px,4vw,32px)] py-3 flex items-center justify-between gap-4 min-h-[clamp(52px,6vh,64px)] sm:min-h-[clamp(48px,6vh,56px)]">
        <div className="flex flex-col gap-0.5 leading-[1.1]">
          <Link to="/" className="text-xl font-bold tracking-[-0.02em] text-fg">H-eries</Link>
          <p className="text-xs text-fg-3 m-0 font-normal max-sm:hidden">오리지널 웹 시리즈 컬렉션</p>
        </div>
        <div className="inline-flex items-center gap-3 sm:gap-2">
          <HeaderActions />
          <HeaderContact />
        </div>
      </div>
    </header>
  )
}
