'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { LookEntry } from '@/types/look'
import { MpesaPurchaseDrawer } from '@/components/purchase/MpesaPurchaseDrawer'
import { SiteFooter } from '@/components/SiteFooter'
import { CharacterBriefSection } from '@/components/look/CharacterBriefSection'

/* ─── Scroll-reveal wrapper ─────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Look number utility ───────────────────────────────────────────────── */
function extractLookNumber(lookId: string): string {
  const match = lookId.match(/\d+/)
  return match ? match[0].padStart(3, '0') : '001'
}

const DIFFICULTY_LABELS = ['', 'Apprentice', 'Journeyman', 'Advanced', 'Expert', 'Master']

/* ─── Component ─────────────────────────────────────────────────────────── */
interface LookSpreadProps {
  lookEntry: LookEntry
}

export function LookSpread({ lookEntry }: LookSpreadProps) {
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [showFloat, setShowFloat] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const isSoldOut = lookEntry.status === 'sold-out' || lookEntry.availableUnits === 0
  const lookNum = extractLookNumber(lookEntry.lookId)
  const { editorialStory, tailorSpec } = lookEntry
  const paragraphs = editorialStory.narrativeBody.split('\n\n').filter(Boolean)

  /* Show floating CTA once hero scrolls out of view */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => setShowFloat(!entry.isIntersecting),
      { threshold: 0.15 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Full-viewport opening image
      ═══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-dvh grain" aria-label="Look hero">
        <Image
          src={lookEntry.heroImageUrl}
          alt={lookEntry.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_10%]"
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/72" />

        {/* Ghost look number */}
        <div
          className="absolute inset-y-0 right-0 flex items-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-display italic text-white pr-4 sm:pr-8 leading-none"
            style={{ fontSize: 'clamp(8rem, 24vw, 22rem)', opacity: 0.055 }}
          >
            {lookNum}
          </span>
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex flex-col justify-between min-h-dvh px-5 sm:px-8 lg:px-14"
          style={{ paddingTop: 'calc(var(--header-h) + 3.5rem)', paddingBottom: '4rem' }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-white/45 hover:text-white transition-colors duration-200"
            >
              ← All Looks
            </Link>
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.24em] text-white/30">
              {lookEntry.season} {lookEntry.year}
            </span>
          </div>

          {/* Bottom section — title + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-7">
            <div>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.26em] text-white/38 mb-3">
                {lookNum} · Atelier Editorial
              </p>
              <h1
                className="font-display italic font-normal text-white leading-[0.97]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
              >
                {editorialStory.lookTitle}
              </h1>
            </div>

            {!isSoldOut && (
              <div className="shrink-0 text-right">
                <button
                  onClick={() => setPurchaseOpen(true)}
                  className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white border border-white/40 px-6 py-3.5 hover:bg-white hover:text-ink transition-all duration-300 block"
                >
                  Purchase via M-Pesa
                </button>
                <p className="font-mono text-[0.48rem] text-white/28 mt-2 tracking-[0.14em] uppercase">
                  KES {lookEntry.priceKES.toLocaleString('en-KE')}
                </p>
              </div>
            )}

            {isSoldOut && (
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white/40 border border-white/20 px-4 py-2">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Photographer credit */}
        <div
          className="absolute bottom-24 right-4 z-10 pointer-events-none select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          aria-hidden="true"
        >
          <span className="font-mono text-[0.45rem] uppercase tracking-[0.14em] text-white/22">
            Photo &copy; {editorialStory.credits.photographer}
          </span>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-bounce"
          style={{ animationDuration: '2s' }}
          aria-hidden="true"
        >
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <path d="M9 3v14M3 13l6 6 6-6" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="square" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EDITORIAL — Narrative, pull quote, credits
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-paper section-md" aria-label="Editorial">
        <div className="kestra-wrap">

          <Reveal>
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.3em] text-muted mb-8 sm:mb-12">
              Editorial · {lookNum}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-12 lg:gap-20 xl:gap-28">

            {/* ── Left: narrative ── */}
            <div>
              <Reveal>
                <h2
                  className="font-display italic font-normal text-ink leading-[1.02] mb-8 sm:mb-10"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)' }}
                >
                  {editorialStory.lookTitle}
                </h2>
              </Reveal>

              <Reveal delay={0.06}>
                <blockquote className="border-l-[3px] border-accent pl-5 sm:pl-6 mb-8 sm:mb-10">
                  <p
                    className="font-display italic text-ink leading-[1.65]"
                    style={{ fontSize: 'clamp(1rem, 1.8vw, 1.175rem)' }}
                  >
                    {editorialStory.pullQuote}
                  </p>
                </blockquote>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-5 sm:space-y-6">
                  {paragraphs.map((para, i) => {
                    if (i === 0) {
                      const words = para.split(' ')
                      const opener = words.slice(0, 2).join(' ')
                      const body = words.slice(2).join(' ')
                      return (
                        <p
                          key={i}
                          className="font-sans text-[0.9375rem] sm:text-[1rem] leading-[1.82] text-ink/85"
                        >
                          <span className="font-sans font-semibold uppercase tracking-[0.15em] text-[0.56rem] text-ink mr-2">
                            {opener}
                          </span>
                          {body}
                        </p>
                      )
                    }
                    return (
                      <p
                        key={i}
                        className="font-sans text-[0.9375rem] sm:text-[1rem] leading-[1.82] text-ink/85"
                      >
                        {para}
                      </p>
                    )
                  })}
                </div>
              </Reveal>

              {/* Mood keywords */}
              {editorialStory.moodKeywords.length > 0 && (
                <Reveal delay={0.12}>
                  <div className="flex flex-wrap gap-2 mt-8 sm:mt-10">
                    {editorialStory.moodKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-muted border border-line px-3 py-1.5"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* ── Right: credits (sticky on scroll) ── */}
            <div>
              <Reveal delay={0.1}>
                <div className="lg:sticky lg:top-28">

                  {/* Credits table */}
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.26em] text-muted mb-5">
                    Credits
                  </p>
                  <div className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3">
                    {(
                      [
                        ['Photo', editorialStory.credits.photographer],
                        ['Tailor', editorialStory.credits.tailor],
                        editorialStory.credits.stylist
                          ? ['Style', editorialStory.credits.stylist]
                          : null,
                        editorialStory.credits.model
                          ? ['Model', editorialStory.credits.model]
                          : null,
                        editorialStory.credits.location
                          ? ['Location', editorialStory.credits.location]
                          : null,
                      ] as ([string, string] | null)[]
                    )
                      .filter((row): row is [string, string] => row !== null)
                      .map(([label, value]) => (
                        <Fragment key={label}>
                          <span className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-muted self-start pt-0.5">
                            {label}
                          </span>
                          <span className="font-sans text-[0.8rem] text-ink leading-snug">
                            {value}
                          </span>
                        </Fragment>
                      ))}
                  </div>

                  {/* Availability */}
                  {!isSoldOut && (
                    <div className="mt-8 pt-7 border-t border-line">
                      <p className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-muted mb-1.5">
                        Availability
                      </p>
                      <p className="font-sans text-[0.875rem] text-ink">
                        {lookEntry.availableUnits} unit{lookEntry.availableUnits !== 1 ? 's' : ''} remaining
                      </p>
                      <p className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-muted mt-1">
                        Made to order · 4–6 weeks
                      </p>
                    </div>
                  )}

                  {/* Mobile purchase shortcut */}
                  {!isSoldOut && (
                    <button
                      onClick={() => setPurchaseOpen(true)}
                      className="mt-8 w-full font-mono text-[0.58rem] uppercase tracking-[0.2em] bg-ink text-paper py-3.5 hover:bg-accent transition-colors duration-200 lg:hidden"
                    >
                      Purchase via M-Pesa
                    </button>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CHARACTER — Anime / cosplay inspiration (only on char looks)
      ═══════════════════════════════════════════════════════════════ */}
      {editorialStory.characterInspiration && (
        <CharacterBriefSection
          inspiration={editorialStory.characterInspiration}
          lookNum={lookNum}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SPECS — Fabric, construction, measurements
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-surface section-md" aria-label="Tailor specs">
        <div className="kestra-wrap">

          {/* Section header with ghost text */}
          <Reveal className="relative mb-12 sm:mb-16 overflow-hidden">
            <span
              className="absolute top-1/2 -translate-y-1/2 left-0 font-display italic text-ink pointer-events-none select-none leading-none"
              style={{ fontSize: 'clamp(4rem, 14vw, 11rem)', opacity: 0.04 }}
              aria-hidden="true"
            >
              Specs
            </span>
            <p className="relative font-mono text-[0.54rem] uppercase tracking-[0.3em] text-muted">
              Tailor Specs · {lookNum}
            </p>
          </Reveal>

          {/* Quick stats */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-8 sm:gap-14 mb-12 sm:mb-16 pb-10 sm:pb-14 border-b border-line">
              <div>
                <p className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-muted mb-2">
                  Difficulty
                </p>
                <div className="flex items-center gap-1.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="inline-block"
                      style={{
                        width: '14px',
                        height: '2px',
                        backgroundColor:
                          i < tailorSpec.difficultyRating
                            ? 'var(--color-accent)'
                            : 'var(--color-line)',
                      }}
                    />
                  ))}
                </div>
                <p className="font-mono text-[0.6rem] text-ink">
                  {DIFFICULTY_LABELS[tailorSpec.difficultyRating]}
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-muted mb-2">
                  Est. Hours
                </p>
                <p
                  className="font-display italic text-ink leading-none"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
                >
                  {tailorSpec.estimatedHours}
                  <span className="font-mono text-[0.55rem] text-muted ml-1">hrs</span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Specs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 sm:gap-y-16">

            {/* Fabric */}
            <Reveal>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-muted mb-5 pb-4 border-b border-line">
                Fabric Composition
              </p>
              <div className="space-y-5">
                {tailorSpec.fabricComposition.map((layer) => (
                  <div key={layer.layerName}>
                    <p className="font-mono text-[0.48rem] uppercase tracking-[0.15em] text-muted mb-1">
                      {layer.layerName}
                    </p>
                    <p className="font-sans text-[0.875rem] text-ink leading-snug">
                      {layer.materialName}
                    </p>
                    <p className="font-mono text-[0.56rem] text-muted mt-0.5">
                      {layer.composition} &middot; {layer.weightGSM}gsm
                      {layer.sourceRegion && ` · ${layer.sourceRegion}`}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Construction */}
            <Reveal delay={0.06}>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-muted mb-5 pb-4 border-b border-line">
                Construction
              </p>
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[0.48rem] uppercase tracking-[0.15em] text-muted mb-1">
                    Stitching
                  </p>
                  <p className="font-sans text-[0.875rem] text-ink leading-relaxed">
                    {tailorSpec.stitchingMethod}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.48rem] uppercase tracking-[0.15em] text-muted mb-1">
                    Notes
                  </p>
                  <p className="font-sans text-[0.875rem] text-ink leading-relaxed">
                    {tailorSpec.constructionNotes}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Measurements + tailor notes */}
            <Reveal delay={0.1}>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-muted mb-5 pb-4 border-b border-line">
                Measurements (cm)
              </p>

              {/* Measurement grid */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-5 mb-7">
                {(
                  Object.entries(tailorSpec.measurements).filter(
                    ([, v]) => v !== undefined
                  ) as [string, number][]
                ).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    chest: 'Chest',
                    waist: 'Waist',
                    hip: 'Hip',
                    shoulderWidth: 'Shoulder',
                    sleeveLength: 'Sleeve',
                    inseam: 'Inseam',
                  }
                  return (
                    <div key={key}>
                      <p className="font-mono text-[0.46rem] uppercase tracking-[0.14em] text-muted mb-1">
                        {labels[key] ?? key}
                      </p>
                      <p className="font-display italic text-ink leading-none" style={{ fontSize: '1.3rem' }}>
                        {value}
                        <span className="font-mono text-[0.46rem] text-muted ml-0.5">cm</span>
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Tailor notes */}
              <blockquote className="border-l-[3px] border-accent pl-4">
                <p className="font-sans italic text-[0.8rem] text-muted leading-relaxed">
                  {tailorSpec.tailorNotes}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PURCHASE — Light editorial CTA section
          Deliberately uses paper bg + accent top border to be
          visually distinct from the dark footer below it.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="bg-paper section-md"
        style={{ borderTop: '3px solid var(--color-accent)' }}
        aria-label="Purchase this look"
      >
        <div className="kestra-wrap">

          {/* ── Label ── */}
          <p className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-muted mb-8 sm:mb-10">
            Acquire This Look &nbsp;·&nbsp; {lookNum}
          </p>

          {/* ── Main layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-24 items-end">

            {/* Left: price as large editorial number */}
            <div>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-muted mb-4">
                Price &nbsp;·&nbsp; Made to Order
              </p>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-mono text-[0.62rem] uppercase text-muted">KES</span>
                <span
                  className="font-display italic text-ink leading-none"
                  style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
                >
                  {lookEntry.priceKES.toLocaleString('en-KE')}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="font-sans text-[0.875rem] text-muted leading-relaxed">
                  {editorialStory.lookTitle} &nbsp;·&nbsp; {lookEntry.season} {lookEntry.year}
                </p>
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-muted/60">
                  Made in Nairobi · Production begins on payment · Ships in 4–6 weeks
                </p>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col gap-3 lg:items-end">
              {isSoldOut ? (
                <div className="border border-line px-6 py-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
                    Sold Out
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setPurchaseOpen(true)}
                    className="inline-flex items-center justify-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] bg-ink text-paper px-8 py-4 hover:bg-accent transition-colors duration-300 w-full sm:w-auto"
                  >
                    Purchase via M-Pesa
                    <span>→</span>
                  </button>
                  <p className="font-mono text-[0.46rem] uppercase tracking-[0.14em] text-muted/55 text-center sm:text-right">
                    Safaricom STK Push · Instant confirmation
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── Available units ── */}
          {!isSoldOut && (
            <div className="mt-10 pt-8 border-t border-line flex items-center justify-between">
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-muted">
                {lookEntry.availableUnits} unit{lookEntry.availableUnits !== 1 ? 's' : ''} remaining
              </p>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(lookEntry.availableUnits, 10) }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block w-3 h-1"
                    style={{ backgroundColor: 'var(--color-accent)', opacity: 0.7 - i * 0.045 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING CTA — Appears when hero leaves viewport
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFloat && !isSoldOut && (
          <motion.div
            key="float-cta"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-5 sm:right-8 z-50"
          >
            <button
              onClick={() => setPurchaseOpen(true)}
              className="flex items-center gap-3.5 bg-ink text-paper font-mono text-[0.56rem] uppercase tracking-[0.2em] px-5 py-3.5 hover:bg-accent transition-colors duration-200"
            >
              <span className="text-paper/40 text-[0.46rem]">
                KES {lookEntry.priceKES.toLocaleString('en-KE')}
              </span>
              <span>Purchase</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase drawer */}
      <MpesaPurchaseDrawer
        lookEntry={lookEntry}
        isOpen={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
      />
    </>
  )
}
