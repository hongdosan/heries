// © 2026 홍도산. All rights reserved. Original creator work.
import {Link} from 'react-router-dom'
import {
  BOOK_FONT_FAMILY_LABEL,
  BOOK_FONT_SIZE_LABEL,
  type BookFontFamily,
  type BookFontSize,
} from '../../shared/lib/use-book-settings.js'

// Aa button 안 *Aa 글자 자체* 가 현 단계 크기로 렌더링 — *클릭 시 변화* 가 즉시 button 미리보기.
const SIZE_PREVIEW: Record<BookFontSize, string> = {
  sm: 'text-[10px]',
  md: 'text-[13px]',
  lg: 'text-[15px]',
  xl: 'text-[17px]',
}

// Lucide-style menu icon — Aa / 가 등 다른 아이콘과 크기 자매 정합. Unicode ☰ 보다 명확.
// `block` = SVG default inline-block baseline 제거 (flex items-center 안 정확히 수직 center 정합).
// `-mt-px` = text 글리프 시각 중앙 (x-height center, baseline 위 약 50%) 과 SVG box 중앙 1px 차이 보정.
const MenuIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden
       className="block -mt-0.5">
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
)

/**
 * 책 reader 상단 헤더 — 시안 img_5.png 정합.
 *
 * **좌측**: breadcrumb (시리즈명 · EP NN 제목)
 * **우측**: 페이지 인디케이터 + 글자 크기 (Aa) + 폰트 (가) + 목차 (☰) + 닫기 (✕, border 없음)
 *
 * - 글자 크기 (Aa) = sm → md → lg → xl 순환 (localStorage 영속)
 * - 폰트 (가) = 고딕 (sans) ↔ 명조 (serif) 토글 (localStorage 영속)
 * - 목차 = side panel toggle
 * - 닫기 = 챕터 목록 페이지로 이동 (우측 끝, border 없는 텍스트 버튼)
 *
 * 테마 토글 = 전역 헤더 (메인 Header 의 ThemeToggle) 와 중복 — BookHeader 에는 미포함.
 */
export interface BookHeaderProps {
  readonly seriesTitle: string
  readonly seriesSlug: string
  readonly episode: number
  readonly chapterTitle: string
  readonly onToggleToc: () => void
  readonly tocOpen: boolean
  // 글자 크기 / 폰트 — chapter.tsx 가 useBookSettings hook state owner.
  readonly fontSize: BookFontSize
  readonly fontFamily: BookFontFamily
  readonly onCycleFontSize: () => void
  readonly onCycleFontFamily: () => void
}

export function BookHeader({
                             seriesTitle, seriesSlug, episode, chapterTitle, onToggleToc, tocOpen,
                             fontSize, fontFamily,
                             onCycleFontSize, onCycleFontFamily,
                           }: BookHeaderProps) {
  // 모든 헤더 우측 child = 동일 height (h-7) + min-w-7 (28px 최소 — 글자 폭 < 28 일 때 박스 고정) + 글자 폭 ≥ 28 시 px-2 로 자연 확장.
  const btn = 'h-7 min-w-6 px-1.5 inline-flex items-center justify-center leading-none text-fg-2 hover:text-accent hover:bg-bg-soft rounded-sm transition-colors cursor-pointer'
  const closeBtn = 'h-7 min-w-6 px-1.5 inline-flex items-center justify-center leading-none text-fg-3 hover:text-accent hover:bg-bg-soft rounded-sm transition-colors cursor-pointer'
  return (
    <header
      className="flex items-center justify-between gap-4 py-3 px-4 border-b border-rule bg-bg-soft text-sm">
      <nav aria-label="현재 위치" className="flex items-center gap-2 min-w-0 text-fg-3">
        <Link to={`/series/${seriesSlug}`} className="hover:text-accent truncate max-w-35">
          {seriesTitle}
        </Link>
        <span className="text-fg-4" aria-hidden>·</span>
        <span
          className="text-fg-2 truncate">EP {String(episode).padStart(2, '0')} {chapterTitle}</span>
      </nav>
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={onCycleFontSize}
                aria-label={`글자 크기: ${BOOK_FONT_SIZE_LABEL[fontSize]} (클릭하여 변경)`}
                title={`글자 크기: ${BOOK_FONT_SIZE_LABEL[fontSize]} (클릭하여 변경)`}
                className={btn}>
          <span className={SIZE_PREVIEW[fontSize]}>Aa</span>
        </button>
        <button type="button" onClick={onCycleFontFamily}
                aria-label={`글자체: ${BOOK_FONT_FAMILY_LABEL[fontFamily]} (클릭하여 변경)`}
                title={`글자체: ${BOOK_FONT_FAMILY_LABEL[fontFamily]} (클릭하여 변경)`}
                className={btn}>
          <span className={fontFamily === 'serif' ? 'font-serif' : 'font-sans'}>가</span>
        </button>
        <button type="button" onClick={onToggleToc}
                aria-label={tocOpen ? '목차 닫기' : '목차 열기'}
                aria-expanded={tocOpen}
                title={tocOpen ? '목차 닫기' : '목차 열기'}
                className={`${btn} aria-expanded:bg-accent-soft aria-expanded:text-accent`}>
          <MenuIcon/>
        </button>
        <span className="h-7 inline-flex items-center leading-none px-1.5 text-fg-4"
              aria-hidden>|</span>
        <Link to={`/series/${seriesSlug}?tab=chapters`}
              className={closeBtn}
              aria-label="챕터 목록으로 (닫기)"
              title="챕터 목록으로 (닫기)">
          ✕
        </Link>
      </div>
    </header>
  )
}
