import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLook } from '@/lib/looks/getLook'
import { getAllLooks } from '@/lib/looks/getAllLooks'
import { LookSpread } from '@/components/look/LookSpread'
import { MagazineNav } from '@/components/layout/MagazineNav'

interface LookPageProps {
  params: Promise<{ lookSlug: string }>
}

export async function generateStaticParams() {
  const looks = await getAllLooks()
  return looks.map((look) => ({ lookSlug: look.lookSlug }))
}

export async function generateMetadata({ params }: LookPageProps): Promise<Metadata> {
  const { lookSlug } = await params
  const lookEntry = await getLook(lookSlug)
  if (!lookEntry) return { title: 'Look Not Found' }

  return {
    title: lookEntry.lookTitle,
    description: lookEntry.editorialStory.pullQuote,
    openGraph: {
      title: `${lookEntry.lookTitle} — KESTRA PROTOCOL`,
      description: lookEntry.editorialStory.pullQuote,
      images: [{ url: lookEntry.heroImageUrl, width: 1400 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${lookEntry.lookTitle} — KESTRA PROTOCOL`,
      images: [lookEntry.heroImageUrl],
    },
  }
}

export default async function LookPage({ params }: LookPageProps) {
  const { lookSlug } = await params
  const lookEntry = await getLook(lookSlug)

  if (!lookEntry || lookEntry.status === 'draft') {
    notFound()
  }

  return (
    <>
      {/* Transparent nav — hero image starts below it */}
      <MagazineNav heroMode />
      <LookSpread lookEntry={lookEntry} />
    </>
  )
}
