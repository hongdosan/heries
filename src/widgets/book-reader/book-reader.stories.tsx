// © 2026 홍도산. All rights reserved. Original creator work.
import type {Meta, StoryObj} from '@storybook/react-vite'
import {MemoryRouter} from 'react-router-dom'
import {BookHeader, BookProgressBar, BookReader, BookToc} from './index.js'

// language=HTML
// (시리즈 cover 페이지는 2026-05-25 부로 제거 — 첫 페이지 = 챕터 cover 부터. specs/003-book-reader-skip-series-cover/)
const SAMPLE_BODY_HTML = `
  <section class="book-cover" id="__cover_chapter__">
    <p class="book-cover-ep">EP 04</p>
    <h2 class="book-cover-title">자대</h2>
  </section>
  <section class="section-cover" id="1-수료"><h2 id="1-수료">1. 수료</h2></section>
  <div class="section-body">
    <p>입소한 지 4 주가 지났다. 수료식 직후, 자대 배치표가 연병장 게시판에 붙었다.</p>
    <p>진혁이 줄 뒤쪽에서 본인 이름을 찾았다. 서울 북부 부대.</p>
  </div>
  <section class="section-cover" id="2-첫-출동"><h2 id="2-첫-출동">2. 첫 출동</h2></section>
  <div class="section-body">
    <p>야간 점호가 끝나고 막사가 어두워졌다.</p>
  </div>
  <section class="section-cover" id="3-검은-거리"><h2 id="3-검은-거리">3. 검은 거리</h2></section>
  <div class="section-body">
    <p>차가 단지 정문 앞에 멈췄다.</p>
  </div>
  <aside class="book-end-cta" id="__end__">
    <p class="book-end-cta-label">2 화 끝</p>
    <a href="/series/x?tab=chapters" class="book-end-cta-back">전체 회차 보기 →</a>
  </aside>
`

const SAMPLE_CHAPTERS = [
  {episode: 1, slug: 'ep-01', title: '마수의 등장', published: '2026-05-15'},
  {episode: 2, slug: 'ep-02', title: '마수와 사람 사이', published: '2026-05-15'},
  {episode: 3, slug: 'ep-03', title: '입소', published: '2026-05-16'},
  {episode: 4, slug: 'ep-04', title: '자대', published: '2026-05-18'},
]

const meta: Meta<typeof BookReader> = {
  title: 'organisms/book-reader (BookReader)',
  component: BookReader,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="border border-rule rounded-lg overflow-hidden bg-surface"
             style={{width: '900px'}}>
          <Story/>
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BookReader>

export const Default: Story = {
  args: {
    bodyHtml: SAMPLE_BODY_HTML,
  },
}

export const ShortBody: Story = {
  args: {
    bodyHtml: '<h2 id="1-짧은">1. 짧은 절</h2><p>본문이 한 페이지에 들어가는 짧은 케이스.</p>',
  },
}

export const WithHeaderAndProgress: Story = {
  render: () => (
    <div className="flex flex-col">
      <BookHeader
        seriesTitle="차원 격돌"
        seriesSlug="clash-of-multiverses"
        episode={4}
        chapterTitle="자대"
        onToggleToc={() => {
        }}
        tocOpen={false}
        fontSize="md"
        fontFamily="sans"
        onCycleFontSize={() => {
        }}
        onCycleFontFamily={() => {
        }}
      />
      <BookReader bodyHtml={SAMPLE_BODY_HTML}/>
      <BookProgressBar page={2} totalPages={12}/>
    </div>
  ),
}

export const WithToc: Story = {
  render: () => (
    <div className="h-150">
      <BookToc
        seriesSlug="clash-of-multiverses"
        seriesTitle="차원 격돌"
        currentEpisode={4}
        currentChapterTitle="자대"
        sections={[
          {id: '1-수료', text: '1. 수료'},
          {id: '2-첫-출동', text: '2. 첫 출동'},
          {id: '3-검은-거리', text: '3. 검은 거리'},
        ]}
        activeSectionId="1-수료"
        currentPage={3}
        chapters={SAMPLE_CHAPTERS}
        onSectionClick={() => {
        }}
        onClose={() => {
        }}
      />
    </div>
  ),
}
