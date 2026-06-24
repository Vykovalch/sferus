"use client";

interface CityFilterProps {
  cities: string[];
  activeCity: string;
  onChange: (city: string) => void;
  name?: string;
}

export function CityFilter({ cities, activeCity, onChange, name = "city" }: CityFilterProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Город
        </h3>
      </div>
      <div className="py-1">
        {cities.map((city) => (
          <label
            key={city}
            className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
          >
            <input
              type="radio"
              name={name}
              value={city}
              checked={activeCity === city}
              onChange={() => onChange(city)}
              className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
            />
            <span className={`text-sm leading-snug transition-colors ${
              activeCity === city
                ? "text-brand font-medium"
                : "text-muted-foreground group-hover:text-foreground"
            }`}>
              {city}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}