// © 2026 홍도산. All rights reserved. Original creator work.
// 챕터 도메인 type SSOT — shared/lib/types.ts 에서 도메인별 분리 (2026-05-18).

/** 챕터 인덱스 entry — `manifest.json` 의 `chapters[]` 원소. */
export interface ChapterIndex {
  episode: number
  slug: string
  title: string
  published: string
  thumbnail?: string
}

/** 챕터 frontmatter — `content/series/{slug}/chapters/ep-NN.md`. */
export interface ChapterFrontmatter {
  title?: string
  episode?: number
  published?: string
  characters?: string[]
}

/** 챕터 페이지가 사용하는 데이터 형 (loader 출력). */
export interface ChapterPageData {
  frontmatter: ChapterFrontmatter
  bodyHtml: string
  index: ChapterIndex
}
