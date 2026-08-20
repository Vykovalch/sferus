import { describe, expect, it } from "vitest";
import {
  createServiceSchema,
  parseServiceCatalogFilters,
  SEARCH_QUERY_MAX_LENGTH,
  toggleServiceSchema,
  updateServiceSchema,
} from "./schemas";

/**
 * FormData отдаёт только строки, поэтому вход везде строковый — так же,
 * как схема получает его в реальном Server Action.
 */
const validInput = {
  title: "Ремонт стиральных машин на дому",
  description: "Профессиональный ремонт стиральных машин любых марок, выезд по городу",
  price: "500",
  priceUnit: "hour",
  categoryId: "3",
  cityId: "1",
  homeVisit: "true",
};

describe("createServiceSchema", () => {
  it("принимает полный валидный вход и приводит типы", () => {
    const result = createServiceSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.price).toBe(500);
    expect(result.data.categoryId).toBe(3);
    expect(result.data.cityId).toBe(1);
    expect(result.data.homeVisit).toBe(true);
    expect(result.data.isNegotiable).toBe(false);
  });

  it("невыбранный чекбокс отсутствует в FormData — это не ошибка, isNegotiable = false", () => {
    // Регрессия: z.undefined() в union не делает ключ необязательным в zod 4.
    // validInput намеренно не содержит isNegotiable — так же, как невыбранный чекбокс.
    const result = createServiceSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.isNegotiable).toBe(false);
  });

  it("выбранный чекбокс приходит строкой 'on'", () => {
    const result = createServiceSchema.safeParse({
      ...validInput,
      price: "",
      isNegotiable: "on",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.isNegotiable).toBe(true);
    expect(result.data.price).toBeNull();
  });

  it("явное 'false' у чекбокса не превращается в false — это невалидное значение", () => {
    // Регрессия: z.coerce.boolean() принял бы "false" как true. checkboxField
    // так не делает, но и произвольную строку пропускать не должен.
    const result = createServiceSchema.safeParse({ ...validInput, isNegotiable: "false" });
    expect(result.success).toBe(false);
  });

  it("без цены и без отметки «Договорная» — ошибка на поле price", () => {
    // Пустой инпут цены приходит из FormData как "", а не как отсутствующий ключ.
    // isNegotiable в validInput и так отсутствует — как невыбранный чекбокс.
    const result = createServiceSchema.safeParse({ ...validInput, price: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    const priceError = result.error.issues.find((issue) => issue.path.join(".") === "price");
    expect(priceError?.message).toBe("Укажите цену или отметьте «Договорная»");
  });

  it("заголовок короче 10 символов отклоняется, ровно 10 — проходит", () => {
    expect(createServiceSchema.safeParse({ ...validInput, title: "Коротко" }).success).toBe(false);
    expect(createServiceSchema.safeParse({ ...validInput, title: "Ровно 10 сим" }).success).toBe(
      true,
    );
  });

  it("заголовок длиннее 100 символов отклоняется", () => {
    const result = createServiceSchema.safeParse({ ...validInput, title: "а".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("описание короче 20 символов отклоняется", () => {
    const result = createServiceSchema.safeParse({ ...validInput, description: "Слишком коротко" });
    expect(result.success).toBe(false);
  });

  it("цена ноль или отрицательная отклоняется", () => {
    expect(createServiceSchema.safeParse({ ...validInput, price: "0" }).success).toBe(false);
    expect(createServiceSchema.safeParse({ ...validInput, price: "-5" }).success).toBe(false);
  });

  it("цена на границе int4 проходит, за границей — нет", () => {
    expect(createServiceSchema.safeParse({ ...validInput, price: "2147483647" }).success).toBe(
      true,
    );
    const result = createServiceSchema.safeParse({ ...validInput, price: "2147483648" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe("Слишком большое значение");
  });

  it("categoryId и cityId вне справочника (0, отрицательные, нечисловые) отклоняются", () => {
    expect(createServiceSchema.safeParse({ ...validInput, categoryId: "0" }).success).toBe(false);
    expect(createServiceSchema.safeParse({ ...validInput, cityId: "-1" }).success).toBe(false);
    expect(createServiceSchema.safeParse({ ...validInput, categoryId: "abc" }).success).toBe(false);
  });
});

describe("updateServiceSchema", () => {
  it("требует id и приводит его к числу", () => {
    const result = updateServiceSchema.safeParse({ ...validInput, id: "42" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.id).toBe(42);
  });

  it("без id отклоняется", () => {
    const result = updateServiceSchema.safeParse(validInput);
    expect(result.success).toBe(false);
  });
});

describe("toggleServiceSchema", () => {
  it("приводит isActive к boolean", () => {
    expect(toggleServiceSchema.safeParse({ id: "1", isActive: "true" }).success).toBe(true);
    const result = toggleServiceSchema.safeParse({ id: "1", isActive: "false" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.isActive).toBe(false);
  });

  it("произвольная строка вместо 'true'/'false' отклоняется", () => {
    const result = toggleServiceSchema.safeParse({ id: "1", isActive: "yes" });
    expect(result.success).toBe(false);
  });
});

describe("parseServiceCatalogFilters", () => {
  it("пустая query-строка — фильтров нет", () => {
    expect(parseServiceCatalogFilters({})).toEqual({
      cityName: undefined,
      executorType: undefined,
    });
  });

  it("валидные city и type проходят как есть", () => {
    expect(parseServiceCatalogFilters({ city: "Тирасполь", type: "company" })).toEqual({
      cityName: "Тирасполь",
      executorType: "company",
    });
  });

  it("невалидный type тихо отбрасывается, city остаётся", () => {
    // Регрессия: type — enum на уровне БД, мусорное значение уронило бы
    // запрос ошибкой Postgres. Отбрасывать нужно только это поле, а не весь фильтр.
    expect(parseServiceCatalogFilters({ city: "Тирасполь", type: "hacked" })).toEqual({
      cityName: "Тирасполь",
      executorType: undefined,
    });
  });

  it("повтор ключа в query (?city=a&city=b) — берётся первое значение", () => {
    expect(parseServiceCatalogFilters({ city: ["Бендеры", "Тирасполь"] })).toEqual({
      cityName: "Бендеры",
      executorType: undefined,
    });
  });

  it("пустая строка city — как отсутствующий фильтр", () => {
    expect(parseServiceCatalogFilters({ city: "" })).toEqual({
      cityName: undefined,
      executorType: undefined,
    });
  });
});

const BLOB = "https://abc123.public.blob.vercel-storage.com";

describe("createServiceSchema — фотографии", () => {
  it("без фотографий поле разбирается в пустой массив", () => {
    const result = createServiceSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.imageUrls).toEqual([]);
  });

  it("одно фото приходит строкой, а не массивом — разбирается в массив", () => {
    // FormData с одним вхождением ключа отдаёт строку, с несколькими — массив.
    const result = createServiceSchema.safeParse({
      ...validInput,
      imageUrls: `${BLOB}/photo-1.webp`,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.imageUrls).toEqual([`${BLOB}/photo-1.webp`]);
  });

  it("несколько фото сохраняют порядок — первое станет обложкой", () => {
    const urls = [`${BLOB}/a.webp`, `${BLOB}/b.webp`, `${BLOB}/c.webp`];
    const result = createServiceSchema.safeParse({ ...validInput, imageUrls: urls });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.imageUrls).toEqual(urls);
  });

  it("адрес с чужого домена отклоняется", () => {
    // Иначе в объявление можно было бы вписать картинку с постороннего сайта —
    // вплоть до отслеживающего пикселя.
    for (const url of [
      "https://example.com/photo.webp",
      "http://abc123.public.blob.vercel-storage.com/photo.webp",
      "https://evil.com/abc.public.blob.vercel-storage.com/photo.webp",
      "не адрес вовсе",
    ]) {
      expect(createServiceSchema.safeParse({ ...validInput, imageUrls: url }).success).toBe(false);
    }
  });

  it("больше пяти фотографий отклоняется", () => {
    const urls = Array.from({ length: 6 }, (_, i) => `${BLOB}/photo-${i}.webp`);
    expect(createServiceSchema.safeParse({ ...validInput, imageUrls: urls }).success).toBe(false);
  });

  it("пустые значения отбрасываются, а не считаются адресом", () => {
    const result = createServiceSchema.safeParse({
      ...validInput,
      imageUrls: ["", `${BLOB}/a.webp`],
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.imageUrls).toEqual([`${BLOB}/a.webp`]);
  });

  it("updateServiceSchema принимает фотографии так же", () => {
    const result = updateServiceSchema.safeParse({
      ...validInput,
      id: "42",
      imageUrls: `${BLOB}/a.webp`,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.imageUrls).toHaveLength(1);
  });
});

describe("parseServiceCatalogFilters — поисковый запрос", () => {
  it("разбирает запрос и обрезает пробелы по краям", () => {
    expect(parseServiceCatalogFilters({ q: "  ремонт стиральных машин  " }).query).toBe(
      "ремонт стиральных машин",
    );
  });

  it("пустой запрос и одни пробелы — как отсутствующий фильтр", () => {
    expect(parseServiceCatalogFilters({ q: "" }).query).toBeUndefined();
    expect(parseServiceCatalogFilters({ q: "   " }).query).toBeUndefined();
    expect(parseServiceCatalogFilters({}).query).toBeUndefined();
  });

  it("слишком длинный запрос обрезается, а не отклоняется", () => {
    // Отклонять целиком незачем: человек мог вставить абзац, и показать ему
    // результат по первым ста символам полезнее, чем пустую страницу.
    const query = parseServiceCatalogFilters({ q: "а".repeat(500) }).query;
    expect(query).toHaveLength(SEARCH_QUERY_MAX_LENGTH);
  });

  it("повтор ключа в URL — берётся первое значение", () => {
    expect(parseServiceCatalogFilters({ q: ["ремонт", "уборка"] }).query).toBe("ремонт");
  });

  it("запрос уживается с остальными фильтрами", () => {
    expect(parseServiceCatalogFilters({ q: "ремонт", city: "Бендеры", type: "company" })).toEqual({
      query: "ремонт",
      cityName: "Бендеры",
      executorType: "company",
    });
  });
});
