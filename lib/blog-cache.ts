import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const BLOG_TAG = 'published-blog-v1'
// Safety net for out-of-band database edits. No polling or cron is introduced.
const CACHE_SECONDS = 86400

export const getPublishedPosts = unstable_cache(async () => {
  const rows = await sql`SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC`
  // Only public listing fields go to the client, not full articles or admin fields.
  return rows.map(row => ({
    id: row.id as string, title: row.title as string, subtitle: row.subtitle as string | null,
    slug: row.slug as string, excerpt: row.excerpt as string | null,
    cover_image: (row.cover_image ?? null) as string | null,
    tags: (row.tags ?? null) as string[] | null,
    published_at: row.published_at as string | null, updated_at: row.updated_at as string | null,
  }))
}, ['published-blog-list-v1'], { tags: [BLOG_TAG], revalidate: CACHE_SECONDS })

export const getPublishedPost = unstable_cache(async (slug: string) => {
  const rows = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true`
  return rows[0] ?? null
}, ['published-blog-post-v1'], { tags: [BLOG_TAG], revalidate: CACHE_SECONDS })

export function refreshPublicBlog() {
  // Next 15's single-argument revalidateTag expires immediately (not SWR).
  // Invalidate the whole blog: slug changes, cached 404s and neighbors all change.
  revalidateTag(BLOG_TAG)
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  revalidatePath('/sitemap.xml')
}

export function blogMutationResponse(data: Record<string, unknown>) {
  // Backend invalidation is flushed by Next after this handler returns. This
  // catches enqueue errors only; deployment checks must verify visible freshness.
  try {
    refreshPublicBlog()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[blog] Saved, but cache refresh failed', error)
    // The write committed: do not report a failed save and encourage duplicate POSTs.
    return NextResponse.json({ ...data, cacheWarning: 'Your change was saved, but public-page refresh failed. Do not repeat the save. Use Refresh public blog in the dashboard to retry.' })
  }
}
