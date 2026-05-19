// © 2026 홍도산. All rights reserved. Original creator work.
import type {BookSection} from './book-reader.js'

/**
 * 책 reader 하단 progress bar + 절 라벨 — 시안 img_3.png 정합.
 *
 * **상단**: 가로 progress bar (현재 페이지 / 전체 페이지 비율)
 * **하단**: 절 라벨 (1. 수료 / 2. 첫 출동 / 3. 검은 거리). 현재 절 = 굵은 강조.
 */
interface BookProgressBarProps {
  readonly sections: ReadonlyArray<BookSection>
  readonly activeSectionId: string | null
  readonly page: number  // 0-indexed
  readonly totalPages: number
  readonly onSectionClick: (id: string) => void
}

export function BookProgressBar({
                                  sections, activeSectionId, page, totalPages, onSectionClick,
                                }: BookProgressBarProps) {
  const ratio = totalPages > 0 ? (page + 1) / totalPages : 0
  return (
    <div className="border-t border-rule pt-3 pb-2 px-4 bg-bg-soft">
      <div className="h-0.5 bg-rule rounded-full overflow-hidden" aria-hidden>
        <div className="h-full bg-fg-2 transition-[width] duration-300"
             style={{width: `${(ratio * 100).toFixed(2)}%`}}/>
      </div>
      <ol className="m-0 mt-2 p-0 list-none flex items-center justify-between gap-3 text-xs">
        {/* 첫 장 = 작품 표지 (special id `__cover_series__`). */}
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => onSectionClick('__cover_series__')}
            className="block transition-colors cursor-pointer text-fg-3 hover:text-accent"
          />
        </li>
        {sections.map((s) => {
          const active = s.id === activeSectionId
          return (
            <li key={s.id} className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onSectionClick(s.id)}
                aria-current={active ? 'true' : undefined}
                className={`block w-full text-center truncate transition-colors cursor-pointer ${
                  active ? 'text-fg font-semibold' : 'text-fg-3 hover:text-accent'
                }`}
              >
                {s.text}
              </button>
            </li>
          )
        })}
        {/* 마지막 장 = 마무리 (special id `__end__`). */}
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => onSectionClick('__end__')}
            className="block transition-colors cursor-pointer text-fg-3 hover:text-accent"
          />
        </li>
      </ol>
    </div>
  )
}
