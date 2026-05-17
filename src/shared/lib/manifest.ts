import { assetUrl } from './env.js'
import type {
  CharacterFolder,
  CharacterIndex,
  SeriesIndexFile,
  SeriesManifest,
} from './types.js'

/**
 * 콘텐츠 fetch + manifest 정규화 모듈.
 *
 * **콘텐츠 SSOT**:
 * - `content/series.json` = 전체 시리즈 인덱스 (홈 페이지의 작품 목록)
 * - `content/series/{slug}/manifest.json` = 시리즈별 인덱스 (챕터·캐릭터)
 * - `content/series/{slug}/{_series, chapters, characters, worldbuilding, ...}.md`
 *
 * **정규화** (normalizeSeriesManifest): manifest.json 의 *unknown* 입력을
 * `SeriesManifest` 타입으로 안전 변환. 잘못된 필드는 무시 (작가 운영 안전성).
 */

/** 전체 시리즈 인덱스 fetch (`content/series.json`). 홈 페이지에서 호출. */
export async function fetchSeriesIndex(): Promise<SeriesIndexFile> {
  const res = await fetch(assetUrl('content/series.json'))
  if (!res.ok) throw new Error(`series.json fetch failed: ${res.status}`)
  return (await res.json()) as SeriesIndexFile
}

/**
 * 시리즈별 manifest fetch + 정규화.
 *
 * series 페이지의 etc 탭 (개요·챕터·등장인물) + chapter / character 페이지 진입 시 호출.
 * 본 정규화 결과는 컴포넌트가 안전하게 사용 (강제 type assertion 없음).
 */
export async function fetchSeriesManifest(slug: string): Promise<SeriesManifest> {
  const res = await fetch(assetUrl(`content/series/${slug}/manifest.json`))
  if (!res.ok) throw new Error(`manifest.json fetch failed for ${slug}: ${res.status}`)
  const raw = (await res.json()) as unknown
  return normalizeSeriesManifest(raw)
}

/** 마크다운 본문 fetch (raw text). frontmatter parse + renderMarkdown 은 호출처. */
export async function fetchMarkdown(path: string): Promise<string> {
  const res = await fetch(assetUrl(path))
  if (!res.ok) throw new Error(`markdown fetch failed: ${path} ${res.status}`)
  return res.text()
}

// 캐릭터 folder = 4 종 (정렬 prefix 1-/2-/3-/4-). 미지 folder = 무시.
const VALID_FOLDERS: ReadonlySet<CharacterFolder> = new Set([
  '1-protagonist',
  '2-major-supporting',
  '3-antagonist',
  '4-minor',
])

/**
 * `unknown` (JSON.parse 결과) → 타입 안전 `SeriesManifest` 변환.
 *
 * **방어 패턴**:
 * - 모든 필드 = optional + type guard (string/array check)
 * - 잘못된 character entry (id 누락 / 미지 folder) = skip (전체 fail 안 시킴)
 * - 빈 chapters / characters = `[]` 기본값
 *
 * 작가가 manifest.json 을 손으로 작성하기 때문에 (자동 생성 X), 일부 오타나
 * 누락이 있어도 사이트가 깨지지 않게 보호.
 */
export function normalizeSeriesManifest(raw: unknown): SeriesManifest {
  const obj = (raw ?? {}) as Record<string, unknown>
  const started = obj['started']
  const thumbnail = obj['thumbnail']
  const chapters = obj['chapters']
  return {
    slug: String(obj['slug'] ?? ''),
    title: String(obj['title'] ?? ''),
    status: String(obj['status'] ?? ''),
    started: typeof started === 'string' ? started : undefined,
    thumbnail: typeof thumbnail === 'string' ? thumbnail : undefined,
    characters: normalizeCharacters(obj['characters']),
    chapters: Array.isArray(chapters) ? (chapters as SeriesManifest['chapters']) : [],
  }
}

/** character 배열 정규화 — 잘못된 entry 는 skip. */
function normalizeCharacters(raw: unknown): CharacterIndex[] {
  if (!Array.isArray(raw)) return []
  const out: CharacterIndex[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const idRaw = o['id']
    const folderRaw = o['folder']
    const nameRaw = o['name']
    const summaryRaw = o['summary']
    const id = typeof idRaw === 'string' ? idRaw : ''
    const folder = typeof folderRaw === 'string' ? folderRaw : ''
    // id 누락 또는 미지 folder = skip (전체 manifest fail 차단).
    if (!id || !VALID_FOLDERS.has(folder as CharacterFolder)) continue
    const name = typeof nameRaw === 'string' && nameRaw ? nameRaw : id
    const summary = typeof summaryRaw === 'string' && summaryRaw ? summaryRaw : undefined
    const entry: CharacterIndex = { id, folder: folder as CharacterFolder, name }
    if (summary) entry.summary = summary
    out.push(entry)
  }
  return out
}
