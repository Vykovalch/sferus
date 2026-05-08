import { db } from '@/lib/db'
import { cities } from '@/lib/db/schema'

export default async function HomePage() {
  const rows = await db.select().from(cities)

  return (
    <main>
      <h1>Города</h1>
      {rows.map((row) => (
        <div key={row.id}>
          <p>{row.id} — {row.name}</p>
        </div>
      ))}
    </main>
  )
}
