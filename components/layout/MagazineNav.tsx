'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagazineNavProps {
  /** When true: nav starts transparent with white text over a dark hero image */
  heroMode?: boolean
}

export function MagazineNav({ heroMode = false }: MagazineNavProps) {
  const [elevated, setElevated] = useState(!heroMode)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!heroMode) {
      setElevated(true)
      return
    }
    const onScroll = () => setElevated(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroMode])

  // Close mobile nav on route change
  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out',
          elevated
            ? 'bg-paper/95 backdrop-blur-sm'
            : 'bg-transparent'
        )}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="h-full flex items-center justify-between px-5 sm:px-8 lg:px-14">

          {/* ── Wordmark ──────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-baseline gap-1.5 group shrink-0"
            aria-label="KESTRA PROTOCOL — Home"
          >
            <span
              className={cn(
                'font-display italic text-[1.45rem] leading-none transition-colors duration-500',
                elevated ? 'text-ink' : 'text-white'
              )}
            >
              KESTRA
            </span>
            <span
              className={cn(
                'font-mono text-[0.5rem] uppercase tracking-[0.3em] leading-none transition-colors duration-500 hidden sm:inline',
                elevated ? 'text-muted' : 'text-white/50'
              )}
            >
              PROTOCOL
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-9" aria-label="Main navigation">
            {[
              { href: '/', label: 'Looks' },
              { href: '/log', label: 'Journal' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative font-mono text-[0.6rem] uppercase tracking-[0.22em] py-1 transition-colors duration-300',
                  pathname === href
                    ? (elevated ? 'text-ink' : 'text-white')
                    : (elevated ? 'text-muted hover:text-ink' : 'text-white/55 hover:text-white')
                )}
              >
                {label}
                {pathname === href && (
                  <motion.span
                    layoutId="nav-active-line"
                    className={cn(
                      'absolute -bottom-0.5 inset-x-0 h-px',
                      elevated ? 'bg-ink' : 'bg-white'
                    )}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Right cluster ─────────────────────────────── */}
          <div className="flex items-center gap-5">
            <span
              className={cn(
                'hidden lg:inline font-mono text-[0.5rem] uppercase tracking-[0.25em] transition-colors duration-500',
                elevated ? 'text-muted' : 'text-white/40'
              )}
            >
              AW 2026
            </span>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex flex-col justify-center w-8 h-8 gap-[5px]"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'block w-5 h-px transition-all duration-300 origin-center',
                    elevated ? 'bg-ink' : 'bg-white',
                    i === 0 && mobileOpen && 'translate-y-[7px] rotate-45',
                    i === 1 && mobileOpen && 'opacity-0 scale-x-0',
                    i === 2 && mobileOpen && '-translate-y-[7px] -rotate-45'
                  )}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-x-0 z-40 bg-paper md:hidden border-b border-line"
            style={{ top: 'var(--header-h)' }}
          >
            <nav className="px-5 py-8" aria-label="Mobile navigation">
              {[
                { href: '/', label: 'Looks' },
                { href: '/log', label: 'Process Journal' },
              ].map(({ href, label }, i, arr) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center justify-between py-5 font-display italic text-[2rem] leading-none text-ink',
                    i < arr.length - 1 && 'border-b border-line'
                  )}
                >
                  <span>{label}</span>
                  <span className="font-mono text-sm not-italic text-muted">→</span>
                </Link>
              ))}
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-muted mt-8">
                AW 2026 · Nairobi, Kenya
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
