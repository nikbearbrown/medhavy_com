import Link from 'next/link'
import { notFound } from 'next/navigation'
import { join } from 'path'
import { resolveLectureFile, readHtmlMetaLight } from '@/lib/ai1'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const src = resolveLectureFile(join(process.cwd(), 'public'), slug)
  if (!src) return { title: 'Lecture - AI+1 - Medhavy' }
  const meta = readHtmlMetaLight(join(process.cwd(), 'public', src))
  return { title: `${meta.title || 'Lecture'} - AI+1 - Medhavy`, description: meta.description || undefined }
}

export default async function LectureViewPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const src = resolveLectureFile(join(process.cwd(), 'public'), slug)
  if (!src) notFound()

  const meta = readHtmlMetaLight(join(process.cwd(), 'public', src))
  const title = meta.title || 'Lecture'

  return (
    <div className="flex flex-col w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="w-full border-b bg-background">
        <div className="container px-4 md:px-6 mx-auto py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/ai1/lectures" className="text-sm text-muted-foreground hover:text-foreground mb-1 inline-block">← Back to Lectures</Link>
            <h1 className="text-2xl font-bold tracking-tighter truncate">{title}</h1>
            {meta.description && <p className="text-sm text-muted-foreground mt-1 truncate">{meta.description}</p>}
          </div>
          <a href={src} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium bg-foreground text-background shadow hover:bg-foreground/90 dark:border dark:border-input dark:bg-background dark:text-foreground dark:shadow-sm dark:hover:bg-accent dark:hover:text-accent-foreground">Full Screen</a>
        </div>
      </div>
      <div className="flex-1 w-full">
        <iframe src={src} title={title} className="w-full border-none" style={{ minHeight: 'calc(100vh - 12rem)' }} allowFullScreen />
      </div>
    </div>
  )
}
