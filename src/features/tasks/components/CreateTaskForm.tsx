"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryOption } from "@/features/categories/queries";
import type { CityOption } from "@/features/cities/queries";

interface CreateTaskFormProps {
  /** Справочники приходят из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
  categories: CategoryOption[];
  mode?: "create" | "edit";
  initialValues?: {
    title?: string;
    description?: string;
    category?: string;
    city?: string;
    budget?: string;
    negotiable?: boolean;
    deadline?: string;
  };
}

export function CreateTaskForm({
  cities,
  categories,
  mode = "create",
  initialValues,
}: CreateTaskFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const cancelHref = isEdit ? "/dashboard/tasks" : "/tasks";
  const redirectAfterSubmit = isEdit ? "/dashboard/tasks" : "/tasks";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [city, setCity] = useState(initialValues?.city ?? "");
  const [budget, setBudget] = useState(initialValues?.budget ?? "");
  const [negotiable, setNegotiable] = useState(initialValues?.negotiable ?? false);
  const [deadline, setDeadline] = useState(initialValues?.deadline ?? "");

  const budgetDisplay = negotiable ? "Договорная" : budget ? `до ${budget} руб.` : "Не указан";

  // В форме выбираются идентификаторы, а предпросмотр показывает названия
  const categoryName = categories.find((c) => String(c.id) === category)?.name ?? "";
  const cityName = cities.find((c) => String(c.id) === city)?.name ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: заменить на Server Action
    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
    router.push(redirectAfterSubmit);
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Форма создания */}
      <form onSubmit={handleSubmit} className="flex-1 min-w-0 w-full flex flex-col gap-4">
        {/* Сообщение об ошибке */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        {/* Блок: Основная информация */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-foreground mb-4 pb-3 border-b border-border">
            Основная информация
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-foreground mb-1.5 block">
                Заголовок задания <span className="text-destructive">*</span>
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
                className="border-input focus-visible:ring-brand"
              />
              <p className="text-xs text-muted-foreground mt-1">{title.length}/100 символов</p>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Описание <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Подробно опишите задание: что нужно сделать, какой результат ожидаете, есть ли особые требования..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-input rounded-md focus-visible:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Подробное описание привлечёт больше подходящих исполнителей
              </p>
            </div>
          </div>
        </div>

        {/* Блок: Категория и город */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-foreground mb-4 pb-3 border-b border-border">
            Категория и местоположение
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="category"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Категория <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full h-9 px-3 py-1 text-sm bg-background text-foreground border border-input rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer"
              >
                <option value="" className="text-muted-foreground">
                  Выберите категорию
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="text-foreground">
                    {cat.name}
                  </option>
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
                className="w-full h-9 px-3 py-1 text-sm bg-background text-foreground border border-input rounded-md focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer"
              >
                <option value="" className="text-muted-foreground">
                  Выберите город
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id} className="text-foreground">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Блок: Бюджет и срок */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-foreground mb-4 pb-3 border-b border-border">
            Бюджет и срок
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="budget" className="text-sm font-medium text-foreground mb-1.5 block">
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
                  className="border-input focus-visible:ring-brand disabled:opacity-40"
                />
                <span className="text-sm text-muted-foreground flex-shrink-0">руб.</span>
              </div>
              <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => {
                    setNegotiable(e.target.checked);
                    if (e.target.checked) setBudget("");
                  }}
                  className="h-4 w-4 rounded border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer"
                />
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Бюджет договорной
                </span>
              </label>
            </div>

            <div>
              <Label
                htmlFor="deadline"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Срок выполнения
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="text"
                placeholder="например: 2 недели, до 1 июня"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border-input focus-visible:ring-brand"
              />
              <p className="text-xs text-muted-foreground mt-1">Необязательное поле</p>
            </div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex items-center gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
          >
            <Link href={cancelHref}>Отмена</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground shadow font-medium cursor-pointer transition-colors"
          >
            {loading
              ? isEdit
                ? "Сохранение..."
                : "Публикация..."
              : isEdit
                ? "Сохранить изменения"
                : "Опубликовать задание"}
          </Button>
        </div>
      </form>

      {/* Правая панель: Предпросмотр и Советы */}
      <div className="hidden md:block w-full md:w-56 lg:w-64 flex-shrink-0 md:sticky md:top-6">
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm space-y-4">
          {/* Виджет предпросмотра */}
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
              Предпросмотр
            </p>
            <div className="border border-border rounded-lg p-3 bg-card/40">
              <p className="text-sm font-medium text-foreground leading-snug mb-2 line-clamp-2">
                {title || "Заголовок задания"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                {description || "Описание задания появится здесь..."}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  Открыто
                </span>
                {categoryName && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {categoryName}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-sm font-bold text-brand">{budgetDisplay}</span>
                {cityName && (
                  <span className="text-xs text-muted-foreground font-medium">{cityName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Блок с подсказками */}
          <div className="bg-brand/5 border border-brand/10 rounded-lg p-3.5">
            <p className="text-xs font-medium text-brand mb-2 flex items-center gap-1">Советы</p>
            <ul className="space-y-2">
              {[
                "Укажите конкретный результат",
                "Добавьте примеры или референсы",
                "Реалистичный бюджет привлечёт больше откликов",
              ].map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-brand flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
