import { slugify } from 'transliteration'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function generateUsername(name: string): Promise<string> {
  const base = slugify(name, { lowercase: true }) || 'user'

  let username = base
  let i = 1

  while (true) {
    const existing = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1)

    if (existing.length === 0) break
    username = `${base}-${i++}`
  }

  return username
}