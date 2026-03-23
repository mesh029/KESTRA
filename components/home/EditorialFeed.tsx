'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { EditorialArticle, ArticleCategory } from '@/types/article'

/** Session-persistent image cache — prevents skeleton flash on back navigation */
const loadedArticleImageUrls = new Set<string>()

/* ─────────────────────────────────────────────────────────────────────────────
   EDITORIAL FEED
   Magazine-style articles + trends section. Layout:

   ┌──────────────────────────────────────┬───────────────┐
   │  FEATURED (large, 2/3 width)         │  Article 2    │
   │  Image + headline overlay            ├───────────────┤
   │                                      │  Article 3    │
   └──────────────────────────────────────┴───────────────┘
   ┌────────────────────────────────────────────────────────ᐅ  horizontal scroll
   │  Art 4   │  Art 5   │  Art 6   │  Art 7   │
   └──────────────────────────────────────────────────────ᐅ
────────────────────────────────────────────────────────── */

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Trends:       'bg-accent text-paper',
  Process:      'bg-ink text-paper',
  Material:     'bg-ink text-paper',
  Culture:      'bg-ink text-paper',
  Interview:    'bg-ink text-paper',
  'Field Notes':'bg-ink text-paper',
}

function CategoryPill({ category }: { category: ArticleCategory }) {
  return (
    <span
      className={`inline-block font-mono text-[0.44rem] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full ${CATEGORY_COLORS[category]}`}
    >
      {category}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* ── Featured card — large, image-led ── */
function FeatureCard({ article }: { article: EditorialArticle }) {
  const [loaded, setLoaded] = useState(() => loadedArticleImageUrls.has(article.coverImageUrl))

  /*
   * Flat z-index stack — everything is a direct child of motion.article
   * (which is the stacking context). No nested position:relative divs
   * that create sub-contexts and fight the skeleton/text layers.
   *
   *  z-[1]  skeleton shimmer (shown only while image loads)
   *  z-[2]  the photo itself (next/image fill → position:absolute)
   *  z-[3]  gradient scrim (always visible, ensures text legibility)
   *  z-[4]  text + link (always on top, always readable)
   */
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-xl bg-surface min-h-[280px] h-full"
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* z-[1] — skeleton shown while image loads */}
      {!loaded && (
        <div className="absolute inset-0 z-[1] img-skeleton" aria-hidden="true" />
      )}

      {/* z-[2] — photo */}
      <Image
        src={article.coverImageUrl}
        alt={article.coverImageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 66vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ zIndex: 2, opacity: loaded ? 1 : 0, transition: 'opacity 0.45s ease' }}
        onLoad={() => { loadedArticleImageUrls.add(article.coverImageUrl); setLoaded(true) }}
      />

      {/* z-[3] — gradient scrim: always rendered so text is readable before & after image loads */}
      <div className="absolute inset-0 pointer-events-none scrim-hero" style={{ zIndex: 3 }} />

      {/* z-[4] — text content + link */}
      <Link
        href={`/editorial/${article.slug}`}
        className="absolute inset-0 flex flex-col justify-end card-caption-safe"
        style={{ zIndex: 4 }}
      >
        <div className="space-y-3">
          <CategoryPill category={article.category} />
          <h3
            className="font-display italic text-white leading-[1.07] line-clamp-3"
            style={{ fontSize: 'clamp(1.35rem, 3.2vw, 2.4rem)' }}
          >
            {article.headline}
          </h3>
          <p className="font-sans text-[0.875rem] text-white/80 leading-[1.7] max-w-[520px]">
            {article.teaser}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.18em] text-white/55">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-mono text-[0.42rem] text-white/30">·</span>
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.18em] text-white/55">
              {article.readingTimeMin} min read
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ── Side card — compact, image + text ── */
function SideCard({ article, delay = 0 }: { article: EditorialArticle; delay?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-xl flex-1 h-full"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <Link href={`/editorial/${article.slug}`} className="group flex flex-col h-full bg-surface">
        {/* Image — fills remaining space after text block */}
        <div className="relative flex-1 min-h-[120px]">
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 scrim-compact" />
          <div className="absolute top-3 left-3">
            <CategoryPill category={article.category} />
          </div>
        </div>
        {/* Text block — px-5 pb-6 clears the rounded-xl 12px corner curves */}
        <div className="card-caption-safe-compact shrink-0 bg-surface">
          <h3 className="font-display italic text-ink text-[1rem] sm:text-[1.0625rem] leading-[1.25] mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {article.headline}
          </h3>
          <p className="font-sans text-[0.8rem] text-muted leading-[1.65] line-clamp-2">
            {article.teaser}
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className="font-mono text-[0.44rem] uppercase tracking-[0.16em] text-muted/55">
              {formatDate(article.publishedAt)} · {article.readingTimeMin} min
            </p>
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-0 group-hover:translate-x-0.5 transition-transform">
              Read →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ── Strip card — horizontal scroll item ── */
function StripCard({ article, delay = 0 }: { article: EditorialArticle; delay?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-56 sm:w-64 overflow-hidden rounded-xl"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <Link href={`/editorial/${article.slug}`} className="group block bg-surface">
        <div className="relative" style={{ aspectRatio: '4/3' }}>
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt}
            fill
            sizes="260px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 scrim-standard" />
          <div className="absolute top-2.5 left-2.5">
            <CategoryPill category={article.category} />
          </div>
        </div>
        {/* px-5 pb-6 clears the 12px rounded-xl corner curves */}
        <div className="card-caption-safe-compact">
          <h3 className="font-display italic text-ink text-[0.9375rem] leading-[1.3] mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {article.headline}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.44rem] uppercase tracking-[0.16em] text-muted/55">
              {article.readingTimeMin} min read
            </p>
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ── Root component ── */
interface EditorialFeedProps {
  articles: EditorialArticle[]
}

export function EditorialFeed({ articles }: EditorialFeedProps) {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'All'>('All')

  const feature = articles.find((a) => a.isFeature) ?? articles[0]
  const rest = articles.filter((a) => a.articleId !== feature.articleId)

  const sideCards = rest.slice(0, 2)
  const stripCards =
    activeCategory === 'All'
      ? rest.slice(2)
      : rest.filter((a) => a.category === activeCategory)

  const categories: Array<ArticleCategory | 'All'> = [
    'All',
    ...Array.from(new Set(rest.map((a) => a.category))) as ArticleCategory[],
  ]

  return (
    <section className="bg-paper section-md" aria-label="Editorial and trends">
      <div className="kestra-wrap">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-line">
          <div>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-muted mb-1.5">
              Editorial & Trends
            </p>
            <h2
              className="font-display italic text-ink leading-[1.05]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
            >
              From the Atelier
            </h2>
          </div>
          <Link
            href="/editorial"
            className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors duration-200 shrink-0 inline-flex items-center gap-1.5 group"
          >
            <span className="border-b border-current pb-px">All Articles</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* ── Hero grid: feature + 2 side cards ── */}
        {/* lg:h-[560px] gives both cells a fixed height so the fill-image feature card
            and the two stacked side cards align flush at top and bottom.               */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:h-[560px] xl:h-[600px] gap-3 mb-3">
          <FeatureCard article={feature} />
          <div className="flex flex-row lg:flex-col gap-3 h-full">
            {sideCards.map((article, i) => (
              <SideCard key={article.articleId} article={article} delay={0.1 + i * 0.08} />
            ))}
          </div>
        </div>

        {/* ── Category filter ── */}
        {categories.length > 2 && (
          <div className="mt-8 mb-6">
            <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-line/80 bg-surface/70 px-2 py-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-mono text-[0.56rem] leading-none uppercase tracking-[0.12em] px-5 py-[0.52rem] rounded-full border transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper/80 text-muted border-line hover:border-ink/60 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
            </div>
          </div>
        )}

        {/* ── Horizontal scroll strip ── */}
        {stripCards.length > 0 && (
          <div className="relative">
            {/* Fade edge */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {stripCards.map((article, i) => (
                <StripCard key={article.articleId} article={article} delay={i * 0.06} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
