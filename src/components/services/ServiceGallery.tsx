"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

export function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  if (images.length === 0) {
    return (
      <div className="w-full h-52 bg-gradient-to-br from-[#0d7a5f]/6 to-[#0d7a5f]/3 rounded-xl flex items-center justify-center">
        <span className="text-7xl font-bold text-[#0d7a5f]/15 select-none">{title.charAt(0)}</span>
      </div>
    );
  }

  return (
    <>
      {/* Галерея */}
      <div className="flex gap-2">
        {/* Главное фото */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="relative flex-1 h-52 rounded-xl overflow-hidden cursor-zoom-in group"
        >
          <Image
            src={images[0]}
            alt={`${title} — фото 1`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
              1 / {images.length}
            </div>
          )}
        </button>

        {/* Миниатюры */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2 w-28">
            {images.slice(1, 3).map((img, index) => (
              <button
                key={img}
                type="button"
                onClick={() => openLightbox(index + 1)}
                className="relative h-[calc(104px-4px)] rounded-xl overflow-hidden cursor-zoom-in group flex-1"
              >
                <Image
                  src={img}
                  alt={`${title} — фото ${index + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Оверлей если фото больше 3 */}
                {index === 1 && images.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-base font-semibold">+{images.length - 3}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Лайтбокс */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото"
          tabIndex={-1}
        >
          {/* Закрыть */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Счётчик */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Навигация */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Следующее фото"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Фото */}
          <div className="relative max-w-4xl max-h-[80vh] w-full mx-16">
            <Image
              src={images[lightboxIndex]}
              alt={`${title} — фото ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
