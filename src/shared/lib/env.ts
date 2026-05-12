export const IS_AUTHOR_MODE: boolean =
  import.meta.env.VITE_AUTHOR_MODE === 'true' ||
  import.meta.env.VITE_AUTHOR_MODE === '1'

const BASE = import.meta.env.BASE_URL

export function assetUrl(rel: string): string {
  const trimmed = rel.replace(/^\.?\//, '')
  return `${BASE}${trimmed}`
}
