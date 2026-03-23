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
   Magazine-style articles + design-process section.

   ┌──────────────────────────────────────┬───────────────┐
   │  FEATURED (large, 2/3 width)         │  Article 2    │
   │  Image + headline overlay            ├───────────────┤
   │                                      │  Article 3    │
   └──────────────────────────────────────┴───────────────┘
   ┌── SCROLLABLE TAB BAR: ALL · PROCESS · MATERIAL · … ──┐
   ┌────────────────────────────────────────────────────────ᐅ horizontal scroll
   │  Art 4   │  Art 5   │  Art 6   │  Art 7   │
   └──────────────────────────────────────────────────────ᐅ
────────────────────────────────────────────────────────── */

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Trends:         'bg-accent text-paper',
  Process:        'bg-ink text-paper',
  Material:       'bg-ink text-paper',
  Culture:        'bg-ink text-paper',
  Interview:      'bg-ink text-paper',
  'Field Notes':  'bg-ink text-paper',
  Character:      'bg-[#1a1a2e] text-[#a78bfa]',
}

function CategoryPill({ category }: { category: ArticleCategory }) {
  return (
    <span
      className={`inline-block font-mono text-[0.44rem] uppercase tracking-[0.22em] px-2.5 py-1 ${CATEGORY_COLORS[category]}`}
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

/* ── Category tab bar — full-width, scrollable, animated underline ── */
function CategoryTabBar({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: Array<ArticleCategory | 'All'>
  activeCategory: ArticleCategory | 'All'
  onSelect: (cat: ArticleCategory | 'All') => void
}) {
  return (
    <div className="overflow-x-auto no-scrollbar -mx-5 sm:mx-0 border-b border-line">
      <div className="flex items-end gap-8 min-w-max px-5 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`relative flex-shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.2em] pb-3.5 pt-3 whitespace-nowrap transition-colors duration-200 ${activeCategory === cat ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            {cat}
            {activeCategory === cat && (
              <motion.div
                layoutId="editorial-cat-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Featured card — large, image-led ── */
function FeatureCard({ article }: { article: EditorialArticle }) {
  const [loaded, setLoaded] = useState(() => loadedArticleImageUrls.has(article.coverImageUrl))

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden bg-surface min-h-[280px] h-full"
    >
      {!loaded && (
        <div className="absolute inset-0 z-[1] img-skeleton" aria-hidden="true" />
      )}

      <Image
        src={article.coverImageUrl}
        alt={article.coverImageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 66vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ zIndex: 2, opacity: loaded ? 1 : 0, transition: 'opacity 0.45s ease' }}
        onLoad={() => { loadedArticleImageUrls.add(article.coverImageUrl); setLoaded(true) }}
      />

      <div className="absolute inset-0 pointer-events-none scrim-hero" style={{ zIndex: 3 }} />

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
            <span className="font-sans text-[0.8rem] text-white/70 font-medium">
              {article.author}
            </span>
            <span className="font-mono text-[0.42rem] text-white/30">·</span>
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.18em] text-white/55">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-mono text-[0.42rem] text-white/30">·</span>
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.18em] text-white/55">
              {article.readingTimeMin} min
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
      className="overflow-hidden flex-1 h-full"
    >
      <Link href={`/editorial/${article.slug}`} className="group flex flex-col h-full bg-surface">
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
        <div className="card-caption-safe-compact shrink-0 bg-surface">
          <h3 className="font-display italic text-ink text-[1rem] sm:text-[1.0625rem] leading-[1.25] mb-1.5 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {article.headline}
          </h3>
          <p className="font-sans text-[0.8rem] text-muted leading-[1.65] line-clamp-2 mb-3">
            {article.teaser}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.44rem] uppercase tracking-[0.16em] text-muted/55">
              {article.author} · {article.readingTimeMin} min
            </p>
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
      className="flex-shrink-0 w-64 sm:w-72 overflow-hidden border border-line"
    >
      <Link href={`/editorial/${article.slug}`} className="group block bg-surface">
        <div className="relative" style={{ aspectRatio: '4/3' }}>
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt}
            fill
            sizes="290px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 scrim-standard" />
          <div className="absolute top-3 left-3">
            <CategoryPill category={article.category} />
          </div>
        </div>
        <div className="card-caption-safe-compact">
          <h3 className="font-display italic text-ink text-[0.9375rem] leading-[1.3] mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {article.headline}
          </h3>
          <p className="font-sans text-[0.775rem] text-muted leading-[1.6] line-clamp-2 mb-3">
            {article.teaser}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.44rem] uppercase tracking-[0.16em] text-muted/55">
              {article.author} · {article.readingTimeMin} min
            </p>
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition-all duration-200">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ── Empty state — no articles for selected category ── */
function EmptyState({ category }: { category: ArticleCategory | 'All' }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="py-14 border border-line flex flex-col items-center justify-center gap-3"
    >
      <p className="font-mono text-[0.5rem] uppercase tracking-[0.26em] text-muted/50">
        No articles filed under
      </p>
      <p className="font-display italic text-ink text-[1.25rem] leading-none">
        {category}
      </p>
      <p className="font-mono text-[0.46rem] uppercase tracking-[0.18em] text-muted/35 mt-1">
        Check back in the next issue
      </p>
    </motion.div>
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
    ...Array.from(new Set(articles.map((a) => a.category))) as ArticleCategory[],
  ]

  return (
    <section className="bg-paper section-md" aria-label="Editorial and design process">
      <div className="kestra-wrap">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-7 mb-8 border-b border-line">
          <div>
            {/* Editorial metadata — issue · season · year */}
            <p className="font-mono text-[0.46rem] uppercase tracking-[0.3em] text-muted/60 mb-1.5">
              AW 2026 · Issue No. 01 · From the Atelier
            </p>
            <h2
              className="font-display italic text-ink leading-[1.05] mb-2"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
            >
              The Design Process
            </h2>
            {/* Editorial mission — the "why" behind the section */}
            <p className="font-sans text-[0.8375rem] text-muted leading-[1.75] max-w-[500px]">
              How each piece comes to exist — the sourced fibres, inherited techniques,
              and deliberate choices that define the collection.
            </p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:h-[560px] xl:h-[600px] gap-3 mb-10">
          <FeatureCard article={feature} />
          <div className="flex flex-row lg:flex-col gap-3 h-full">
            {sideCards.map((article, i) => (
              <SideCard key={article.articleId} article={article} delay={0.1 + i * 0.08} />
            ))}
          </div>
        </div>

        {/* ── Category tab bar — full-width animated tabs ── */}
        {categories.length > 2 && (
          <CategoryTabBar
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        )}

        {/* ── Horizontal scroll strip or empty state ── */}
        <div className="mt-6">
          {stripCards.length === 0 ? (
            <EmptyState category={activeCategory} />
          ) : (
            <div className="relative">
              {/* Fade edge — right bleed indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
                {stripCards.map((article, i) => (
                  <StripCard key={article.articleId} article={article} delay={i * 0.06} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
