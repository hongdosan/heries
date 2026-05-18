import {extractOutline} from '../../shared/lib/markdown.js'

interface ChapterOutlineProps {
  readonly bodyHtml: string
}

/**
 * 챕터 본문 목차 (h2 anchor) — 본문 안 2 절 이상일 때만 렌더.
 *
 * **추출 이유**: chapter.tsx 의 inline IIFE (25 줄) 패턴 분리 — 가독성 + 단일 책임.
 * **anchor scroll**: `<a href="#id">` 클릭 시 `scrollIntoView({ behavior: 'smooth' })`.
 * **시각**: `<details>` collapsible — 모바일에서도 접힘 가능.
 */
export function ChapterOutline({bodyHtml}: ChapterOutlineProps) {
  const outline = extractOutline(bodyHtml, 2)
  if (outline.length < 2) return null
  return (
    <details className="mb-5 p-3 px-4 bg-bg-soft border border-rule rounded-md group">
      <summary className="cursor-pointer font-semibold text-sm text-fg-2 tracking-[0.02em] list-none inline-flex items-center gap-2 [&::-webkit-details-marker]:hidden before:content-['▸'] before:text-xs before:text-fg-3 before:transition-transform group-open:before:rotate-90">
        목차 · {outline.length}개 절
      </summary>
      <ol className="mt-3 pl-5 text-sm text-fg-3 list-decimal">
        {outline.map((h) => (
          <li key={h.id} className="my-2">
            <a
              href={`#${h.id}`}
              className="text-fg-2 no-underline border-b border-transparent transition-[color,border-color] hover:text-accent hover:border-accent-ring"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({behavior: 'smooth', block: 'start'})
              }}
            >{h.text}</a>
          </li>
        ))}
      </ol>
    </details>
  )
}
