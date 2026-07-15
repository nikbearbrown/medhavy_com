import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import groups from '@/lib/lectures-manifest.json'

type Doc = { slug: string; href: string; viewHref: string; title: string; description: string }
const ALL: Doc[] = groups.flatMap(g => g.docs as Doc[])

function findDoc(segments: string[]): Doc | null {
  if (segments.some(s => s === '..' || s.includes('\\'))) return null
  const key = segments.join('/')
  return ALL.find(d => d.slug === key) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = findDoc(slug)
  return { title: doc ? `${doc.title} - AI+1 - Medhavy` : 'Lecture - Medhavy', description: doc?.description || undefined }
}

export default async function LectureViewPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const doc = findDoc(slug)
  if (!doc) notFound()

  return (
    <div className="flex flex-col w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="w-full border-b bg-background">
        <div className="container px-4 md:px-6 mx-auto py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/ai1/lectures" className="text-sm text-muted-foreground hover:text-foreground mb-1 inline-block">← Back to Lectures</Link>
            <h1 className="text-2xl font-bold tracking-tighter truncate">{doc.title}</h1>
            {doc.description && <p className="text-sm text-muted-foreground mt-1 truncate">{doc.description}</p>}
          </div>
          <a href={doc.href} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium bg-foreground text-background shadow hover:bg-foreground/90 dark:border dark:border-input dark:bg-background dark:text-foreground dark:shadow-sm dark:hover:bg-accent dark:hover:text-accent-foreground">Full Screen</a>
        </div>
      </div>
      <div className="flex-1 w-full">
        <iframe src={doc.href} title={doc.title} className="w-full border-none" style={{ minHeight: 'calc(100vh - 12rem)' }} allowFullScreen />
      </div>
    </div>
  )
}
