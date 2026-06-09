"use client";

import * as React from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cities = [
  { id: 1, name: "Тирасполь" },
  { id: 2, name: "Бендеры" },
  { id: 3, name: "Рыбница" },
  { id: 4, name: "Дубоссары" },
  { id: 5, name: "Григориополь" },
  { id: 6, name: "Каменка" },
  { id: 7, name: "Слободзея" },
  { id: 8, name: "Днестровск" },
];

export function CityDropdown() {
  // В реальном проекте 2026 года здесь может быть стейт из URL или Cookie
  const [currentCity, setCurrentCity] = React.useState(cities[0].name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 px-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0"
        >
          {/* Иконка из макета image_d01e5c.png */}
          <MapPin className="h-4 w-4" />
          <span className="text-base font-medium">{currentCity}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        {cities.map((city) => (
          <DropdownMenuItem
            key={city.id}
            onClick={() => setCurrentCity(city.name)}
            className="cursor-pointer text-base py-2 font-medium text-foreground"
          >
            {city.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}