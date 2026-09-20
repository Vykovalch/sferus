/**
 * Иконки категорий.
 *
 * Отдельный модуль, а не часть `constants.ts`: константы оттуда импортирует
 * клиентский `SearchBar`, и карта иконок уезжала вместе с ними в браузер —
 * 20 иконок Phosphor со всеми начертаниями, около 80 КБ, которые клиенту
 * не нужны вовсе. Здесь их читают только серверные компоненты.
 */
import type { Icon } from "@phosphor-icons/react";
// Поштучные импорты из `dist/ssr`, а не из общего входа пакета. Причины две.
// `dist/ssr` — версия без React-контекста: она работает в серверных
// компонентах, обычная требует `use client`. Поштучно — потому что общий вход
// это бочка из полутора тысяч модулей, и `@phosphor-icons/react` нет в списке
// пакетов, которые Next разбирает сам (`optimizePackageImports`).
import { BroomIcon } from "@phosphor-icons/react/dist/ssr/Broom";
import { BuildingsIcon } from "@phosphor-icons/react/dist/ssr/Buildings";
import { CameraIcon } from "@phosphor-icons/react/dist/ssr/Camera";
import { CarIcon } from "@phosphor-icons/react/dist/ssr/Car";
import { ChartLineUpIcon } from "@phosphor-icons/react/dist/ssr/ChartLineUp";
import { ChefHatIcon } from "@phosphor-icons/react/dist/ssr/ChefHat";
import { ConfettiIcon } from "@phosphor-icons/react/dist/ssr/Confetti";
import { FactoryIcon } from "@phosphor-icons/react/dist/ssr/Factory";
import { FirstAidKitIcon } from "@phosphor-icons/react/dist/ssr/FirstAidKit";
import { FlowerIcon } from "@phosphor-icons/react/dist/ssr/Flower";
import { GavelIcon } from "@phosphor-icons/react/dist/ssr/Gavel";
import { GraduationCapIcon } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { HardHatIcon } from "@phosphor-icons/react/dist/ssr/HardHat";
import { HeartbeatIcon } from "@phosphor-icons/react/dist/ssr/Heartbeat";
import { LaptopIcon } from "@phosphor-icons/react/dist/ssr/Laptop";
import { PawPrintIcon } from "@phosphor-icons/react/dist/ssr/PawPrint";
import { PlantIcon } from "@phosphor-icons/react/dist/ssr/Plant";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { TruckIcon } from "@phosphor-icons/react/dist/ssr/Truck";
import { WrenchIcon } from "@phosphor-icons/react/dist/ssr/Wrench";

/**
 * Иконки категорий: slug → компонент Phosphor.
 *
 * Ключ — слаг, а не имя из `categories.icon`: образ, как и цвет, это решение
 * дизайн-системы, и меняться он должен правкой кода, а не миграцией общей
 * с боевой базы. Колонка `categories.icon` осталась в БД от прежней схемы
 * и на фронте больше не используется.
 *
 * Карта явная, а не `import * as Icons` с обращением по ключу: динамическое
 * обращение ломает tree-shaking и затягивает в бандл всю библиотеку целиком.
 *
 * Образы выбраны конкретные: пока цвет различал категории, годились общие
 * символы (молоток на «Строительстве» и он же запасной, портфель на
 * «Бизнесе»). Стиль теперь один на все двадцать, и отличать их приходится
 * форме — поэтому метла, а не дом, каска, а не молоток.
 */
export const CATEGORY_ICONS: Record<string, Icon> = {
  "construction-and-renovation": HardHatIcon,
  "repair-services": WrenchIcon,
  "home-and-care": BroomIcon,
  auto: CarIcon,
  digital: LaptopIcon,
  "legal-and-documents": GavelIcon,
  "business-and-finance": ChartLineUpIcon,
  "photo-and-video": CameraIcon,
  events: ConfettiIcon,
  "food-and-catering": ChefHatIcon,
  medical: FirstAidKitIcon,
  "beauty-and-wellness": HeartbeatIcon,
  education: GraduationCapIcon,
  pets: PawPrintIcon,
  "real-estate": BuildingsIcon,
  "transport-and-delivery": TruckIcon,
  security: ShieldCheckIcon,
  production: FactoryIcon,
  "agro-and-landscaping": PlantIcon,
  funeral: FlowerIcon,
};

/**
 * Иконка по слагу категории.
 *
 * ОГРАНИЧЕНИЕ: категория, добавленная в обход этой карты, получит нейтральный
 * ярлык вместо своего образа. Пока категории статичны, это приемлемо; когда
 * появится управление ими из админки, выбор иконки переедет в админку.
 */
export function categoryIcon(slug: string): Icon {
  return CATEGORY_ICONS[slug] ?? TagIcon;
}
