// © 2026 홍도산. All rights reserved. Original creator work.
import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {extractOutline} from '../../shared/lib/markdown.js'
import {
  BOOK_FONT_FAMILY_CLASS,
  type BookFontFamily,
  type BookFontSize,
} from '../../shared/lib/use-book-settings.js'
import {cn} from '../../shared/lib/cn.js'
import './book-reader.css'

/**
 * 책 형태 paginated reader — 시안 ep-01-4.webp / ep-01-3.webp 정합 (2026-05-19 v3 재설계).
 *
 * **CSS columns paginated 패턴**:
 * - bodyHtml = chapter.tsx 가 합성 (book-cover-series + book-cover-chapter + section-cover N + 본문 + book-end-cta)
 * - 각 cover / section-cover = `break-after: column + height: 100%` → 한 column 다 차지 + 다음 element 가 다음 column 시작
 * - 본문 = column flow 자동 (한 절 본문 길면 여러 column 으로 흘러 넘김)
 * - 한 spread = 2 column 동시 표시 (`columnCount: 2`) — frame `overflow: hidden` + JS scrollLeft 로 spread 단위 horizontal 페이지네이션
 * - 페이지 이동 = 키보드 ←/→/Home/End/PageUp/PageDown + 터치 swipe + 마우스 drag (화살표 버튼 X, 시각 노이즈 제거)
 */

export interface BookSection {
  readonly id: string
  readonly text: string
}

export interface BookReaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly bodyHtml: string
  readonly onSectionsChange?: (sections: ReadonlyArray<BookSection>) => void
  readonly onProgressChange?: (state: BookProgress) => void
  readonly fontSize?: BookFontSize
  readonly fontFamily?: BookFontFamily
}

export interface BookProgress {
  readonly page: number
  readonly totalPages: number
  readonly activeSectionId: string | null
}

const FONT_SIZE_TOKENS: Record<BookFontSize, CSSProperties> = {
  sm: {
    ['--fs-sm' as never]: '12px',
    ['--fs-base' as never]: '14px',
    ['--fs-md' as never]: '15px',
    ['--fs-lg' as never]: '16px',
    ['--fs-xl' as never]: '19px'
  },
  md: {
    ['--fs-sm' as never]: '14px',
    ['--fs-base' as never]: '16px',
    ['--fs-md' as never]: '17px',
    ['--fs-lg' as never]: '19px',
    ['--fs-xl' as never]: '22px'
  },
  lg: {
    ['--fs-sm' as never]: '15px',
    ['--fs-base' as never]: '18px',
    ['--fs-md' as never]: '20px',
    ['--fs-lg' as never]: '22px',
    ['--fs-xl' as never]: '25px'
  },
  xl: {
    ['--fs-sm' as never]: '17px',
    ['--fs-base' as never]: '20px',
    ['--fs-md' as never]: '22px',
    ['--fs-lg' as never]: '25px',
    ['--fs-xl' as never]: '28px'
  },
}

// frame_inner_width = 정확히 spread (= 2 col + gap) 만큼만. frame outside 좌우 = 화살표 button 영역.
// 책 가장자리 여백 = column 안 element 의 padding-inline.
// frame_inner_width = 2 col (gap 0) — column-gap 이 있으면 *spread 사이 gap shift* 로 다음 페이지 일부 노출 버그.
// 책의 두 페이지 사이 fold 시각 표시 = column-rule (수직 라인) + 각 element padding-inline (column 안 가장자리 여백).
const BOOK_FRAME_STYLE: CSSProperties = {
  height: 'clamp(420px, 58vh, 560px)',
  overflow: 'hidden',
  scrollBehavior: 'smooth',
  padding: '24px 0',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  position: 'relative',
  margin: '0 auto',
  width: '100%',
  maxWidth: '1000px',
  boxSizing: 'border-box',
}

const BOOK_CONTENT_STYLE: CSSProperties = {
  height: '100%',
  columnCount: 2,
  columnGap: '0px',
  columnFill: 'auto',
  // column-rule 제거 — `.book-frame::before` spine 이 가운데 세로선 담당 (column-rule 은 content 짧을 때 끊김).
  // spine ::before 는 page 시작/끝/표지/본문 모두 동일 — 통일성 보장.
}

export function BookReader({
                             bodyHtml, onSectionsChange, onProgressChange,
                             fontSize = 'md', fontFamily = 'sans',
                             className, onKeyDown: externalOnKeyDown,
                             ...rest
                           }: Readonly<BookReaderProps>) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)

  // 모바일 ≤640px 감지 — matchMedia (브라우저 창 resize 실시간).
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia('(max-width: 640px)').matches : false,
  )
  useEffect(() => {
    if (typeof globalThis.matchMedia !== 'function') return
    const mq = globalThis.matchMedia('(max-width: 640px)')
    const onChange = (e: MediaQueryListEvent): void => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // 모바일 JS 본문 분할 (SDD 020) — iOS Safari column-fill: auto 미지원 우회.
  // mobilePages === null = 측정 단계 (단일 dangerouslySetInnerHTML, column-count: 1).
  // mobilePages = string[] = 분할 완료, flex row pagination.
  const [mobilePages, setMobilePages] = useState<readonly string[] | null>(null)

  // bodyHtml / fontSize / fontFamily / isMobile 변경 시 = 측정 reset.
  useEffect(() => {
    setMobilePages(null)
  }, [bodyHtml, fontSize, fontFamily, isMobile])

  // h2 추출 = 절 목록 (BookToc / BookProgressBar 호환).
  const sections = useMemo<BookSection[]>(
    () => extractOutline(bodyHtml, 2).map((h) => ({id: h.id, text: h.text})),
    [bodyHtml],
  )

  useEffect(() => {
    onSectionsChange?.(sections)
  }, [sections, onSectionsChange])

  // 페이지 수 측정 — CSS columns 의 scrollWidth ÷ clientWidth.
  // resize / column-count 변경 시 column 들이 reflow → scrollLeft 가 spread 경계에서 벗어남 (페이지 가운데 걸침).
  // 측정 후 현 spread 경계로 *재정렬* (= `cur * clientWidth` 로 scrollTo). 사용자 보이는 페이지가 항상 spread 단위로 정렬.
  const measure = useCallback(() => {
    const frame = frameRef.current
    if (!frame) return
    // scrollWidth / clientWidth 가 정확히 정수 아닐 수 있음 (브라우저 sub-pixel 반올림 / 마지막 group partial).
    // `Math.ceil` = 마지막 partial group 도 1 spread 로 카운트 (End 버튼이 마지막 콘텐츠 닿게).
    // CSS variable `--page-w` = frame 의 clientWidth (scrollbar 제외 영역).
    // 모바일 selector 에서 flex item width 를 100vw 대신 var(--page-w) 로 → scrollbar 너비만큼 viewport 초과해
    // 우측 잘리는 버그 (014) 해소. 데스크탑은 CSS columns 라 영향 X.
    frame.style.setProperty('--page-w', `${frame.clientWidth}px`)
    const total = Math.max(1, Math.ceil(frame.scrollWidth / frame.clientWidth))
    const cur = Math.min(Math.max(0, Math.round(frame.scrollLeft / frame.clientWidth)), total - 1)
    setTotalPages(total)
    setPage(cur)
    // 스크롤 재정렬 — reflow 후 scrollLeft 가 spread 경계 벗어났을 때만 (1px 이내는 그대로).
    // 마지막 페이지에 clamp: scrollLeft_max 가 (total-1) * clientWidth 보다 작을 수 있어 max 와 비교 후 작은 값 사용.
    const targetMax = frame.scrollWidth - frame.clientWidth
    const target = Math.min(cur * frame.clientWidth, targetMax)
    if (Math.abs(frame.scrollLeft - target) > 1) {
      frame.scrollTo({left: target, behavior: 'auto'})
    }
  }, [])

  // 모바일 JS 본문 분할 — 측정 단계 (mobilePages === null + isMobile) 에서 element offsetTop 기반 page chunk.
  // CSS columns 의 column-fill: auto 가 iOS Safari 17.4 미만에서 미지원 → 모든 본문이 1 column 안 압축 → 1/1 회귀.
  // 우회 = JS 가 element 단위로 페이지 분할 + flex row pagination (column-fill 의존 X).
  // requestAnimationFrame — iOS Safari 에서 useLayoutEffect 시점 flex layout 미완료 케이스 대비.
  // raf = next paint frame → layout 완료 보장 → 측정 정확 (023 1/1 회귀 대응).
  useLayoutEffect(() => {
    if (!isMobile || mobilePages !== null) return
    const raf = requestAnimationFrame(() => {
      const frame = frameRef.current
      const content = contentRef.current
      if (!frame || !content) return

      // 측정 시점 cover/section-cover/book-end-cta 의 height: 100% + break-after: column 임시 무력화 →
      // 자연 element 높이 측정 가능 (위 element 들은 분할 로직에서 각자 1 페이지 강제 처리).
      const covers = content.querySelectorAll<HTMLElement>('.book-cover, .section-cover, .book-end-cta')
      const original = new Map<HTMLElement, { h: string; ba: string }>()
      covers.forEach((c) => {
        original.set(c, {h: c.style.height, ba: c.style.breakAfter})
        c.style.height = 'auto'
        c.style.breakAfter = 'auto'
      })
      // force reflow
      void content.offsetHeight

      const pageHeight = Math.max(200, frame.clientHeight - 8)
      const contentRect = content.getBoundingClientRect()
      const children = Array.from(content.children) as HTMLElement[]

      type Page = { sectionBody: boolean; els: HTMLElement[] }
      const pages: Page[] = []
      let pageStart = 0
      const newPage = (sectionBody: boolean, topRef: number): void => {
        pages.push({sectionBody, els: []})
        pageStart = topRef
      }
      const cur = (): Page => pages[pages.length - 1]!

      for (const child of children) {
        const cTop = child.getBoundingClientRect().top - contentRect.top
        if (child.classList.contains('section-body')) {
          if (pages.length === 0 || cur().els.length > 0) newPage(true, cTop)
          else cur().sectionBody = true
          const inners = Array.from(child.children) as HTMLElement[]
          for (const inner of inners) {
            const iTop = inner.getBoundingClientRect().top - contentRect.top
            const iBottom = iTop + inner.offsetHeight
            if (iBottom - pageStart > pageHeight && cur().els.length > 0) {
              newPage(true, iTop)
            }
            cur().els.push(inner)
          }
        } else {
          // cover / section-cover / book-end-cta = 각자 1 페이지 강제
          if (pages.length === 0 || cur().els.length > 0) newPage(false, cTop)
          else cur().sectionBody = false
          cur().els.push(child)
        }
      }

      // 복원
      covers.forEach((c) => {
        const o = original.get(c)
        if (o) {
          c.style.height = o.h
          c.style.breakAfter = o.ba
        }
      })

      const chunks: string[] = pages.map((p) =>
        p.sectionBody
          ? `<div class="section-body">${p.els.map((e) => e.outerHTML).join('')}</div>`
          : p.els.map((e) => e.outerHTML).join(''),
      )
      if (chunks.length > 0) setMobilePages(chunks)
    })
    return () => cancelAnimationFrame(raf)
  }, [isMobile, mobilePages, bodyHtml, fontSize, fontFamily])

  // useLayoutEffect = paint 전 동기 실행. measure() 가 첫 paint 전에 `--page-w` 설정 →
  // 모바일 flex item width 가 첫 페인트부터 정확한 frame.clientWidth (scrollbar/부모 container 차감 포함).
  // 이전 useEffect 는 paint 후 실행이라 첫 페인트 = fallback `100vw` (= viewport 너비, 부모 container 너비 초과) →
  // 우측 잘림 (014 회귀). Vite SPA = SSR 없음 → useLayoutEffect warning 무관.
  // dep 에 mobilePages 포함 — JS 분할 후 chunks render 시 content DOM 자체 교체 (dangerouslySetInnerHTML →
  // children map). ResizeObserver 가 새 content 자동 트리거 안 하는 케이스 대비 → mobilePages 변경 시
  // 명시적 재측정 + observer 재생성. PC 좁힘 (mobile media + JS 분할) 1/1 회귀 해소 (020 후속).
  useLayoutEffect(() => {
    measure()
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    if (frameRef.current) ro?.observe(frameRef.current)
    if (contentRef.current) ro?.observe(contentRef.current)
    globalThis.addEventListener('resize', measure)
    return () => {
      ro?.disconnect()
      globalThis.removeEventListener('resize', measure)
    }
  }, [measure, bodyHtml, fontSize, fontFamily, mobilePages])

  // 활성 절 = 현 spread 안 첫 h2 element.
  const activeSectionId = useMemo<string | null>(() => {
    const content = contentRef.current
    const frame = frameRef.current
    if (!content || !frame || sections.length === 0) return null
    const pageWidth = frame.clientWidth
    const pageStart = page * pageWidth
    const pageEnd = pageStart + pageWidth
    let active: string | null = sections[0]?.id ?? null
    for (const s of sections) {
      const el = content.querySelector(`#${CSS.escape(s.id)}`) as HTMLElement | null
      if (!el) continue
      const left = el.offsetLeft
      if (left >= pageEnd) break
      if (left < pageEnd) active = s.id
      if (left >= pageStart && left < pageEnd) {
        active = s.id
        break
      }
    }
    return active
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sections, totalPages])

  useEffect(() => {
    onProgressChange?.({page, totalPages, activeSectionId})
  }, [page, totalPages, activeSectionId, onProgressChange])

  const goToPage = useCallback((next: number) => {
    const frame = frameRef.current
    if (!frame) return
    const target = Math.max(0, Math.min(next, totalPages - 1))
    // behavior: 'smooth' → 'auto' — smooth scroll 중 매 frame onScroll → setPage → re-render → jitter (023).
    // 즉시 jump 로 jitter X. drag/swipe finishDrag 가 페이지 결정 → 자연 사용.
    frame.scrollTo({left: target * frame.clientWidth, behavior: 'auto'})
  }, [totalPages])

  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page])
  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page])

  // scrollLeft 변경 감지 — raf throttle 로 매 frame setPage 한 번만 (jitter 완화, 023).
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let raf = 0
    const onScroll = (): void => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const cur = Math.round(frame.scrollLeft / frame.clientWidth)
        setPage(cur)
      })
    }
    frame.addEventListener('scroll', onScroll, {passive: true})
    return () => {
      frame.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // 키보드 네비 — ←/→/Home/End/PageUp/PageDown. 한 누름 = 한 spread (= 2 column 동시 표시 단위) 이동.
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    externalOnKeyDown?.(e)
    if (e.defaultPrevented) return
    const k = e.key
    if (k === 'ArrowLeft' || k === 'PageUp') {
      e.preventDefault()
      goPrev()
    } else if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') {
      e.preventDefault()
      goNext()
    } else if (k === 'Home') {
      e.preventDefault()
      goToPage(0)
    } else if (k === 'End') {
      e.preventDefault()
      goToPage(totalPages - 1)
    }
  }

  // 외부 (헤더 / 목차) 에서 절 클릭 시 페이지 이동.
  // `frame.clientWidth` = 한 spread 폭 (2 col 동시 표시) → `offsetLeft / clientWidth` = 그 절이 포함된 spread index.
  // (이전 코드의 `% 2` 정렬은 page=column index 모델 잔재 — 현재 page=spread index 라 불필요. 잘못된 spread 로 jump 하던 원인.)
  const scrollToSection = useCallback((id: string) => {
    const content = contentRef.current
    const frame = frameRef.current
    if (!content || !frame) return
    const el = content.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null
    if (!el) return
    const targetSpread = Math.floor(el.offsetLeft / frame.clientWidth)
    goToPage(targetSpread)
  }, [goToPage])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id?: string; page?: number } | undefined
      if (!detail) return
      if (typeof detail.id === 'string') scrollToSection(detail.id)
      else if (typeof detail.page === 'number') goToPage(detail.page)
    }
    globalThis.addEventListener('heries:book-reader-goto', handler)
    return () => globalThis.removeEventListener('heries:book-reader-goto', handler)
  }, [scrollToSection, goToPage])

  // 모바일 터치 swipe + 데스크탑 마우스 drag.
  // 2026-05-26 v0.5.2 핫픽스: SDD 004 의 passive:false touchmove + axis lock + preventDefault 가
  // 모바일 사이트에서 책 본문 페이지 전환을 막는 회귀 (첫 페이지 한 장만 보임) 야기 → 일단 제거.
  // CSS `touch-action: pan-y pinch-zoom` 도 함께 제거됨 (book-reader.css 참조).
  // 임계 완화 (dy*1.0) 는 유지 = 자연 사선 swipe 인식. SDD 008 핫픽스 참조.
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>): void => {
    const t = e.touches[0]
    if (t) dragStartRef.current = {x: t.clientX, y: t.clientY}
  }
  const onTouchEnd = (e: ReactTouchEvent<HTMLDivElement>): void => {
    const start = dragStartRef.current
    if (!start) return
    const t = e.changedTouches[0]
    if (!t) return
    finishDrag(start, t.clientX, t.clientY)
  }
  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return
    dragStartRef.current = {x: e.clientX, y: e.clientY}
  }
  const onMouseUp = (e: ReactMouseEvent<HTMLDivElement>): void => {
    const start = dragStartRef.current
    if (!start) return
    finishDrag(start, e.clientX, e.clientY)
  }
  const onMouseLeave = (): void => {
    dragStartRef.current = null
  }
  const finishDrag = (start: { x: number; y: number }, endX: number, endY: number): void => {
    dragStartRef.current = null
    const dx = endX - start.x
    const dy = endY - start.y
    // 60px 최소 이동 + 가로가 세로 이상 (자연 사선까지 인정. 이전 dy*1.5 = 너무 엄격해 간헐 먹통).
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return
    if (dx > 0) goPrev()
    else goNext()
  }

  return (
    // section + aria-label = 자동 region landmark (role="region" 명시 불필요).
    // 페이지 네비 = 키보드 (←/→/Home/End/PageUp/PageDown) + 터치 swipe + 마우스 drag — 화살표 버튼 X (시각 노이즈 제거).
    <section className={cn('relative max-sm:flex-1 max-sm:min-h-0 max-sm:flex max-sm:flex-col', className)}
             aria-label="챕터 본문 (책 형태)"
             tabIndex={0} onKeyDown={onKey}
             onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
             onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
             {...rest as HTMLAttributes<HTMLElement>}>
      <div
        ref={frameRef}
        className={cn('book-frame max-sm:flex-1 max-sm:min-h-0', isMobile && mobilePages && 'book-frame-paged')}
        style={BOOK_FRAME_STYLE}
        aria-live="polite"
        data-mobile={isMobile ? '1' : '0'}
        data-chunks={mobilePages?.length ?? 0}
        data-total={totalPages}
      >
        {isMobile && mobilePages ? (
          // key="paged" 강제 — React 가 dangerouslySetInnerHTML div 와 chunks div 를 동일 element 로 diff 시
          // innerHTML 이 잔존 + chunks children 이 mount 안 되는 버그 회피 (021 후속 022).
          <div
            key="paged"
            ref={contentRef}
            className={cn('book-content book-content-paged article-prose', BOOK_FONT_FAMILY_CLASS[fontFamily])}
            style={{...FONT_SIZE_TOKENS[fontSize]}}
          >
            {mobilePages.map((html, i) => (
              <div key={i} className="book-page" dangerouslySetInnerHTML={{__html: html}}/>
            ))}
          </div>
        ) : (
          <div
            key="single"
            ref={contentRef}
            className={cn('book-content article-prose', BOOK_FONT_FAMILY_CLASS[fontFamily])}
            style={{...BOOK_CONTENT_STYLE, ...FONT_SIZE_TOKENS[fontSize]}}
            dangerouslySetInnerHTML={{__html: bodyHtml}}
          />
        )}
      </div>
    </section>
  )
}
