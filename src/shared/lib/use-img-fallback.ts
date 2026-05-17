import { useState, useCallback } from 'react'
import placeholderUrl from '../images/thumbnail-placeholder.webp?url'

/** 사이트 공통 placeholder 이미지 — 썸네일 fetch 실패 시 fallback. */
export const PLACEHOLDER_THUMB = placeholderUrl

/**
 * `<img>` 로드 실패 시 2 단계 fallback 추적 hook.
 *
 * **2 단계 흐름**:
 * 1. 원본 이미지 fetch 실패 → `error: true` set → 호출처가 PLACEHOLDER_THUMB 로 src 교체
 * 2. PLACEHOLDER_THUMB 도 실패 → `fatal: true` set → 호출처가 CSS 빗금 패턴 빈 박스 렌더
 *
 * **사용 예** (series-list / chapter-toc / character cover 등):
 * ```tsx
 * const { error, fatal, onError } = useImgFallback()
 * let src: string | null
 * if (fatal) src = null
 * else if (error) src = PLACEHOLDER_THUMB
 * else src = assetUrl(`content/series/${slug}/${thumbnail}`)
 *
 * {src ? <img src={src} onError={onError} /> : <span className="빗금" />}
 * ```
 */
export function useImgFallback(): {
  error: boolean
  fatal: boolean
  onError: () => void
} {
  const [error, setError] = useState(false)
  const [fatal, setFatal] = useState(false)
  const onError = useCallback(() => {
    // 첫 onError 호출 시 = 원본 fail → error true (호출처는 PLACEHOLDER 로 src 교체).
    // PLACEHOLDER 도 fail 하면 두 번째 onError → fatal true (호출처는 빈 박스 렌더).
    setError((prev) => {
      if (prev) {
        setFatal(true)
        return prev
      }
      return true
    })
  }, [])
  return { error, fatal, onError }
}
