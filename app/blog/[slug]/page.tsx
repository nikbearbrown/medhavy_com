import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedPost, getPublishedPosts } from '@/lib/blog-cache'
import { getReadingTime } from '@/lib/utils'
import BlogVizHydrator from '@/components/BlogVizHydrator/BlogVizHydrator'

export const dynamic = 'force-static'
export const revalidate = 86400

// Generate on first request, then serve cached HTML (including newly published slugs).
export async function generateStaticParams() { return [] }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (post) {
      return {
        title: `${post.title} - Medhavy`,
        description: post.excerpt || post.subtitle || post.title,
        openGraph: {
          title: post.title,
          description: post.excerpt || post.subtitle || post.title,
          images: post.cover_image ? [post.cover_image] : [],
        },
        twitter: {
          card: 'summary_large_image' as const,
          title: post.title,
          description: post.excerpt || post.subtitle || post.title,
          images: post.cover_image ? [post.cover_image] : [],
        },
      }
    }
  return { title: 'Blog - Medhavy' }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()
  const posts = await getPublishedPosts()
  const index = posts.findIndex(p => p.slug === slug)
  const prevPost = index >= 0 ? posts[index + 1] : null
  const nextPost = index > 0 ? posts[index - 1] : null

  const readingTime = getReadingTime(post.content || '')

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← Back to Blog
          </Link>
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt=""
              className="w-full h-48 sm:h-80 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">{post.title}</h1>
          {post.subtitle && <p className="text-xl text-muted-foreground mt-3">{post.subtitle}</p>}
          <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
            {post.published_at && <time>{formatDate(post.published_at)}</time>}
            {post.published_at && <span>·</span>}
            <span>{readingTime}</span>
          </div>
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none overflow-x-hidden prose-headings:font-bold prose-headings:tracking-tighter prose-a:text-foreground prose-a:underline prose-img:rounded-lg">
          <BlogVizHydrator html={post.content} />
        </div>
        {post.byline && (
          <div className="mt-12 pt-8 border-t text-sm text-muted-foreground whitespace-pre-line">
            {post.byline}
          </div>
        )}

        {/* Previous / Next */}
        {(prevPost || nextPost) && (
          <nav className="mt-16 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              {prevPost && (
                <Link href={`/blog/${prevPost.slug}`} className="group block">
                  <span className="text-xs text-muted-foreground">← Previous</span>
                  <p className="text-sm font-medium mt-1 group-hover:underline">{prevPost.title}</p>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="group block">
                  <span className="text-xs text-muted-foreground">Next →</span>
                  <p className="text-sm font-medium mt-1 group-hover:underline">{nextPost.title}</p>
                </Link>
              )}
            </div>
          </nav>
        )}

        <div className="mt-16 pt-8 border-t">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Back to Blog</Link>
        </div>
      </div>
    </div>
  )
}
