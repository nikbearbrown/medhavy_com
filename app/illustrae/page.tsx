import { join } from 'path'
import type { Metadata } from 'next'
import { scanHtmlSubdirs } from '@/lib/html-meta'
import IllustraeBrowser from './IllustraeBrowser'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Previz - Medhavy',
  description: 'Animated figure previews. Experts review each and promote the best to prime-time Remotion renders.',
}

export default function IllustraePage() {
  const groups = scanHtmlSubdirs(join(process.cwd(), 'public', 'illustrae'))

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Previz</h1>
        <p className="text-muted-foreground mb-10">
          Animated figure previews, grouped by book. Each is a clean Illustrae plate with
          motion re-added. Review one at a time and promote the keepers to prime-time renders.
        </p>
        <IllustraeBrowser groups={groups} />
      </div>
    </div>
  )
}
