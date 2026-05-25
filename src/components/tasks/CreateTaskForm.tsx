'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const categories = [
  'Строительство и ремонт',
  'Ремонт техники и оборудования',
  'Дом, быт и уход',
  'Автоуслуги',
  'IT и Digital',
  'Юридические услуги и документы',
  'Бизнес и финансы',
  'Фото и видео',
  'Мероприятия и праздники',
  'Еда и кейтеринг',
  'Медицина',
  'Красота, здоровье и фитнес',
  'Образование и обучение',
  'Домашние животные',
  'Недвижимость и риелторы',
  'Транспорт и доставка',
  'Охрана и безопасность',
  'Производство и изготовление',
  'Агро и благоустройство',
  'Ритуальные услуги',
]

const cities = ['Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Слободзея']

export function CreateTaskForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [budget, setBudget] = useState('')
  const [negotiable, setNegotiable] = useState(false)
  const [deadline, setDeadline] = useState('')

  const budgetDisplay = negotiable
    ? 'Договорная'
    : budget
    ? `до ${budget} руб.`
    : 'Не указан'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // TODO: заменить на Server Action
    await new Promise((r) => setTimeout(r, 1000))

    setLoading(false)
    router.push('/tasks')
  }

  return (
    <div className="flex gap-6 items-start">

      {/* Форма */}
      <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex flex-col gap-4">

        {/* Ошибка */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Основная информация */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Основная информация
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Заголовок задания <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Кратко опишите что нужно сделать"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="border-gray-300 focus:border-[#0d7a5f]"
              />
              <p className="text-xs text-gray-400 mt-1">
                {title.length}/100 символов
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Описание <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Подробно опишите задание: что нужно сделать, какой результат ожидаете, есть ли особые требования..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Подробное описание привлечёт больше подходящих исполнителей
              </p>
            </div>
          </div>
        </div>

        {/* Категория и город */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Категория и местоположение
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Категория <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none bg-white"
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Город <span className="text-red-500">*</span>
              </Label>
              <select
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none bg-white"
              >
                <option value="">Выберите город</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Бюджет и срок */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Бюджет и срок
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Бюджет
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="например 500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  disabled={negotiable}
                  className="border-gray-300 focus:border-[#0d7a5f] disabled:opacity-50"
                />
                <span className="text-sm text-gray-500 flex-shrink-0">руб.</span>
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => {
                    setNegotiable(e.target.checked)
                    if (e.target.checked) setBudget('')
                  }}
                  className="accent-[#0d7a5f]"
                />
                <span className="text-sm text-gray-600">Бюджет договорной</span>
              </label>
            </div>

            <div>
              <Label htmlFor="deadline" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Срок выполнения
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="text"
                placeholder="например: 2 недели, до 1 июня"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border-gray-300 focus:border-[#0d7a5f]"
              />
              <p className="text-xs text-gray-400 mt-1">Необязательное поле</p>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-gray-300 text-gray-600"
          >
            <Link href="/tasks">Отмена</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0d7a5f] hover:bg-[#0a6149] text-white"
          >
            {loading ? 'Публикация...' : 'Опубликовать задание'}
          </Button>
        </div>

      </form>

      {/* Превью + советы */}
      <div className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">

          {/* Превью */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Предпросмотр
          </p>
          <div className="border border-gray-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-gray-900 leading-snug mb-2 line-clamp-2">
              {title || 'Заголовок задания'}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-3">
              {description || 'Описание задания появится здесь...'}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Открыто</span>
              {category && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {category}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-sm font-semibold text-[#0d7a5f]">{budgetDisplay}</span>
              {city && <span className="text-xs text-gray-400">{city}</span>}
            </div>
          </div>

          {/* Советы */}
          <div className="bg-[#0d7a5f]/5 rounded-lg p-3">
            <p className="text-xs font-semibold text-[#0d7a5f] mb-2">Советы</p>
            <ul className="space-y-1.5">
              {[
                'Укажите конкретный результат',
                'Добавьте примеры или референсы',
                'Реалистичный бюджет привлечёт больше откликов',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 text-[#0d7a5f] flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  )
}
