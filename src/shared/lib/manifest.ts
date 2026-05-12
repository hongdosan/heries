import { assetUrl } from './env.js'
import type {
  CharacterFolder,
  CharacterIndex,
  SeriesIndexFile,
  SeriesManifest,
} from './types.js'

export async function fetchSeriesIndex(): Promise<SeriesIndexFile> {
  const res = await fetch(assetUrl('content/series.json'))
  if (!res.ok) throw new Error(`series.json fetch failed: ${res.status}`)
  return (await res.json()) as SeriesIndexFile
}

export async function fetchSeriesManifest(slug: string): Promise<SeriesManifest> {
  const res = await fetch(assetUrl(`content/series/${slug}/manifest.json`))
  if (!res.ok) throw new Error(`manifest.json fetch failed for ${slug}: ${res.status}`)
  const raw = (await res.json()) as unknown
  return normalizeSeriesManifest(raw)
}

export async function fetchMarkdown(path: string): Promise<string> {
  const res = await fetch(assetUrl(path))
  if (!res.ok) throw new Error(`markdown fetch failed: ${path} ${res.status}`)
  return await res.text()
}

/**
 * manifest.json 의 `characters` 필드는 역사적으로 두 형식이 혼재한다:
 *   - 신규(권장): `CharacterIndex[]` = `{ id, folder, name }[]`
 *   - 레거시: `string[]` = `"{folder}/{id}"[]`
 *
 * 본 정규화는 두 형식 모두를 안전하게 `CharacterIndex[]` 로 변환하여
 * 다운스트림 코드 (`manifest.characters.find((c) => c.id === ...)`) 의
 * 가정을 보장한다. 또한 부분적으로 누락된 객체 (예: `name` 없음) 도
 * graceful 하게 `id` 로 fallback 한다.
 *
 * 본 fix 는 11 카드 렌더링 차단 버그 (string[] / CharacterIndex[] 혼재
 * 로 인한 `find` 항상 undefined) 의 코드 측 안전망이다.
 */
export function normalizeSeriesManifest(raw: unknown): SeriesManifest {
  const obj = (raw ?? {}) as Record<string, unknown>
  return {
    slug: String(obj.slug ?? ''),
    title: String(obj.title ?? ''),
    status: String(obj.status ?? ''),
    started: String(obj.started ?? ''),
    thumbnail: typeof obj.thumbnail === 'string' ? obj.thumbnail : undefined,
    characters: normalizeCharacters(obj.characters),
    chapters: Array.isArray(obj.chapters) ? (obj.chapters as SeriesManifest['chapters']) : [],
  }
}

function normalizeCharacters(raw: unknown): CharacterIndex[] {
  if (!Array.isArray(raw)) return []
  const out: CharacterIndex[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      // 레거시 "{folder}/{id}" 형식
      const slash = item.indexOf('/')
      if (slash < 0) continue
      const folder = item.slice(0, slash)
      const id = item.slice(slash + 1)
      if (!id) continue
      out.push({ id, folder: folder as CharacterFolder, name: id })
      continue
    }
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const id = typeof o.id === 'string' ? o.id : ''
      const folder = typeof o.folder === 'string' ? (o.folder as CharacterFolder) : undefined
      if (!id || !folder) continue
      const name = typeof o.name === 'string' && o.name ? o.name : id
      out.push({ id, folder, name })
    }
  }
  return out
}
