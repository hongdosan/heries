// © 2026 홍도산. All rights reserved. Original creator work.

/**
 * 책 reader 하단 progress bar — 가로 진행률 표시.
 *
 * 절 라벨은 햄버거 (☰) > 목차 사이드바 (`BookToc`) 로 일원화 — footer 에는 진행률 bar 만 노출.
 */
interface BookProgressBarProps {
  readonly page: number  // 0-indexed
  readonly totalPages: number
}

export function BookProgressBar({page, totalPages}: BookProgressBarProps) {
  const ratio = totalPages > 0 ? (page + 1) / totalPages : 0
  return (
    <div className="border-t border-rule py-2 px-4 bg-bg-soft">
      <div className="h-0.5 bg-rule rounded-full overflow-hidden" aria-hidden>
        <div className="h-full bg-fg-2 transition-[width] duration-300"
             style={{width: `${(ratio * 100).toFixed(2)}%`}}/>
      </div>
    </div>
  )
}
