import { useEffect, useRef } from 'react'
import { loadCharacter } from '../../entities/character'
import type { SeriesManifest } from '../../shared/lib/types.js'

const CACHE_PREFIX = 'heries:character-summary:'

function readCache(slug: string, id: string): string | null {
  try {
    return localStorage.getItem(CACHE_PREFIX + slug + ':' + id)
  } catch {
    return null
  }
}

function writeCache(slug: string, id: string, summary: string): void {
  try {
    localStorage.setItem(CACHE_PREFIX + slug + ':' + id, summary)
  } catch {
    // localStorage 비활성 환경 — silent
  }
}

export interface CharacterMentionHostProps {
  slug: string
  manifest: SeriesManifest
  children: React.ReactNode
}

/**
 * 마크다운 본문 안의 {{char:id|name}} → `.character-mention` span 노드에
 * 호버 툴팁을 부착하는 hydration 컨테이너.
 *
 * 호버 시 lazy fetch (캐릭터 frontmatter.summary) + localStorage 캐싱.
 * 클릭 기능 없음 — 본문 내 캐릭터 mention 은 *맥락 정보 제공* 의 호버 툴팁
 * 만 노출하고, 캐릭터 페이지로의 이동은 시리즈 → 등장인물 탭에서만.
 *
 * 본 슬라이스가 본 작품에서 *등장인물 mention 의 유일한 공식 컴포넌트*.
 * 본문 안 캐릭터 언급은 모두 {{char:id|name}} syntax 로 작성하여 본 hydrator
 * 의 처리 흐름을 따른다.
 *
 * 의존성 = manifest 의 캐릭터 id 목록을 join 한 stable key. 본 키가 바뀌지
 * 않는 한 mount/cleanup 반복을 피한다 (manifest 객체 ref 가 매 렌더마다
 * 새로 만들어져도 안전).
 */
export function CharacterMentionHost({ slug, manifest, children }: CharacterMentionHostProps) {
  const ref = useRef<HTMLDivElement>(null)
  const manifestRef = useRef(manifest)
  manifestRef.current = manifest

  // stable key — 캐릭터 id 목록 동일하면 동일 key, 재마운트 없음
  const idsKey = manifest.characters.map((c) => c.id).join(',')

  useEffect(() => {
    const root = ref.current
    if (!root) return

    let activeTooltip: HTMLDivElement | null = null
    let activeAnchor: HTMLElement | null = null

    const positionTooltip = (anchor: HTMLElement, tip: HTMLDivElement) => {
      const rect = anchor.getBoundingClientRect()
      const tipRect = tip.getBoundingClientRect()
      const margin = 8
      let left = rect.left + rect.width / 2 - tipRect.width / 2
      left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin))
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow >= tipRect.height + margin + 8
        ? rect.bottom + margin
        : rect.top - tipRect.height - margin
      tip.style.left = `${left + window.scrollX}px`
      tip.style.top = `${top + window.scrollY}px`
    }

    const showTooltip = (anchor: HTMLElement, summary: string) => {
      hideTooltip()
      const tip = document.createElement('div')
      tip.className = 'character-mention-tooltip'
      tip.textContent = summary
      document.body.appendChild(tip)
      positionTooltip(anchor, tip)
      activeTooltip = tip
      activeAnchor = anchor
    }

    const hideTooltip = () => {
      if (activeTooltip) {
        activeTooltip.remove()
        activeTooltip = null
        activeAnchor = null
      }
    }

    const fetchSummary = async (id: string): Promise<string> => {
      const cached = readCache(slug, id)
      if (cached !== null) return cached
      // Early guard — manifest 에 등재되지 않은 id (오타·페이즈 2/3 미공개 빌런 등)
      // 는 fetch 시도 자체를 생략. reader 빌드에서는 빌런 카드가 dist 에 없어
      // 404 가 발생하므로 본 가드가 필수.
      const m = manifestRef.current
      if (!m.characters.some((c) => c.id === id)) {
        writeCache(slug, id, '')
        return ''
      }
      try {
        const data = await loadCharacter(slug, id, m)
        const summary = String(data.frontmatter.summary ?? '').trim() || data.index.name
        writeCache(slug, id, summary)
        return summary
      } catch {
        return ''
      }
    }

    const isStillHovered = (el: HTMLElement) =>
      el.matches(':hover') || document.activeElement === el

    const onEnter = (e: Event) => {
      const anchor = e.currentTarget as HTMLElement
      const id = anchor.dataset.characterId
      if (!id) return
      void fetchSummary(id).then((summary) => {
        if (!isStillHovered(anchor)) return
        if (summary) showTooltip(anchor, summary)
      })
    }

    const onLeave = (e: Event) => {
      const anchor = e.currentTarget as HTMLElement
      if (anchor === activeAnchor) hideTooltip()
    }

    const nodes = root.querySelectorAll<HTMLElement>('.character-mention[data-character-id]')
    nodes.forEach((node) => {
      node.addEventListener('mouseenter', onEnter)
      node.addEventListener('mouseleave', onLeave)
      node.addEventListener('focus', onEnter)
      node.addEventListener('blur', onLeave)
    })

    const onScroll = () => {
      if (activeTooltip && activeAnchor) positionTooltip(activeAnchor, activeTooltip)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      hideTooltip()
      nodes.forEach((node) => {
        node.removeEventListener('mouseenter', onEnter)
        node.removeEventListener('mouseleave', onLeave)
        node.removeEventListener('focus', onEnter)
        node.removeEventListener('blur', onLeave)
      })
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [slug, idsKey, children])

  return <div ref={ref}>{children}</div>
}
