'use client'

import { useState } from 'react'

const subcategories = [
  { name: 'Все', count: 120 },
  { name: 'Электрика', count: 34 },
  { name: 'Сантехника', count: 28 },
  { name: 'Отделка', count: 22 },
  { name: 'Кровля', count: 15 },
  { name: 'Окна и двери', count: 12 },
  { name: 'Фундамент', count: 9 },
]

const cities = ['Все', 'Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Слободзея']

const executorTypes = [
  { value: 'all', label: 'Все' },
  { value: 'individual', label: 'Частный специалист' },
  { value: 'company', label: 'Компания' },
]

export function CategorySidebar() {
  const [activeSubcat, setActiveSubcat] = useState('Все')
  const [activeCity, setActiveCity] = useState('Все')
  const [executorType, setExecutorType] = useState('all')

  return (
    <div className="space-y-3">

      {/* Подкатегории */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Подкатегории</h3>
        </div>
        <nav className="py-1">
          {subcategories.map((sub) => (
            <button
              key={sub.name}
              type="button"
              onClick={() => setActiveSubcat(sub.name)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                activeSubcat === sub.name
                  ? 'bg-[#0d7a5f]/8 text-[#0d7a5f] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{sub.name}</span>
              <span className={`text-xs ${activeSubcat === sub.name ? 'text-[#0d7a5f]/70' : 'text-gray-400'}`}>
                {sub.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Тип исполнителя */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Исполнитель</h3>
        </div>
        <div className="p-3 space-y-1">
          {executorTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="executorType"
                value={type.value}
                checked={executorType === type.value}
                onChange={() => setExecutorType(type.value)}
                className="accent-[#0d7a5f]"
              />
              <span className={`text-sm ${executorType === type.value ? 'text-[#0d7a5f] font-medium' : 'text-gray-700'}`}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Город */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Город</h3>
        </div>
        <div className="p-3 flex flex-wrap gap-1.5">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCity(city)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeCity === city
                  ? 'bg-[#0d7a5f] border-[#0d7a5f] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-[#0d7a5f] hover:text-[#0d7a5f]'
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
