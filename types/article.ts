export type ArticleCategory =
  | 'Trends'
  | 'Process'
  | 'Material'
  | 'Culture'
  | 'Interview'
  | 'Field Notes'
  | 'Character'

/**
 * A single design/edit pass in the article's evolution history.
 * Displayed as an atelier revision timeline in the article detail page.
 */
export interface ArticleRevision {
  /** 7-char deterministic hash — used as a unique display key */
  hash: string
  /** Semver-style version string: v1.0, v1.1, v2.0 */
  version: string
  /** ISO 8601 publication or revision date */
  date: string
  /** Short note describing what changed in this edit pass */
  message: string
  /** Name of the person responsible for this revision */
  author: string
}

export interface EditorialArticle {
  articleId: string
  slug: string
  category: ArticleCategory
  headline: string
  /** 1–2 sentence teaser shown on cards */
  teaser: string
  coverImageUrl: string
  coverImageAlt: string
  readingTimeMin: number
  publishedAt: string
  /** Byline author */
  author: string
  /** Renders as full-width featured article in the grid */
  isFeature?: boolean
  /**
   * Full editorial body.
   * Paragraphs separated by \n\n.
   * A line beginning with ## is a section subheading.
   */
  body?: string
  /**
   * Slugs of Looks directly featured or referenced in this article.
   * Used to render linked Look cards inside the article.
   */
  relatedLooks?: string[]
  /** Chronological revision history, oldest first */
  revisionHistory?: ArticleRevision[]
  /** Number of studio adaptations/variants derived from this article */
  forkCount?: number
}
