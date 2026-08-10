"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RespondButtonProps {
  taskId: number;
  className?: string;
}

export function RespondButton({ taskId, className }: RespondButtonProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: отправить отклик через Server Action
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        // Изменено: Используем семантический цвет бренда и добавляем cursor-pointer
        className={`bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors ${className ?? ""}`}
      >
        Откликнуться на задание
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        {/* Изменено: Заменено на компонент Label с адаптивным цветом */}
        <Label htmlFor="price" className="block text-xs font-medium text-foreground mb-1.5">
          Ваша цена (руб.)
        </Label>
        {/* Изменено: Заменено на компонент Input из ui-кита */}
        <Input
          id="price"
          type="number"
          placeholder="например 500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border-input focus-visible:ring-brand"
        />
      </div>
      <div>
        <Label htmlFor="text" className="block text-xs font-medium text-foreground mb-1.5">
          Сообщение заказчику
        </Label>
        {/* Изменено: Стилизовано под глобальные токены темы */}
        <textarea
          id="text"
          placeholder="Расскажите почему вы подходите для этого задания..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 text-sm bg-background text-foreground border border-input rounded-md focus-visible:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground shadow font-medium cursor-pointer transition-colors"
        >
          {loading ? "Отправка..." : "Отправить отклик"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer transition-colors"
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
