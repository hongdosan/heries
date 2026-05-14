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

const VALID_FOLDERS: ReadonlySet<CharacterFolder> = new Set([
  '1-protagonist',
  '2-major-supporting',
  '3-antagonist',
  '4-minor',
])

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

function normalizeCharacters(raw: unknown): CharacterIndex[] {
  if (!Array.isArray(raw)) return []
  const out: CharacterIndex[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const idRaw = o['id']
    const folderRaw = o['folder']
    const nameRaw = o['name']
    const id = typeof idRaw === 'string' ? idRaw : ''
    const folder = typeof folderRaw === 'string' ? folderRaw : ''
    if (!id || !VALID_FOLDERS.has(folder as CharacterFolder)) continue
    const name = typeof nameRaw === 'string' && nameRaw ? nameRaw : id
    out.push({ id, folder: folder as CharacterFolder, name })
  }
  return out
}
