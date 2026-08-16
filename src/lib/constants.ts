import {
  Briefcase,
  Building,
  Camera,
  Car,
  Factory,
  Flower,
  GraduationCap,
  Hammer,
  Heart,
  Home,
  type LucideIcon,
  Monitor,
  PartyPopper,
  PawPrint,
  Scale,
  Shield,
  Sprout,
  Stethoscope,
  Truck,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

/**
 * Статусы задания. Значения совпадают с pg-enum `task_status`.
 * `in_progress` в v1 нет намеренно: он подразумевает известного исполнителя,
 * а связи задания с исполнителем без откликов не существует.
 */
export const TASK_STATUSES = {
  open: "Открыто",
  completed: "Завершено",
  cancelled: "Отменено",
} as const;

export type TaskStatus = keyof typeof TASK_STATUSES;

/**
 * Иконки категорий: имя из `categories.icon` → компонент lucide.
 *
 * Карта явная, а не `import * as Icons` с обращением по ключу: динамическое
 * обращение ломает tree-shaking и затягивает в бандл всю библиотеку целиком.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Hammer,
  Wrench,
  Home,
  Car,
  Monitor,
  Scale,
  Briefcase,
  Camera,
  PartyPopper,
  UtensilsCrossed,
  Stethoscope,
  Heart,
  GraduationCap,
  PawPrint,
  Building,
  Truck,
  Shield,
  Factory,
  Sprout,
  Flower,
};

/** Иконка по имени из БД. Подставляет запасную, если имя неизвестно. */
export function categoryIcon(name: string | null): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || Hammer;
}

/**
 * Цвета иконок категорий: slug → классы Tailwind.
 *
 * Цвет — часть дизайн-системы, а не бизнес-данные, поэтому живёт в коде:
 * смена палитры при редизайне не должна быть миграцией БД. К тому же Tailwind
 * собирает CSS сканированием исходников — класс, приехавший строкой из базы,
 * в бандл просто не попадёт.
 *
 * ОГРАНИЧЕНИЕ: новая категория, добавленная в обход этой карты, отрисуется
 * нейтральным цветом. Пока категории статичны, это приемлемо.
 * Переходить на токен в колонке `categories.color` + фиксированную палитру
 * здесь стоит тогда, когда появится управление категориями из админки.
 */
export const CATEGORY_STYLES: Record<string, { icon: string }> = {
  "construction-and-renovation": { icon: "text-orange-500" },
  "repair-services": { icon: "text-slate-500" },
  "home-and-care": { icon: "text-teal-500" },
  auto: { icon: "text-blue-500" },
  digital: { icon: "text-violet-500" },
  "legal-and-documents": { icon: "text-indigo-500" },
  "business-and-finance": { icon: "text-emerald-600" },
  "photo-and-video": { icon: "text-pink-500" },
  events: { icon: "text-yellow-500" },
  "food-and-catering": { icon: "text-amber-500" },
  medical: { icon: "text-red-500" },
  "beauty-and-wellness": { icon: "text-rose-500" },
  education: { icon: "text-cyan-500" },
  pets: { icon: "text-lime-600" },
  "real-estate": { icon: "text-sky-600" },
  "transport-and-delivery": { icon: "text-blue-600" },
  security: { icon: "text-zinc-600" },
  production: { icon: "text-stone-500" },
  "agro-and-landscaping": { icon: "text-green-600" },
  funeral: { icon: "text-purple-400" },
};

const NEUTRAL_STYLE = { icon: "text-muted-foreground" };

/** Цвета по слагу. Неизвестная категория получает нейтральный вид, а не падает. */
export function categoryStyle(slug: string) {
  return CATEGORY_STYLES[slug] ?? NEUTRAL_STYLE;
}

/** Значение фильтра «все города» / «все категории» — не выбранный вариант. */
export const ALL_OPTION = "all";
