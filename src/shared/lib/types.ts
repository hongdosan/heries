export interface SeriesIndex {
  slug: string
  title: string
  status: string
  started?: string
  thumbnail?: string
}

export interface SeriesIndexFile {
  series: SeriesIndex[]
}

export type CharacterFolder =
  | '1-protagonist'
  | '2-major-supporting'
  | '3-antagonist'
  | '4-minor'

export interface CharacterIndex {
  id: string
  folder: CharacterFolder
  name: string
  summary?: string
}

export interface ChapterIndex {
  episode: number
  slug: string
  title: string
  published: string
  thumbnail?: string
}

export interface SeriesManifest {
  slug: string
  title: string
  status: string
  started?: string
  thumbnail?: string
  characters: CharacterIndex[]
  chapters: ChapterIndex[]
}

export interface DocFile<F = Record<string, unknown>> {
  frontmatter: F
  body: string
}

export interface SeriesFrontmatter {
  title?: string
  slug?: string
  status?: string
  started?: string
}

export interface ChapterFrontmatter {
  title?: string
  episode?: number
  published?: string
  characters?: string[]
}

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
