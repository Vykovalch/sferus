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

const cities = ['Все', 'Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Слободзея']

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
    <div className="space-y-3">

      {/* Категории */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Категория</h3>
        </div>
        <div className="py-1">
          {visibleCats.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 px-4 py-2 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={activeCategory === cat}
                onChange={() => setActiveCategory(cat)}
                className="accent-[#0d7a5f] flex-shrink-0"
              />
              <span className={`text-sm leading-snug ${
                activeCategory === cat ? 'text-[#0d7a5f] font-medium' : 'text-gray-700'
              }`}>
                {cat}
              </span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => setShowAllCats((v) => !v)}
            className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-[#0d7a5f] transition-colors"
          >
            {showAllCats ? 'Скрыть ↑' : 'Все категории ↓'}
          </button>
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

      {/* Статус */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Статус</h3>
        </div>
        <div className="py-1">
          {statuses.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-2.5 px-4 py-2 cursor-pointer"
            >
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={activeStatus === status.value}
                onChange={() => setActiveStatus(status.value)}
                className="accent-[#0d7a5f] flex-shrink-0"
              />
              <span className={`text-sm ${
                activeStatus === status.value ? 'text-[#0d7a5f] font-medium' : 'text-gray-700'
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
