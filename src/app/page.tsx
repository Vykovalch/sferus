import { db } from '@/lib/db'
import { test } from '@/lib/db/schema'

export default async function HomePage() {
  const rows = await db.select().from(test)

  return (
    <main>
      <h1>Тест</h1>
      {rows.map((row) => (
        <div key={row.id}>
          <p>{row.id} — {row.name}</p>
        </div>
      ))}
    </main>
  )
}
