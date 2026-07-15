import { join } from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { scanFlatCategory } from '@/lib/ai1'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Visualizations - AI+1 - Medhavy',
  description: 'Interactive chart references — one page per chart family.',
}

export default function VisualizationsPage() {
  const docs = scanFlatCategory(
    join(process.cwd(), 'public', 'ai1', 'visualizations'),
    '/ai1/visualizations',
    '/ai1/visualizations',
  )

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/ai1" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Library</Link>
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Visualizations</h1>
        <p className="text-muted-foreground mb-10">{docs.length} interactive chart references.</p>

        {docs.length === 0 && <p className="text-sm text-muted-foreground">Visualizations coming soon.</p>}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map(doc => (
            <Link key={doc.slug} href={doc.viewHref} className="group block border rounded-lg p-4 hover:border-foreground/40 transition-colors bg-card">
              <h3 className="font-medium text-sm leading-snug group-hover:underline">{doc.title}</h3>
              {doc.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
