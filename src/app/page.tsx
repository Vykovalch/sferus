import { db } from '@/lib/db'
import { cities } from '@/lib/db/schema'

export default async function HomePage() {
  const rows = await db.select().from(cities)

  return (
    <main>
      <h1>Главная секция</h1>
    </main>
  )
}
