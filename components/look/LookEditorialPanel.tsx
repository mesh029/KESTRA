import type { EditorialStory } from '@/types/look'

interface LookEditorialPanelProps {
  editorialStory: EditorialStory
}

export function LookEditorialPanel({ editorialStory }: LookEditorialPanelProps) {
  const { lookTitle, season, year, pullQuote, narrativeBody, moodKeywords, credits } = editorialStory

  const paragraphs = narrativeBody.split('\n\n').filter(Boolean)

  return (
    <article className="pb-10">

      {/* Department label — Vogue-style section opener */}
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-steel-grey mb-4">
        Editorial
      </p>

      {/* Look title */}
      <h1
        className="font-display italic font-normal leading-[1.08] text-void-black mb-2"
        style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)' }}
      >
        {lookTitle}
      </h1>

      {/* Season line */}
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel-grey mb-6">
        {season} {year}
      </p>

      {/* Hairline */}
      <hr className="border-t border-void-black mb-6" />

      {/* Pull quote / dek — italic Playfair with orange accent */}
      <blockquote className="border-l-[3px] border-sunset-orange pl-4 sm:pl-5 mb-8">
        <p
          className="font-display italic leading-[1.55] text-void-black"
          style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}
        >
          {pullQuote}
        </p>
      </blockquote>

      {/* Narrative body */}
      <div className="space-y-5 mb-8">
        {paragraphs.map((paragraph, index) => {
          if (index === 0) {
            // First paragraph — bold run-in opener (first 2 words)
            const words = paragraph.split(' ')
            const runIn = words.slice(0, 2).join(' ')
            const rest = words.slice(2).join(' ')

            return (
              <p
                key={index}
                className="font-sans text-[0.9375rem] sm:text-[1rem] leading-[1.78] text-void-black"
              >
                <span className="font-sans font-semibold uppercase tracking-[0.14em] text-[0.6rem] text-void-black mr-2">
                  {runIn}
                </span>
                {rest}
              </p>
            )
          }
          return (
            <p
              key={index}
              className="font-sans text-[0.9375rem] sm:text-[1rem] leading-[1.78] text-void-black"
            >
              {paragraph}
            </p>
          )
        })}
      </div>

      {/* Mood keywords */}
      {moodKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {moodKeywords.map((keyword) => (
            <span
              key={keyword}
              className="font-mono text-[0.55rem] uppercase tracking-[0.18em] border border-void-black px-2.5 py-1.5 text-void-black"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Credits — tabular grid, Vogue footer style */}
      <div className="pt-6 border-t border-void-black">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-steel-grey mb-4">
          Credits
        </p>
        <div className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-2.5">

          <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">
            Photo
          </span>
          <span className="font-sans text-[0.8rem] text-void-black">
            {credits.photographer}
          </span>

          <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">
            Tailor
          </span>
          <span className="font-sans text-[0.8rem] text-void-black">
            {credits.tailor}
          </span>

          {credits.stylist && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">
                Style
              </span>
              <span className="font-sans text-[0.8rem] text-void-black">
                {credits.stylist}
              </span>
            </>
          )}

          {credits.model && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">
                Model
              </span>
              <span className="font-sans text-[0.8rem] text-void-black">
                {credits.model}
              </span>
            </>
          )}

          {credits.location && (
            <>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-steel-grey self-center">
                Location
              </span>
              <span className="font-sans text-[0.8rem] text-void-black">
                {credits.location}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
