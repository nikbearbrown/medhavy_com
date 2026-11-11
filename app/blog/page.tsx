import { getPublishedPosts } from '@/lib/blog-cache'
import type { Metadata } from 'next'
import BlogFeed from './BlogFeed'

export const dynamic = 'force-static'
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog - Medhavy',
  description: 'Writing on the intersection of AI, humans, education, and technology by Medhavy.',
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Medhavy Blog</h1>
        <p className="text-muted-foreground mb-10">
          Writing on the intersection of AI, humans, education, and technology.
        </p>
        <BlogFeed posts={posts} />
      </div>
    </div>
  )
}
