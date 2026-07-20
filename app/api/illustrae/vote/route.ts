import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/illustrae/vote?slug=book/name  -> { up, down }
// GET /api/illustrae/vote                 -> [{ slug, up, down }]
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  try {
    if (slug) {
      const rows = await sql`
        SELECT
          COUNT(*) FILTER (WHERE verdict = 'up')   AS up,
          COUNT(*) FILTER (WHERE verdict = 'down') AS down
        FROM previz_votes
        WHERE slug = ${slug}
      `
      const r = rows[0] || { up: 0, down: 0 }
      return NextResponse.json({ up: Number(r.up), down: Number(r.down) })
    }
    const rows = await sql`
      SELECT slug,
        COUNT(*) FILTER (WHERE verdict = 'up')   AS up,
        COUNT(*) FILTER (WHERE verdict = 'down') AS down
      FROM previz_votes
      GROUP BY slug
      ORDER BY slug
    `
    return NextResponse.json(
      rows.map(r => ({ slug: r.slug, up: Number(r.up), down: Number(r.down) }))
    )
  } catch (err) {
    console.error('[api/illustrae/vote] GET failed:', err)
    return NextResponse.json(slug ? { up: 0, down: 0 } : [])
  }
}

// POST { slug, verdict: 'up'|'down', voter, note? } -> upsert one vote per (slug, voter)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const slug = String(body.slug || '').trim()
    const verdict = String(body.verdict || '').trim()
    const voter = String(body.voter || 'anon').trim().slice(0, 64) || 'anon'
    const note = body.note ? String(body.note).slice(0, 500) : null

    if (!slug || (verdict !== 'up' && verdict !== 'down')) {
      return NextResponse.json({ error: 'slug and verdict (up|down) required' }, { status: 400 })
    }

    await sql`
      INSERT INTO previz_votes (slug, verdict, voter, note)
      VALUES (${slug}, ${verdict}, ${voter}, ${note})
      ON CONFLICT (slug, voter)
      DO UPDATE SET verdict = EXCLUDED.verdict, note = EXCLUDED.note, created_at = NOW()
    `

    const rows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE verdict = 'up')   AS up,
        COUNT(*) FILTER (WHERE verdict = 'down') AS down
      FROM previz_votes
      WHERE slug = ${slug}
    `
    const r = rows[0] || { up: 0, down: 0 }
    return NextResponse.json({ ok: true, up: Number(r.up), down: Number(r.down) })
  } catch (err) {
    console.error('[api/illustrae/vote] POST failed:', err)
    return NextResponse.json({ error: 'vote failed' }, { status: 500 })
  }
}
