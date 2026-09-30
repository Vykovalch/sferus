"use client";

import { upload } from "@vercel/blob/client";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryOption } from "@/features/categories/queries";
import type { CityOption } from "@/features/cities/queries";
import { createService, updateService } from "@/features/services/actions";
import { PRICE_UNIT_LABELS, PRICE_UNITS } from "@/features/services/schemas";
import { type ActionState, idleState } from "@/lib/action-state";
import { formatAmount } from "@/lib/format";
import { compressImage, IMAGE_UPLOAD } from "@/lib/images";

export interface ServiceFormValues {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  cityId: number;
  price: number | null;
  isNegotiable: boolean;
  priceUnit: string;
  homeVisit: boolean;
  imageUrls: string[];
}

interface CreateServiceFormProps {
  /** Справочники приходят из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
  categories: CategoryOption[];
  mode?: "create" | "edit";
  initialValues?: ServiceFormValues;
}

/**
 * Форма объявления об услуге.
 *
 * **Одна карточка без секционных заголовков** (2026-09-30), как в форме
 * задания. До этого поля лежали в четырёх обрамлённых секциях, и заголовок
 * «Стоимость услуги» стоял над подписью «Цена» — то же слово дважды.
 *
 * **Порядок:** заголовок → описание → фото → категория и город → выезд
 * на дом → цена.
 *
 * Фотографии подняты с последнего места на третье. Причин три: карточка
 * в каталоге построена вокруг снимка, и обложку незачем просить в самом конце;
 * загрузка идёт асинхронно, а кнопка публикации заблокирована, пока файл летит
 * в хранилище, — начатая раньше, она успевает закончиться; так устроены формы
 * там, где снимок решает (у Etsy блок фотографий первый). Первым полем фото
 * всё же не стоят: открывать форму выбором файла на телефоне — тяжёлый вход.
 *
 * «Выезд на дом» переехал из блока цены к городу: это условие работы,
 * а не свойство цены, и на странице объявления он стоит в «Деталях» рядом
 * с городом.
 */
export function CreateServiceForm({
  cities,
  categories,
  mode = "create",
  initialValues,
}: CreateServiceFormProps) {
  const isEdit = mode === "edit";
  const cancelHref = isEdit ? "/dashboard/services" : "/services";

  const [state, formAction, pending] = useActionState<ActionState<never>, FormData>(
    isEdit ? updateService : createService,
    idleState,
  );

  // Поля остаются управляемыми: от них зависит подсказка «Клиент увидит»
  // под ценой. На отправку это не влияет — значения уходят через FormData
  // по атрибуту name.
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues ? String(initialValues.categoryId) : "");
  const [city, setCity] = useState(initialValues ? String(initialValues.cityId) : "");
  const [price, setPrice] = useState(initialValues?.price ? String(initialValues.price) : "");
  const [isNegotiable, setIsNegotiable] = useState(initialValues?.isNegotiable ?? false);
  const [priceUnit, setPriceUnit] = useState(initialValues?.priceUnit ?? "hour");
  const [homeVisit, setHomeVisit] = useState(initialValues?.homeVisit ?? true);
  // Адреса уже загруженных файлов: сам файл ушёл в хранилище напрямую
  // из браузера, к объявлению его привяжет Server Action при сохранении.
  const [photos, setPhotos] = useState<string[]>(initialValues?.imageUrls ?? []);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const errorMessage = state.status === "error" ? state.message : null;
  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  // Поля, у которых есть собственная подсказка под инпутом. Ошибки всех
  // остальных показываем в общей плашке — иначе форма отказывает молча,
  // без единого объяснения, и причину видно только в схеме.
  const shownInline = new Set(["title", "description", "categoryId", "cityId", "price"]);
  const unmappedErrors =
    state.status === "error"
      ? Object.entries(state.fieldErrors ?? {})
          .filter(([field, messages]) => !shownInline.has(field) && messages?.length)
          .flatMap(([, messages]) => messages ?? [])
      : [];

  const priceUnitLabel = PRICE_UNIT_LABELS[priceUnit as (typeof PRICE_UNITS)[number]] ?? "";
  const priceDisplay = isNegotiable
    ? "Договорная"
    : price
      ? `от ${formatAmount(Number(price))} руб. ${priceUnitLabel}`
      : "Цена не указана";

  /**
   * Файл уходит из браузера прямо в хранилище: сервер выдаёт только токен,
   * мегабайты через него не проходят. Перед отправкой фото сжимается —
   * заодно теряя EXIF с геометкой съёмки.
   */
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const files = input.files;
    if (!files || files.length === 0) return;

    const selected = Array.from(files).slice(0, IMAGE_UPLOAD.maxFiles - photos.length);
    // Сброс значения: иначе повторный выбор того же файла не вызовет change.
    input.value = "";

    setUploadError(null);

    for (const file of selected) {
      if (file.size > IMAGE_UPLOAD.maxBytes) {
        setUploadError("Файл больше 10 МБ — выберите фотографию поменьше");
        continue;
      }

      setUploadingCount((count) => count + 1);
      try {
        const compressed = await compressImage(file);
        const blob = await upload(compressed.name, compressed, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        setPhotos((prev) => [...prev, blob.url]);
      } catch {
        setUploadError("Не удалось загрузить фотографию. Попробуйте ещё раз");
      } finally {
        setUploadingCount((count) => count - 1);
      }
    }
  }

  /**
   * Убираем фото из формы. Файл в хранилище удалит Server Action при сохранении:
   * пока объявление не сохранено, пользователь может передумать.
   */
  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && initialValues && <input type="hidden" name="id" value={initialValues.id} />}

      {/* Плашка отказа — над карточкой: она относится ко всей форме */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {errorMessage}
          {unmappedErrors.length > 0 && (
            <ul className="mt-1.5 list-disc list-inside space-y-0.5">
              {unmappedErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        {/* 20px между полями: подсказка под полем отбита на 4px, и при 16px
            до следующей подписи оставалось 12 — группы сливались. */}
        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-foreground mb-1.5 block">
              Заголовок объявления
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Кратко опишите услугу"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={10}
              maxLength={100}
              aria-invalid={Boolean(fieldError("title"))}
            />
            {fieldError("title") ? (
              <p className="text-xs text-destructive mt-1">{fieldError("title")}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">{title.length}/100 символов</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Описание
            </Label>
            {/* Поле из кита, а не собственное: у ручного были свой радиус,
                своя тень и никакого состояния ошибки. `rows` оставлен
                для браузеров без `field-sizing`, `min-h-32` держит ту же
                высоту в пять строк, `resize-y` позволяет растянуть. */}
            <Textarea
              id="description"
              name="description"
              placeholder="Подробно опишите услугу: что входит, ваш опыт, преимущества, гарантии..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={20}
              rows={5}
              aria-invalid={Boolean(fieldError("description"))}
              className="min-h-32 resize-y"
            />
            {fieldError("description") ? (
              <p className="text-xs text-destructive mt-1">{fieldError("description")}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Подробное описание привлечёт больше клиентов
              </p>
            )}
          </div>

          {/* Фото работ — третьим блоком, а не последним (2026-09-30).
              Подпись группы, а не заголовок секции: загрузчику нужна подпись,
              как любому полю. */}
          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">Фото работ</p>
            <p className="text-xs text-muted-foreground mb-3">
              До {IMAGE_UPLOAD.maxFiles} фотографий. Первая станет обложкой объявления в каталоге.
            </p>

            {/* Адреса уходят в FormData повторяющимся ключом — схема принимает
                и одно значение, и массив. */}
            {photos.map((url) => (
              <input key={url} type="hidden" name="imageUrls" value={url} />
            ))}

            {uploadError && (
              <p role="alert" className="text-xs text-destructive mb-3">
                {uploadError}
              </p>
            )}

            {fieldError("imageUrls") && (
              <p className="text-xs text-destructive mb-3">{fieldError("imageUrls")}</p>
            )}

            {photos.length < IMAGE_UPLOAD.maxFiles && (
              // `sr-only`, а не `hidden` (2026-09-30): со скрытым через
              // `display: none` полем файла до загрузки нельзя было добраться
              // табом вообще — отказ по WCAG 2.1.1. Теперь поле остаётся
              // в потоке фокуса, а рамку подсвечивает `focus-within`.
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border rounded-xl py-8 cursor-pointer hover:border-brand hover:bg-brand/5 focus-within:border-state/60 focus-within:ring-3 focus-within:ring-state/20 transition-all group">
                <Upload className="h-8 w-8 text-muted-foreground/60 mb-2 group-hover:text-brand transition-colors" />
                <span className="text-sm text-muted-foreground mb-1 group-hover:text-foreground transition-colors">
                  Нажмите для загрузки фото
                </span>
                <span className="text-xs text-muted-foreground/60">
                  JPG, PNG или WebP, до 10 МБ
                </span>
                <input
                  type="file"
                  aria-label="Загрузить фотографии"
                  accept={IMAGE_UPLOAD.allowedTypes.join(",")}
                  multiple
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            )}

            {(photos.length > 0 || uploadingCount > 0) && (
              <div className="flex gap-2 flex-wrap mt-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
                  >
                    {/* biome-ignore lint/performance/noImgElement: превью в форме — оптимизировать нечего */}
                    <img
                      src={photo}
                      alt={`Фото ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* На сенсорных ширинах крестик виден всегда: наведения
                        там нет, и удалить снимок было нечем. С 640px
                        появляется при наведении на миниатюру и при фокусе. */}
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center cursor-pointer transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`Удалить фото ${index + 1}`}
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}

                {Array.from({ length: uploadingCount }).map((_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: плейсхолдеры без собственной сущности
                    key={`uploading-${index}`}
                    role="img"
                    aria-label="Фотография загружается"
                    className="w-20 h-20 rounded-lg border border-border bg-muted animate-pulse"
                  />
                ))}

                {photos.length + uploadingCount < IMAGE_UPLOAD.maxFiles && (
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-brand hover:bg-brand/5 focus-within:border-state/60 focus-within:ring-3 focus-within:ring-state/20 text-muted-foreground/60 hover:text-brand transition-all">
                    <span className="text-2xl font-light">+</span>
                    <input
                      type="file"
                      aria-label="Добавить ещё фотографии"
                      accept={IMAGE_UPLOAD.allowedTypes.join(",")}
                      multiple
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <Label
                htmlFor="categoryId"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Категория
              </Label>
              <NativeSelect
                id="categoryId"
                name="categoryId"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                aria-invalid={Boolean(fieldError("categoryId"))}
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </NativeSelect>
              {fieldError("categoryId") && (
                <p className="text-xs text-destructive mt-1">{fieldError("categoryId")}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cityId" className="text-sm font-medium text-foreground mb-1.5 block">
                Город
              </Label>
              <NativeSelect
                id="cityId"
                name="cityId"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                aria-invalid={Boolean(fieldError("cityId"))}
              >
                <option value="">Выберите город</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
              {fieldError("cityId") && (
                <p className="text-xs text-destructive mt-1">{fieldError("cityId")}</p>
              )}
            </div>
          </div>

          {/* Настоящая радиогруппа, а не пара кнопок (2026-09-30). Раньше
              это были `<button aria-pressed>` со скрытым полем: скринридер
              объявлял «кнопка, нажата» вместо «выбрано 1 из 2», стрелками
              между вариантами перейти было нельзя, и вид — две крупные
              коробки — не совпадал ни с чем на сайте.

              Разметка и классы взяты у «Типа профиля» в настройках:
              нативный `<input type="radio">` 16px с `accent-brand`, подпись
              `text-sm`, зазор 8px, весь `<label>` кликабельный. Схема
              принимает "true"/"false" (`booleanField`), поэтому значения
              радиокнопок уходят в `FormData` напрямую и скрытое поле
              больше не нужно. */}
          <fieldset>
            <legend className="text-sm font-medium text-foreground mb-2">
              Выезд на дом / объект
            </legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                { value: true, label: "Да, выезжаю" },
                { value: false, label: "Только у себя" },
              ].map((opt) => (
                <label
                  key={String(opt.value)}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="homeVisit"
                    value={String(opt.value)}
                    checked={homeVisit === opt.value}
                    onChange={() => setHomeVisit(opt.value)}
                    className="h-4 w-4 border-input text-brand accent-brand cursor-pointer"
                  />
                  <span className="text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <Label htmlFor="price" className="text-sm font-medium text-foreground mb-1.5 block">
              Цена
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="price"
                name="price"
                type="number"
                min={1}
                placeholder="например 80"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isNegotiable}
                required={!isNegotiable}
                aria-invalid={Boolean(fieldError("price"))}
              />
              <span className="text-sm text-muted-foreground flex-shrink-0">руб.</span>
              <NativeSelect
                name="priceUnit"
                aria-label="Единица измерения цены"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-auto flex-shrink-0"
              >
                {PRICE_UNITS.map((value) => (
                  <option key={value} value={value}>
                    {PRICE_UNIT_LABELS[value]}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                name="isNegotiable"
                checked={isNegotiable}
                onChange={(e) => {
                  setIsNegotiable(e.target.checked);
                  if (e.target.checked) setPrice("");
                }}
                className="h-4 w-4 rounded border-input text-brand accent-brand cursor-pointer"
              />
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Цена договорная
              </span>
            </label>

            {fieldError("price") ? (
              <p className="text-xs text-destructive mt-1">{fieldError("price")}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Клиент увидит: <span className="text-foreground font-medium">{priceDisplay}</span>
              </p>
            )}
          </div>
        </div>

        {/* Кнопки внутри карточки, как в профиле и на экранах входа: на сером
            холсте они висели отдельно от того, что отправляют. */}
        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
          <Button
            type="button"
            variant="outline"
            asChild
            className="h-10 rounded-full border-input text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer font-medium"
          >
            <Link href={cancelHref}>Отмена</Link>
          </Button>
          <Button
            type="submit"
            // Пока фото не долетело, сохранять нельзя: его адреса ещё нет
            // в форме, и объявление сохранилось бы без него.
            disabled={pending || uploadingCount > 0}
            className="flex-1 h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer text-base font-medium transition-colors"
          >
            {pending
              ? isEdit
                ? "Сохранение..."
                : "Публикация..."
              : isEdit
                ? "Сохранить изменения"
                : "Опубликовать"}
          </Button>
        </div>
      </div>
    </form>
  );
}
