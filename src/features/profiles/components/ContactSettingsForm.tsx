"use client";

import { Phone, Send } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateContacts } from "@/features/profiles/actions";
import type { ContactFormValues } from "@/features/profiles/schemas";
import { type ActionState, idleState } from "@/lib/action-state";

interface ContactSettingsFormProps {
  initialValues: ContactFormValues;
}

interface VisibilityCheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Галочка видимости канала. Значение уходит в FormData как "on" — невыбранная
 * не отправляется вовсе, и схема разбирает это как `false`.
 */
function VisibilityCheckbox({ name, label, checked, onChange }: VisibilityCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input text-brand accent-brand cursor-pointer"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

/**
 * Настройка контактов для клиентов.
 *
 * Один номер телефона на три канала: звонки, WhatsApp и Viber работают по
 * одному и тому же номеру, поэтому вводится он один раз, а галочки говорят,
 * каким способом с человеком можно связаться. Telegram отдельным полем —
 * там обычно имя пользователя, а не номер.
 *
 * Галочка прячет контакт, но не стирает его: снятая видимость сохраняет
 * значение в базе, и вернуть показ можно не набирая номер заново.
 */
export function ContactSettingsForm({ initialValues }: ContactSettingsFormProps) {
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    updateContacts,
    idleState,
  );

  const [phone, setPhone] = useState(initialValues.phone);
  const [phoneVisible, setPhoneVisible] = useState(initialValues.phoneVisible);
  const [whatsappVisible, setWhatsappVisible] = useState(initialValues.whatsappVisible);
  const [viberVisible, setViberVisible] = useState(initialValues.viberVisible);
  const [telegram, setTelegram] = useState(initialValues.telegram);
  const [telegramVisible, setTelegramVisible] = useState(initialValues.telegramVisible);

  const errorMessage = state.status === "error" ? state.message : null;
  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  const hasPhone = phone.trim().length > 0;
  const hasTelegram = telegram.trim().length > 0;
  const phoneHidden = hasPhone && !phoneVisible && !whatsappVisible && !viberVisible;

  return (
    <form action={formAction} className="space-y-5">
      <p className="text-xs text-muted-foreground -mt-1">
        Клиенты увидят отмеченные контакты по кнопке «Показать контакты» на ваших объявлениях
      </p>

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
          Контакты сохранены
        </output>
      )}

      {/* Телефон и мессенджеры на нём */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          Телефон
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+373 777 12345"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={64}
          aria-invalid={Boolean(fieldError("phone"))}
          className="border-input focus-visible:ring-brand"
        />
        {fieldError("phone") && <p className="text-xs text-destructive">{fieldError("phone")}</p>}

        <fieldset disabled={!hasPhone} className="disabled:opacity-40 pt-1">
          <legend className="text-xs text-muted-foreground mb-2">
            Как с вами связаться по этому номеру
          </legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <VisibilityCheckbox
              name="phoneVisible"
              label="Звонки"
              checked={phoneVisible}
              onChange={setPhoneVisible}
            />
            <VisibilityCheckbox
              name="whatsappVisible"
              label="WhatsApp"
              checked={whatsappVisible}
              onChange={setWhatsappVisible}
            />
            <VisibilityCheckbox
              name="viberVisible"
              label="Viber"
              checked={viberVisible}
              onChange={setViberVisible}
            />
          </div>
        </fieldset>

        {phoneHidden && (
          <p className="text-xs text-muted-foreground">Номер сохранён, но клиенты его не увидят</p>
        )}
      </div>

      {/* Telegram */}
      <div className="space-y-2">
        <Label
          htmlFor="telegram"
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Send className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          Telegram
        </Label>
        <Input
          id="telegram"
          name="telegram"
          type="text"
          placeholder="@username"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          maxLength={64}
          aria-invalid={Boolean(fieldError("telegram"))}
          className="border-input focus-visible:ring-brand"
        />
        {fieldError("telegram") && (
          <p className="text-xs text-destructive">{fieldError("telegram")}</p>
        )}

        <fieldset disabled={!hasTelegram} className="disabled:opacity-40 pt-1">
          <VisibilityCheckbox
            name="telegramVisible"
            label="Показывать клиентам"
            checked={telegramVisible}
            onChange={setTelegramVisible}
          />
        </fieldset>

        {hasTelegram && !telegramVisible && (
          <p className="text-xs text-muted-foreground">
            Telegram сохранён, но клиенты его не увидят
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
      >
        {pending ? "Сохранение…" : "Сохранить контакты"}
      </Button>
    </form>
  );
}
