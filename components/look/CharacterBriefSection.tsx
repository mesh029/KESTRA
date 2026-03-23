'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CharacterInspiration } from '@/types/look'

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterImg
   Plain <img> tag — bypasses Next.js image optimiser entirely so the browser
   fetches directly from the CDN. onError switches to a typographic placeholder.
───────────────────────────────────────────────────────────────────────────── */
function CharacterImg({
  inspiration,
  className = '',
}: {
  inspiration: CharacterInspiration
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-void-black ${className}`}>
      {/* ── Typographic placeholder — always rendered underneath ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-[1] select-none">
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Corner marks */}
        <span className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/20" />
        <span className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/20" />
        <span className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/20" />
        <span className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/20" />

        {/* Large ghost character name */}
        <p
          className="relative z-[2] font-display italic text-white/10 text-center leading-none pointer-events-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
          aria-hidden
        >
          {inspiration.characterName}
        </p>

        {/* Readable label centred */}
        <p className="relative z-[2] font-mono text-[0.44rem] uppercase tracking-[0.3em] text-white/30 mt-4 text-center">
          Character Reference
        </p>
        <p
          className="relative z-[2] font-display italic text-white/65 text-center leading-tight mt-1"
          style={{ fontSize: 'clamp(0.85rem, 2vw, 1.2rem)' }}
        >
          {inspiration.characterName}
        </p>
        <p className="relative z-[2] font-mono text-[0.42rem] uppercase tracking-[0.2em] text-white/30 mt-1 text-center">
          {inspiration.sourceMaterial}
        </p>
      </div>

      {/* ── Real image — sits above placeholder, hidden on error ── */}
      {!failed && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={inspiration.imageUrl}
          alt={inspiration.imageAlt}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-top z-[2]"
          style={{ display: 'block' }}
        />
      )}

      {/* Tint so text behind doesn't bleed through */}
      {!failed && (
        <div className="absolute inset-0 z-[3] bg-void-black/30 pointer-events-none" />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterModal — full-screen bottom sheet
───────────────────────────────────────────────────────────────────────────── */
function CharacterModal({
  inspiration,
  onClose,
}: {
  inspiration: CharacterInspiration
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[70] bg-void-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[71] bg-paper overflow-hidden"
        style={{ maxHeight: '92vh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        role="dialog"
        aria-label={`Character brief: ${inspiration.characterName}`}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-10 h-[3px] rounded-sm bg-ink/20" />
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 36px)' }}>

          {/* Full-width character image (16:9) */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <CharacterImg inspiration={inspiration} className="absolute inset-0 w-full h-full" />
          </div>

          {/* Content */}
          <div className="px-5 sm:px-8 pt-6 pb-14">

            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="font-mono text-[0.46rem] uppercase tracking-[0.28em] text-muted mb-1.5">
                  Anime · Cosplay Inspiration
                </p>
                <h2
                  className="font-display italic text-ink leading-tight"
                  style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)' }}
                >
                  {inspiration.characterName}
                </h2>
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-muted mt-1.5">
                  {inspiration.sourceMaterial}
                </p>
                <p className="font-mono text-[0.44rem] uppercase tracking-[0.14em] text-muted/50 mt-0.5">
                  {inspiration.creator} · {inspiration.year}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-ink font-mono text-[0.68rem] hover:bg-ink hover:text-paper transition-colors duration-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <hr className="border-t border-ink mb-5" />

            <p className="font-mono text-[0.5rem] uppercase tracking-[0.24em] text-muted mb-3">
              Design Logic — What KESTRA Borrowed
            </p>
            <p className="font-sans text-[0.9375rem] text-ink/80 leading-[1.76] italic">
              {inspiration.characterNote}
            </p>

          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterBriefSection — exported, inserted into LookSpread between
   the editorial narrative and the tailor specs.
───────────────────────────────────────────────────────────────────────────── */
interface CharacterBriefSectionProps {
  inspiration: CharacterInspiration
  lookNum: string
}

export function CharacterBriefSection({ inspiration, lookNum }: CharacterBriefSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* ── Dark inverted section ── */}
      <section className="bg-void-black" aria-label="Anime / cosplay character inspiration">
        <div className="kestra-wrap py-14 sm:py-20">

          {/* Section label */}
          <p className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-white/25 mb-8 sm:mb-12">
            Anime · Cosplay · {lookNum}
          </p>

          {/* Two-column: image left, details right */}
          <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr] gap-8 sm:gap-12 lg:gap-16 items-start">

            {/* Character image */}
            <div>
              <div
                className="relative w-full border border-white/10"
                style={{ aspectRatio: '2/3' }}
              >
                <CharacterImg
                  inspiration={inspiration}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Caption below image */}
              <p className="font-mono text-[0.42rem] uppercase tracking-[0.18em] text-white/25 mt-3">
                © {inspiration.sourceMaterial} / {inspiration.creator}
              </p>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between gap-8 sm:gap-10">

              <div>
                {/* "Inspired by" label */}
                <p className="font-mono text-[0.48rem] uppercase tracking-[0.26em] text-white/30 mb-3">
                  Look inspired by
                </p>

                {/* Character name — large display */}
                <h2
                  className="font-display italic text-white leading-tight mb-1"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
                >
                  {inspiration.characterName}
                </h2>

                {/* Source / creator / year */}
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-white/40 mb-0.5">
                  {inspiration.sourceMaterial}
                </p>
                <p className="font-mono text-[0.44rem] uppercase tracking-[0.14em] text-white/22">
                  {inspiration.creator} · {inspiration.year}
                </p>

                {/* Hairline */}
                <div className="w-12 h-px bg-white/15 my-6" />

                {/* Design note excerpt */}
                <p className="font-sans italic text-[0.9375rem] text-white/55 leading-[1.72] line-clamp-4">
                  {inspiration.characterNote}
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setModalOpen(true)}
                className="self-start font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white border border-white/30 px-6 py-3 hover:border-white hover:text-white transition-colors duration-200 flex items-center gap-3 group"
              >
                Full Character Brief
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CharacterModal
            inspiration={inspiration}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
