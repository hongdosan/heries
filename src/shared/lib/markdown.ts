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
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? '')) {
        const m = (lines[i] ?? '').match(/^(\s*)[-*]\s+(.*)$/)
        if (!m) { i++; continue }
        items.push({ indent: (m[1] ?? '').length, text: m[2] ?? '' })
        i++
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
      out.push('<ol>' + buf.map((b) => `<li>${renderInline(b)}</li>`).join('') + '</ol>')
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
      const thead = '<thead><tr>' + header.map((h) => `<th>${renderInline(h)}</th>`).join('') + '</tr></thead>'
      const tbody =
        '<tbody>' +
        rows
          .map(
            (r) =>
              '<tr>' + r.map((c) => `<td>${renderInline(c)}</td>`).join('') + '</tr>',
          )
          .join('') +
        '</tbody>'
      out.push(`<table>${thead}${tbody}</table>`)
      continue
    }

    const buf: string[] = []
    while (i < lines.length && (lines[i] ?? '').trim() && !isBlockStart(lines[i] ?? '')) {
      buf.push(lines[i] ?? '')
      i++
    }
    out.push(`<p>${renderInline(buf.join(' '))}</p>`)
  }

  return out.join('\n')
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
function safeUrl(raw: string): string {
  const t = String(raw).trim()
  if (!t) return '#'
  // eslint-disable-next-line no-control-regex
  const stripped = t.replace(/[ -]/g, '')
  if (/^\s*(javascript|data|vbscript|file):/i.test(stripped)) return '#'
  return stripped.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function renderInline(src: string): string {
  let s = escapeHtml(src)
  s = s.replace(/`([^`]+)`/g, (_, c: string) => `<code>${c}</code>`)
  s = s.replace(new RegExp(`!\\[([^\\]]*)]\\((${URL_RE})\\)`, 'g'), (_, alt: string, url: string) => `<img src="${safeUrl(url)}" alt="${escapeAttr(String(alt))}">`)
  s = s.replace(new RegExp(`\\[([^\\]]+)]\\((${URL_RE})\\)`, 'g'), (_, txt: string, url: string) => `<a href="${safeUrl(url)}">${txt}</a>`)
  s = s.replace(/\*\*([^\n]+?)\*\*(?!\*)/g, '<strong>$1</strong>')
  s = s.replace(/(?<!\*)\*(?!\s)([^*\n]+?)(?<!\s)\*(?!\*)/g, '<em>$1</em>')
  return s
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function slugify(s: string): string {
  return s
    .replace(/[*_`~[\]()!#]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '')
}

export function extractOutline(html: string, level: 2 | 3 = 2): { id: string; text: string }[] {
  const re = new RegExp(`<h${level} id="([^"]+)">([^<]+)</h${level}>`, 'g')
  const items: { id: string; text: string }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    items.push({ id: m[1] ?? '', text: m[2] ?? '' })
  }
  return items
}
