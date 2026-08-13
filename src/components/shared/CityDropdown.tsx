"use client";

import { ChevronDown, MapPin } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CityOption } from "@/features/cities/queries";

const ALL_CITIES = "Все города";

interface CityDropdownProps {
  /** Города из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
}

export function CityDropdown({ cities }: CityDropdownProps) {
  const [currentCity, setCurrentCity] = React.useState(ALL_CITIES);

  const options = [ALL_CITIES, ...cities.map((c) => c.name)];

  return (
    <>
      <input type="hidden" name="city" value={currentCity} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 px-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-0"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-base font-medium">{currentCity}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="min-w-[calc(var(--radix-dropdown-menu-trigger-width)+2rem)]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {options.map((name) => (
            <DropdownMenuItem
              key={name}
              onClick={() => setCurrentCity(name)}
              className="cursor-pointer text-base py-2 font-medium text-foreground"
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
