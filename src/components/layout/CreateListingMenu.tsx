"use client";

import { ClipboardList, FileText, type LucideIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CreateListingOption {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Цвет иконки кодирует сторону площадки: серый — исполнитель, бренд — заказчик. */
  iconClassName: string;
}

/**
 * Что можно разместить — одно описание на выпадающее меню шапки и мобильное меню,
 * чтобы названия и пояснения не разъехались.
 *
 * «Услугу» первой — решение владельца (2026-09-17): на старте важнее наполнить
 * каталог. Иконки те же, что у «Мои услуги» и «Мои задания» в кабинете.
 * У задания — тёмная ступень бренда: яркий жёлтый на белом дал бы 1.6:1
 * при минимуме 3:1 для значимой графики.
 *
 * Гостю пункты тоже видны: страницы создания закрыты middleware и сами
 * отправляют на вход с возвратом в форму.
 */
export const CREATE_LISTING_OPTIONS: readonly CreateListingOption[] = [
  {
    href: "/services/new",
    title: "Услугу",
    description: "Расскажите, что умеете, — клиенты найдут вас",
    icon: ClipboardList,
    iconClassName: "text-secondary!",
  },
  {
    href: "/tasks/new",
    title: "Задание",
    description: "Опишите задачу — исполнители найдут вас",
    icon: FileText,
    iconClassName: "text-brand!",
  },
];

/**
 * Иконка, название и пояснение пункта.
 *
 * Цвета иконки и пояснения — с `!`: пункт выпадающего меню при наведении и фокусе
 * перекрашивает всех потомков в `accent-foreground`, и без этого цветовое деление
 * «клиент / исполнитель» пропадало бы ровно в момент выбора.
 */
export function CreateListingOptionLabel({ option }: { option: CreateListingOption }) {
  const Icon = option.icon;

  return (
    <>
      <Icon aria-hidden="true" className={cn("size-5 mt-0.5 shrink-0", option.iconClassName)} />
      <span className="flex flex-col gap-0.5 text-left">
        <span className="text-sm font-semibold text-foreground">{option.title}</span>
        <span className="text-xs leading-snug text-muted-foreground!">{option.description}</span>
      </span>
    </>
  );
}

/**
 * Кнопка «Разместить» в шапке — от 768px, для гостя и вошедшего.
 *
 * Заменила две равновесные кнопки «Создать услугу» и «Создать задание»
 * (решение владельца, 2026-09-17): одно главное действие вместо двух спорящих,
 * пояснение того, чем задание отличается от услуги, и около 160px ширины шапки.
 * Ниже 768px те же пункты — в мобильном меню.
 *
 * Кнопка контурная, а не с заливкой (решение владельца, 2026-09-17): заливка
 * цветом бренда на первом экране главной зарезервирована за «Найти» в Hero,
 * две яркие кнопки спорили бы. При наведении и пока меню открыто
 * (`aria-expanded`) — заливка; иначе вариант `outline` сделал бы открытую
 * кнопку серой.
 *
 * Рамка — яркий жёлтый заливки, текст — цвета и размера пунктов меню шапки
 * (решение владельца, 2026-09-18; было `border-primary text-primary`, 14px):
 * при наведении меняется только фон, рамка и текст остаются. Рамка на светлой
 * шапке — 1.6:1; кнопку опознают по тексту (17:1), не по рамке.
 */
export function CreateListingMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="hidden md:inline-flex h-10 gap-2 rounded-full border-brand-fill text-base text-foreground px-5 font-semibold hover:bg-brand-fill hover:text-brand-fill-foreground aria-expanded:bg-brand-fill aria-expanded:text-brand-fill-foreground transition-colors"
        >
          <Plus aria-hidden="true" className="size-4" />
          Разместить
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-1">
        {CREATE_LISTING_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.href}
            asChild
            className="cursor-pointer items-start gap-3 px-3 py-2.5"
          >
            <Link href={option.href}>
              <CreateListingOptionLabel option={option} />
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
