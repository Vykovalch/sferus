export * from './auth-schema'

import {
  pgTable,
  text,
  bigint,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const cities = pgTable('cities', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
})

export const categories = pgTable('categories', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  order: integer('order').default(0),
})

export const services = pgTable('services', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: bigint('price', { mode: 'number' }).notNull(),
  categoryId: bigint('category_id', { mode: 'number' }).references(() => categories.id),
  cityId: bigint('city_id', { mode: 'number' }).references(() => cities.id),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  image: text('image'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  budget: bigint('budget', { mode: 'number' }),
  status: integer('status').default(1), // 1 - open, 2 - in progress, 3 - completed, 4 - cancelled
  categoryId: bigint('category_id', { mode: 'number' }).references(() => categories.id),
  cityId: bigint('city_id', { mode: 'number' }).references(() => cities.id),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const responses = pgTable('responses', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  message: text('message').notNull(),
  price: bigint('price', { mode: 'number' }).notNull(),
  taskId: bigint('task_id', { mode: 'number' }).references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const reviews = pgTable('reviews', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  authorId: text('author_id').references(() => user.id, { onDelete: 'cascade' }),
  targetId: text('target_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})