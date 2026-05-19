// © 2026 홍도산. All rights reserved. Original creator work.
import {useState} from 'react'
import {Link} from 'react-router-dom'
import type {ChapterIndex} from '../../entities/chapter'
import type {BookSection} from './book-reader.js'

/**
 * 책 reader 목차 사이드 패널 — 시안 img_4.png 정합.
 *
 * **2 탭**:
 * - *이 회차* — 현재 챕터의 절 목록 (활성 절 = 좌 굵은 선 + bg highlight)
 * - *회차 전체* — 시리즈 전체 챕터 목록 (현재 챕터 강조)
 *
 * **이웃 회차** (이 회차 탭 안 하단): EP 이전 · EP 다음 (미공개 = dim).
 * **푸터**: 시리즈 전체 챕터 링크.
 *
 * 본 컴포넌트 = `<aside>` (chapter.tsx 가 dialog/overlay 로 감싸 사용).
 */

type TocTab = 'this' | 'all'

interface BookTocProps {
  readonly seriesSlug: string
  readonly seriesTitle: string
  readonly currentEpisode: number
  readonly currentChapterTitle: string
  readonly sections: ReadonlyArray<BookSection>
  readonly activeSectionId: string | null
  readonly currentPage: number  // 1-indexed (UI 표시용)
  readonly chapters: ReadonlyArray<ChapterIndex>
  readonly onSectionClick: (id: string) => void
  readonly onClose: () => void
}

export function BookToc({
  seriesSlug, seriesTitle, currentEpisode, currentChapterTitle,
  sections, activeSectionId, currentPage, chapters, onSectionClick, onClose,
}: BookTocProps) {
  const [tab, setTab] = useState<TocTab>('this')
  const sorted = [...chapters].sort((a, b) => a.episode - b.episode)
  const prevCh = sorted.find((c) => c.episode === currentEpisode - 1)
  const nextCh = sorted.find((c) => c.episode === currentEpisode + 1)

  return (
    <aside className="h-full flex flex-col bg-surface text-fg overflow-hidden"
           aria-label="챕터 목차">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div>
          <p className="m-0 text-xs font-mono tracking-[0.2em] text-fg-3 uppercase">Contents</p>
          <h2 className="m-0 mt-1 text-xl font-semibold">목차</h2>
        </div>
        <button type="button" onClick={onClose}
                className="w-7 h-7 inline-flex items-center justify-center text-fg-3 hover:text-accent border border-rule rounded-sm transition-colors cursor-pointer"
                aria-label="목차 닫기">
          ✕
        </button>
      </div>

      <div role="tablist" aria-label="목차 범위" className="flex items-center gap-2 px-5 pb-3 text-sm border-b border-rule">
        <TocTabBtn label="이 회차" active={tab === 'this'} onClick={() => setTab('this')}/>
        <TocTabBtn label="회차 전체" active={tab === 'all'} onClick={() => setTab('all')}/>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === 'this' ? (
          <ThisChapterPanel
            currentEpisode={currentEpisode}
            currentChapterTitle={currentChapterTitle}
            sections={sections}
            activeSectionId={activeSectionId}
            currentPage={currentPage}
            prevCh={prevCh}
            nextCh={nextCh}
            seriesSlug={seriesSlug}
            onSectionClick={onSectionClick}
          />
        ) : (
          <AllChaptersPanel
            chapters={sorted}
            currentEpisode={currentEpisode}
            seriesSlug={seriesSlug}
          />
        )}
      </div>

      <div className="border-t border-rule px-5 py-3">
        <Link to={`/series/${seriesSlug}?tab=chapters`}
              aria-label={`${seriesTitle} 전체 회차 목록으로 이동`}
              className="flex items-center justify-between text-sm text-fg-2 hover:text-accent transition-colors no-underline">
          <span>전체 회차 보기</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  )
}

function TocTabBtn({label, active, onClick}: Readonly<{label: string; active: boolean; onClick: () => void}>) {
  return (
    <button type="button" role="tab" aria-selected={active}
            onClick={onClick}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
              active ? 'bg-accent-soft text-accent font-semibold' : 'text-fg-3 hover:text-fg-2'
            }`}>
      {label}
    </button>
  )
}

function ThisChapterPanel({
  currentEpisode, currentChapterTitle, sections, activeSectionId, currentPage,
  prevCh, nextCh, seriesSlug, onSectionClick,
}: Readonly<{
  currentEpisode: number
  currentChapterTitle: string
  sections: ReadonlyArray<BookSection>
  activeSectionId: string | null
  currentPage: number
  prevCh: ChapterIndex | undefined
  nextCh: ChapterIndex | undefined
  seriesSlug: string
  onSectionClick: (id: string) => void
}>) {
  return (
    <>
      <p className="m-0 mb-3 text-xs text-fg-3">
        EP {String(currentEpisode).padStart(2, '0')} · {currentChapterTitle}
      </p>
      {sections.length === 0 ? (
        <p className="m-0 text-sm text-fg-3">절 정보 없음.</p>
      ) : (
        <ol className="m-0 p-0 list-none flex flex-col gap-1">
          {sections.map((s) => {
            const active = s.id === activeSectionId
            // s.text 가 이미 "1. 수료" 형태로 넘버링 포함 (markdown h2 원문) → 별도 인덱스 미표시 (중복 방지).
            return (
              <li key={s.id}>
                <button type="button" onClick={() => onSectionClick(s.id)}
                        aria-current={active ? 'true' : undefined}
                        className={`block w-full text-left px-3 py-2.5 rounded-md transition-colors cursor-pointer border-l-[3px] ${
                          active
                            ? 'bg-bg-soft border-l-fg text-fg'
                            : 'border-l-transparent text-fg-2 hover:bg-bg-soft hover:text-fg'
                        }`}>
                  <span className="block text-sm font-medium">{s.text}</span>
                  {active && (
                    <span className="block text-xs text-fg-3 mt-1">
                      읽는 중 · p.{currentPage}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      )}
      <hr className="my-5 border-0 border-t border-rule"/>
      <p className="m-0 mb-2 text-xs text-fg-3">이웃 회차</p>
      <ul className="m-0 p-0 list-none flex flex-col gap-1">
        {prevCh ? (
          <li>
            <Link to={`/series/${seriesSlug}/chapter/${prevCh.episode}`}
                  className="flex items-baseline justify-between gap-3 px-3 py-2 rounded-md text-fg-2 hover:bg-bg-soft hover:text-fg transition-colors no-underline">
              <span className="text-xs text-fg-3 tabular-nums">EP {String(prevCh.episode).padStart(2, '0')}</span>
              <span className="text-sm flex-1">{prevCh.title}</span>
              <span aria-hidden className="text-fg-4">→</span>
            </Link>
          </li>
        ) : null}
        {nextCh ? (
          <li>
            <Link to={`/series/${seriesSlug}/chapter/${nextCh.episode}`}
                  className="flex items-baseline justify-between gap-3 px-3 py-2 rounded-md text-fg-2 hover:bg-bg-soft hover:text-fg transition-colors no-underline">
              <span className="text-xs text-fg-3 tabular-nums">EP {String(nextCh.episode).padStart(2, '0')}</span>
              <span className="text-sm flex-1">{nextCh.title}</span>
              <span aria-hidden className="text-fg-4">→</span>
            </Link>
          </li>
        ) : (
          <li className="flex items-baseline gap-3 px-3 py-2 text-fg-4">
            <span className="text-xs tabular-nums">EP {String(currentEpisode + 1).padStart(2, '0')}</span>
            <span className="text-sm italic">미공개</span>
          </li>
        )}
      </ul>
    </>
  )
}

function AllChaptersPanel({chapters, currentEpisode, seriesSlug}: Readonly<{
  chapters: ReadonlyArray<ChapterIndex>
  currentEpisode: number
  seriesSlug: string
}>) {
  return (
    <ol className="m-0 p-0 list-none flex flex-col gap-1">
      {chapters.map((c) => {
        const current = c.episode === currentEpisode
        return (
          <li key={c.episode}>
            <Link to={`/series/${seriesSlug}/chapter/${c.episode}`}
                  aria-current={current ? 'page' : undefined}
                  className={`flex items-baseline gap-3 px-3 py-2 rounded-md transition-colors no-underline ${
                    current
                      ? 'bg-bg-soft border-l-[3px] border-l-fg text-fg font-semibold pl-[9px]'
                      : 'text-fg-2 hover:bg-bg-soft hover:text-fg border-l-[3px] border-l-transparent pl-[9px]'
                  }`}>
              <span className="text-xs text-fg-3 tabular-nums">EP {String(c.episode).padStart(2, '0')}</span>
              <span className="text-sm flex-1">{c.title}</span>
              {c.published && (
                <time dateTime={c.published} className="text-xs text-fg-4 tabular-nums">{c.published.slice(5)}</time>
              )}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
