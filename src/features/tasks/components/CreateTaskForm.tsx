"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryOption } from "@/features/categories/queries";
import type { CityOption } from "@/features/cities/queries";
import { createTask, updateTask } from "@/features/tasks/actions";
import { type ActionState, idleState } from "@/lib/action-state";

export interface TaskFormValues {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  cityId: number;
  budget: number | null;
  isNegotiable: boolean;
}

interface CreateTaskFormProps {
  /** Справочники приходят из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
  categories: CategoryOption[];
  mode?: "create" | "edit";
  initialValues?: TaskFormValues;
}

export function CreateTaskForm({
  cities,
  categories,
  mode = "create",
  initialValues,
}: CreateTaskFormProps) {
  const isEdit = mode === "edit";
  const cancelHref = isEdit ? "/dashboard/tasks" : "/tasks";

  const [state, formAction, pending] = useActionState<ActionState<never>, FormData>(
    isEdit ? updateTask : createTask,
    idleState,
  );

  // Поля остаются управляемыми, чтобы сброс цены при «Бюджет договорной»
  // действительно очищал поле. На отправку это не влияет — значения уходят
  // через FormData по атрибуту name.
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues ? String(initialValues.categoryId) : "");
  const [city, setCity] = useState(initialValues ? String(initialValues.cityId) : "");
  const [budget, setBudget] = useState(initialValues?.budget ? String(initialValues.budget) : "");
  const [isNegotiable, setIsNegotiable] = useState(initialValues?.isNegotiable ?? false);

  const errorMessage = state.status === "error" ? state.message : null;
  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  // Поля, у которых есть собственная подсказка под инпутом. Ошибки всех
  // остальных показываем в общей плашке — иначе форма отказывает молча.
  const shownInline = new Set(["title", "description", "categoryId", "cityId", "budget"]);
  const unmappedErrors =
    state.status === "error"
      ? Object.entries(state.fieldErrors ?? {})
          .filter(([field, messages]) => !shownInline.has(field) && messages?.length)
          .flatMap(([, messages]) => messages ?? [])
      : [];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && initialValues && <input type="hidden" name="id" value={initialValues.id} />}

      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
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

      {/* Блок: Основная информация */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-border">
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
              minLength={10}
              maxLength={100}
              aria-invalid={Boolean(fieldError("title"))}
              className="border-input"
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
              Описание <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              name="description"
              placeholder="Подробно опишите задание: что нужно сделать, какой результат ожидаете, есть ли особые требования..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={20}
              rows={5}
              aria-invalid={Boolean(fieldError("description"))}
              className="w-full px-3 py-2 text-base bg-background text-foreground border border-input rounded-md focus-visible:outline-none focus-visible:border-state/60 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
            />
            {fieldError("description") ? (
              <p className="text-xs text-destructive mt-1">{fieldError("description")}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Подробное описание привлечёт больше подходящих исполнителей
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Блок: Категория и город */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-border">
          Категория и местоположение
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="categoryId"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Категория <span className="text-destructive">*</span>
            </Label>
            <select
              id="categoryId"
              name="categoryId"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              aria-invalid={Boolean(fieldError("categoryId"))}
              className="w-full h-10 px-3 py-1 text-base bg-background text-foreground border border-input rounded-md focus-visible:outline-none focus-visible:border-state/60 disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer"
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
            {fieldError("categoryId") && (
              <p className="text-xs text-destructive mt-1">{fieldError("categoryId")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cityId" className="text-sm font-medium text-foreground mb-1.5 block">
              Город <span className="text-destructive">*</span>
            </Label>
            <select
              id="cityId"
              name="cityId"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              aria-invalid={Boolean(fieldError("cityId"))}
              className="w-full h-10 px-3 py-1 text-base bg-background text-foreground border border-input rounded-md focus-visible:outline-none focus-visible:border-state/60 disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer"
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
            {fieldError("cityId") && (
              <p className="text-xs text-destructive mt-1">{fieldError("cityId")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Блок: Бюджет */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-border">
          Бюджет
        </h2>

        <div>
          <Label htmlFor="budget" className="text-sm font-medium text-foreground mb-1.5 block">
            Бюджет {!isNegotiable && <span className="text-destructive">*</span>}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="budget"
              name="budget"
              type="number"
              min={1}
              placeholder="например 500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={isNegotiable}
              required={!isNegotiable}
              aria-invalid={Boolean(fieldError("budget"))}
              className="border-input"
            />
            <span className="text-sm text-muted-foreground flex-shrink-0">руб.</span>
          </div>
          <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isNegotiable"
              checked={isNegotiable}
              onChange={(e) => {
                setIsNegotiable(e.target.checked);
                if (e.target.checked) setBudget("");
              }}
              className="h-4 w-4 rounded border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer"
            />
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Бюджет договорной
            </span>
          </label>
          {fieldError("budget") && (
            <p className="text-xs text-destructive mt-1">{fieldError("budget")}</p>
          )}
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="flex items-center gap-3 mt-2">
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
          disabled={pending}
          className="flex-1 h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground text-base font-medium cursor-pointer transition-colors"
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
    </form>
  );
}
