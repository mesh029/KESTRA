// ─── KESTRA PROTOCOL — Project Log Type Definitions ─────────────────────────

export type LogEntryCategory =
  | 'design'
  | 'construction'
  | 'editorial'
  | 'technical'
  | 'production'
  | 'release'

export type LogEntryStatus =
  | 'wip'
  | 'blocked'
  | 'completed'
  | 'abandoned'
  | 'note'

export interface LogEntry {
  entryId: string
  entryDate: string                 // ISO date: YYYY-MM-DD
  entryTime?: string                // Optional: HH:MM (24h)
  category: LogEntryCategory
  status: LogEntryStatus
  title: string                     // ≤80 chars
  body: string                      // Markdown-safe prose
  linkedLookSlug?: string           // Links to /looks/[slug]
  linkedArticleSlug?: string        // Links to /editorial/[slug]
  attachments?: LogAttachment[]
}

export interface LogAttachment {
  attachmentType: 'image' | 'sketch' | 'fabric-swatch' | 'reference'
  url: string
  caption?: string
}
