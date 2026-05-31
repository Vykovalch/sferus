'use client'

import { useState } from 'react'

const categories = [
  'Все категории',
  'Строительство и ремонт',
  'Ремонт техники',
  'Дом, быт и уход',
  'Автоуслуги',
  'IT и Digital',
  'Юридические услуги и документы',
  'Бизнес и финансы',
  'Фото и видео',
  'Мероприятия и праздники',
  'Медицина',
  'Красота и фитнес',
  'Образование и обучение',
  'Домашние животные',
  'Недвижимость и риелторы',
  'Транспорт и доставка',
  'Охрана и безопасность',
  'Производство и изготовление',
  'Агро и благоустройство',
  'Ритуальные услуги',
]

const cities = ['Все', 'Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Слободея']

const statuses = [
  { value: 'open', label: 'Открытые' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Завершённые' },
]

const VISIBLE_CATS = 7

export function TasksSidebar() {
  const [activeCategory, setActiveCategory] = useState('Все категории')
  const [activeCity, setActiveCity] = useState('Все')
  const [activeStatus, setActiveStatus] = useState('open')
  const [showAllCats, setShowAllCats] = useState(false)

  const visibleCats = showAllCats ? categories : categories.slice(0, VISIBLE_CATS)

  return (
    <div className="space-y-3 select-none">

      {/* Блок: Категории */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-border">
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Категория
          </h3>
        </div>
        <div className="py-1">
          {visibleCats.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={activeCategory === cat}
                onChange={() => setActiveCategory(cat)}
                className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
              />
              <span className={`text-sm leading-snug transition-colors ${
                activeCategory === cat 
                  ? 'text-brand font-medium' 
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {cat}
              </span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => setShowAllCats((v) => !v)}
            className="w-full text-left px-4 py-2 text-xs font-medium text-muted-foreground hover:text-brand cursor-pointer transition-colors"
          >
            {showAllCats ? 'Скрыть ↑' : 'Все категории ↓'}
          </button>
        </div>
      </div>

      {/* Блок: Город */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-border">
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Город
          </h3>
        </div>
        <div className="p-3 flex flex-wrap gap-1.5">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCity(city)}
              className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                activeCity === city
                  ? 'bg-brand border-brand text-brand-foreground shadow-sm'
                  : 'border-input bg-background text-muted-foreground hover:border-brand/50 hover:text-foreground'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Блок: Статус */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-border">
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Статус
          </h3>
        </div>
        <div className="py-1">
          {statuses.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
            >
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={activeStatus === status.value}
                onChange={() => setActiveStatus(status.value)}
                className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
              />
              <span className={`text-sm transition-colors ${
                activeStatus === status.value 
                  ? 'text-brand font-medium' 
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  )
}