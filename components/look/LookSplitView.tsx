'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import type { LookEntry, LookMode } from '@/types/look'
import { LookHeroImage } from './LookHeroImage'
import { LookModeSwitcher } from './LookModeSwitcher'
import { LookEditorialPanel } from './LookEditorialPanel'
import { LookSpecsPanel } from './LookSpecsPanel'
import { MpesaPurchaseDrawer } from '@/components/purchase/MpesaPurchaseDrawer'
import { SiteFooter } from '@/components/SiteFooter'

interface LookSplitViewProps {
  lookEntry: LookEntry
}

export function LookSplitView({ lookEntry }: LookSplitViewProps) {
  const [activeMode, setActiveMode] = useState<LookMode>('editorial')
  const [purchaseDrawerOpen, setPurchaseDrawerOpen] = useState(false)

  const isSoldOut =
    lookEntry.status === 'sold-out' || lookEntry.availableUnits === 0

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP — Fixed split. Header height subtracted from viewport.
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex overflow-hidden"
        style={{ height: 'calc(100dvh - var(--header-h))', marginTop: 'var(--header-h)' }}
      >
        {/* ── LEFT: Hero image — 60% ─────────────────────────────────── */}
        <div className="w-[60%] flex-shrink-0 h-full">
          <LookHeroImage
            imageUrl={lookEntry.heroImageUrl}
            lookTitle={lookEntry.lookTitle}
            photographerCredit={lookEntry.editorialStory.credits.photographer}
            seasonTag={lookEntry.season}
            year={lookEntry.year}
          />
        </div>

        {/* ── RIGHT: Scrollable content — 40% ────────────────────────── */}
        <div className="flex-1 h-full flex flex-col border-l border-void-black bg-paper-white overflow-hidden">

          {/* Back nav + mode switcher — sticky top */}
          <div className="flex-shrink-0 border-b border-void-black">
            {/* Back to all looks */}
            <div className="flex items-center justify-between px-7 xl:px-10 pt-5 pb-4 border-b border-light-grey">
              <Link
                href="/"
                className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-steel-grey hover:text-void-black transition-colors duration-200 flex items-center gap-2"
              >
                <span>←</span>
                <span>All Looks</span>
              </Link>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-steel-grey">
                {lookEntry.season} {lookEntry.year}
              </p>
            </div>

            {/* Mode switcher */}
            <div className="px-7 xl:px-10 pt-4 pb-0">
              <LookModeSwitcher activeMode={activeMode} onModeChange={setActiveMode} />
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto panel-scroll px-7 xl:px-10 pt-7 pb-8">
            <AnimatePresence mode="wait">
              {activeMode === 'editorial' ? (
                <motion.div
                  key="editorial"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                >
                  <LookEditorialPanel editorialStory={lookEntry.editorialStory} />
                </motion.div>
              ) : (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                >
                  <LookSpecsPanel tailorSpec={lookEntry.tailorSpec} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Purchase CTA — pinned to bottom ─── */}
          <div className="flex-shrink-0 border-t border-void-black bg-paper-white px-7 xl:px-10 py-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-1">
                  Price · Made to Order
                </p>
                <p className="font-sans font-medium text-[1.3rem] leading-none text-void-black">
                  KES {lookEntry.priceKES.toLocaleString('en-KE')}
                </p>
              </div>
              {!isSoldOut && (
                <p className="font-mono text-[0.55rem] text-steel-grey pb-0.5">
                  {lookEntry.availableUnits} unit{lookEntry.availableUnits !== 1 ? 's' : ''} left
                </p>
              )}
            </div>

            <button
              onClick={() => !isSoldOut && setPurchaseDrawerOpen(true)}
              disabled={isSoldOut}
              className={`w-full py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.22em] border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange focus-visible:ring-offset-2 ${
                isSoldOut
                  ? 'bg-light-grey text-steel-grey border-light-grey cursor-not-allowed'
                  : 'bg-void-black text-paper-white border-void-black hover:bg-sunset-orange hover:border-sunset-orange'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Purchase via M-Pesa'}
            </button>

            <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-steel-grey text-center mt-3">
              STK Push · Instant confirmation · Delivered in 4–6 weeks
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE — Stacked layout. Header accounts for top offset.
      ══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden" style={{ paddingTop: 'var(--header-h)' }}>

        {/* Hero image — full width, 3:4 portrait */}
        <div className="relative w-full grain-overlay overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <LookHeroImage
            imageUrl={lookEntry.heroImageUrl}
            lookTitle={lookEntry.lookTitle}
            photographerCredit={lookEntry.editorialStory.credits.photographer}
            seasonTag={lookEntry.season}
            year={lookEntry.year}
          />
        </div>

        {/* Sticky mode switcher + back nav */}
        <div className="sticky z-30 bg-paper-white border-b border-void-black" style={{ top: 'var(--header-h)' }}>
          {/* Back + season */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-light-grey">
            <Link
              href="/"
              className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-steel-grey hover:text-void-black transition-colors flex items-center gap-2"
            >
              ← All Looks
            </Link>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey">
              {lookEntry.season} {lookEntry.year}
            </span>
          </div>
          {/* Mode tabs */}
          <div className="px-5 pt-3 pb-0">
            <LookModeSwitcher activeMode={activeMode} onModeChange={setActiveMode} />
          </div>
        </div>

        {/* Content — generous mobile padding, pb for fixed bottom bar */}
        <div className="px-5 pt-7 pb-36">
          <AnimatePresence mode="wait">
            {activeMode === 'editorial' ? (
              <motion.div
                key="editorial-mobile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <LookEditorialPanel editorialStory={lookEntry.editorialStory} />
              </motion.div>
            ) : (
              <motion.div
                key="specs-mobile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <LookSpecsPanel tailorSpec={lookEntry.tailorSpec} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile footer */}
        <SiteFooter />

        {/* Fixed bottom purchase bar — above everything */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-paper-white border-t border-void-black">
          <div className="flex items-center gap-4 px-5 py-3">
            <div className="flex-1">
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-steel-grey">
                KES
              </p>
              <p className="font-sans font-medium text-[1.05rem] leading-tight text-void-black">
                {lookEntry.priceKES.toLocaleString('en-KE')}
              </p>
            </div>
            <button
              onClick={() => !isSoldOut && setPurchaseDrawerOpen(true)}
              disabled={isSoldOut}
              className={`flex-1 py-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] border transition-all duration-200 ${
                isSoldOut
                  ? 'bg-light-grey text-steel-grey border-light-grey cursor-not-allowed'
                  : 'bg-void-black text-paper-white border-void-black active:bg-sunset-orange active:border-sunset-orange'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Purchase via M-Pesa'}
            </button>
          </div>
          {/* Safe area spacer for devices with home bars */}
          <div className="h-safe-area-inset-bottom bg-paper-white" />
        </div>
      </div>

      {/* Purchase drawer — shared */}
      <MpesaPurchaseDrawer
        lookEntry={lookEntry}
        isOpen={purchaseDrawerOpen}
        onClose={() => setPurchaseDrawerOpen(false)}
      />
    </>
  )
}
