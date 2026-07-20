'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function getVoterId(): string {
  try {
    let id = sessionStorage.getItem('previz_voter')
    if (!id) {
      id = 'r' + Math.random().toString(36).slice(2, 10)
      sessionStorage.setItem('previz_voter', id)
    }
    return id
  } catch {
    return 'anon'
  }
}

export default function VoteBar({ slug }: { slug: string }) {
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(0)
  const [mine, setMine] = useState<'up' | 'down' | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(`/api/illustrae/vote?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => {
        if (typeof d.up === 'number') setUp(d.up)
        if (typeof d.down === 'number') setDown(d.down)
      })
      .catch(() => {})
  }, [slug])

  async function vote(verdict: 'up' | 'down') {
    if (busy) return
    setBusy(true)
    setMine(verdict)
    try {
      const res = await fetch('/api/illustrae/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, verdict, voter: getVoterId() }),
      })
      const d = await res.json()
      if (typeof d.up === 'number') setUp(d.up)
      if (typeof d.down === 'number') setDown(d.down)
    } catch {
      // ignore
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => vote('up')}
        disabled={busy}
        aria-label="Promote"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors disabled:opacity-50',
          mine === 'up'
            ? 'border-green-600 bg-green-600 text-white'
            : 'hover:border-foreground/30 hover:bg-accent'
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="tabular-nums">{up}</span>
      </button>
      <button
        onClick={() => vote('down')}
        disabled={busy}
        aria-label="Pass"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors disabled:opacity-50',
          mine === 'down'
            ? 'border-red-600 bg-red-600 text-white'
            : 'hover:border-foreground/30 hover:bg-accent'
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="tabular-nums">{down}</span>
      </button>
    </div>
  )
}
