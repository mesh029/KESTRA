'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { EditorialStory, CharacterInspiration } from '@/types/look'

interface LookEditorialPanelProps {
  editorialStory: EditorialStory
}

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterImageDisplay
   Self-contained with its own aspect-ratio so the container always has height.
   Typographic placeholder renders at all times; real image fades in on load.
───────────────────────────────────────────────────────────────────────────── */
function CharacterImageDisplay({
  inspiration,
  aspectRatio = '2 / 3',
}: {
  inspiration: CharacterInspiration
  aspectRatio?: string
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    /* Outer shell — explicit aspect-ratio gives the container real height.
       position: relative is set via inline style to guarantee it wins over
       any inherited Tailwind class. */
    <div
      className="w-full overflow-hidden bg-void-black"
      style={{ aspectRatio, position: 'relative' }}
    >
      {/* ── Typographic placeholder — always visible ── */}
      <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center px-4">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Corner brackets */}
        <span className="absolute top-3 left-3 w-3 h-3 border-l border-t border-white/25" />
        <span className="absolute top-3 right-3 w-3 h-3 border-r border-t border-white/25" />
        <span className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-white/25" />
        <span className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-white/25" />
        {/* Centre cross */}
        <span className="absolute w-5 h-px bg-white/15" />
        <span className="absolute h-5 w-px bg-white/15" />

        {/* Identity text */}
        <p className="relative z-[2] font-mono text-[0.42rem] uppercase tracking-[0.28em] text-white/30 mb-2 text-center">
          Character
        </p>
        <p
          className="relative z-[2] font-display italic text-white text-center leading-[1.15]"
          style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1.1rem)' }}
        >
          {inspiration.characterName}
        </p>
        <p className="relative z-[2] font-mono text-[0.38rem] uppercase tracking-[0.2em] text-white/35 mt-1.5 text-center">
          {inspiration.sourceMaterial}
        </p>
      </div>

      {/* ── Real image — fades in on load, invisible on error ── */}
      {!imgError && (
        <Image
          src={inspiration.imageUrl}
          alt={inspiration.imageAlt}
          fill
          unoptimized
          sizes="(max-width: 768px) 90vw, 480px"
          className="object-cover object-top z-[2] transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
      {/* Tint over real image when loaded so placeholder text stays visible */}
      {imgLoaded && !imgError && (
        <div className="absolute inset-0 z-[3] bg-void-black/35" />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterBriefPopover — bottom sheet overlay
───────────────────────────────────────────────────────────────────────────── */
function CharacterBriefPopover({
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
        className="fixed inset-0 z-[60] bg-void-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[61] bg-paper-white overflow-hidden"
        style={{ maxHeight: '88vh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-[3px] bg-steel-grey/30 rounded-sm" />
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 24px)' }}>

          {/* Large character image — 16:9 */}
          <CharacterImageDisplay inspiration={inspiration} aspectRatio="16 / 9" />

          {/* Details */}
          <div className="px-5 pt-5 pb-12">

            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-[0.48rem] uppercase tracking-[0.26em] text-steel-grey mb-1.5">
                  Character Brief
                </p>
                <h2
                  className="font-display italic text-void-black leading-tight"
                  style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}
                >
                  {inspiration.characterName}
                </h2>
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-steel-grey mt-1">
                  {inspiration.sourceMaterial}
                </p>
                <p className="font-mono text-[0.44rem] uppercase tracking-[0.12em] text-steel-grey/45 mt-0.5">
                  {inspiration.creator} · {inspiration.year}
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 mt-1 w-8 h-8 flex items-center justify-center border border-void-black font-mono text-[0.7rem] hover:bg-void-black hover:text-paper-white transition-colors duration-200"
                aria-label="Close character brief"
              >
                ✕
              </button>
            </div>

            <hr className="border-t border-void-black mb-5" />

            <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-steel-grey mb-3">
              Design Logic
            </p>
            <p className="font-sans text-[0.9rem] text-void-black/80 leading-[1.72] italic">
              {inspiration.characterNote}
            </p>

          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CharacterBriefPanel — compact trigger in editorial flow
───────────────────────────────────────────────────────────────────────────── */
function CharacterBriefPanel({ inspiration }: { inspiration: CharacterInspiration }) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setPopoverOpen(true)}
        className="w-full mb-8 border border-void-black overflow-hidden group text-left"
        aria-label={`View character brief: ${inspiration.characterName}`}
      >
        {/* Inverted header bar */}
        <div className="bg-void-black px-4 py-2.5 flex items-center gap-3">
          <p className="font-mono text-[0.48rem] uppercase tracking-[0.28em] text-paper-white/50">
            Character Brief
          </p>
          <div className="h-px flex-1 bg-white/10" />
          <p className="font-mono text-[0.44rem] uppercase tracking-[0.18em] text-paper-white/30 group-hover:text-sunset-orange transition-colors duration-200">
            Tap to expand →
          </p>
        </div>

        {/* Body: thumbnail left, info right */}
        <div className="flex">
          {/* Thumbnail — 88px wide, aspect-ratio drives the height */}
          <div className="flex-shrink-0 border-r border-void-black" style={{ width: '88px' }}>
            <CharacterImageDisplay inspiration={inspiration} aspectRatio="2 / 3" />
          </div>

          {/* Info column */}
          <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between">
            <div>
              <p
                className="font-display italic text-void-black leading-tight"
                style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}
              >
                {inspiration.characterName}
              </p>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-steel-grey mt-0.5">
                {inspiration.sourceMaterial}
              </p>
              <p className="font-mono text-[0.42rem] uppercase tracking-[0.12em] text-steel-grey/45 mt-0.5">
                {inspiration.creator} · {inspiration.year}
              </p>
            </div>
            <p className="font-sans text-[0.78rem] text-void-black/55 leading-[1.5] italic line-clamp-2 mt-3">
              {inspiration.characterNote}
            </p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {popoverOpen && (
          <CharacterBriefPopover
            inspiration={inspiration}
            onClose={() => setPopoverOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   LookEditorialPanel (root export)
───────────────────────────────────────────────────────────────────────────── */
export function LookEditorialPanel({ editorialStory }: LookEditorialPanelProps) {
  const {
    lookTitle,
    season,
    year,
    pullQuote,
    narrativeBody,
    moodKeywords,
    credits,
    characterInspiration,
  } = editorialStory

  const paragraphs = narrativeBody.split('\n\n').filter(Boolean)

  return (
    <article className="pb-10">

      {/* Department label */}
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-steel-grey mb-4">
        {characterInspiration ? 'Character Look' : 'Editorial'}
      </p>

      {/* Look title */}
      <h1
        className="font-display italic font-normal leading-[1.08] text-void-black mb-2"
        style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)' }}
      >
        {lookTitle}
      </h1>

      {/* Season line */}
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel-grey mb-6">
        {season} {year}
      </p>

      <hr className="border-t border-void-black mb-6" />

      {/* Pull quote */}
      <blockquote className="border-l-[3px] border-sunset-orange pl-4 sm:pl-5 mb-8">
        <p
          className="font-display italic leading-[1.55] text-void-black"
          style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}
        >
          {pullQuote}
        </p>
      </blockquote>

      {/* Character Brief trigger */}
      {characterInspiration && (
        <CharacterBriefPanel inspiration={characterInspiration} />
      )}

      {/* Narrative body */}
      <div className="space-y-5 mb-8">
        {paragraphs.map((paragraph, index) => {
          if (index === 0) {
            const words = paragraph.split(' ')
            const runIn = words.slice(0, 2).join(' ')
            const rest = words.slice(2).join(' ')
            return (
              <p key={index} className="font-sans text-[0.9375rem] sm:text-[1rem] leading-[1.78] text-void-black">
                <span className="font-sans font-semibold uppercase tracking-[0.14em] text-[0.6rem] text-void-black mr-2">
                  {runIn}
                </span>
                {rest}
              </p>
            )
          }
          return (
            <p key={index} className="font-sans text-[0.9375rem] sm:text-[1rem] leading-[1.78] text-void-black">
              {paragraph}
            </p>
          )
        })}
      </div>

      {/* Mood keywords */}
      {moodKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {moodKeywords.map((keyword) => (
            <span
              key={keyword}
              className="font-mono text-[0.55rem] uppercase tracking-[0.18em] border border-void-black px-2.5 py-1.5 text-void-black"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Credits */}
      <div className="pt-6 border-t border-void-black">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-steel-grey mb-4">Credits</p>
        <div className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-2.5">

          <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">Photo</span>
          <span className="font-sans text-[0.8rem] text-void-black">{credits.photographer}</span>

          <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">Tailor</span>
          <span className="font-sans text-[0.8rem] text-void-black">{credits.tailor}</span>

          {credits.stylist && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">Style</span>
              <span className="font-sans text-[0.8rem] text-void-black">{credits.stylist}</span>
            </>
          )}

          {credits.model && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">Model</span>
              <span className="font-sans text-[0.8rem] text-void-black">{credits.model}</span>
            </>
          )}

          {credits.location && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">Location</span>
              <span className="font-sans text-[0.8rem] text-void-black">{credits.location}</span>
            </>
          )}

          {characterInspiration && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">Character</span>
              <span className="font-sans text-[0.8rem] text-void-black">
                {characterInspiration.characterName} — {characterInspiration.sourceMaterial}
              </span>
            </>
          )}

        </div>
      </div>
    </article>
  )
}
