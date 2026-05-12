import type { SeriesIndexFile, SeriesManifest } from './types.js'

export async function fetchSeriesIndex(): Promise<SeriesIndexFile> {
  const res = await fetch('./content/series.json')
  if (!res.ok) throw new Error(`series.json fetch failed: ${res.status}`)
  return (await res.json()) as SeriesIndexFile
}

export async function fetchSeriesManifest(slug: string): Promise<SeriesManifest> {
  const res = await fetch(`./content/series/${slug}/manifest.json`)
  if (!res.ok) throw new Error(`manifest.json fetch failed for ${slug}: ${res.status}`)
  return (await res.json()) as SeriesManifest
}

export async function fetchMarkdown(path: string): Promise<string> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`markdown fetch failed: ${path} ${res.status}`)
  return await res.text()
}
