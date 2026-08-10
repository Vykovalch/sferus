"use client";

import { useState } from "react";
import { Phone, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChannelConfig {
  key: "phone" | "whatsapp" | "telegram" | "viber";
  label: string;
  icon: typeof Phone;
  placeholder: string;
  type: "tel" | "text";
}

const CHANNELS: ChannelConfig[] = [
  { key: "phone", label: "Телефон", icon: Phone, placeholder: "+373 ...", type: "tel" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "+373 ...", type: "tel" },
  { key: "telegram", label: "Telegram", icon: Send, placeholder: "@username", type: "text" },
  { key: "viber", label: "Viber", icon: Phone, placeholder: "+373 ...", type: "tel" },
];

interface ContactValues {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
}

interface ContactSettingsFormProps {
  initialValues?: ContactValues;
}

export function ContactSettingsForm({ initialValues }: ContactSettingsFormProps) {
  const [enabled, setEnabled] = useState<Record<ChannelConfig["key"], boolean>>({
    phone: Boolean(initialValues?.phone),
    whatsapp: Boolean(initialValues?.whatsapp),
    telegram: Boolean(initialValues?.telegram),
    viber: Boolean(initialValues?.viber),
  });
  const [values, setValues] = useState<ContactValues>({
    phone: initialValues?.phone ?? "",
    whatsapp: initialValues?.whatsapp ?? "",
    telegram: initialValues?.telegram ?? "",
    viber: initialValues?.viber ?? "",
  });

  function toggleChannel(key: ChannelConfig["key"], checked: boolean) {
    setEnabled((prev) => ({ ...prev, [key]: checked }));
  }

  function setValue(key: ChannelConfig["key"], value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: заменить на Server Action при подключении БД
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-muted-foreground -mt-1">
        Клиенты увидят только включённые контакты при нажатии «Показать контакты» на ваших объявлениях
      </p>

      <div className="space-y-3">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const isEnabled = enabled[channel.key];
          return (
            <div key={channel.key} className="flex items-start gap-3">
              <label className="flex items-center gap-2 pt-2 w-32 flex-shrink-0 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => toggleChannel(channel.key, e.target.checked)}
                  className="h-4 w-4 rounded border-input text-brand accent-brand cursor-pointer"
                />
                <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground">{channel.label}</span>
              </label>
              <div className="flex-1 min-w-0">
                <Input
                  type={channel.type}
                  value={values[channel.key] ?? ""}
                  onChange={(e) => setValue(channel.key, e.target.value)}
                  disabled={!isEnabled}
                  placeholder={channel.placeholder}
                  className="border-input focus-visible:ring-brand disabled:opacity-40"
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="submit"
        className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
      >
        Сохранить контакты
      </Button>
    </form>
  );
}
