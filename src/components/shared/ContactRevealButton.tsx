"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { revealServiceContacts, revealTaskContacts } from "@/features/profiles/actions";
import type { VisibleContact } from "@/features/profiles/queries";

interface ContactRevealButtonProps {
  /**
   * Какое серверное действие вызвать раскрытием. Не функция-колбэк: Server
   * Component не может передать произвольную стрелочную функцию клиентскому
   * компоненту через границу сервер/клиент — сериализуется только прямая
   * ссылка на `'use server'` функцию. Поэтому здесь дискриминант + id,
   * а сами действия импортируются внутри клиентского компонента.
   */
  target: { kind: "service"; id: number } | { kind: "task"; id: number };
  isAuthenticated: boolean;
  loginCallbackUrl: string;
  className?: string;
}

/** Как показать канал связи: иконка, подпись, ссылка. */
const CHANNELS = {
  phone: {
    icon: Phone,
    label: (value: string) => value,
    href: (value: string) => `tel:${value}`,
    external: false,
  },
  whatsapp: {
    icon: MessageCircle,
    label: (value: string) => `WhatsApp: ${value}`,
    href: (value: string) => `https://wa.me/${value.replace(/\D/g, "")}`,
    external: true,
  },
  telegram: {
    icon: Send,
    label: (value: string) => `Telegram: @${value.replace(/^@/, "")}`,
    href: (value: string) => `https://t.me/${value.replace(/^@/, "")}`,
    external: true,
  },
  viber: {
    icon: Phone,
    label: (value: string) => `Viber: ${value}`,
    href: (value: string) => `viber://chat?number=${encodeURIComponent(value.replace(/\D/g, ""))}`,
    external: false,
  },
} as const;

/**
 * Контакты не приходят пропсами и не лежат в разметке страницы: они
 * запрашиваются с сервера по нажатию, после проверки сессии.
 * Иначе их можно было бы прочитать в исходном коде, не нажимая кнопку.
 *
 * Общий для услуг и заданий — какое именно действие вызвать, решает вызывающая
 * страница через `reveal`, сама кнопка не знает про конкретную сущность.
 */
export function ContactRevealButton({
  target,
  isAuthenticated,
  loginCallbackUrl,
  className,
}: ContactRevealButtonProps) {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<VisibleContact[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <Button asChild className={className}>
        <Link href={`/login?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`}>
          Показать контакты
        </Link>
      </Button>
    );
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next || contacts !== null) return;

    startTransition(async () => {
      const result =
        target.kind === "service"
          ? await revealServiceContacts(target.id)
          : await revealTaskContacts(target.id);
      if (result.status === "ok") {
        setContacts(result.contacts);
        setError(null);
      } else {
        setError(
          result.status === "unauthorized"
            ? "Войдите в аккаунт, чтобы увидеть контакты"
            : "Не удалось получить контакты",
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={className}>Показать контакты</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Свяжитесь напрямую</DialogTitle>
          <DialogDescription>Указаны следующие способы связи</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {pending && <p className="text-sm text-muted-foreground">Загружаем контакты...</p>}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {contacts?.map((contact) => {
            const channel = CHANNELS[contact.channel];
            const Icon = channel.icon;
            const externalProps = channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <a
                key={contact.channel}
                href={channel.href(contact.value)}
                {...externalProps}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors"
              >
                <Icon className="h-4 w-4 text-brand flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {channel.label(contact.value)}
                </span>
              </a>
            );
          })}

          {contacts?.length === 0 && (
            <p className="text-sm text-muted-foreground">Контакты не указаны</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
