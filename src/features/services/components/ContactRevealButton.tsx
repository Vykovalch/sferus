"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
}

interface ContactRevealButtonProps {
  contacts: ContactInfo;
  isAuthenticated: boolean;
  loginCallbackUrl: string;
  className?: string;
}

export function ContactRevealButton({
  contacts,
  isAuthenticated,
  loginCallbackUrl,
  className,
}: ContactRevealButtonProps) {
  const [open, setOpen] = useState(false);
  const hasAnyContact = Boolean(contacts.phone || contacts.whatsapp || contacts.telegram || contacts.viber);

  if (!isAuthenticated) {
    return (
      <Button asChild className={className}>
        <Link href={`/login?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`}>Показать контакты</Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>Показать контакты</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Свяжитесь напрямую</DialogTitle>
          <DialogDescription>Исполнитель указал следующие способы связи</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {contacts.phone && (
            <a
              href={`tel:${contacts.phone}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors"
            >
              <Phone className="h-4 w-4 text-brand flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{contacts.phone}</span>
            </a>
          )}

          {contacts.whatsapp && (
            <a
              href={`https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-brand flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">WhatsApp: {contacts.whatsapp}</span>
            </a>
          )}

          {contacts.telegram && (
            <a
              href={`https://t.me/${contacts.telegram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors"
            >
              <Send className="h-4 w-4 text-brand flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Telegram: @{contacts.telegram.replace(/^@/, "")}
              </span>
            </a>
          )}

          {contacts.viber && (
            <a
              href={`viber://chat?number=${encodeURIComponent(contacts.viber.replace(/\D/g, ""))}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors"
            >
              <Phone className="h-4 w-4 text-brand flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">Viber: {contacts.viber}</span>
            </a>
          )}

          {!hasAnyContact && (
            <p className="text-sm text-muted-foreground">Исполнитель не указал способы связи</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
