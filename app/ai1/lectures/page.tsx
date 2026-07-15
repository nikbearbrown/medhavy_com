import { join } from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { scanLectures } from '@/lib/ai1'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lectures - AI+1 - Medhavy',
  description: 'Narrated lecture decks, chapter by chapter, across the library.',
}

export default function LecturesPage() {
  const groups = scanLectures(join(process.cwd(), 'public', 'ai1', 'lectures'))
  const total = groups.reduce((n, g) => n + g.docs.length, 0)

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/ai1" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Library</Link>
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Lectures</h1>
        <p className="text-muted-foreground mb-10">{total} lecture decks across {groups.length} collections.</p>

        {groups.length === 0 && <p className="text-sm text-muted-foreground">Lectures coming soon.</p>}

        <div className="space-y-10">
          {groups.map(group => (
            <section key={group.slug}>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">{group.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.docs.map(doc => (
                  <Link key={doc.slug} href={doc.viewHref} className="group block border rounded-lg p-4 hover:border-foreground/40 transition-colors bg-card">
                    <h3 className="font-medium text-sm leading-snug group-hover:underline">{doc.title}</h3>
                    {doc.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
