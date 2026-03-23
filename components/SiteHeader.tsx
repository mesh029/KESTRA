'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',    label: 'Looks' },
  { href: '/log', label: 'Process Log' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-paper-white transition-all duration-200',
          scrolled ? 'border-b border-void-black' : 'border-b border-transparent',
          // Always show border
          'border-b border-void-black'
        )}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="h-full flex items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* ── Wordmark ─── */}
          <Link
            href="/"
            className="flex items-baseline gap-1.5 group flex-shrink-0"
            aria-label="KESTRA PROTOCOL — Home"
          >
            <span className="font-display italic text-[1.35rem] leading-none text-void-black group-hover:text-steel-grey transition-colors duration-200">
              KESTRA
            </span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-steel-grey leading-none hidden sm:inline">
              PROTOCOL
            </span>
          </Link>

          {/* ── Desktop nav ─── */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors duration-200 py-1',
                  pathname === href
                    ? 'text-void-black'
                    : 'text-steel-grey hover:text-void-black'
                )}
              >
                {label}
                {pathname === href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-px left-0 right-0 h-px bg-void-black"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Right cluster ─── */}
          <div className="flex items-center gap-4">
            {/* Season tag — desktop only */}
            <span className="hidden lg:inline font-mono text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey border border-mid-grey px-2 py-1">
              AW 2026
            </span>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className={cn(
                  'block w-5 h-px bg-void-black transition-all duration-300 origin-center',
                  mobileOpen && 'translate-y-[7px] rotate-45'
                )}
              />
              <span
                className={cn(
                  'block w-5 h-px bg-void-black transition-all duration-300',
                  mobileOpen && 'opacity-0 scale-x-0'
                )}
              />
              <span
                className={cn(
                  'block w-5 h-px bg-void-black transition-all duration-300 origin-center',
                  mobileOpen && '-translate-y-[7px] -rotate-45'
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 z-40 bg-paper-white border-b border-void-black md:hidden"
            style={{ top: 'var(--header-h)' }}
          >
            <nav className="flex flex-col px-5 py-6 gap-0" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center justify-between py-4 font-display italic text-[1.6rem] leading-none text-void-black',
                    i < NAV_LINKS.length - 1 && 'border-b border-light-grey'
                  )}
                >
                  <span>{label}</span>
                  <span className="font-mono text-[0.6rem] text-steel-grey not-italic tracking-widest">
                    →
                  </span>
                </Link>
              ))}

              <div className="pt-6 mt-2 border-t border-light-grey">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel-grey">
                  AW 2026 · Made in Nairobi
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
