import { Search } from "lucide-react";
import {
  Hammer,
  Wrench,
  Home,
  Car,
  Monitor,
  Scale,
  Briefcase,
  Camera,
  PartyPopper,
  UtensilsCrossed,
  Stethoscope,
  Heart,
  GraduationCap,
  PawPrint,
  Building,
  Truck,
  Shield,
  Factory,
  Sprout,
  Flower,
} from "lucide-react";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { CityDropdown } from "@/components/shared/CityDropdown";

const categories = [
  {
    name: "Строительство и ремонт",
    slug: "stroitelstvo-i-remont",
    icon: Hammer,
    count: 120,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    name: "Ремонт техники и оборудования",
    slug: "remont-tehniki",
    icon: Wrench,
    count: 85,
    iconColor: "text-slate-500",
    iconBg: "bg-slate-500/10",
  },
  {
    name: "Дом, быт и уход",
    slug: "dom-byt-i-uhod",
    icon: Home,
    count: 95,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
  },
  {
    name: "Автоуслуги",
    slug: "avtousligi",
    icon: Car,
    count: 60,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    name: "IT и Digital",
    slug: "it-i-digital",
    icon: Monitor,
    count: 45,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
  {
    name: "Юридические услуги и документы",
    slug: "yuridicheskie-i-dokumenty",
    icon: Scale,
    count: 38,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
  },
  {
    name: "Бизнес и финансы",
    slug: "biznes-i-finansy",
    icon: Briefcase,
    count: 42,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-600/10",
  },
  {
    name: "Фото и видео",
    slug: "foto-i-video",
    icon: Camera,
    count: 33,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    name: "Мероприятия и праздники",
    slug: "meropriyatiya-i-prazdniki",
    icon: PartyPopper,
    count: 25,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
  },
  {
    name: "Еда и кейтеринг",
    slug: "eda-i-kejtering",
    icon: UtensilsCrossed,
    count: 18,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    name: "Медицина",
    slug: "medicina",
    icon: Stethoscope,
    count: 29,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  {
    name: "Красота, здоровье и фитнес",
    slug: "krasota-zdorove-fitnes",
    icon: Heart,
    count: 67,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
  },
  {
    name: "Образование и обучение",
    slug: "obrazovanie-i-obuchenie",
    icon: GraduationCap,
    count: 54,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
  },
  {
    name: "Домашние животные",
    slug: "domashnie-zhivotnye",
    icon: PawPrint,
    count: 22,
    iconColor: "text-lime-600",
    iconBg: "bg-lime-600/10",
  },
  {
    name: "Недвижимость и риелторы",
    slug: "nedvizhimost-i-rieltor",
    icon: Building,
    count: 31,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-600/10",
  },
  {
    name: "Транспорт и доставка",
    slug: "transport-i-dostavka",
    icon: Truck,
    count: 44,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-600/10",
  },
  {
    name: "Охрана и безопасность",
    slug: "ohrana-i-bezopasnost",
    icon: Shield,
    count: 15,
    iconColor: "text-zinc-600",
    iconBg: "bg-zinc-600/10",
  },
  {
    name: "Производство и изготовление",
    slug: "proizvodstvo-i-izgotovlenie",
    icon: Factory,
    count: 27,
    iconColor: "text-stone-500",
    iconBg: "bg-stone-500/10",
  },
  {
    name: "Агро и благоустройство",
    slug: "agro-i-blagoustrojstvo",
    icon: Sprout,
    count: 19,
    iconColor: "text-green-600",
    iconBg: "bg-green-600/10",
  },
  {
    name: "Ритуальные услуги",
    slug: "ritualnye-usligi",
    icon: Flower,
    count: 11,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Шапка */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-6">Услуги</h1>

          {/* Поиск*/}
          <div className="group flex flex-col md:flex-row items-stretch bg-card/80 dark:bg-card/40 backdrop-blur-xl p-2 rounded-2xl md:rounded-3xl border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-border focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 gap-2 md:gap-0 max-w-3xl">
            <div className="relative flex-1 flex items-center group/input">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-brand" />
              <input
                type="text"
                placeholder="Ремонт, уборка, репетитор..."
                className="w-full pl-12 pr-4 py-3.5 text-base bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none font-medium"
              />
            </div>

            <div className="hidden md:block h-8 my-auto w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="flex items-center px-2 py-1 md:py-0 bg-secondary/10 md:bg-transparent rounded-xl md:rounded-none">
              <CityDropdown />
            </div>

            <button
              type="button"
              className="px-8 py-3.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl md:rounded-2xl shadow-[0_4px_12px_rgba(250,84,84,0.2)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 font-semibold text-base cursor-pointer"
            >
              Найти
            </button>
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              icon={cat.icon}
              count={cat.count}
              iconColor={cat.iconColor}
              iconBg={cat.iconBg}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
