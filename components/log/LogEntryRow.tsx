'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LogEntry, LogEntryStatus } from '@/types/log'

interface LogEntryRowProps {
  logEntry: LogEntry
}

const STATUS_META: Record<LogEntryStatus, {
  symbol: string
  label: string
  dotClass: string
  borderClass: string
}> = {
  wip:       { symbol: '◐', label: 'In Progress', dotClass: 'text-accent',  borderClass: 'border-accent/50' },
  blocked:   { symbol: '✕', label: 'Blocked',     dotClass: 'text-accent',  borderClass: 'border-accent' },
  completed: { symbol: '●', label: 'Completed',   dotClass: 'text-ink',     borderClass: 'border-line' },
  abandoned: { symbol: '○', label: 'Abandoned',   dotClass: 'text-muted',   borderClass: 'border-line' },
  note:      { symbol: '—', label: 'Note',        dotClass: 'text-muted',   borderClass: 'border-line' },
}

function formatLogDate(isoDate: string): string {
  const d = new Date(isoDate)
  if (isNaN(d.getTime())) return isoDate.replace(/-/g, '.')
  return d.toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase()
}

export function LogEntryRow({ logEntry }: LogEntryRowProps) {
  const meta = STATUS_META[logEntry.status]
  const paragraphs = logEntry.body.split('\n\n').filter(Boolean)
  const isActive = logEntry.status === 'wip' || logEntry.status === 'blocked'
  const hasLinks = !!(logEntry.linkedLookSlug || logEntry.linkedArticleSlug)
  const primaryHref = logEntry.linkedArticleSlug
    ? `/editorial/${logEntry.linkedArticleSlug}`
    : logEntry.linkedLookSlug
      ? `/looks/${logEntry.linkedLookSlug}`
      : null

  /* Expand long bodies after the first paragraph */
  const [expanded, setExpanded] = useState(false)
  const firstPara = paragraphs[0] ?? ''
  const restParas = paragraphs.slice(1)
  const hasMore = restParas.length > 0

  return (
    <motion.article
      layout
      className={`
        relative pl-6 sm:pl-7 pr-1 sm:pr-2 border-l-[2px] ${meta.borderClass}
        ${hasLinks ? 'group' : ''}
      `}
      aria-label={`Log entry: ${logEntry.title}`}
    >
      {/* ── Status dot on left border ── */}
      <span
        className={`absolute -left-[5.5px] top-[3px] font-mono text-[0.62rem] leading-none ${meta.dotClass}`}
        aria-hidden="true"
      >
        {meta.symbol}
      </span>

      {/* ── Row 1: date · status · category ── */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4">
        <span className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-muted">
          {formatLogDate(logEntry.entryDate)}
          {logEntry.entryTime && (
            <span className="text-muted/45 ml-1.5">{logEntry.entryTime}</span>
          )}
        </span>

        <span className="font-mono text-[0.42rem] text-line" aria-hidden="true">·</span>

        <span className={`font-mono text-[0.52rem] uppercase tracking-[0.14em] ${meta.dotClass}`}>
          {meta.label}
        </span>

        <span className="font-mono text-[0.42rem] text-line" aria-hidden="true">·</span>

        <span className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-muted border border-line px-2 py-0.5">
          {logEntry.category}
        </span>

        {/* WIP pulse */}
        {isActive && (
          <span className="relative inline-flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
        )}
      </div>

      {/* ── Row 2 + 3: clickable content area (title + body) ── */}
      {primaryHref ? (
        <Link href={primaryHref} className="block rounded-sm -ml-1 px-1 py-1.5 mb-1 hover:bg-surface/55 transition-colors duration-200">
          <h3
            className="font-sans font-semibold text-ink leading-[1.28] mb-4 group-hover:text-accent transition-colors duration-200"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.14rem)' }}
          >
            {logEntry.title}
          </h3>

          <div className="space-y-4">
            <p className="font-sans text-[0.94rem] text-muted leading-[1.9]">
              {firstPara}
            </p>

            <AnimatePresence initial={false}>
              {expanded && restParas.length > 0 && (
                <motion.div
                  key="extra"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden space-y-4"
                >
                  {restParas.map((para, i) => (
                    <p key={i} className="font-sans text-[0.94rem] text-muted leading-[1.9]">
                      {para}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
      ) : (
        <>
          <h3
            className="font-sans font-semibold text-ink leading-[1.28] mb-4"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.14rem)' }}
          >
            {logEntry.title}
          </h3>
          <div className="space-y-4">
            <p className="font-sans text-[0.94rem] text-muted leading-[1.9]">
              {firstPara}
            </p>
            <AnimatePresence initial={false}>
              {expanded && restParas.length > 0 && (
                <motion.div
                  key="extra"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden space-y-4"
                >
                  {restParas.map((para, i) => (
                    <p key={i} className="font-sans text-[0.94rem] text-muted leading-[1.9]">
                      {para}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 font-mono text-[0.48rem] uppercase tracking-[0.18em] text-muted hover:text-ink transition-colors duration-200 flex items-center gap-1.5"
        >
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            ›
          </motion.span>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      )}

      {/* ── Row 4: linked refs — look + article ── */}
      {hasLinks && (
        <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-3">
          {logEntry.linkedLookSlug && (
            <Link
              href={`/looks/${logEntry.linkedLookSlug}`}
              className="inline-flex items-center gap-2 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-ink border border-line px-3 py-2 rounded-sm hover:border-ink hover:text-ink transition-all duration-200 group/btn bg-paper/55"
            >
              <span className="font-mono text-[0.44rem] text-muted/70 group-hover/btn:text-muted transition-colors duration-200">
                look ·
              </span>
              <span>View Look</span>
              <span className="group-hover/btn:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          )}
          {logEntry.linkedArticleSlug && (
            <Link
              href={`/editorial/${logEntry.linkedArticleSlug}`}
              className="inline-flex items-center gap-2 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-muted border border-line px-3 py-2 rounded-sm hover:border-ink hover:text-ink transition-all duration-200 group/btn bg-paper/55"
            >
              <span className="font-mono text-[0.44rem] text-muted/50 group-hover/btn:text-muted transition-colors duration-200">
                revisions ·
              </span>
              <span>Open Evolution</span>
              <span className="group-hover/btn:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          )}
        </div>
      )}

      {/* ── Row 5: attachments ── */}
      {logEntry.attachments && logEntry.attachments.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2.5">
          {logEntry.attachments.map((attachment, i) => (
            <div key={i} className="border border-line px-3 py-2 rounded-sm">
              <p className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-muted mb-0.5">
                {attachment.attachmentType}
              </p>
              {attachment.caption && (
                <p className="font-sans text-[0.75rem] text-muted/75">
                  {attachment.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.article>
  )
}
