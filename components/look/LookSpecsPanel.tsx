import type { TailorSpec } from '@/types/look'

interface LookSpecsPanelProps {
  tailorSpec: TailorSpec
}

const DIFFICULTY_LABELS = ['', 'Apprentice', 'Journeyman', 'Advanced', 'Expert', 'Master']

export function LookSpecsPanel({ tailorSpec }: LookSpecsPanelProps) {
  const {
    fabricComposition,
    stitchingMethod,
    constructionNotes,
    measurements,
    tailorNotes,
    estimatedHours,
    difficultyRating,
  } = tailorSpec

  const measurementEntries = Object.entries(measurements).filter(
    ([, v]) => v !== undefined
  ) as [string, number][]

  const measurementLabels: Record<string, string> = {
    chest: 'Chest',
    waist: 'Waist',
    hip: 'Hip',
    shoulderWidth: 'Shoulder',
    sleeveLength: 'Sleeve',
    inseam: 'Inseam',
  }

  return (
    <article className="pb-10 font-mono">

      {/* Department label */}
      <p className="text-[0.58rem] uppercase tracking-[0.26em] text-steel-grey mb-4">
        Tailor Specs
      </p>

      {/* Quick stats bar */}
      <div className="grid grid-cols-2 gap-px bg-void-black border border-void-black mb-6">
        {/* Difficulty */}
        <div className="bg-paper-white px-4 py-4">
          <p className="text-[0.55rem] uppercase tracking-[0.18em] text-steel-grey mb-2.5">
            Difficulty
          </p>
          <div className="flex items-center gap-1.5 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`inline-block w-3 h-px ${
                  i < difficultyRating ? 'bg-sunset-orange' : 'bg-steel-grey/25'
                }`}
                style={{ height: '3px' }}
              />
            ))}
          </div>
          <p className="text-[0.7rem] text-void-black">
            {DIFFICULTY_LABELS[difficultyRating]}
          </p>
        </div>

        {/* Est. hours */}
        <div className="bg-paper-white px-4 py-4">
          <p className="text-[0.55rem] uppercase tracking-[0.18em] text-steel-grey mb-2.5">
            Est. Hours
          </p>
          <p className="text-[1.4rem] leading-none text-void-black font-light">
            {estimatedHours}
            <span className="text-[0.6rem] text-steel-grey ml-1">hrs</span>
          </p>
        </div>
      </div>

      <hr className="border-t border-void-black mb-6" />

      {/* ── Fabric composition ─────────────────────────────────────── */}
      <section className="mb-7">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-4">
          Fabric Composition
        </p>
        <div className="divide-y divide-void-black border-t border-b border-void-black">
          {fabricComposition.map((layer) => (
            <div
              key={layer.layerName}
              className="py-3.5 grid grid-cols-[5rem_1fr] gap-x-4 items-start"
            >
              <span className="text-[0.55rem] uppercase tracking-[0.14em] text-steel-grey pt-0.5">
                {layer.layerName}
              </span>
              <div>
                <p className="text-[0.8rem] text-void-black leading-snug mb-0.5">
                  {layer.materialName}
                </p>
                <p className="text-[0.6rem] text-steel-grey">
                  {layer.composition} · {layer.weightGSM}gsm
                  {layer.sourceRegion && ` · ${layer.sourceRegion}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stitching method ───────────────────────────────────────── */}
      <section className="mb-7">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-2">
          Stitching Method
        </p>
        <p className="text-[0.8rem] text-void-black leading-relaxed">{stitchingMethod}</p>
      </section>

      {/* ── Measurements ──────────────────────────────────────────── */}
      {measurementEntries.length > 0 && (
        <section className="mb-7">
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-3">
            Measurements (cm)
          </p>
          <div className="grid grid-cols-3 gap-px bg-void-black border border-void-black">
            {measurementEntries.map(([key, value]) => (
              <div key={key} className="bg-paper-white px-3 py-3">
                <p className="text-[0.5rem] uppercase tracking-[0.14em] text-steel-grey mb-1">
                  {measurementLabels[key] ?? key}
                </p>
                <p className="text-[1rem] leading-none text-void-black">
                  {value}
                  <span className="text-[0.5rem] text-steel-grey ml-0.5">cm</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-[0.5rem] text-steel-grey mt-2 tracking-[0.14em] uppercase">
            Standard measurements. Custom sizing on request.
          </p>
        </section>
      )}

      {/* ── Construction notes ────────────────────────────────────── */}
      <section className="mb-7">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-2">
          Construction
        </p>
        <p className="text-[0.78rem] text-void-black leading-relaxed">{constructionNotes}</p>
      </section>

      {/* ── Tailor notes — accent blockquote ──────────────────────── */}
      <section>
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-2">
          Tailor Notes
        </p>
        <blockquote className="border-l-[3px] border-sunset-orange pl-4 text-[0.78rem] text-void-black leading-relaxed italic font-sans">
          {tailorNotes}
        </blockquote>
      </section>
    </article>
  )
}
