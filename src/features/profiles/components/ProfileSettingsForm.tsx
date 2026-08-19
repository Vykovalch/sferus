"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CityOption } from "@/features/cities/queries";
import { updateProfile } from "@/features/profiles/actions";
import { PROFILE_TYPE_LABELS } from "@/features/profiles/schemas";
import { type ActionState, idleState } from "@/lib/action-state";

export interface ProfileFormValues {
  type: "individual" | "company";
  cityId: number | null;
  bio: string | null;
  experienceYears: number | null;
}

interface ProfileSettingsFormProps {
  /** Имя и email приходят из сессии: они живут в таблице better-auth. */
  userName: string;
  userEmail: string;
  cities: CityOption[];
  initialValues: ProfileFormValues;
}

const PROFILE_TYPES = Object.keys(PROFILE_TYPE_LABELS) as (keyof typeof PROFILE_TYPE_LABELS)[];

/**
 * Форма профиля.
 *
 * Email показывается, но не редактируется: его смена — отдельный сценарий
 * с подтверждением по почте. Поле помечено `readOnly` и в схему действия
 * не входит вовсе.
 *
 * Правовая форма (`type`) появляется в интерфейсе впервые: до сих пор колонка
 * оставалась со значением по умолчанию, из-за чего фильтр «Исполнитель»
 * в каталоге не мог ничего отфильтровать, а бейдж «Компания» не показывался
 * никому.
 */
export function ProfileSettingsForm({
  userName,
  userEmail,
  cities,
  initialValues,
}: ProfileSettingsFormProps) {
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    updateProfile,
    idleState,
  );

  const [name, setName] = useState(userName);
  const [type, setType] = useState(initialValues.type);
  const [cityId, setCityId] = useState(initialValues.cityId ? String(initialValues.cityId) : "");
  const [experienceYears, setExperienceYears] = useState(
    initialValues.experienceYears === null ? "" : String(initialValues.experienceYears),
  );
  const [bio, setBio] = useState(initialValues.bio ?? "");

  const errorMessage = state.status === "error" ? state.message : null;
  const fieldError = (field: string) =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {errorMessage}
        </div>
      )}

      {state.status === "success" && (
        <output className="block p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-foreground text-sm">
          Профиль сохранён
        </output>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Имя и фамилия</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(fieldError("name"))}
        />
        {fieldError("name") ? (
          <p className="text-xs text-destructive">{fieldError("name")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Это имя видят клиенты в ваших объявлениях</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={userEmail}
          readOnly
          className="bg-muted text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Email используется для входа и меняется отдельно
        </p>
      </div>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium text-foreground mb-1.5">Тип профиля</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {PROFILE_TYPES.map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="h-4 w-4 border-input text-brand accent-brand cursor-pointer"
              />
              <span className="text-sm text-foreground">{PROFILE_TYPE_LABELS[value]}</span>
            </label>
          ))}
        </div>
        {fieldError("type") ? (
          <p className="text-xs text-destructive">{fieldError("type")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            По нему клиенты фильтруют исполнителей в каталоге
          </p>
        )}
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="cityId">Город</Label>
        <select
          id="cityId"
          name="cityId"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          aria-invalid={Boolean(fieldError("cityId"))}
          className="w-full h-9 px-3 py-1 text-sm bg-background text-foreground border border-input rounded-md focus:outline-none focus:border-brand transition-colors cursor-pointer"
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {fieldError("cityId") && <p className="text-xs text-destructive">{fieldError("cityId")}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="experienceYears">Опыт работы, лет</Label>
        <Input
          id="experienceYears"
          name="experienceYears"
          type="number"
          inputMode="numeric"
          min={0}
          max={80}
          step={1}
          placeholder="Не указан"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          aria-invalid={Boolean(fieldError("experienceYears"))}
        />
        {fieldError("experienceYears") ? (
          <p className="text-xs text-destructive">{fieldError("experienceYears")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Показывается в объявлениях. Оставьте пустым, если не хотите указывать
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">О себе</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={1000}
          placeholder="Расскажите о себе, опыте, специализации..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          aria-invalid={Boolean(fieldError("bio"))}
          className="w-full px-3 py-2 text-sm bg-background text-foreground border border-input rounded-md focus:outline-none focus:border-brand placeholder:text-muted-foreground resize-none transition-colors"
        />
        {fieldError("bio") ? (
          <p className="text-xs text-destructive">{fieldError("bio")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{bio.length}/1000 символов</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
      >
        {pending ? "Сохранение…" : "Сохранить изменения"}
      </Button>
    </form>
  );
}
