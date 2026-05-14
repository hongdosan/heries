import { useState, useCallback } from 'react'
import { assetUrl } from './env.js'

/** Site-wide default thumbnail placeholder image. */
export const PLACEHOLDER_THUMB = assetUrl('content/_shared/images/thumbnail-placeholder.webp')

/**
 * Track <img> load failure so the caller can swap to a placeholder.
 * - First failure → swap to PLACEHOLDER_THUMB (state.error = true)
 * - Placeholder also failing → final state (state.fatal = true) so caller can
 *   render the CSS hatched-pattern empty box.
 */
export function useImgFallback(): {
  error: boolean
  fatal: boolean
  onError: () => void
} {
  const [error, setError] = useState(false)
  const [fatal, setFatal] = useState(false)
  const onError = useCallback(() => {
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
