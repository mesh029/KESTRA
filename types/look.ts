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

/**
 * Optional character / archetype reference for Looks designed against a fictional brief.
 * Displayed as an inverted "Character Brief" panel above the narrative body.
 */
export interface CharacterInspiration {
  /** Full name of the character, e.g. 'Motoko Kusanagi' */
  characterName: string
  /** Work the character originates from, e.g. 'Ghost in the Shell' */
  sourceMaterial: string
  /** Original creator / director, e.g. 'Masamune Shirow / Mamoru Oshii' */
  creator: string
  /** Year of original publication or release */
  year: number
  /** Portrait or reference image of the character */
  imageUrl: string
  imageAlt: string
  /**
   * 1–2 sentence editorial note articulating the design logic
   * borrowed from this character — not a synopsis of the source material.
   */
  characterNote: string
}

export interface EditorialStory {
  lookTitle: string
  season: string
  year: number
  pullQuote: string                 // 1 sentence ≤20 words. Italic dek above body.
  narrativeBody: string             // 150–400 words, supports \n\n for paragraph breaks
  moodKeywords: string[]            // e.g. ['arid', 'geometric', 'sparse']
  credits: LookCredits
  /** Present only on Character-brief Looks */
  characterInspiration?: CharacterInspiration
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
