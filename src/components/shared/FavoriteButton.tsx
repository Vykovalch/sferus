"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function FavoriteButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setLiked((prev) => !prev);
      }}
      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
    >
      <Heart
        className={`h-3.5 w-3.5 transition-colors ${
          liked ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    </button>
  );
}
