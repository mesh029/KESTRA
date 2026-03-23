import type { LookEntry } from '@/types/look'
import { seedLooks } from './seed'

export async function getAllLooks(): Promise<LookEntry[]> {
  // In production: replace with DB query or CMS fetch
  // e.g. await db.select().from(looks).where(eq(looks.status, 'published'))
  return seedLooks.filter((look) => look.status === 'published')
}
