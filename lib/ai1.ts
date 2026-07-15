import { openSync, readSync, closeSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

export interface Ai1Doc {
  slug: string          // path segments under the category, no .html
  href: string          // static file URL
  viewHref: string      // in-site viewer URL
  title: string
  description: string
}

export interface Ai1Group {
  slug: string
  title: string
  docs: Ai1Doc[]
}

function titleCase(slug: string): string {
  return slug.split('-').map(w => (w.charAt(0).toUpperCase() + w.slice(1))).join(' ')
}

/** Read only the head of an HTML file — enough for <title> and meta description
 *  without pulling multi-MB decks into memory on every scan. */
export function readHtmlMetaLight(filePath: string): { title: string | null; description: string | null } {
  try {
    const fd = openSync(filePath, 'r')
    const buf = Buffer.alloc(8192)
    const bytes = readSync(fd, buf, 0, 8192, 0)
    closeSync(fd)
    const head = buf.toString('utf-8', 0, bytes)
    const t = head.match(/<title[^>]*>([^<]+)<\/title>/i)
    const d = head.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
      ?? head.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)
    return { title: t ? t[1].trim() : null, description: d ? d[1].trim() : null }
  } catch {
    return { title: null, description: null }
  }
}

/** Flat category: every *.html directly in `dir`. */
export function scanFlatCategory(dir: string, staticPrefix: string, viewPrefix: string): Ai1Doc[] {
  let files: string[]
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.html')).sort()
  } catch {
    return []
  }
  return files.map(filename => {
    const slug = filename.replace(/\.html$/, '')
    const meta = readHtmlMetaLight(join(dir, filename))
    return {
      slug,
      href: `${staticPrefix}/${filename}`,
      viewHref: `${viewPrefix}/${slug}`,
      title: meta.title || titleCase(slug),
      description: meta.description || '',
    }
  })
}

/** Lecture library: groups by book/collection.
 *  Layout handled:
 *    lectures/<group>/**\/*.html                      (flat per-book decks)
 *    lectures/library/<book>/lectures/<ch>/deck.html   (nested deck library)
 */
export function scanLectures(lecturesDir: string): Ai1Group[] {
  if (!existsSync(lecturesDir)) return []
  const groups = new Map<string, Ai1Doc[]>()

  const walk = (dir: string, rel: string[], depth: number) => {
    let entries: string[]
    try { entries = readdirSync(dir).sort() } catch { return }
    for (const entry of entries) {
      if (entry.startsWith('.')) continue
      const full = join(dir, entry)
      let st
      try { st = statSync(full) } catch { continue }
      if (st.isDirectory()) {
        if (depth < 5) walk(full, [...rel, entry], depth + 1)
      } else if (entry.endsWith('.html')) {
        const segs = [...rel, entry.replace(/\.html$/, '')]
        const groupKey = segs[0] === 'library' && segs.length > 1 ? segs[1] : segs[0]
        const meta = readHtmlMetaLight(full)
        const relPath = [...rel, entry].join('/')
        const chapterFallback =
          segs[segs.length - 1] === 'deck' && segs.length > 1
            ? titleCase(segs[segs.length - 2])
            : titleCase(segs[segs.length - 1])
        const doc: Ai1Doc = {
          slug: segs.join('/'),
          href: `/ai1/lectures/${relPath}`,
          viewHref: `/ai1/lectures/view/${segs.join('/')}`,
          title: meta.title || chapterFallback,
          description: meta.description || '',
        }
        const list = groups.get(groupKey) || []
        list.push(doc)
        groups.set(groupKey, list)
      }
    }
  }
  walk(lecturesDir, [], 0)

  return Array.from(groups.entries())
    .map(([slug, docs]) => ({
      slug,
      title: titleCase(slug),
      docs: docs.sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true })),
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

/** Resolve viewer segments to a static file path, refusing traversal. */
export function resolveLectureFile(publicDir: string, segments: string[]): string | null {
  if (segments.some(s => s === '..' || s.includes('\\') || s.startsWith('.'))) return null
  const rel = segments.join('/')
  const filePath = join(publicDir, 'ai1', 'lectures', `${rel}.html`)
  return existsSync(filePath) ? `/ai1/lectures/${rel}.html` : null
}
