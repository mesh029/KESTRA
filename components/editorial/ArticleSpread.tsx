'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { EditorialArticle } from '@/types/article'
import type { LookEntry } from '@/types/look'

/* ─────────────────────────────────────────────────────────────────────────────
   ARTICLE SPREAD
   Full-article reading experience with:
   ─ Editorial header (category · author · date · reading time)
   ─ Hero image — wide, cinematic
   ─ Body text — proper reading column with ## section headings
   ─ Related Looks strip — linked mini-cards
   ─ Commit log — monospace git-style revision history sidebar
   ─ Footer strip

   Layout (≥ lg):
   ┌────────────────────────────────────┬────────────────────┐
   │  Article body + Related Looks      │  COMMIT LOG        │
   │  (reading column, max 68ch)        │  (sticky sidebar)  │
   └────────────────────────────────────┴────────────────────┘
────────────────────────────────────────────────────────────── */

interface ArticleSpreadProps {
  article: EditorialArticle
  relatedLookEntries: LookEntry[]
}

/* ── Helpers ── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* ── Body renderer — parses \n\n paragraphs and ## headings ── */
function ArticleBody({ body }: { body: string }) {
  const blocks = body.split('\n\n').filter(Boolean)
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h3
              key={i}
              className="font-display italic text-ink mt-8 mb-1 leading-[1.2]"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}
            >
              {block.replace('## ', '')}
            </h3>
          )
        }
        return (
          <p
            key={i}
            className="font-sans text-ink/85 leading-[1.8]"
            style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)' }}
          >
            {block}
          </p>
        )
      })}
    </div>
  )
}

/* ── Related look mini-card ── */
function RelatedLookCard({ lookEntry }: { lookEntry: LookEntry }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Link
      href={`/looks/${lookEntry.lookSlug}`}
      className="group flex-shrink-0 w-48 sm:w-56 overflow-hidden rounded-lg bg-surface"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      <div className="relative aspect-[3/4] bg-surface">
        {!loaded && <div className="absolute inset-0 img-skeleton" />}
        <Image
          src={lookEntry.heroImageUrl}
          alt={lookEntry.heroImageAlt}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 scrim-standard" />
        {/* px-4 pb-5 clears the rounded-lg 8px corner curves comfortably */}
        <div className="absolute bottom-0 left-0 right-0 card-caption-safe-compact">
          <p className="font-mono text-[0.42rem] uppercase tracking-[0.18em] text-white/60 mb-0.5">
            LOOK {lookEntry.lookId.split('-')[1]}
          </p>
          <p className="font-display italic text-white text-[0.875rem] leading-[1.25] line-clamp-2">
            {lookEntry.lookTitle}
          </p>
          <p className="font-mono text-[0.42rem] uppercase tracking-[0.14em] text-white/50 mt-1">
            KES {lookEntry.priceKES.toLocaleString('en-KE')}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* ── Atelier revision log — design-process history ── */
function CommitLog({ article }: { article: EditorialArticle }) {
  const revisions = [...(article.revisionHistory ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const firstRevision = revisions[0]
  const latestRevision = revisions[revisions.length - 1]
  return (
    <aside
      className="rounded-xl overflow-hidden"
      style={{
        background: '#0d0d0d',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[0.48rem] uppercase tracking-[0.22em] text-white/35">
          atelier revision record
        </span>
      </div>

      <div className="p-4 space-y-0">
        {/* Process metadata */}
        <div className="mb-4 pb-3 border-b border-white/10">
          <p className="text-[0.52rem] text-[#7dd3fc] mb-0.5">
            design-thread/{article.slug}
          </p>
          <p className="text-[0.48rem] text-white/30 mt-1">
            stage: <span className="text-[#86efac]">atelier-main</span>
            {(article.forkCount ?? 0) > 0 && (
              <>
                {' '}·{' '}
                <span className="text-[#fbbf24]">
                  {article.forkCount} variant{(article.forkCount ?? 0) !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Growth summary */}
        {revisions.length > 0 && (
          <div className="mb-4 pb-3 border-b border-white/10">
            <p className="text-[0.46rem] uppercase tracking-[0.18em] text-white/35 mb-1.5">
              Evolution arc
            </p>
            <p className="text-[0.5rem] text-white/70 leading-[1.6]">
              {formatShortDate(firstRevision.date)} to {formatShortDate(latestRevision.date)}
              {' '}· {revisions.length} recorded edit pass{revisions.length !== 1 ? 'es' : ''}
            </p>
            <p className="text-[0.46rem] text-white/35 mt-1">
              Readers can trace how the narrative, references, and tailoring notes evolved over time.
            </p>
          </div>
        )}

        {/* Revisions — oldest to newest for growth tracking */}
        {revisions.length === 0 ? (
          <p className="text-[0.5rem] text-white/30 italic">No revision history.</p>
        ) : (
          <div className="space-y-3">
            {revisions.map((rev, i) => (
              <motion.div
                key={rev.hash}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="relative pl-4"
              >
                {/* Revision line decoration */}
                <div className="absolute left-0 top-[6px] bottom-0 w-px bg-white/15" />
                <div className="absolute left-[-3px] top-[4px] w-[7px] h-[7px] rounded-full border border-[#7dd3fc] bg-[#0d0d0d]" />

                <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                  <span className="text-[0.5rem] text-[#f97316] font-bold tracking-wider">
                    {rev.hash}
                  </span>
                  <span className="text-[0.42rem] text-white/35 uppercase tracking-[0.14em]">
                    Rev {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[0.44rem] text-[#86efac] uppercase tracking-wider">
                    {rev.version}
                  </span>
                  <span className="text-[0.44rem] text-white/30">
                    {formatShortDate(rev.date)}
                  </span>
                </div>
                <p className="text-[0.52rem] text-white/80 leading-[1.55] mb-0.5">
                  {rev.message}
                </p>
                <p className="text-[0.44rem] text-white/35">
                  — {rev.author}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[0.46rem] text-white/25 leading-[1.7]">
            {revisions.length} revision{revisions.length !== 1 ? 's' : ''} on record
            <br />
            <span className="text-white/15">
              KESTRA PROTOCOL · atelier process record
            </span>
          </p>
        </div>
      </div>
    </aside>
  )
}

/* ── Root ── */
export function ArticleSpread({ article, relatedLookEntries }: ArticleSpreadProps) {
  return (
    <div className="min-h-screen bg-paper">

      {/* ── Back navigation ── */}
      <div className="kestra-wrap pt-6 pb-0">
        <Link
          href="/#editorial"
          className="inline-flex items-center gap-2 font-mono text-[0.52rem] uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors duration-200"
        >
          <span>←</span>
          <span>All Articles</span>
        </Link>
      </div>

      {/* ── Article header ── */}
      <header className="kestra-wrap pt-8 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Department label */}
          <p className="font-mono text-[0.48rem] uppercase tracking-[0.3em] text-muted mb-3">
            {article.category}
          </p>

          {/* Headline */}
          <h1
            className="font-display italic text-ink leading-[1.05] mb-4 max-w-[900px]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
          >
            {article.headline}
          </h1>

          {/* Byline strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pb-6 border-b border-line">
            <span className="font-sans text-[0.875rem] text-ink font-medium">
              {article.author}
            </span>
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.16em] text-muted">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.16em] text-muted">
              {article.readingTimeMin} min read
            </span>
          </div>
        </motion.div>
      </header>

      {/* ── Hero image ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.01 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full mt-6 overflow-hidden"
        style={{ aspectRatio: '21/9' }}
      >
        <Image
          src={article.coverImageUrl}
          alt={article.coverImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle bottom vignette to ease transition into body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/60" />
        {/* Caption */}
        <p className="absolute bottom-3 right-4 font-mono text-[0.42rem] uppercase tracking-[0.18em] text-white/50 [writing-mode:horizontal-tb]">
          {article.coverImageAlt}
        </p>
      </motion.div>

      {/* ── Body + Commit log ── */}
      <div className="kestra-wrap py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-14 items-start">

          {/* Body column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {article.body ? (
              <ArticleBody body={article.body} />
            ) : (
              <p className="font-sans text-muted italic">Full article coming soon.</p>
            )}

            {/* ── Related looks strip ── */}
            {relatedLookEntries.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.26em] text-muted">
                    Referenced Looks
                  </p>
                  <div className="h-px flex-1 bg-line mx-4" />
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {relatedLookEntries.map((lookEntry, i) => (
                    <motion.div
                      key={lookEntry.lookId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <RelatedLookCard lookEntry={lookEntry} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Commit log — sticky on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
          >
            <CommitLog article={article} />

            {/* Article meta card */}
            <div
              className="mt-4 rounded-xl p-5 border border-line bg-surface"
            >
              <p className="font-mono text-[0.44rem] uppercase tracking-[0.22em] text-muted mb-3">
                Article record
              </p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                {[
                  ['Category', article.category],
                  ['Author', article.author],
                  ['Published', formatShortDate(article.publishedAt)],
                  ['Reading', `${article.readingTimeMin} min`],
                  ['Looks cited', String(article.relatedLooks?.length ?? 0)],
                  ['Revisions', String(article.revisionHistory?.length ?? 0)],
                ].map(([label, value]) => (
                  <div key={label} className="contents">
                    <span
                      className="font-mono text-[0.44rem] uppercase tracking-[0.14em] text-muted self-baseline pt-px"
                    >
                      {label}
                    </span>
                    <span
                      className="font-sans text-[0.8125rem] text-ink leading-[1.4]"
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  )
}
