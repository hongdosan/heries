// © 2026 홍도산. All rights reserved. Original creator work.
import {type MouseEvent as ReactMouseEvent, useCallback, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {loadChapter} from './api/load-chapter.js'
import {useDocumentTitle} from '../../shared/lib/use-document-title.js'
import {fetchSeriesManifest} from '../../entities/series'
import {useAsync} from '../../shared/lib/use-async.js'
import {useBookSettings} from '../../shared/lib/use-book-settings.js'
import {assetUrl} from '../../shared/lib/env.js'
import {Empty, Loading} from '../../shared/ui'
import {
  BookHeader,
  type BookProgress,
  BookProgressBar,
  BookReader,
  type BookSection,
  BookToc,
} from '../../widgets/book-reader'

/**
 * 챕터 상세 페이지 — 시안 img_3·img_4.png 정합.
 *
 * **레이아웃** (책 형태 paginated reader):
 * - 상단 = BookHeader (닫기 + breadcrumb + 페이지 indicator + 4 아이콘)
 * - 본문 = BookReader (CSS columns 2 페이지 동시 + 좌우 화살표 + 키보드 ←/→ 네비)
 * - 하단 = BookProgressBar (가로 progress + 절 라벨)
 * - 목차 = BookToc (사이드 패널, dialog 오버레이)
 *
 * **이전 패턴 (세로 스크롤 + chapter-outline + scroll-nav)** 폐기.
 */
export function ChapterPage() {
  const {slug = '', episode = ''} = useParams<{ slug: string; episode: string }>()
  const navigate = useNavigate()
  const [sections, setSections] = useState<ReadonlyArray<BookSection>>([])
  const [progress, setProgress] = useState<BookProgress>({
    page: 0,
    totalPages: 1,
    activeSectionId: null
  })
  const [tocOpen, setTocOpen] = useState(false)
  const {fontSize, fontFamily, cycleFontSize, cycleFontFamily} = useBookSettings()

  // book-end-cta 안 native <a> 클릭 위임 — SPA navigation 강제 (full reload 방지).
  // chapter.tsx 가 BookReader content 안 a 태그 클릭을 가로채 React Router navigate 호출.
  const onContentClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a.book-end-cta-link, a.book-end-cta-back') as HTMLAnchorElement | null
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('http')) return
    e.preventDefault()
    navigate(href)
  }, [navigate])

  const state = useAsync(async () => {
    const manifest = await fetchSeriesManifest(slug)
    const data = await loadChapter(slug, episode, manifest)
    return {manifest, data}
  }, [slug, episode])

  const chapterTitle = state.status === 'success'
    ? `${state.data.data.frontmatter.title || state.data.data.index.title} · ${state.data.manifest.title}`
    : ''
  useDocumentTitle(chapterTitle)

  // 절 / 페이지 이동 = BookReader 의 custom event ('heries:book-reader-goto') dispatch.
  const dispatchGoto = useCallback((detail: { id?: string; page?: number }) => {
    globalThis.dispatchEvent(new CustomEvent('heries:book-reader-goto', {detail}))
  }, [])

  const onSectionClick = useCallback((id: string) => {
    // BookReader 의 scrollToSection 가 element offsetLeft 측정 → spread 정렬 (id-based).
    // 특수 id ('__cover_series__' / '__cover_chapter__' / '__end__') 도 동일 패턴으로 작동.
    dispatchGoto({id})
    setTocOpen(false)
  }, [dispatchGoto])

  // 목차 열린 상태에서 ESC = 닫기 + body scroll lock + 패널 안 focus 이동 (focus trap 보강).
  useEffect(() => {
    if (!tocOpen) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setTocOpen(false)
    }
    globalThis.addEventListener('keydown', onKey)
    // 패널 첫 focusable element 로 focus 이동 (a11y).
    requestAnimationFrame(() => {
      const panel = document.querySelector('[aria-label="목차 패널"] aside') as HTMLElement | null
      const firstBtn = panel?.querySelector('button, a') as HTMLElement | null
      firstBtn?.focus()
    })
    return () => globalThis.removeEventListener('keydown', onKey)
  }, [tocOpen])

  if (state.status === 'loading') return <main className={MAIN_CLS}><Loading/></main>
  if (state.status === 'error') return <main className={MAIN_CLS}>
    <Empty>오류: {state.error.message}</Empty></main>

  const {manifest, data} = state.data

  // 이전/다음 화 (마무리 페이지 + 하단 nav 공통).
  const sorted = [...manifest.chapters].sort((a, b) => a.episode - b.episode)
  const idx = sorted.findIndex((c) => c.episode === data.index.episode)
  const prev = idx > 0 ? sorted[idx - 1] : undefined
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined
  const seriesUrl = `/series/${slug}`
  const prevHref = prev ? `${seriesUrl}/chapter/${prev.episode}` : ''
  const nextHref = next ? `${seriesUrl}/chapter/${next.episode}` : ''
  const chapterTitleText = data.frontmatter.title || data.index.title

  // bodyHtml 합성 — book-cover-chapter + 각 절 section-cover (h2 + thumb) + 본문 + end.
  // 각 cover element = `break-before/after: column + height: 100%` → 한 column 다 차지 (정확히 한 페이지).
  // 본문 (p / blockquote 등) = column flow 자동 (긴 본문 = 여러 column).
  // (시리즈 cover 페이지는 2026-05-25 부로 제거 — 첫 페이지 = 챕터 cover 부터. 시리즈 식별은 리스트·홈에서. specs/003-book-reader-skip-series-cover/)
  const chapterThumbSrc = data.index.thumbnail ? assetUrl(`content/series/${slug}/${data.index.thumbnail}`) : ''
  const escTitle = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escAttr = (s: string) => s.replace(/"/g, '&quot;')
  const coverChapterHtml = `
<section class="book-cover book-cover-chapter-page" id="__cover_chapter__">
  ${chapterThumbSrc ? `<img class="book-cover-thumb" src="${escAttr(chapterThumbSrc)}" alt="" />` : ''}
  <p class="book-cover-ep">EP ${String(data.index.episode).padStart(2, '0')}</p>
  <h2 class="book-cover-title">${escTitle(chapterTitleText)}</h2>
</section>
`
  // 본문 h2 단위 변환 — 각 h2 를 section-cover (h2 + 첫 img) wrapper 로 감싸고 본문 분리.
  const transformedBody = (() => {
    const doc = new DOMParser().parseFromString(`<div>${data.bodyHtml}</div>`, 'text/html')
    const root = doc.querySelector('div')!
    let result = ''
    let currentSectionStarted = false
    const closeCurrentSection = () => {
      if (currentSectionStarted) {
        result += `</div>`
        currentSectionStarted = false
      }
    }
    const nodes = Array.from(root.children)
    let i = 0
    while (i < nodes.length) {
      const node = nodes[i]!
      if (node.tagName === 'H2') {
        closeCurrentSection()
        const sectionId = node.getAttribute('id') ?? `section-${i}`
        // h2 직후 첫 img (또는 첫 p 안 img) = 절 thumb.
        let thumbSrc = ''
        let consumed = 1
        const nextNode = nodes[i + 1]
        if (nextNode) {
          const img = nextNode.tagName === 'IMG' ? (nextNode as HTMLImageElement) : nextNode.querySelector('img')
          const src = img?.getAttribute('src')
          if (src) {
            thumbSrc = src
            consumed = 2  // h2 + 다음 img 소비.
          }
        }
        // h2 + thumb = 한 section-cover element (column 단위 차지).
        result += `<section class="section-cover" id="${escAttr(sectionId)}">`
        result += node.outerHTML
        if (thumbSrc) {
          result += `<img class="section-cover-thumb" src="${escAttr(thumbSrc)}" alt="" />`
        }
        result += `</section>`
        // 본문 영역 시작 (다음 column 부터 flow).
        result += `<div class="section-body">`
        currentSectionStarted = true
        i += consumed
        continue
      }
      // h2 외 element = 현 section-body 안.
      if (!currentSectionStarted) {
        result += `<div class="section-body">`
        currentSectionStarted = true
      }
      result += node.outerHTML
      i++
    }
    closeCurrentSection()
    return result
  })()
  const epPad = String(data.index.episode).padStart(2, '0')
  const endHtml = `
<aside class="book-end-cta book-end-page" id="__end__">
  <div class="book-end-cta-mark">
    <span class="book-end-cta-ep">EP ${epPad}</span>
    <h2 class="book-end-cta-chapter">${escTitle(chapterTitleText)}</h2>
    <p class="book-end-cta-fin">— 끝 —</p>
  </div>
  <nav class="book-end-cta-nav" aria-label="회차 이동">
    ${prev ? `<a href="${prevHref}" class="book-end-cta-link prev"><span class="book-end-cta-link-meta">← 이전 화 · EP ${String(prev.episode).padStart(2, '0')}</span><span class="book-end-cta-link-title">${escTitle(prev.title)}</span></a>` : ''}
    ${next ? `<a href="${nextHref}" class="book-end-cta-link next"><span class="book-end-cta-link-meta">다음 화 · EP ${String(next.episode).padStart(2, '0')} →</span><span class="book-end-cta-link-title">${escTitle(next.title)}</span></a>` : '<p class="book-end-cta-final">다음 화 미공개</p>'}
  </nav>
  <a href="${seriesUrl}?tab=chapters" class="book-end-cta-back">전체 회차 보기 →</a>
</aside>
`
  // block element 사이 whitespace text node 제거 — multi-column 안 inline box 가 col 차지하는 버그 회피.
  const fullBodyHtml = (coverChapterHtml + transformedBody + endHtml).replace(/>\s+</g, '><')

  return (
    <main className={MAIN_CLS}>
      <div
        className="w-full max-w-500 mx-auto border border-rule rounded-lg overflow-hidden bg-surface shadow-soft max-sm:flex max-sm:flex-col max-sm:max-w-none max-sm:h-full max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <BookHeader
          seriesTitle={manifest.title}
          seriesSlug={slug}
          episode={data.index.episode}
          chapterTitle={data.frontmatter.title || data.index.title}
          onToggleToc={() => setTocOpen((v) => !v)}
          tocOpen={tocOpen}
          fontSize={fontSize}
          fontFamily={fontFamily}
          onCycleFontSize={cycleFontSize}
          onCycleFontFamily={cycleFontFamily}
        />

        <div className="relative max-sm:flex-1 max-sm:min-h-0 max-sm:flex max-sm:flex-col" onClick={onContentClick}>
          <BookReader
            bodyHtml={fullBodyHtml}
            onSectionsChange={setSections}
            onProgressChange={setProgress}
            fontSize={fontSize}
            fontFamily={fontFamily}
          />
          {tocOpen && (
            <div
              className="absolute inset-0 z-20 grid grid-cols-[1fr_minmax(280px,420px)] items-stretch bg-bg/40 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label="목차 패널"
            >
              <button type="button"
                      aria-label="목차 닫기 (배경 클릭)"
                      onClick={() => setTocOpen(false)}
                      className="cursor-pointer"/>
              <div className="border-l border-rule h-full overflow-hidden">
                <BookToc
                  seriesSlug={slug}
                  seriesTitle={manifest.title}
                  currentEpisode={data.index.episode}
                  currentChapterTitle={data.frontmatter.title || data.index.title}
                  sections={sections}
                  activeSectionId={progress.activeSectionId}
                  currentPage={progress.page + 1}
                  chapters={manifest.chapters}
                  onSectionClick={onSectionClick}
                  onClose={() => setTocOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        <BookProgressBar page={progress.page} totalPages={progress.totalPages}/>

        {/* 하단 이전화·다음화 nav + 중앙 페이지 인디케이터 — 3 영역 균등 분배 (좌 prev / 중 page / 우 next). */}
        <nav aria-label="회차 이동"
             className="flex items-center justify-between gap-3 px-4 py-3 border-t border-rule bg-bg-soft text-sm">
          {prev ? (
            <a href={prevHref}
               onClick={(e) => {
                 e.preventDefault();
                 navigate(prevHref)
               }}
               className="inline-flex items-center gap-2 text-fg-2 hover:text-accent no-underline transition-colors min-w-0 flex-1">
              <span aria-hidden>←</span>
              <span
                className="text-fg-3 tabular-nums">EP {String(prev.episode).padStart(2, '0')}</span>
              <span className="truncate">{prev.title}</span>
            </a>
          ) : <span className="text-fg-4 text-xs flex-1">첫 회차</span>}
          <span className="text-fg-3 tabular-nums text-xs select-none shrink-0"
                aria-label={`${progress.page + 1} 페이지, 전체 ${progress.totalPages} 페이지`}>
            {progress.page + 1} / {progress.totalPages}
          </span>
          {next ? (
            <a href={nextHref}
               onClick={(e) => {
                 e.preventDefault();
                 navigate(nextHref)
               }}
               className="inline-flex items-center gap-2 text-fg-2 hover:text-accent no-underline transition-colors min-w-0 flex-1 justify-end">
              <span className="truncate">{next.title}</span>
              <span
                className="text-fg-3 tabular-nums">EP {String(next.episode).padStart(2, '0')}</span>
              <span aria-hidden>→</span>
            </a>
          ) : <span className="text-fg-4 text-xs flex-1 text-right">다음 화 미공개</span>}
        </nav>
      </div>
    </main>
  )
}

// 모바일 (≤640px) = fullscreen reader 모드 (SDD 017):
//   `fixed inset-0 z-50 bg-bg` — viewport 풀 점유 + 사이트 header/footer 가림 + z-50 으로 위 덮음.
//   `items-stretch` + book container `max-sm:h-full` → frame chain 이 viewport (100dvh) 풀 차지.
//   닫기 = BookHeader 안 시리즈 Link (← 작품 제목 클릭).
// 데스크탑 (>640px): 기존 인라인 페이지 (sm:items-center + min-h + px) 그대로 — 영향 0.
const MAIN_CLS = 'flex-1 w-full max-w-page mx-auto flex items-center justify-center min-h-[calc(100vh-160px)] px-[clamp(8px,2vw,16px)] max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:bg-bg max-sm:max-w-none max-sm:m-0 max-sm:p-0 max-sm:min-h-0 max-sm:items-stretch'
