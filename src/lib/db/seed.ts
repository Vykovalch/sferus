/**
 * Сид справочников: города и категории.
 *
 * Зачем: миграции создают структуру, но не содержимое. Без справочников
 * приложение неработоспособно — `category_id` и `city_id` в схеме NOT NULL.
 * Новая база (тестовая, staging, копия другого разработчика, восстановление
 * после сбоя) поднимется пустой, и сид — единственный воспроизводимый способ
 * привести её в рабочее состояние.
 *
 * Идемпотентность: вставляет отсутствующее, обновляет имя, иконку и порядок
 * у существующего — сопоставление по `slug`. Ничего не удаляет и не меняет
 * идентификаторы: на них уже могут ссылаться объявления.
 *
 * Запуск: npm run db:seed
 */
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { categories, cities } from "./schema";

config({ path: ".env.local", quiet: true });

const CITY_ROWS = [
  { slug: "tiraspol", name: "Тирасполь", order: 1 },
  { slug: "bendery", name: "Бендеры", order: 2 },
  { slug: "rybnitsa", name: "Рыбница", order: 3 },
  { slug: "dubossary", name: "Дубоссары", order: 4 },
  { slug: "slobodzeya", name: "Слободзея", order: 5 },
  { slug: "dnestrovsk", name: "Днестровск", order: 6 },
  { slug: "grigoriopol", name: "Григориополь", order: 7 },
  { slug: "kamenka", name: "Каменка", order: 8 },
];

/** `icon` — имя иконки lucide. Сопоставление с компонентом — в lib/constants.ts. */
const CATEGORY_ROWS = [
  { slug: "construction-and-renovation", name: "Строительство и ремонт", icon: "Hammer", order: 1 },
  { slug: "repair-services", name: "Ремонт техники и оборудования", icon: "Wrench", order: 2 },
  { slug: "home-and-care", name: "Дом, быт и уход", icon: "Home", order: 3 },
  { slug: "auto", name: "Автоуслуги", icon: "Car", order: 4 },
  { slug: "digital", name: "IT и Digital", icon: "Monitor", order: 5 },
  { slug: "legal-and-documents", name: "Юридические услуги и документы", icon: "Scale", order: 6 },
  { slug: "business-and-finance", name: "Бизнес и финансы", icon: "Briefcase", order: 7 },
  { slug: "photo-and-video", name: "Фото и видео", icon: "Camera", order: 8 },
  { slug: "events", name: "Мероприятия и праздники", icon: "PartyPopper", order: 9 },
  { slug: "food-and-catering", name: "Еда и кейтеринг", icon: "UtensilsCrossed", order: 10 },
  { slug: "medical", name: "Медицина", icon: "Stethoscope", order: 11 },
  { slug: "beauty-and-wellness", name: "Красота, здоровье и фитнес", icon: "Heart", order: 12 },
  { slug: "education", name: "Образование и обучение", icon: "GraduationCap", order: 13 },
  { slug: "pets", name: "Домашние животные", icon: "PawPrint", order: 14 },
  { slug: "real-estate", name: "Недвижимость и риелторы", icon: "Building", order: 15 },
  { slug: "transport-and-delivery", name: "Транспорт и доставка", icon: "Truck", order: 16 },
  { slug: "security", name: "Охрана и безопасность", icon: "Shield", order: 17 },
  { slug: "production", name: "Производство и изготовление", icon: "Factory", order: 18 },
  {
    slug: "agro-and-landscaping",
    name: "Агро услуги и благоустройство",
    icon: "Sprout",
    order: 19,
  },
  { slug: "funeral", name: "Ритуальные услуги", icon: "Flower", order: 20 },
];

async function seed() {
  // Импорт после config(): клиент БД читает DATABASE_URL на уровне модуля
  const { db } = await import("./index");

  console.log(`Города: ${CITY_ROWS.length}...`);
  await db
    .insert(cities)
    .values(CITY_ROWS)
    .onConflictDoUpdate({
      target: cities.slug,
      set: {
        name: sql`excluded.name`,
        order: sql`excluded."order"`,
      },
    });

  console.log(`Категории: ${CATEGORY_ROWS.length}...`);
  await db
    .insert(categories)
    .values(CATEGORY_ROWS)
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: sql`excluded.name`,
        icon: sql`excluded.icon`,
        order: sql`excluded."order"`,
      },
    });

  console.log("Сид выполнен.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Сид не выполнен:", error);
    process.exit(1);
  });
