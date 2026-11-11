import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPost } from '@/lib/blog-cache'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const post = await getPublishedPost(slug)
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Blog temporarily unavailable' }, { status: 503 })
  }
}
