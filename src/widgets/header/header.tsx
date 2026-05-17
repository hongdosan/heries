import {HeaderActions} from '../header-actions'
import {HeaderBrand} from '../header-brand'

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[10px] backdrop-saturate-[1.8] border-b border-rule">
      <div className="max-w-page mx-auto px-[clamp(16px,4vw,32px)] py-3 flex items-center justify-between gap-4 min-h-[clamp(52px,6vh,64px)] sm:min-h-[clamp(48px,6vh,56px)]">
        <HeaderBrand />
        <HeaderActions />
      </div>
    </header>
  )
}
