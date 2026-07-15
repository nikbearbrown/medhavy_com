import { join } from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { scanHtmlDir } from '@/lib/html-meta'
import { scanFlatCategory, scanLectures } from '@/lib/ai1'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Library - Medhavy',
  description: 'The Medhavy library: tools, lectures, visualizations, and simulations.',
}

export default function Ai1Page() {
  const pub = join(process.cwd(), 'public')
  const toolCount = scanHtmlDir(join(pub, 'artifacts')).length
  const lectureGroups = scanLectures(join(pub, 'ai1', 'lectures'))
  const lectureCount = lectureGroups.reduce((n, g) => n + g.docs.length, 0)
  const vizCount = scanFlatCategory(join(pub, 'ai1', 'visualizations'), '/ai1/visualizations', '/ai1/visualizations').length
  const simCount = scanFlatCategory(join(pub, 'ai1', 'simulations'), '/ai1/simulations', '/ai1/simulations').length

  const sections = [
    { href: '/ai1/tools', title: 'Tools', count: toolCount, unit: 'tools', description: 'A curated directory of AI tools for educators, students, and professionals.' },
    { href: '/ai1/lectures', title: 'Lectures', count: lectureCount, unit: 'decks', description: 'Narrated lecture decks, chapter by chapter, across the library.' },
    { href: '/ai1/visualizations', title: 'Visualizations', count: vizCount, unit: 'charts', description: 'Interactive chart references — one page per chart family.' },
    { href: '/ai1/simulations', title: 'Simulations', count: simCount, unit: 'simulations', description: 'Interactive simulations and explorable explanations.' },
  ]

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Library</h1>
        <p className="text-muted-foreground mb-8">Tools, lectures, visualizations, and simulations — the Medhavy library.</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map(s => (
            <Link key={s.href} href={s.href} className="group block border rounded-lg p-6 hover:border-foreground/40 transition-colors bg-card">
              <h2 className="text-xl font-semibold tracking-tight group-hover:underline mb-1">{s.title}</h2>
              <p className="text-xs text-muted-foreground mb-3">{s.count} {s.unit}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
