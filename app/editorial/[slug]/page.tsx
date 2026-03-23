import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticle } from '@/lib/articles/getArticle'
import { getAllArticles } from '@/lib/articles/getAllArticles'
import { getLook } from '@/lib/looks/getLook'
import { ArticleSpread } from '@/components/editorial/ArticleSpread'
import { MagazineNav } from '@/components/layout/MagazineNav'
import { SiteFooter } from '@/components/SiteFooter'

/* ── Static params — pre-render all known article pages ── */
export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

/* ── Per-article Open Graph metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article not found — KESTRA PROTOCOL' }

  return {
    title: `${article.headline} — KESTRA PROTOCOL`,
    description: article.teaser,
    openGraph: {
      title: article.headline,
      description: article.teaser,
      images: [{ url: article.coverImageUrl, alt: article.coverImageAlt }],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  }
}

/* ── Page ── */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  /* Resolve related look entries server-side */
  const relatedLookEntries = await Promise.all(
    (article.relatedLooks ?? []).map((lookSlug) => getLook(lookSlug)),
  ).then((results) => results.filter((l): l is NonNullable<typeof l> => l !== null))

  return (
    <>
      <MagazineNav />
      <main className="page-top">
        <ArticleSpread article={article} relatedLookEntries={relatedLookEntries} />
      </main>
      <SiteFooter />
    </>
  )
}
