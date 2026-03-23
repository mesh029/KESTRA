import Link from 'next/link'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-paper">

      {/* ── Main body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-14 pt-16 pb-10 sm:pt-20 sm:pb-12">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-12 lg:gap-0 lg:divide-x lg:divide-white/10">

          {/* ── Brand column ──── */}
          <div className="lg:pr-14">
            <Link href="/" className="group block mb-6">
              <span
                className="font-display italic leading-[0.95] text-paper group-hover:text-paper/70 transition-colors duration-300"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
              >
                KESTRA
              </span>
              <br />
              <span className="font-mono text-[0.52rem] uppercase tracking-[0.32em] text-paper/30 mt-1 inline-block">
                PROTOCOL
              </span>
            </Link>
            <p className="font-sans text-[0.875rem] text-paper/55 leading-relaxed max-w-[220px]">
              A shoppable editorial magazine. Every Look is a story told in fabric, light, and craft.
            </p>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-paper/25 mt-6">
              Nairobi, Kenya · Est. 2026
            </p>
          </div>

          {/* ── Navigation column ── */}
          <div className="lg:px-14">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-paper/30 mb-6">
              Navigate
            </p>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Collection' },
                { href: '/log', label: 'Process Journal' },
                { href: '#', label: 'Sizing Guide' },
                { href: '#', label: 'Made to Order' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-sans text-[0.9rem] text-paper/60 hover:text-paper transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact + Purchase column ── */}
          <div className="lg:pl-14">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-paper/30 mb-6">
              Contact
            </p>
            <ul className="space-y-4 mb-10">
              <li>
                <a
                  href="mailto:editorial@kestra.co.ke"
                  className="font-sans text-[0.9rem] text-paper/60 hover:text-paper transition-colors duration-200"
                >
                  editorial@kestra.co.ke
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.9rem] text-paper/60 hover:text-paper transition-colors duration-200"
                >
                  Instagram
                </a>
              </li>
            </ul>

            <div className="border-t border-white/10 pt-8">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-paper/25 mb-2">
                Purchase
              </p>
              <p className="font-sans text-[0.8rem] text-paper/40 leading-relaxed">
                All orders via M-Pesa STK Push.
                <br />Production begins in 2 business days.
                <br />Delivered in 4–6 weeks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/8 mx-5 sm:mx-8 lg:mx-14">
        <div className="mx-auto max-w-[1280px] py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-paper/20">
            &copy; {year} KESTRA PROTOCOL &middot; All garments made to order in Nairobi
          </p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms'].map((label) => (
              <Link
                key={label}
                href="#"
                className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-paper/20 hover:text-paper/45 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
