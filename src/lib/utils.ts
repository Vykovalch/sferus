import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Форматирует цену
export function formatPrice(from: number, to?: number | null): string {
  if (to) {
    return `${from.toLocaleString('ru')}–${to.toLocaleString('ru')} руб.`
  }
  return `от ${from.toLocaleString('ru')} руб.`
}

// Форматирует дату
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Получает инициалы из имени
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
