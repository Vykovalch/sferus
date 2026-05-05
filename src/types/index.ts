import type { City, CategoryId } from '@/constants'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string | null
  city: City
  avatarUrl?: string | null
  role: 'CLIENT' | 'EXECUTOR' | 'BOTH'
  bio?: string | null
  rating?: number | null
  reviewsCount: number
  createdAt: Date
}

export interface Category {
  id: CategoryId
  name: string
  icon: string
  parentId?: string | null
}

export interface Listing {
  id: string
  title: string
  description: string
  priceFrom: number
  priceTo?: number | null
  categoryId: CategoryId
  city: City
  executorId: string
  executor?: UserProfile
  images: string[]
  isActive: boolean
  viewsCount: number
  createdAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  budget?: number | null
  categoryId?: CategoryId | null
  city: City
  clientId: string
  client?: UserProfile
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  _count?: { responses: number }
}

export interface Response {
  id: string
  taskId: string
  executorId: string
  executor?: UserProfile
  message: string
  price?: number | null
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
}

export interface Review {
  id: string
  listingId?: string | null
  reviewerId: string
  reviewer?: UserProfile
  executorId: string
  rating: number
  text?: string | null
  createdAt: Date
}