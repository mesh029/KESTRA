import type { EditorialArticle } from '@/types/article'
import { seedArticles } from './seed'

export async function getArticle(slug: string): Promise<EditorialArticle | null> {
  // In production: replace with CMS fetch or DB query
  return seedArticles.find((a) => a.slug === slug) ?? null
}
