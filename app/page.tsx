import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllLooks } from '@/lib/looks/getAllLooks'
import { MagazineNav } from '@/components/layout/MagazineNav'
import { SiteFooter } from '@/components/SiteFooter'
import { MasonryRack } from '@/components/home/MasonryRack'
import { EditorialFeed } from '@/components/home/EditorialFeed'
import { seedArticles } from '@/lib/articles/seed'

export const metadata: Metadata = {
  title: 'KESTRA PROTOCOL — AW 2026',
  description:
    'A shoppable editorial magazine. Every Look is a story told in fabric, light, and craft. Based in Nairobi, Kenya.',
}

export default async function HomePage() {
  const allLooks = await getAllLooks()
  const looks = allLooks.filter((l) => l.status !== 'draft')
  const [cover, ...rack] = looks

  return (
    <>
      <MagazineNav heroMode={!!cover} />

      <main>

        {/* ═══════════════════════════════════════════════════════════════
            COVER — Full-viewport opening image
        ═══════════════════════════════════════════════════════════════ */}
        {cover ? (
          <section className="relative min-h-dvh flex flex-col grain" aria-label="Cover look">
            <Image
              src={cover.heroImageUrl}
              alt={cover.heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_12%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/10 to-black/72" />

            {/* Ghost number — right edge */}
            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none select-none" aria-hidden="true">
              <span
                className="font-display italic text-white pr-6 sm:pr-10 leading-none"
                style={{ fontSize: 'clamp(7rem, 22vw, 20rem)', opacity: 0.055 }}
              >
                001
              </span>
            </div>

            {/* Content */}
            <div
              className="relative z-10 flex flex-col justify-between flex-1 kestra-wrap"
              style={{ paddingTop: 'calc(var(--header-h) + 3.5rem)', paddingBottom: '3.5rem' }}
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.5rem] uppercase tracking-[0.28em] text-white/40">
                  AW 2026 &middot; NAIROBI
                </span>
                <span className="font-mono text-[0.5rem] uppercase tracking-[0.28em] text-white/28 hidden sm:inline">
                  {looks.length.toString().padStart(2, '0')} LOOKS
                </span>
              </div>

              {/* Headline */}
              <div className="max-w-4xl">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-white/38 mb-5">
                  Atelier Editorial
                </p>
                <h1
                  className="font-display italic font-normal text-white leading-[0.95] mb-6"
                  style={{ fontSize: 'clamp(3.8rem, 10vw, 10rem)' }}
                >
                  Every Look<br />is a story.
                </h1>
                <p className="font-sans text-[0.9375rem] text-white/58 max-w-[340px] leading-[1.75]">
                  Each garment made to order in Nairobi —
                  photographed, written, and tailored in Kenya.
                </p>
              </div>

              {/* Bottom — first look info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6">
                <div>
                  <p className="font-mono text-[0.48rem] uppercase tracking-[0.25em] text-white/32 mb-2.5">
                    001 &middot; {cover.season} {cover.year}
                  </p>
                  <h2
                    className="font-display italic text-white leading-tight"
                    style={{ fontSize: 'clamp(1.3rem, 3vw, 2.2rem)' }}
                  >
                    {cover.lookTitle}
                  </h2>
                </div>
                <Link
                  href={`/looks/${cover.lookSlug}`}
                  className="shrink-0 font-mono text-[0.56rem] uppercase tracking-[0.22em] text-white border border-white/38 px-6 py-3.5 hover:bg-white hover:text-ink transition-all duration-300"
                >
                  Open Look →
                </Link>
              </div>
            </div>

            {/* Photographer credit */}
            <div
              className="absolute bottom-24 right-4 z-10 pointer-events-none select-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              aria-hidden="true"
            >
              <span className="font-mono text-[0.44rem] uppercase tracking-[0.14em] text-white/20">
                Photo &copy; {cover.editorialStory.credits.photographer}
              </span>
            </div>

            {/* Scroll cue */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-bounce" style={{ animationDuration: '2.2s' }} aria-hidden="true">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path d="M8 2v14M2 11l6 6 6-6" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="square" />
              </svg>
            </div>
          </section>
        ) : (
          <section className="min-h-[60vh] flex items-end kestra-wrap pb-16 pt-40">
            <div>
              <p className="font-mono text-[0.56rem] uppercase tracking-[0.28em] text-muted mb-5">AW 2026</p>
              <h1 className="font-display italic text-ink leading-[0.95]" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
                Looks<br />incoming.
              </h1>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            LOOK RACK — Grid of remaining looks
        ═══════════════════════════════════════════════════════════════ */}
        {rack.length > 0 && (
          <section className="bg-paper section-md" aria-label="All looks">
            <div className="kestra-wrap">

              {/* ── Section header ── */}
              <div className="flex items-baseline justify-between pb-5 mb-6 sm:mb-8 border-b border-line">
                <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.28em] text-muted">
                  AW 2026 — Full Collection
                </h2>
                <span className="font-mono text-[0.5rem] text-muted tabular-nums">
                  {looks.length} {looks.length === 1 ? 'Look' : 'Looks'}
                </span>
              </div>

              {/* ── Pinterest-style masonry rack ── */}
              <MasonryRack looks={rack} indexOffset={1} />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            EDITORIAL FEED — Articles, trends, process, culture
        ═══════════════════════════════════════════════════════════════ */}
        <EditorialFeed articles={seedArticles} />

        {/* ═══════════════════════════════════════════════════════════════
            ABOUT — Editorial brand statement
        ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-surface section-md" aria-label="About KESTRA">
          <div className="kestra-wrap">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-24 items-start">

              {/* Left */}
              <div>
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.28em] text-muted mb-5">
                  About KESTRA PROTOCOL
                </p>
                <p
                  className="font-display italic text-ink leading-[1.1]"
                  style={{ fontSize: 'clamp(1.65rem, 3.5vw, 2.8rem)' }}
                >
                  Fashion is not a product.<br />
                  It is a conversation.
                </p>
              </div>

              {/* Right */}
              <div className="lg:pt-14">
                <p className="font-sans text-[0.9375rem] text-muted leading-[1.78] mb-7">
                  KESTRA PROTOCOL is a Nairobi-based atelier and editorial magazine.
                  Each Look is designed, tailored, and photographed in Kenya. We publish
                  one collection per season and sell directly to you — made to order,
                  via M-Pesa.
                </p>
                <Link
                  href="/log"
                  className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-ink hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  <span className="border-b border-current pb-px">Read the Process Journal</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
