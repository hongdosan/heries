// © 2026 홍도산. All rights reserved. Original creator work.
// 시리즈 도메인 type SSOT — shared/lib/types.ts 에서 도메인별 분리 (2026-05-18).

import type {CharacterIndex} from '../../character'
import type {ChapterIndex} from '../../chapter'

/** 시리즈 목록 entry — `content/series.json` 의 `series[]` 원소. */
export interface SeriesIndex {
  slug: string
  title: string
  status: string
  started?: string
  thumbnail?: string
  /** 시리즈 카드의 한 줄 시놉시스 (홈 작품 목록 카드 노출). */
  description?: string
  /** 발행된 챕터 수 (홈 작품 목록 카드 노출). */
  chapterCount?: number
}

/** `content/series.json` 파일 전체 형. */
export interface SeriesIndexFile {
  series: SeriesIndex[]
}

/** 시리즈 frontmatter — `content/series/{slug}/_series.md`. */
export interface SeriesFrontmatter {
  title?: string
  slug?: string
  status?: string
  started?: string
}

/** 작품 상세 페이지의 lore note entry — 작품 헤더 우측 LORE NOTES 영역 노출 (각성자 / 마수 / 부대 등 핵심 용어). */
export interface LoreNote {
  term: string
  body: string
}

/** 시리즈 manifest — `content/series/{slug}/manifest.json`. 캐릭터/챕터 인덱스 + 상세 페이지 노출 메타 포함. */
export interface SeriesManifest {
  slug: string
  title: string
  status: string
  started?: string
  thumbnail?: string
  /** 카테고리 라벨 = 작품 상세 페이지의 제목 아래 *각성자 · 마수 · 군대* 식 노출. */
  categories?: string[]
  /** 작품 상세 페이지 LORE NOTES 영역 — 작품 핵심 용어 짧은 사전. */
  loreNotes?: LoreNote[]
  characters: CharacterIndex[]
  chapters: ChapterIndex[]
}

/** 시리즈 페이지가 사용하는 데이터 형 (loader 출력 + page consumer 입력). */
export interface SeriesPageData {
  frontmatter: SeriesFrontmatter
  bodyHtml: string
  manifest: SeriesManifest
}
