import type { LookEntry } from '@/types/look'
import { seedLooks } from './seed'

export async function getLook(lookSlug: string): Promise<LookEntry | null> {
  // In production: replace with DB query or CMS fetch
  return seedLooks.find((look) => look.lookSlug === lookSlug) ?? null
}
