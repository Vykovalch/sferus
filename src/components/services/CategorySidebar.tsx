'use client'

import { useState } from 'react'

const subcategories = [
  { name: 'Все подкатегории', count: 120 },
  { name: 'Электрика', count: 34 },
  { name: 'Сантехника', count: 28 },
  { name: 'Отделка', count: 22 },
  { name: 'Кровля', count: 15 },
  { name: 'Окна и двери', count: 12 },
  { name: 'Фундамент', count: 9 },
]

const cities = ['Все', 'Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Слободзея']

const executorTypes = [
  { value: 'all', label: 'Все исполнители' },
  { value: 'individual', label: 'Частный специалист' },
  { value: 'company', label: 'Компания' },
]

export function CategorySidebar() {
  const [activeSubcat, setActiveSubcat] = useState('Все подкатегории')
  const [activeCity, setActiveCity] = useState('Все')
  const [executorType, setExecutorType] = useState('all')

  return (
    <div className="space-y-3 select-none">

      {/* Блок: Подкатегории */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-border">
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Подкатегория
          </h3>
        </div>
        <div className="py-1">
          {subcategories.map((sub) => (
            <label
              key={sub.name}
              className="flex items-center justify-between px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="radio"
                  name="subcategory"
                  value={sub.name}
                  checked={activeSubcat === sub.name}
                  onChange={() => setActiveSubcat(sub.name)}
                  className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
                />
                <span className={`text-sm leading-snug truncate transition-colors ${
                  activeSubcat === sub.name 
                    ? 'text-brand font-medium' 
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {sub.name}
                </span>
              </div>
              <span className={`text-xs pl-2 flex-shrink-0 transition-colors ${
                activeSubcat === sub.name 
                  ? 'text-brand/70 font-medium' 
                  : 'text-muted-foreground/60 group-hover:text-muted-foreground'
              }`}>
                {sub.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Блок: Исполнитель */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-border">
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Исполнитель
          </h3>
        </div>
        <div className="py-1">
          {executorTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
            >
              <input
                type="radio"
                name="executorType"
                value={type.value}
                checked={executorType === type.value}
                onChange={() => setExecutorType(type.value)}
                className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
              />
              <span className={`text-sm leading-snug transition-colors ${
                executorType === type.value 
                  ? 'text-brand font-medium' 
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {type.label}
              </span>
            </label>
          ))}
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

    </div>
  )
}