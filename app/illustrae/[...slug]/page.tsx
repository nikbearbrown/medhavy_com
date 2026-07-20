import Link from 'next/link'
import { notFound } from 'next/navigation'
import { join } from 'path'
import { existsSync } from 'fs'
import { scanHtmlSubdirs } from '@/lib/html-meta'
import VoteBar from '../VoteBar'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const groups = scanHtmlSubdirs(join(process.cwd(), 'public', 'illustrae'))
  for (const g of groups) {
    const doc = g.docs.find(d => d.slug === slugPath)
    if (doc) {
      return {
        title: `${doc.title} - Previz`,
        description: doc.description || doc.title,
      }
    }
  }
  return { title: 'Previz - Medhavy' }
}

export default async function IllustraeDocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const filePath = join(process.cwd(), 'public', 'illustrae', `${slugPath}.html`)

  if (!existsSync(filePath)) notFound()

  const groups = scanHtmlSubdirs(join(process.cwd(), 'public', 'illustrae'))
  let title = slug[slug.length - 1]
  let description = ''
  for (const g of groups) {
    const doc = g.docs.find(d => d.slug === slugPath)
    if (doc) {
      title = doc.title
      description = doc.description
      break
    }
  }

  return (
    <div className="flex flex-col w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="w-full border-b bg-background">
        <div className="container px-4 md:px-6 mx-auto py-4 flex items-center justify-between">
          <div>
            <Link
              href="/illustrae"
              className="text-sm text-muted-foreground hover:text-foreground mb-1 inline-block"
            >
              &larr; Back to Previz
            </Link>
            <h1 className="text-2xl font-bold tracking-tighter">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <VoteBar slug={slugPath} />
        </div>
      </div>
      <div className="flex-1 w-full">
        <iframe
          src={`/illustrae/${slugPath}.html`}
          title={title}
          className="w-full border-none"
          style={{ minHeight: 'calc(100vh - 12rem)' }}
        />
      </div>
    </div>
  )
}
