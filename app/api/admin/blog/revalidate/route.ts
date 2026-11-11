import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { refreshPublicBlog } from '@/lib/blog-cache'

export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    refreshPublicBlog()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Refresh failed; please retry. No content was changed.' }, { status: 503 })
  }
}
