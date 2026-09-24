import { Building2, Camera, MapPin, User, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

export interface ServiceCardProps {
  id: number;
  title: string;
  /** Slug категории — часть адреса объявления. */
  categorySlug: string;
  city: string;
  /** Уже отформатированная цена: «от 80 руб. за час» либо «Договорная». */
  price: string;
  authorName: string;
  authorType?: "individual" | "company" | null;
  /** Первая фотография объявления; нет — заглушка с камерой. */
  imageUrl?: string | null;
  isFavorite?: boolean;
  isAuthenticated?: boolean;
}

/**
 * Карточка услуги.
 *
 * Ссылкой обёрнут заголовок, а не вся карточка: кликабельную площадь даёт
 * `after:absolute after:inset-0` поверх контейнера. Так кнопка избранного
 * оказывается рядом со ссылкой, а не внутри неё — форма внутри `<a>`
 * недопустима, и кнопка внутри ссылки была невалидной вложенностью.
 */
export function ServiceCard({
  id,
  title,
  categorySlug,
  city,
  price,
  authorName,
  authorType,
  imageUrl,
  isFavorite = false,
  isAuthenticated = false,
}: ServiceCardProps) {
  const isCompany = authorType === "company";

  return (
    // Контейнера у карточки нет (решение владельца, 2026-09-24): ни заливки,
    // ни рамки, ни тени. Форму задаёт сама фотография, карточки разделяет
    // воздух — так устроены витрины Avito, Ozon, Etsy и Airbnb. Прежняя рамка
    // повторяла линию фотографии второй раз, а на белой секции «Новые
    // объявления» была единственным, что отделяло белую карточку от белого фона.
    //
    // В тот же день пробовали промежуточный вариант — белую плитку без рамки:
    // на сером фоне каталога она держит карточку лучше, но владелец вернулся
    // к варианту без контейнера.
    //
    // Рамки остаются у карточек без фотографии — задание, категория: там
    // контейнер и есть форма.
    <article className="group relative">
      {/* Фото: скругление и обрезка здесь, а не на карточке */}
      <div className="aspect-[1.5] relative overflow-hidden rounded-2xl bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        {/* Отметка в кружке 32px с полупрозрачной заливкой и обводкой в цвет
            сердечка (решение владельца, 2026-09-24). Всё оформление кружка
            живёт в `FavoriteButton`, у константы `OVERLAY_CHIP`: цвет обводки
            зависит от состояния, а состояние знает только сам компонент.
            Здесь остаётся одно положение. Зона касания 44px приходит
            из `tap-target` внутри кнопки. */}
        <FavoriteButton
          target={{ kind: "service", id }}
          isFavorite={isFavorite}
          isAuthenticated={isAuthenticated}
          variant="overlay"
          className="absolute top-2 right-2 z-10"
        />
      </div>

      {/* Контент: боковых отступов нет — текст выравнивается по краям
          фотографии, а не по внутреннему полю исчезнувшей коробки. */}
      <div className="pt-3">
        {/* Отклик на наведение — подчёркивание названия и приближение
            фотографии выше. Тень и подъём убраны вместе с контейнером:
            они рисовали бы прямоугольник, которого больше нет. */}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2 group-hover:underline underline-offset-2 decoration-foreground/40">
          <Link href={`/services/${categorySlug}/${id}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        {/* Три блока: название, плотная пара фактов, цена. Отступы 8 / 4 / 8 —
            блоки разделены одинаково, внутри пары тесно.

            Сначала перед ценой стояло 12px как третья ступень шкалы 4 / 8 / 12
            (решение владельца, 2026-09-24). Замер по скриншоту в масштабе 1:1
            показал, что на экране это самый большой промежуток карточки —
            19px от букв до букв против 17px после фотографии, — и цена
            отваливалась вниз, тем более что под ней ещё 24px до следующего
            ряда сетки. Уменьшено до 8px тем же днём.

            Иконки 12px, под размер текста рядом: при 14px значок был крупнее
            подписи, которую сопровождает. */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 min-w-0">
          {isCompany ? (
            <Building2 className="h-3 w-3 flex-shrink-0" />
          ) : (
            <User className="h-3 w-3 flex-shrink-0" />
          )}
          <span className="truncate">{authorName}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>{city}</span>
        </div>

        {/* Цена — 14px medium, а не semibold: полужирная она была ровно того же
            размера и веса, что название, и на карточке получалось два
            одинаково громких заголовка. Размер оставлен 14px — на 12px цена
            встала бы в один ряд с городом и потерялась среди серых фактов.
            Владелец держит ту же линию с 2026-09-24: «цена в услугах
            примерная, увеличивать шрифт для неё не нужно». Иконка 14px под
            размер текста, как у автора и города. */}
        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
          <Wallet className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{price}</span>
        </div>
      </div>
    </article>
  );
}
