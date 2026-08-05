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
  mode?: 'create' | 'edit'
  initialValues?: {
    title?: string
    description?: string
    category?: string
    city?: string
    price?: string
    priceUnit?: string
    homeVisit?: boolean
    photos?: string[]
  }
}

export function CreateServiceForm({ userName, mode = 'create', initialValues }: CreateServiceFormProps) {
  const router = useRouter()
  const isEdit = mode === 'edit'
  const cancelHref = isEdit ? '/dashboard/services' : '/services'
  const redirectAfterSubmit = isEdit ? '/dashboard/services' : '/services'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [category, setCategory] = useState(initialValues?.category ?? '')
  const [city, setCity] = useState(initialValues?.city ?? '')
  const [price, setPrice] = useState(initialValues?.price ?? '')
  const [priceUnit, setPriceUnit] = useState(initialValues?.priceUnit ?? 'hour')
  const [homeVisit, setHomeVisit] = useState(initialValues?.homeVisit ?? true)
  const [photos, setPhotos] = useState<string[]>(initialValues?.photos ?? [])

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
    router.push(redirectAfterSubmit)
  }

  return (
    <div className="flex gap-6 items-start min-h-screen bg-background text-foreground">

      {/* Форма */}
      <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex flex-col gap-4">

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Основная информация */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border/60">
            Основная информация
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-foreground mb-1.5 block">
                Заголовок объявления <span className="text-destructive">*</span>
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
                className="border-border focus-visible:border-brand"
              />
              <p className="text-xs text-muted-foreground mt-1">{title.length}/100 символов</p>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-foreground mb-1.5 block">
                Описание <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Подробно опишите услугу: что входит, ваш опыт, преимущества, гарантии..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Подробное описание привлечёт больше клиентов
              </p>
            </div>
          </div>
        </div>

        {/* Категория и город */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border/60">
            Категория и местоположение
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-foreground mb-1.5 block">
                Категория <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-brand cursor-pointer"
              >
                <option value="" className="bg-background">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-background">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-foreground mb-1.5 block">
                Город <span className="text-destructive">*</span>
              </Label>
              <select
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-brand cursor-pointer"
              >
                <option value="" className="bg-background">Выберите город</option>
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-background">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Стоимость */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border/60">
            Стоимость услуги
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-foreground mb-1.5 block">
                Цена <span className="text-destructive">*</span>
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
                  className="border-border focus-visible:border-brand"
                />
                <span className="text-sm text-muted-foreground flex-shrink-0">руб.</span>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="flex h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-brand cursor-pointer flex-shrink-0"
                >
                  {priceUnits.map((u) => (
                    <option key={u.value} value={u.value} className="bg-background">{u.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Клиент увидит: <span className="text-foreground font-medium">{priceDisplay}</span>
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Выезд на дом / объект
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: true, label: 'Да, выезжаю' },
                  { value: false, label: 'Только у себя' },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setHomeVisit(opt.value)}
                    className={`flex items-center gap-2.5 px-4 py-3 border rounded-lg text-sm transition-all cursor-pointer ${
                      homeVisit === opt.value
                        ? 'border-brand bg-brand/5 text-brand font-medium'
                        : 'border-border text-muted-foreground hover:border-border/80 hover:bg-card/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      homeVisit === opt.value ? 'border-brand' : 'border-border'
                    }`}>
                      {homeVisit === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-brand" />
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
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-1 pb-3 border-b border-border/60 flex items-center justify-between">
            <span>Фото работ</span>
            <span className="text-xs font-normal text-muted-foreground">необязательно</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-3 mb-3">
            Объявления с фото получают в 3 раза больше откликов
          </p>

          {photos.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border rounded-xl py-8 cursor-pointer hover:border-brand hover:bg-brand/5 transition-all group">
              <Upload className="h-8 w-8 text-muted-foreground/60 mb-2 group-hover:text-brand transition-colors" />
              <span className="text-sm text-muted-foreground mb-1 group-hover:text-foreground transition-colors">Нажмите для загрузки фото</span>
              <span className="text-xs text-muted-foreground/60">JPG или PNG, до 5 МБ каждое</span>
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
                <div key={photo} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  {/* biome-ignore lint/performance/noImgElement: preview only */}
                  <img src={photo} alt={`Фото ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Удалить фото"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-brand hover:bg-brand/5 text-muted-foreground/60 hover:text-brand transition-all">
                  <span className="text-2xl font-light">+</span>
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
            className="border-border text-muted-foreground hover:text-foreground cursor-pointer font-medium"
          >
            <Link href={cancelHref}>Отмена</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
          >
            {loading
              ? (isEdit ? 'Сохранение...' : 'Публикация...')
              : (isEdit ? 'Сохранить изменения' : 'Опубликовать объявление')}
          </Button>
        </div>

      </form>

      {/* Превью + советы */}
      <div className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm">

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Предпросмотр
          </p>

          <div className="border border-border rounded-lg overflow-hidden mb-4 bg-card/30">
            <div className="h-24 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center relative">
              <span className="text-4xl font-bold text-brand/20">
                {title.charAt(0) || '?'}
              </span>
              {category && (
                <span className="absolute top-2 left-2 bg-background/95 text-brand text-[10px] px-2 py-0.5 rounded-full border border-brand/20 font-medium max-w-[90%] truncate">
                  {category}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-foreground leading-snug mb-2 line-clamp-2">
                {title || 'Заголовок объявления'}
              </p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand flex-shrink-0">
                  {userInitials}
                </div>
                <span className="text-xs text-muted-foreground truncate">{userName.split(' ')[0]}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 gap-1">
                <span className="text-[11px] font-bold text-brand truncate max-w-[65%]">{priceDisplay}</span>
                {city && <span className="text-[11px] text-muted-foreground flex-shrink-0">{city}</span>}
              </div>
            </div>
          </div>

          <div className="bg-brand/5 rounded-lg p-3 border border-brand/10">
            <p className="text-xs font-semibold text-brand mb-2">Советы</p>
            <ul className="space-y-1.5">
              {[
                'Фото работ привлекает в 3 раза больше клиентов',
                'Укажите опыт и гарантии на работу',
                'Реалистичная цена привлечёт больше откликов',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-normal">
                  <CheckCircle className="h-3 w-3 text-brand flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  )
}