"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
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

/**
 * Форма задания.
 *
 * **Одна карточка без секционных заголовков** (2026-09-30). До этого поля были
 * разложены по трём обрамлённым секциям — «Основная информация», «Категория
 * и местоположение», «Бюджет», — в каждой по одному-два поля, а заголовок
 * «Бюджет» стоял прямо над подписью «Бюджет». Рубрикация в форме начинает
 * работать от семи-восьми полей; здесь их пять.
 *
 * Порядок полей не менялся: содержание → классификация → деньги. Деньги идут
 * последними намеренно — это самый трудный вопрос, и его задают, когда человек
 * уже вложился в заполнение.
 */
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

      {/* Плашка отказа — над карточкой: она относится ко всей форме.
          Вид тот же, что в форме услуги. */}
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
              Заголовок задания
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Кратко опишите, что нужно сделать"
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
                свои отступы и никакого состояния ошибки. `rows` оставлен
                для браузеров без `field-sizing`, `min-h-32` держит ту же
                высоту в пять строк, `resize-y` позволяет растянуть. */}
            <Textarea
              id="description"
              name="description"
              placeholder="Подробно опишите задание: что нужно сделать, какой результат ожидаете, есть ли особые требования..."
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
                Подробное описание привлечёт больше подходящих исполнителей
              </p>
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

          <div>
            <Label htmlFor="budget" className="text-sm font-medium text-foreground mb-1.5 block">
              Бюджет
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
              />
              <span className="text-sm text-muted-foreground flex-shrink-0">руб.</span>
            </div>
            <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none w-fit">
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
      </div>
    </form>
  );
}
