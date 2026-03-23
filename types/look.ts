// ─── KESTRA PROTOCOL — Look Type Definitions ────────────────────────────────

export interface LookEntry {
  lookId: string                    // e.g. 'look-001-arid-geometry'
  lookSlug: string                  // URL slug: 'arid-geometry'
  lookTitle: string
  season: 'SS' | 'AW' | 'Resort' | 'Pre-Fall'
  year: number
  heroImageUrl: string
  heroImageAlt: string
  priceKES: number                  // Price in Kenyan Shillings (integer)
  availableUnits: number            // 0 = sold out
  editorialStory: EditorialStory
  tailorSpec: TailorSpec
  publishedAt: string               // ISO 8601
  status: 'published' | 'draft' | 'sold-out'
}

export interface EditorialStory {
  lookTitle: string
  season: string
  year: number
  pullQuote: string                 // 1 sentence ≤20 words. Italic dek above body.
  narrativeBody: string             // 150–400 words, supports \n\n for paragraph breaks
  moodKeywords: string[]            // e.g. ['arid', 'geometric', 'sparse']
  credits: LookCredits
}

export interface LookCredits {
  photographer: string
  tailor: string
  stylist?: string
  model?: string
  location?: string
}

export interface TailorSpec {
  lookId: string
  fabricComposition: FabricLayer[]
  stitchingMethod: string
  constructionNotes: string
  measurements: MeasurementSet
  tailorNotes: string
  estimatedHours: number
  difficultyRating: 1 | 2 | 3 | 4 | 5
}

export interface FabricLayer {
  layerName: string                 // 'Shell' | 'Lining' | 'Interlining' | 'Interfacing'
  materialName: string              // e.g. 'Kenyan Ankara Cotton'
  composition: string               // e.g. '100% Cotton'
  weightGSM: number
  sourceRegion?: string
}

export interface MeasurementSet {
  chest?: number
  waist?: number
  hip?: number
  shoulderWidth?: number
  sleeveLength?: number
  inseam?: number
  // All values in centimetres
}

export type LookMode = 'editorial' | 'specs'
