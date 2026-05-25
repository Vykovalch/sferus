'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Upload, X } from 'lucide-react'
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

const priceUnits = [
  { value: 'hour', label: 'за час' },
  { value: 'job', label: 'за работу' },
  { value: 'day', label: 'за день' },
  { value: 'sqm', label: 'за кв.м.' },
  { value: 'unit', label: 'за единицу' },
]

interface CreateServiceFormProps {
  userName: string
}

export function CreateServiceForm({ userName }: CreateServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')
  const [priceUnit, setPriceUnit] = useState('hour')
  const [homeVisit, setHomeVisit] = useState(true)
  const [photos, setPhotos] = useState<string[]>([])

  const priceUnitLabel = priceUnits.find((u) => u.value === priceUnit)?.label ?? ''
  const priceDisplay = price ? `от ${price} руб. ${priceUnitLabel}` : 'Цена не указана'
  const userInitials = userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const remaining = 5 - photos.length
    const newPhotos = Array.from(files).slice(0, remaining).map((f) => URL.createObjectURL(f))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    // TODO: заменить на Server Action
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    router.push('/services')
  }

  return (
    <div className="flex gap-6 items-start">

      {/* Форма */}
      <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex flex-col gap-4">

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
                Заголовок объявления <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Кратко опишите услугу"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="border-gray-300 focus:border-[#0d7a5f]"
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/100 символов</p>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Описание <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Подробно опишите услугу: что входит, ваш опыт, преимущества, гарантии..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Подробное описание привлечёт больше клиентов
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

        {/* Стоимость */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Стоимость услуги
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Цена <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="например 80"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="border-gray-300 focus:border-[#0d7a5f]"
                />
                <span className="text-sm text-gray-500 flex-shrink-0">руб.</span>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none bg-white flex-shrink-0"
                >
                  {priceUnits.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Клиент увидит: <span className="text-gray-600">{priceDisplay}</span>
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Выезд на дом / объект
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: 'Да, выезжаю' },
                  { value: false, label: 'Только у себя' },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setHomeVisit(opt.value)}
                    className={`flex items-center gap-2.5 px-4 py-3 border rounded-lg text-sm transition-colors ${
                      homeVisit === opt.value
                        ? 'border-[#0d7a5f] bg-[#0d7a5f]/5 text-[#0d7a5f] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      homeVisit === opt.value ? 'border-[#0d7a5f]' : 'border-gray-300'
                    }`}>
                      {homeVisit === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-[#0d7a5f]" />
                      )}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Фото работ */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1 pb-3 border-b border-gray-100">
            Фото работ
            <span className="text-xs font-normal text-gray-400 ml-2">необязательно</span>
          </h2>
          <p className="text-xs text-gray-400 mt-3 mb-3">
            Объявления с фото получают в 3 раза больше откликов
          </p>

          {photos.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-[#0d7a5f] hover:bg-[#0d7a5f]/2 transition-colors">
              <Upload className="h-8 w-8 text-gray-300 mb-2" />
              <span className="text-sm text-gray-500 mb-1">Нажмите для загрузки фото</span>
              <span className="text-xs text-gray-400">JPG или PNG, до 5 МБ каждое</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}

          {photos.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {photos.map((photo, index) => (
                <div key={photo} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                  {/* biome-ignore lint/performance/noImgElement: preview only */}
                  <img src={photo} alt={`Фото ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Удалить фото"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#0d7a5f] transition-colors">
                  <span className="text-2xl text-gray-300">+</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-gray-300 text-gray-600"
          >
            <Link href="/services">Отмена</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0d7a5f] hover:bg-[#0a6149] text-white"
          >
            {loading ? 'Публикация...' : 'Опубликовать объявление'}
          </Button>
        </div>

      </form>

      {/* Превью + советы */}
      <div className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Предпросмотр
          </p>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="h-24 bg-gradient-to-br from-[#0d7a5f]/6 to-[#0d7a5f]/3 flex items-center justify-center relative">
              <span className="text-4xl font-bold text-[#0d7a5f]/15">
                {title.charAt(0) || '?'}
              </span>
              {category && (
                <span className="absolute top-2 left-2 bg-white/90 text-[#0d7a5f] text-xs px-2 py-0.5 rounded-full border border-[#0d7a5f]/20">
                  {category}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-gray-900 leading-snug mb-2 line-clamp-2">
                {title || 'Заголовок объявления'}
              </p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-xs font-semibold text-[#0d7a5f] flex-shrink-0">
                  {userInitials}
                </div>
                <span className="text-xs text-gray-500 truncate">{userName.split(' ')[0]}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-xs font-semibold text-[#0d7a5f]">{priceDisplay}</span>
                {city && <span className="text-xs text-gray-400">{city}</span>}
              </div>
            </div>
          </div>

          <div className="bg-[#0d7a5f]/5 rounded-lg p-3">
            <p className="text-xs font-semibold text-[#0d7a5f] mb-2">Советы</p>
            <ul className="space-y-1.5">
              {[
                'Фото работ привлекает в 3 раза больше клиентов',
                'Укажите опыт и гарантии на работу',
                'Реалистичная цена привлечёт больше откликов',
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
