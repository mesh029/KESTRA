import type { EditorialArticle } from '@/types/article'
import { seedArticles } from './seed'

export async function getAllArticles(): Promise<EditorialArticle[]> {
  // In production: replace with CMS fetch or DB query; sorted newest-first
  return [...seedArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}
