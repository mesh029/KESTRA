import type { Metadata } from 'next'
import { MagazineNav } from '@/components/layout/MagazineNav'
import { SiteFooter } from '@/components/SiteFooter'
import { ProjectTimeline } from '@/components/log/ProjectTimeline'
import { seedLogEntries } from '@/lib/log/seedLog'

export const metadata: Metadata = {
  title: 'Process Journal — KESTRA PROTOCOL',
  description:
    'The making of KESTRA PROTOCOL — a chronological record of look design, construction, editorial direction, and atelier decisions.',
}

export default function LogPage() {
  const entries = [...seedLogEntries].sort(
    (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
  )

  const wipCount = entries.filter((e) => e.status === 'wip').length
  const completedCount = entries.filter((e) => e.status === 'completed').length

  return (
    <>
      <MagazineNav heroMode={false} />

      <main className="page-top bg-paper min-h-dvh">

        {/* ── Page masthead ─────────────────────────────────────── */}
        <section className="mx-auto max-w-[800px] px-5 sm:px-8 py-14 sm:py-20">
          <p className="font-mono text-[0.54rem] uppercase tracking-[0.3em] text-muted mb-5">
            KESTRA PROTOCOL
          </p>
          <h1
            className="font-display italic font-normal text-ink leading-[1.04] mb-5"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            Process Journal
          </h1>
          <p className="font-sans text-[0.9375rem] text-muted max-w-md leading-relaxed">
            A raw, chronological record of look design decisions, construction progress,
            fittings, fabric choices, and editorial direction.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-8 pt-7 border-t border-line">
            {[
              ['Entries', entries.length],
              ['In Progress', wipCount],
              ['Completed', completedCount],
            ].map(([label, count], i, arr) => (
              <div key={label as string} className="flex items-center gap-5">
                <div>
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-muted">
                    {label}&nbsp;
                  </span>
                  <span className="font-mono text-[0.5rem] text-ink">
                    {count}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span className="font-mono text-[0.5rem] text-muted/30" aria-hidden="true">·</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <ProjectTimeline logEntries={entries} />

      </main>

      <SiteFooter />
    </>
  )
}
