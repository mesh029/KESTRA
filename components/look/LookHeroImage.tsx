import Image from 'next/image'

interface LookHeroImageProps {
  imageUrl: string
  lookTitle: string
  photographerCredit: string
  seasonTag: string
  year: number
}

export function LookHeroImage({
  imageUrl,
  lookTitle,
  photographerCredit,
  seasonTag,
  year,
}: LookHeroImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-void-black">
      {/* Main image */}
      <Image
        src={imageUrl}
        alt={lookTitle}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover object-[center_12%]"
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          opacity: 0.035,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Bottom left — season tag */}
      <div className="absolute bottom-6 left-6 z-20">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-paper-white/55">
          {seasonTag} {year}
        </span>
      </div>

      {/* Right edge — rotated photographer credit (Vogue-style) */}
      <div
        className="absolute bottom-10 right-4 z-20"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-paper-white/40">
          Photo &copy; {photographerCredit}
        </span>
      </div>

      {/* Right seam rule — visual join to content panel */}
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-px bg-void-black z-20" />
    </div>
  )
}
