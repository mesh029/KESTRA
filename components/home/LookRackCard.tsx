'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { LookEntry } from '@/types/look'

/**
 * Module-level cache — persists for the whole browser session.
 * When a user navigates away and back, React remounts components
 * (resetting useState), but this Set survives. So any image that
 * already loaded once is treated as loaded immediately on re-mount,
 * preventing the skeleton flash on back navigation.
 */
const loadedImageUrls = new Set<string>()

interface LookRackCardProps {
  look: LookEntry
  /** 0-based position in the rack — used for stagger */
  index: number
  /** CSS aspect-ratio value e.g. "3/4", "2/3", "1/1" */
  aspectRatio?: string
  /** Column-level stagger offset so each column animates independently */
  colDelay?: number
  /**
   * When true the card fills its parent height instead of using
   * the aspect ratio — used for the last card in each masonry column
   * so it stretches to eliminate bottom-edge white space.
   */
  fillHeight?: boolean
  /** When true renders a CHARACTER badge — used for cosplay/anime looks */
  characterBadge?: boolean
}

export function LookRackCard({
  look,
  index,
  aspectRatio = '3/4',
  colDelay = 0,
  fillHeight = false,
  characterBadge = false,
}: LookRackCardProps) {
  // Initialise as true if this URL was already loaded in this session
  const [imgLoaded, setImgLoaded] = useState(() => loadedImageUrls.has(look.heroImageUrl))
  const isSoldOut = look.status === 'sold-out' || look.availableUnits === 0
  const num = String(index + 1).padStart(3, '0')

  return (
    /*
     * whileHover on the outer motion.div:
     * - scale(1.018) gives a gentle lift without translateY so the card
     *   never overlaps neighbours above it
     * - zIndex:10 brings the hovered card above all siblings
     * - position:relative needed for z-index to work in a flex column
     */
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ scale: 1.018, zIndex: 10 }}
      transition={{
        opacity: { duration: 0.65, delay: colDelay + (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] },
        y:       { duration: 0.65, delay: colDelay + (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] },
        scale:   { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
        zIndex:  { duration: 0 },
      }}
      style={
        fillHeight
          ? { height: '100%', minHeight: '220px' }
          : undefined
      }
    >
      <Link
        href={`/looks/${look.lookSlug}`}
        className="group block relative overflow-hidden bg-surface"
        style={fillHeight ? { height: '100%' } : { aspectRatio }}
        aria-label={`View Look ${num}: ${look.lookTitle}`}
      >
        {/* ── Skeleton shimmer shown while image loads ── */}
        {!imgLoaded && (
          <div className="absolute inset-0 z-10 img-skeleton" aria-hidden="true" />
        )}

        {/* ── Image ── */}
        <Image
          src={look.heroImageUrl}
          alt={look.heroImageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-[center_10%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          onLoad={() => {
            loadedImageUrls.add(look.heroImageUrl)
            setImgLoaded(true)
          }}
        />

        {/* ── Ghost look number ── */}
        {imgLoaded && (
          <span
            className="absolute bottom-0 right-2 z-[1] font-display italic leading-none pointer-events-none select-none text-white"
            style={{ fontSize: 'clamp(4.5rem, 15vw, 10rem)', opacity: 0.065, lineHeight: '0.85' }}
            aria-hidden="true"
          >
            {num}
          </span>
        )}

        {/* ── Bottom gradient — standardized legibility tier ── */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] scrim-standard z-[2]" />

        {/* ── Badges row ── */}
        <div className="absolute top-3 left-3 z-[3] flex flex-col gap-1.5">
          {characterBadge && (
            <span className="font-mono text-[0.4rem] uppercase tracking-[0.22em] bg-[#1a1a2e] text-[#a78bfa] border border-[#a78bfa]/30 px-2 py-1 backdrop-blur-sm">
              Character
            </span>
          )}
          {isSoldOut && (
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.2em] text-white/65 bg-black/45 backdrop-blur-sm px-2.5 py-1.5">
              Sold Out
            </span>
          )}
        </div>

        {/* ── Caption band ──
             px-6 pb-8 keeps text well clear of the rounded-xl 12px corner curves.
             The extra bottom space also lets the ghost number breathe.          ── */}
        <div className="absolute bottom-0 inset-x-0 z-[3] card-caption-safe">
          <p className="font-mono text-[0.44rem] uppercase tracking-[0.2em] text-white/38 mb-2">
            {num} &middot; {look.season} {look.year}
          </p>
          <div className="flex items-end justify-between gap-4">
            <h3
              className="font-display italic text-white leading-[1.05] min-w-0 line-clamp-2"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.55rem)' }}
            >
              {look.lookTitle}
            </h3>
            {!isSoldOut && (
              <div className="text-right shrink-0">
                <p className="font-mono text-[0.4rem] uppercase text-white/32 leading-none mb-1">KES</p>
                <p className="font-sans font-medium text-white leading-none" style={{ fontSize: '0.8125rem' }}>
                  {look.priceKES.toLocaleString('en-KE')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Hover overlay ── */}
        <div className="absolute inset-0 z-[2] bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  )
}
