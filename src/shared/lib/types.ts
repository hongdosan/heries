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
  | '1-main-character'
  | '2-major-supporting'
  | '3-supporting'
  | '3-antagonist'
  | '4-minor'

export interface CharacterIndex {
  id: string
  folder: CharacterFolder
  name: string
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
  /** Story arc / appearance span — series-long / phase-long / arc / single-episode / cameo-recurring. */
  arc_span?: string
  first_appearance?: string
  aliases?: string[]
  heries_arc?: string
  /** One-bite summary (1~3 lines, ≤200 chars) for cross-fanfic readers. Reader-safe (원작 정보 only). */
  summary?: string
}
