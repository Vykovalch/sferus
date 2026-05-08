import { pgTable, bigint, text } from 'drizzle-orm/pg-core';

export const cities = pgTable('cities', {
  id: bigint('id', { mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
});