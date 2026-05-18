// © 2026 홍도산. All rights reserved. Original creator work.
// 캐릭터 도메인 type SSOT — shared/lib/types.ts 에서 도메인별 분리 (2026-05-18).

/** 캐릭터 폴더 — 등급별 분류 (`content/series/{slug}/characters/`). */
export type CharacterFolder =
  | '1-protagonist'
  | '2-major-supporting'
  | '3-antagonist'
  | '4-minor'

/** 캐릭터 인덱스 entry — `manifest.json` 의 `characters[]` 원소. */
export interface CharacterIndex {
  id: string
  folder: CharacterFolder
  name: string
  summary?: string
}

/** 캐릭터 frontmatter — `content/series/{slug}/characters/{folder}/{id}.md`. */
export interface CharacterFrontmatter {
  slug?: string
  name?: string
  origin?: string
  affiliation?: string
  role?: string
  first_appearance?: string
  /** 캐릭터 카드의 *공개 절* 갱신 시점 챕터 슬러그 (예: "ep-03"). reader build 에서 카드 노출 사실의 시점 명시. */
  reader_snapshot?: string
  aliases?: string[]
  /** H-eries 분기 (본 작품) 의 소환 시점. 작가 모드 전용 (정책 #9 v2 마스킹 대상). */
  heries_arc?: string
  summary?: string
}

/** 캐릭터 상세 페이지가 사용하는 데이터 형 (loader 출력). */
export interface CharacterPageData {
  frontmatter: CharacterFrontmatter
  bodyHtml: string
  index: CharacterIndex
}
