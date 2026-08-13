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
export const CATEGORY_STYLES: Record<string, { icon: string; bg: string }> = {
  "construction-and-renovation": { icon: "text-orange-500", bg: "bg-orange-500/10" },
  "repair-services": { icon: "text-slate-500", bg: "bg-slate-500/10" },
  "home-and-care": { icon: "text-teal-500", bg: "bg-teal-500/10" },
  auto: { icon: "text-blue-500", bg: "bg-blue-500/10" },
  digital: { icon: "text-violet-500", bg: "bg-violet-500/10" },
  "legal-and-documents": { icon: "text-indigo-500", bg: "bg-indigo-500/10" },
  "business-and-finance": { icon: "text-emerald-600", bg: "bg-emerald-600/10" },
  "photo-and-video": { icon: "text-pink-500", bg: "bg-pink-500/10" },
  events: { icon: "text-yellow-500", bg: "bg-yellow-500/10" },
  "food-and-catering": { icon: "text-amber-500", bg: "bg-amber-500/10" },
  medical: { icon: "text-red-500", bg: "bg-red-500/10" },
  "beauty-and-wellness": { icon: "text-rose-500", bg: "bg-rose-500/10" },
  education: { icon: "text-cyan-500", bg: "bg-cyan-500/10" },
  pets: { icon: "text-lime-600", bg: "bg-lime-600/10" },
  "real-estate": { icon: "text-sky-600", bg: "bg-sky-600/10" },
  "transport-and-delivery": { icon: "text-blue-600", bg: "bg-blue-600/10" },
  security: { icon: "text-zinc-600", bg: "bg-zinc-600/10" },
  production: { icon: "text-stone-500", bg: "bg-stone-500/10" },
  "agro-and-landscaping": { icon: "text-green-600", bg: "bg-green-600/10" },
  funeral: { icon: "text-purple-400", bg: "bg-purple-400/10" },
};

const NEUTRAL_STYLE = { icon: "text-muted-foreground", bg: "bg-muted" };

/** Цвета по слагу. Неизвестная категория получает нейтральный вид, а не падает. */
export function categoryStyle(slug: string) {
  return CATEGORY_STYLES[slug] ?? NEUTRAL_STYLE;
}

/** Значение фильтра «все города» / «все категории» — не выбранный вариант. */
export const ALL_OPTION = "all";
