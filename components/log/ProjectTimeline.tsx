'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LogEntry, LogEntryCategory } from '@/types/log'
import { LogEntryRow } from './LogEntryRow'

interface ProjectTimelineProps {
  logEntries: LogEntry[]
}

const FILTER_OPTIONS: Array<{ value: LogEntryCategory | 'all'; label: string }> = [
  { value: 'all',          label: 'All' },
  { value: 'design',       label: 'Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'editorial',    label: 'Editorial' },
  { value: 'technical',    label: 'Technical' },
  { value: 'production',   label: 'Production' },
  { value: 'release',      label: 'Release' },
]

export function ProjectTimeline({ logEntries }: ProjectTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<LogEntryCategory | 'all'>('all')

  const filteredEntries =
    activeFilter === 'all'
      ? logEntries
      : logEntries.filter((entry) => entry.category === activeFilter)

  return (
    <div>

      {/* ── Filter bar — sticky below header ────────────────────── */}
      <div
        className="sticky z-30 bg-paper border-b border-line"
        style={{ top: 'var(--header-h)' }}
      >
        <div className="kestra-prose">
          <div className="flex gap-0 overflow-x-auto no-scrollbar">
            {FILTER_OPTIONS.map(({ value, label }) => {
              const count =
                value === 'all'
                  ? logEntries.length
                  : logEntries.filter((e) => e.category === value).length
              const isActive = activeFilter === value

              return (
                <button
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  className={`relative flex-shrink-0 flex items-center gap-1.5 py-4 pr-6 transition-colors duration-200 ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.2em]">
                    {label}
                  </span>
                  {count > 0 && (
                    <span
                      className={`font-mono text-[0.48rem] tabular-nums ${
                        isActive ? 'text-muted' : 'text-muted/40'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="log-filter-underline"
                      className="absolute bottom-0 left-0 h-[2px] bg-ink"
                      style={{ right: '1.5rem' }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Timeline entries ─────────────────────────────────────── */}
      <div className="kestra-prose py-10 sm:py-14 lg:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {filteredEntries.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display italic text-ink/30" style={{ fontSize: '1.4rem' }}>
                  Nothing here yet.
                </p>
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-muted mt-4">
                  Entries will appear as the collection develops.
                </p>
              </div>
            ) : (
              /* Each entry is separated by generous vertical space only —
                 no heavy black rule dividers that cramp the text. */
              <div className="space-y-10 sm:space-y-14">
                {filteredEntries.map((entry) => (
                  <LogEntryRow key={entry.entryId} logEntry={entry} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
