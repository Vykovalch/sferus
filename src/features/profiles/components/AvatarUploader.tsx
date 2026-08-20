"use client";

import { upload } from "@vercel/blob/client";
import { Camera } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateAvatar } from "@/features/profiles/actions";
import { type ActionState, idleState } from "@/lib/action-state";
import { compressAvatar, IMAGE_UPLOAD } from "@/lib/images";

interface AvatarUploaderProps {
  userName: string;
  userEmail: string;
  /** Текущий аватар из сессии: `user.image`. */
  imageUrl: string | null;
}

/**
 * Загрузка и удаление аватара.
 *
 * Файл идёт в хранилище напрямую тем же эндпоинтом, что и фотографии
 * объявлений, а действие лишь записывает адрес в `user.image`. Отправка
 * формы вызывается из кода сразу после загрузки: отдельная кнопка
 * «Сохранить» здесь была бы лишним шагом — выбор файла и есть намерение.
 */
export function AvatarUploader({ userName, userEmail, imageUrl }: AvatarUploaderProps) {
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    updateAvatar,
    idleState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Пока страница не перерисовалась после сохранения, показываем то,
  // что человек только что выбрал.
  const [preview, setPreview] = useState<string | null>(imageUrl);

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function submitWith(url: string) {
    if (!urlInputRef.current || !formRef.current) return;
    urlInputRef.current.value = url;
    formRef.current.requestSubmit();
  }

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    setError(null);

    if (file.size > IMAGE_UPLOAD.maxBytes) {
      setError("Файл больше 10 МБ — выберите фотографию поменьше");
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressAvatar(file);
      const blob = await upload(compressed.name, compressed, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setPreview(blob.url);
      submitWith(blob.url);
    } catch {
      setError("Не удалось загрузить фотографию. Попробуйте ещё раз");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    // Пустая строка означает «убрать» — тот же приём, что у контактов.
    submitWith("");
  }

  const busy = uploading || pending;
  const errorMessage = error ?? (state.status === "error" ? state.message : null);

  return (
    <div className="flex items-center gap-4">
      <form ref={formRef} action={formAction} className="contents">
        <input ref={urlInputRef} type="hidden" name="imageUrl" defaultValue="" />

        <label
          className={`relative cursor-pointer ${busy ? "pointer-events-none opacity-60" : ""}`}
          aria-label="Изменить фотографию профиля"
        >
          <Avatar className="w-16 h-16">
            <AvatarImage src={preview ?? undefined} alt={userName} />
            <AvatarFallback className="text-xl font-bold bg-brand/10 text-brand">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand flex items-center justify-center">
            <Camera className="h-3 w-3 text-white" />
          </span>
          <input
            type="file"
            accept={IMAGE_UPLOAD.allowedTypes.join(",")}
            onChange={handleSelect}
            disabled={busy}
            className="hidden"
          />
        </label>
      </form>

      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{userName}</p>
        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>

        {errorMessage ? (
          <p role="alert" className="text-xs text-destructive mt-1">
            {errorMessage}
          </p>
        ) : busy ? (
          <p className="text-xs text-muted-foreground mt-1">Сохраняем фотографию…</p>
        ) : (
          preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer mt-1"
            >
              Удалить фотографию
            </button>
          )
        )}
      </div>
    </div>
  );
}
