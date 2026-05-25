import { assetUrl } from './env.js'

/**
 * H-eries 자체 markdown 렌더러.
 *
 * **의존 0 정책 (CLAUDE.md #3) 정합** — marked / markdown-it 등 외부 lib 미사용.
 * 사이트가 작가 자작 markdown 만 렌더하므로 *최소 spec* 만 구현:
 * - heading (h1~h6 + h2/h3 anchor link)
 * - code fence (```) / inline code (`)
 * - blockquote (>)
 * - 정렬·번호 list (- / N.)
 * - hr (---)
 * - 단순 table (| ... |)
 * - 이미지 + 링크 + bold + em
 *
 * **XSS 안전**: 모든 사용자 입력 (= frontmatter 값, 본문 텍스트) 은
 * `escapeHtml` / `escapeAttr` / `safeUrl` 통과 후 출력.
 * 결과 HTML 은 `dangerouslySetInnerHTML` 로 React 에 안전 주입.
 *
 * **anchor link**: h2/h3 만 자동 `#` 링크 부착 (스크롤 위치 공유 용).
 * **author-only heading**: `## 시놉시스` / `## H-eries 분기 ~` 는
 * 별도 class 로 마킹 (spoiler 마스킹 SSOT 정합).
 */

/**
 * 이미지 src 해석:
 * - 절대 URL (https://, //, data:) = 그대로
 * - `/` 시작 절대 경로 = 그대로
 * - 그 외 상대 경로 = `assetUrl()` 로 BASE_URL prefix 자동 적용
 */
function resolveImgUrl(raw: string): string {
  const safe = safeUrl(raw)
  if (safe === '#') return safe
  if (/^(https?:)?\/\//.test(safe) || safe.startsWith('data:') || safe.startsWith('/')) return safe
  return assetUrl(safe)
}

/**
 * 마크다운 텍스트 → HTML 문자열 변환.
 *
 * **알고리즘** = 라인 단위 순회 (block-level 인식) + 인라인 패턴은 `renderInline`.
 * - 빈 줄 = skip (paragraph 경계)
 * - `#` heading / ` ``` ` fence / `>` blockquote / `-` `N.` list / `---` hr / `|` table
 * - 그 외 = 단락 (`<p>`) 누적
 *
 * **HTML 주석 (`<!-- ... -->`) 사전 제거** — 저작권 고지 등 메타 정보 안 노출.
 */
export function renderMarkdown(src: string): string {
  const stripped = src.replace(/<!--[\s\S]*?-->/g, '')
  const lines = stripped.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''

    if (!line.trim()) {
      i++
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = (heading[1] ?? '').length
      const text = (heading[2] ?? '').trim()
      const id = slugify(text)
      const isAuthorOnly = text === '시놉시스' || text.startsWith('H-eries 분기')
      const cls = isAuthorOnly ? ' class="author-only-heading"' : ''
      // h2/h3 만 anchor link (h1 = 페이지 제목, h4+ = 세부 항목)
      const anchor = id && (level === 2 || level === 3)
        ? `<a href="#${id}" class="heading-anchor" aria-hidden="true" tabindex="-1">#</a>`
        : ''
      out.push(`<h${level}${cls} id="${id}">${renderInline(text)}${anchor}</h${level}>`)
      i++
      continue
    }

    if (line.startsWith('```')) {
      const fence = line.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        buf.push(lines[i] ?? '')
        i++
      }
      i++
      const cls = fence ? ` class="lang-${escapeAttr(fence)}"` : ''
      out.push(`<pre><code${cls}>${escapeHtml(buf.join('\n'))}</code></pre>`)
      continue
    }

    if (line.startsWith('> ') || line === '>') {
      const buf: string[] = []
      while (i < lines.length && ((lines[i] ?? '').startsWith('> ') || lines[i] === '>')) {
        buf.push((lines[i] ?? '').replace(/^>\s?/, ''))
        i++
      }
      out.push(`<blockquote>${renderMarkdown(buf.join('\n'))}</blockquote>`)
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: { indent: number; text: string }[] = []
      while (i < lines.length) {
        const cur = lines[i] ?? ''
        const m = cur.match(/^(\s*)[-*]\s+(.*)$/)
        if (m) {
          items.push({ indent: (m[1] ?? '').length, text: m[2] ?? '' })
          i++
          continue
        }
        // List continuation: 공백 들여쓰기로 시작 + list 패턴 아님 = 직전 항목의 wrap.
        // IDE 자동 줄바꿈으로 list item 이 두 줄로 나뉜 경우 동일 항목으로 묶는다.
        if (/^\s+\S/.test(cur) && items.length > 0) {
          const lastItem = items[items.length - 1]
          if (lastItem) {
            lastItem.text = joinParagraphLines([lastItem.text, cur.trim()])
          }
          i++
          continue
        }
        break
      }
      out.push(renderNestedList(items))
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? '')) {
        buf.push((lines[i] ?? '').replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      out.push(`<ol>${  buf.map((b) => `<li>${renderInline(b)}</li>`).join('')  }</ol>`)
      continue
    }

    if (line.startsWith('|') && i + 1 < lines.length && /^\|[\s\-:|]+\|\s*$/.test(lines[i + 1] ?? '')) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && (lines[i] ?? '').startsWith('|')) {
        rows.push(splitRow(lines[i] ?? ''))
        i++
      }
      const thead = `<thead><tr>${  header.map((h) => `<th>${renderInline(h)}</th>`).join('')  }</tr></thead>`
      const tbody =
        `<tbody>${ 
        rows
          .map(
            (r) =>
              `<tr>${  r.map((c) => `<td>${renderInline(c)}</td>`).join('')  }</tr>`,
          )
          .join('') 
        }</tbody>`
      out.push(`<table>${thead}${tbody}</table>`)
      continue
    }

    const buf: string[] = []
    while (i < lines.length && (lines[i] ?? '').trim() && !isBlockStart(lines[i] ?? '')) {
      buf.push(lines[i] ?? '')
      i++
    }
    out.push(`<p>${renderInline(joinParagraphLines(buf))}</p>`)
  }

  return out.join('\n')
}

// paragraph join — IDE / linter 가 자동 wrap 한 단락을 원래 텍스트로 복원.
// 줄바꿈 = 기본 공백 인서트 (한국어·영문 무관). 다음 줄이 *구두점* 으로 시작 시 공백 없음 (구두점 자연 정합).
// 2026-05-25 정정 — 이전 *한국어 양쪽 = 공백 없음* 가정은 한국어 자연 띄어쓰기 위반 (예: *동생 우선아의\n학생증* → *우선아의학생증* 버그).
function joinParagraphLines(lines: string[]): string {
  if (lines.length === 0) return ''
  let out = lines[0] ?? ''
  for (let k = 1; k < lines.length; k++) {
    const next = lines[k] ?? ''
    const nextCh = next.charAt(0)
    const isPunct = (ch: string) => /[.,!?;:)\]}」』"'…—–-]/.test(ch)
    const sep = isPunct(nextCh) ? '' : ' '
    out += sep + next
  }
  return out
}

function isBlockStart(line: string): boolean {
  return (
    /^(#{1,6})\s+/.test(line) ||
    line.startsWith('```') ||
    line.startsWith('> ') ||
    line === '>' ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    line.startsWith('|')
  )
}

function renderNestedList(items: { indent: number; text: string }[]): string {
  let html = ''
  const stack: number[] = []
  for (const it of items) {
    while (stack.length && (stack[stack.length - 1] ?? 0) > it.indent) {
      html += '</li></ul>'
      stack.pop()
    }
    if (!stack.length || (stack[stack.length - 1] ?? 0) < it.indent) {
      html += '<ul>'
      stack.push(it.indent)
    } else {
      html += '</li>'
    }
    html += `<li>${renderInline(it.text)}`
  }
  while (stack.length) {
    html += '</li></ul>'
    stack.pop()
  }
  return html
}

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split('|').map((c) => c.trim())
}

const URL_RE = String.raw`(?:[^\s()]|\([^\s()]*\))+`

// Allow http/https/mailto + relative paths + protocol-relative + fragments + assetUrl outputs.
// Block javascript:/data:/vbscript: and anything that looks like a script execution vector.
/**
 * URL XSS 안전 처리.
 * - `javascript:` / `data:` / `vbscript:` / `file:` 스킴 차단 → `#` 반환
 * - 제어 문자 (0x00~0x1F) 제거 (스킴 우회 패턴 차단)
 * - HTML 특수문자 escape (`"` `<` `>` → entity)
 */
function safeUrl(raw: string): string {
  const t = String(raw).trim()
  if (!t) return '#'
  // 제어 문자 (0x00~0x1F) 제거 — 스크립트 우회 패턴 차단.
   
  const stripped = t.replace(/[ -]/g, '')
  if (/^\s*(javascript|data|vbscript|file):/i.test(stripped)) return '#'
  return stripped.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 단일 라인의 인라인 markdown 패턴 → HTML.
 *
 * **처리 순서** (escape 가 첫 → 그 후 markdown pattern 만 적용 = XSS 안전):
 * 1. `escapeHtml` 첫 호출 — 모든 `<`/`>`/`&` escape
 * 2. inline code `` ` `` → `<code>`
 * 3. 이미지 `![alt](url)` → `<img src="resolved" alt="escaped" loading="lazy">`
 * 4. 링크 `[text](url)` → `<a href="safeUrl">text</a>`
 * 5. bold `**text**` → `<strong>`
 * 6. em `*text*` → `<em>` (단어 경계 강제 — 별표 단독·중첩 차단)
 *
 * **사용처** (frontmatter inline 값 직접 렌더):
 * - 캐릭터 카드의 origin / affiliation / heries_arc / summary 등
 */
export function renderInline(src: string): string {
  let s = escapeHtml(src)
  s = s.replace(/`([^`]+)`/g, (_, c: string) => `<code>${c}</code>`)
  s = s.replace(new RegExp(`!\\[([^\\]]*)]\\((${URL_RE})\\)`, 'g'), (_, alt: string, url: string) => `<img src="${resolveImgUrl(url)}" alt="${escapeAttr(String(alt))}" loading="lazy">`)
  s = s.replace(new RegExp(`\\[([^\\]]+)]\\((${URL_RE})\\)`, 'g'), (_, txt: string, url: string) => `<a href="${safeUrl(url)}">${txt}</a>`)
  s = s.replace(/\*\*([^\n]+?)\*\*(?!\*)/g, '<strong>$1</strong>')
  s = s.replace(/(?<!\*)\*(?!\s)([^*\n]+?)(?<!\s)\*(?!\*)/g, '<em>$1</em>')
  return s
}

/** `<`/`>`/`&` → HTML entity. body content escape 용. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** escapeHtml + `"` → entity. HTML attribute 값 escape 용. */
function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * heading 텍스트 → anchor id (URL fragment 안전).
 * 한국어 unicode 보존 (`\p{Letter}\p{Number}` 매칭) + 공백 `-` 치환 + lowercase.
 * 예: "## 핵심 정체성" → `핵심-정체성` → `#핵심-정체성` 링크.
 */
function slugify(s: string): string {
  return s
    .replace(/[*_`~[\]()!#]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '')
}

/**
 * 렌더된 HTML 에서 h2 (또는 h3) 의 `id` + 텍스트 추출 (목차 생성용).
 * chapter 페이지의 우측 outline (`<details>` 안 목차) 에서 사용.
 */
export function extractOutline(html: string, level: 2 | 3 = 2): { id: string; text: string }[] {
  // 렌더러가 h2/h3 에 `<a class="heading-anchor">#</a>` 자식을 자동 부착 → 내부 `<` 등장. inner 는 non-greedy `.*?` + flag `s` 로 매치.
  // text 는 `.heading-anchor` 통째 strip (= '#' 도 함께 제거) → 나머지 inline tag 제거.
  const re = new RegExp(`<h${level} id="([^"]+)">(.*?)</h${level}>`, 'gs')
  const items: { id: string; text: string }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const id = m[1] ?? ''
    const text = (m[2] ?? '')
      .replace(/<a\b[^>]*class="[^"]*heading-anchor[^"]*"[^>]*>.*?<\/a>/gs, '')
      .replace(/<[^>]*>/g, '')
      .trim()
    items.push({ id, text })
  }
  return items
}
