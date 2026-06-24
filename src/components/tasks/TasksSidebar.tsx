'use client'

import { useState } from 'react'
import { CategoryFilter } from '@/components/shared/CategoryFilter'
import { CityFilter } from '@/components/shared/CityFilter'
import { StatusFilter } from '@/components/shared/StatusFilter'

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

const cities = ['Все города', 'Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Слободея']

interface TasksSidebarProps {
  idPrefix?: string;
}

export function TasksSidebar({ idPrefix = 'desktop' }: TasksSidebarProps) {
  const [activeCategory, setActiveCategory] = useState('Все категории')
  const [activeCity, setActiveCity] = useState('Все города')
  const [activeStatus, setActiveStatus] = useState('open')

  return (
    <div className="space-y-3 select-none">
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        name={`${idPrefix}-category`}
      />
      <CityFilter
        cities={cities}
        activeCity={activeCity}
        onChange={setActiveCity}
        name={`${idPrefix}-city`}
      />
      <StatusFilter
        activeStatus={activeStatus}
        onChange={setActiveStatus}
        name={`${idPrefix}-status`}
      />
    </div>
  )
}
