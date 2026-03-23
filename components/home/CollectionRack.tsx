'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { LookEntry } from '@/types/look'
import { MasonryRack } from './MasonryRack'

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type CollectionCategory = 'All' | 'Atelier' | 'Character' | 'Archive'

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterLookCard
   Full editorial card used in the Character category view.
   Dark-inverted, shows look image + character reference details side-by-side.
───────────────────────────────────────────────────────────────────────────── */
function CharacterLookCard({
  look,
  index,
}: {
  look: LookEntry
  index: number
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const inspiration = look.editorialStory.characterInspiration!
  const isSoldOut = look.status === 'sold-out' || look.availableUnits === 0
  const num = String(index + 1).padStart(3, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="border border-white/10 overflow-hidden"
    >
      <Link
        href={`/looks/${look.lookSlug}`}
        className="group grid grid-cols-1 sm:grid-cols-[1fr_1fr] lg:grid-cols-[340px_1fr]"
        aria-label={`View Look ${num}: ${look.lookTitle}`}
      >
        {/* ── Look image ── */}
        <div className="relative overflow-hidden bg-void-black" style={{ aspectRatio: '3/4', minHeight: '260px' }}>
          {!imgLoaded && (
            <div className="absolute inset-0 bg-white/[0.04] animate-pulse" />
          )}
          <Image
            src={look.heroImageUrl}
            alt={look.heroImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 340px"
            className="object-cover object-[center_10%] transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Gradient for caption legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          {/* Look caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-mono text-[0.4rem] uppercase tracking-[0.22em] text-white/35 mb-1">
              {num} · {look.season} {look.year}
            </p>
            <p
              className="font-display italic text-white leading-tight"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            >
              {look.lookTitle}
            </p>
          </div>
        </div>

        {/* ── Character + details panel ── */}
        <div className="flex flex-col justify-between p-6 sm:p-8 bg-void-black border-t sm:border-t-0 sm:border-l border-white/10">

          {/* Top: character info */}
          <div>
            {/* Section label */}
            <p className="font-mono text-[0.44rem] uppercase tracking-[0.3em] text-white/25 mb-4">
              Anime · Cosplay Inspiration
            </p>

            {/* Character name — dominant display element */}
            <h3
              className="font-display italic text-white leading-tight mb-1"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}
            >
              {inspiration.characterName}
            </h3>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-white/40 mb-0.5">
              {inspiration.sourceMaterial}
            </p>
            <p className="font-mono text-[0.42rem] uppercase tracking-[0.12em] text-white/20 mb-6">
              {inspiration.creator} · {inspiration.year}
            </p>

            {/* Thin divider */}
            <div className="w-8 h-px bg-white/15 mb-6" />

            {/* Character design note */}
            <p className="font-sans italic text-[0.875rem] text-white/50 leading-[1.72] line-clamp-4">
              {inspiration.characterNote}
            </p>
          </div>

          {/* Bottom: price + CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between gap-4">
            <div>
              {isSoldOut ? (
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-white/30">Sold Out</p>
              ) : (
                <>
                  <p className="font-mono text-[0.44rem] uppercase tracking-[0.16em] text-white/25 mb-1">Price</p>
                  <p className="font-sans font-medium text-white" style={{ fontSize: '1.05rem' }}>
                    KES {look.priceKES.toLocaleString('en-KE')}
                  </p>
                </>
              )}
            </div>

            <span className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
              View Look →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CategoryFilter
   Horizontal tab strip with Framer Motion animated underline.
───────────────────────────────────────────────────────────────────────────── */
function CategoryFilter({
  categories,
  active,
  counts,
  onChange,
}: {
  categories: CollectionCategory[]
  active: CollectionCategory
  counts: Record<CollectionCategory, number>
  onChange: (cat: CollectionCategory) => void
}) {
  return (
    <div className="relative mb-0">
      {/* Baseline rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-line" />

      <div className="flex gap-0 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = active === cat
          const count = counts[cat]
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-3.5 font-mono text-[0.54rem] uppercase tracking-[0.22em] whitespace-nowrap transition-colors duration-200 ${
                isActive ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {cat}
              {/* Count badge */}
              <span
                className={`font-mono text-[0.38rem] tabular-nums transition-colors duration-200 ${
                  cat === 'Character'
                    ? isActive
                      ? 'text-[#a78bfa]'
                      : 'text-[#a78bfa]/50'
                    : isActive
                    ? 'text-muted'
                    : 'text-muted/40'
                }`}
              >
                {count}
              </span>

              {/* Animated underline — violet for Character, ink for all others */}
              {isActive && (
                <motion.div
                  layoutId="collection-cat-indicator"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                    cat === 'Character' ? 'bg-[#a78bfa]' : 'bg-ink'
                  }`}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CollectionRack — exported root component
───────────────────────────────────────────────────────────────────────────── */
interface CollectionRackProps {
  /** All published/sold-out looks (cover look already stripped out) */
  looks: LookEntry[]
}

export function CollectionRack({ looks }: CollectionRackProps) {
  const [activeCategory, setActiveCategory] = useState<CollectionCategory>('All')

  /* ── Derive categories from look data ── */
  const atelierLooks  = looks.filter((l) => !l.editorialStory.characterInspiration && l.status !== 'sold-out')
  const characterLooks = looks.filter((l) => !!l.editorialStory.characterInspiration)
  const archiveLooks  = looks.filter((l) => l.status === 'sold-out')

  const counts: Record<CollectionCategory, number> = {
    All:       looks.length,
    Atelier:   atelierLooks.length,
    Character: characterLooks.length,
    Archive:   archiveLooks.length,
  }

  const visibleCategories: CollectionCategory[] = [
    'All',
    'Atelier',
    ...(characterLooks.length > 0 ? ['Character' as CollectionCategory] : []),
    ...(archiveLooks.length > 0   ? ['Archive'   as CollectionCategory] : []),
  ]

  /* ── Looks to pass to MasonryRack ── */
  const masonryLooks =
    activeCategory === 'All'     ? looks :
    activeCategory === 'Atelier' ? atelierLooks :
    activeCategory === 'Archive' ? archiveLooks :
    []

  return (
    <section className="bg-paper section-md" aria-label="Full collection">
      <div className="kestra-wrap">

        {/* ── Section header ── */}
        <div className="flex items-baseline justify-between pb-5 mb-0 border-b border-line">
          <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.28em] text-muted">
            AW 2026 — Full Collection
          </h2>
          <span className="font-mono text-[0.5rem] text-muted tabular-nums">
            {looks.length} {looks.length === 1 ? 'Look' : 'Looks'}
          </span>
        </div>

        {/* ── Category filter ── */}
        <CategoryFilter
          categories={visibleCategories}
          active={activeCategory}
          counts={counts}
          onChange={setActiveCategory}
        />

      </div>

      {/* ── Content — animated switch between views ── */}
      <AnimatePresence mode="wait">

        {/* Masonry — All / Atelier / Archive */}
        {activeCategory !== 'Character' && masonryLooks.length > 0 && (
          <motion.div
            key={`masonry-${activeCategory}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="kestra-wrap mt-8">
              <MasonryRack looks={masonryLooks} indexOffset={1} />
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {activeCategory !== 'Character' && masonryLooks.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="kestra-wrap mt-16 pb-8"
          >
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.22em] text-muted/50">
              No looks in this category yet.
            </p>
          </motion.div>
        )}

        {/* ── Character view — dark inverted section ── */}
        {activeCategory === 'Character' && (
          <motion.div
            key="character"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Dark section wrapper */}
            <div className="bg-void-black mt-0">
              <div className="kestra-wrap py-14 sm:py-20">

                {/* Header */}
                <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14 pb-8 border-b border-white/10">
                  <div>
                    <p className="font-mono text-[0.44rem] uppercase tracking-[0.3em] text-white/20 mb-3">
                      Collection · Character Looks
                    </p>
                    <h2
                      className="font-display italic text-white leading-tight"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                    >
                      Anime &amp; Cosplay<br />Inspired
                    </h2>
                    <p className="font-sans text-[0.875rem] text-white/40 leading-[1.7] max-w-[420px] mt-3">
                      Garments built from fictional briefs — each Look is a direct translation of a character's
                      silhouette logic into Kenyan craft.
                    </p>
                  </div>
                  {/* Count badge */}
                  <div className="shrink-0 text-right">
                    <p
                      className="font-display italic text-white/10 leading-none select-none"
                      style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
                      aria-hidden
                    >
                      {String(characterLooks.length).padStart(2, '0')}
                    </p>
                  </div>
                </div>

                {/* Character look cards */}
                <div className="flex flex-col gap-4 sm:gap-6">
                  {characterLooks.map((look, i) => (
                    <CharacterLookCard key={look.lookId} look={look} index={i} />
                  ))}
                </div>

                {/* Bottom note */}
                <p className="font-mono text-[0.44rem] uppercase tracking-[0.22em] text-white/15 mt-10 sm:mt-14">
                  Each character look ships as a regular commission — 4 to 6 weeks from Nairobi.
                </p>

              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}
