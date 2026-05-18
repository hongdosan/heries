// © 2026 홍도산. All rights reserved. Original creator work.
// manifest fetch + 정규화 — series 도메인 SSOT.
// (구) shared/api/manifest.ts 에서 도메인별 분리 이동 (2026-05-18).
//
// 콘텐츠 SSOT:
// - `content/series.json` = 전체 시리즈 인덱스 (홈 페이지의 작품 목록)
// - `content/series/{slug}/manifest.json` = 시리즈별 인덱스 (챕터·캐릭터)
//
// 정규화 (normalizeSeriesManifest + normalizeCharacters + normalizeChapters):
// manifest.json 의 *unknown* 입력을 SeriesManifest 타입으로 안전 변환.
// - 모든 필드 = optional + type guard
// - 잘못된 character entry (id 누락 / 미지 folder) = skip
// - 잘못된 chapter entry (episode 비숫자 / slug 누락) = skip
// - 전체 fail 차단 (작가가 손으로 manifest.json 작성)

import {assetUrl} from '../../../shared/lib/env.js'
import type {CharacterFolder, CharacterIndex} from '../../character'
import type {ChapterIndex} from '../../chapter'
import type {SeriesIndexFile, SeriesManifest} from '../model/types.js'

/** 전체 시리즈 인덱스 fetch (`content/series.json`). 홈 페이지에서 호출. */
export async function fetchSeriesIndex(): Promise<SeriesIndexFile> {
  const res = await fetch(assetUrl('content/series.json'))
  if (!res.ok) throw new Error(`series.json fetch failed: ${res.status}`)
  return (await res.json()) as SeriesIndexFile
}

/**
 * 시리즈별 manifest fetch + 정규화.
 *
 * series 페이지의 etc 탭 + chapter / character 페이지 진입 시 호출.
 * 본 정규화 결과는 컴포넌트가 안전하게 사용 (강제 type assertion 없음).
 */
export async function fetchSeriesManifest(slug: string): Promise<SeriesManifest> {
  const res = await fetch(assetUrl(`content/series/${slug}/manifest.json`))
  if (!res.ok) throw new Error(`manifest.json fetch failed for ${slug}: ${res.status}`)
  const raw = (await res.json()) as unknown
  return normalizeSeriesManifest(raw)
}

// 캐릭터 folder = 4 종 (정렬 prefix 1-/2-/3-/4-). 미지 folder = 무시.
const VALID_FOLDERS: ReadonlySet<CharacterFolder> = new Set([
  '1-protagonist',
  '2-major-supporting',
  '3-antagonist',
  '4-minor',
])

/** `unknown` 이 string 일 때 값 반환, 아니면 fallback. */
function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

/** `unknown` 이 비어있지 않은 string 일 때만 반환, 아니면 undefined. */
function asNonEmptyString(v: unknown): string | undefined {
  return typeof v === 'string' && v ? v : undefined
}

/** `unknown` 을 Record 로 안전 변환 (object 아니면 null). */
function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' ? v as Record<string, unknown> : null
}

export function normalizeSeriesManifest(raw: unknown): SeriesManifest {
  const obj = asRecord(raw) ?? {}
  return {
    slug: asString(obj['slug']),
    title: asString(obj['title']),
    status: asString(obj['status']),
    started: asNonEmptyString(obj['started']),
    thumbnail: asNonEmptyString(obj['thumbnail']),
    characters: normalizeCharacters(obj['characters']),
    chapters: normalizeChapters(obj['chapters']),
  }
}

/** 단일 character entry 변환 — 무효면 null. */
function toCharacter(item: unknown): CharacterIndex | null {
  const o = asRecord(item)
  if (!o) return null
  const id = asString(o['id'])
  const folder = asString(o['folder'])
  // id 누락 또는 미지 folder = invalid (skip).
  if (!id || !VALID_FOLDERS.has(folder as CharacterFolder)) return null
  const name = asNonEmptyString(o['name']) ?? id
  const summary = asNonEmptyString(o['summary'])
  const entry: CharacterIndex = {id, folder: folder as CharacterFolder, name}
  if (summary) entry.summary = summary
  return entry
}

/** character 배열 정규화 — 잘못된 entry 는 skip. */
function normalizeCharacters(raw: unknown): CharacterIndex[] {
  if (!Array.isArray(raw)) return []
  return raw.map(toCharacter).filter((c): c is CharacterIndex => c !== null)
}

/** 단일 chapter entry 변환 — 무효면 null. */
function toChapter(item: unknown): ChapterIndex | null {
  const o = asRecord(item)
  if (!o) return null
  const episodeRaw = o['episode']
  const episode = typeof episodeRaw === 'number' ? episodeRaw : Number(episodeRaw)
  const slug = asString(o['slug'])
  // episode 비숫자 / slug 누락 = invalid (skip).
  if (!Number.isFinite(episode) || !slug) return null
  const entry: ChapterIndex = {
    episode,
    slug,
    title: asString(o['title']),
    published: asString(o['published']),
  }
  const thumbnail = asNonEmptyString(o['thumbnail'])
  if (thumbnail) entry.thumbnail = thumbnail
  return entry
}

/** chapter 배열 정규화 — 잘못된 entry 는 skip. */
function normalizeChapters(raw: unknown): ChapterIndex[] {
  if (!Array.isArray(raw)) return []
  return raw.map(toChapter).filter((c): c is ChapterIndex => c !== null)
}
