import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/blog-cache'

export async function GET() {
  try { return NextResponse.json(await getPublishedPosts()) }
  catch { return NextResponse.json({ error: 'Blog temporarily unavailable' }, { status: 503 }) }
}
