// © 2026 홍도산. All rights reserved. Original creator work.
// 도메인 무관 마크다운 fetch — shared/api 잔류 (type 의존 0).

import {assetUrl} from '../lib/env.js'

/** 마크다운 본문 fetch (raw text). frontmatter parse + renderMarkdown 은 호출처. */
export async function fetchMarkdown(path: string): Promise<string> {
  const res = await fetch(assetUrl(path))
  if (!res.ok) throw new Error(`markdown fetch failed: ${path} ${res.status}`)
  return res.text()
}
