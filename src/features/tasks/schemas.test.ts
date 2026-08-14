import { describe, expect, it } from "vitest";
import {
  changeTaskStatusSchema,
  createTaskSchema,
  parseTaskCatalogFilters,
  updateTaskSchema,
} from "./schemas";

const validInput = {
  title: "Нужен электрик для замены проводки",
  description: "Квартира 3-комнатная, нужно полностью заменить проводку и щиток.",
  budget: "500",
  categoryId: "3",
  cityId: "1",
};

describe("createTaskSchema", () => {
  it("принимает полный валидный вход и приводит типы", () => {
    const result = createTaskSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.budget).toBe(500);
    expect(result.data.categoryId).toBe(3);
    expect(result.data.cityId).toBe(1);
    expect(result.data.isNegotiable).toBe(false);
  });

  it("невыбранный чекбокс отсутствует в FormData — isNegotiable = false", () => {
    const result = createTaskSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.isNegotiable).toBe(false);
  });

  it("выбранный чекбокс 'on', бюджет пустой — договорная", () => {
    const result = createTaskSchema.safeParse({ ...validInput, budget: "", isNegotiable: "on" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.isNegotiable).toBe(true);
    expect(result.data.budget).toBeNull();
  });

  it("без бюджета и без отметки «Договорная» — ошибка на поле budget", () => {
    const result = createTaskSchema.safeParse({ ...validInput, budget: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    const budgetError = result.error.issues.find((issue) => issue.path.join(".") === "budget");
    expect(budgetError?.message).toBe("Укажите бюджет или отметьте «Договорная»");
  });

  it("заголовок короче 10 символов отклоняется", () => {
    expect(createTaskSchema.safeParse({ ...validInput, title: "Коротко" }).success).toBe(false);
  });

  it("бюджет ноль или отрицательный отклоняется", () => {
    expect(createTaskSchema.safeParse({ ...validInput, budget: "0" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ ...validInput, budget: "-5" }).success).toBe(false);
  });

  it("бюджет за границей int4 отклоняется", () => {
    const result = createTaskSchema.safeParse({ ...validInput, budget: "2147483648" });
    expect(result.success).toBe(false);
  });

  it("categoryId и cityId вне справочника отклоняются", () => {
    expect(createTaskSchema.safeParse({ ...validInput, categoryId: "0" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ ...validInput, cityId: "abc" }).success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("требует id и приводит его к числу", () => {
    const result = updateTaskSchema.safeParse({ ...validInput, id: "42" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.id).toBe(42);
  });

  it("без id отклоняется", () => {
    expect(updateTaskSchema.safeParse(validInput).success).toBe(false);
  });
});

describe("changeTaskStatusSchema", () => {
  it("принимает 'completed' и 'cancelled'", () => {
    expect(changeTaskStatusSchema.safeParse({ id: "1", status: "completed" }).success).toBe(true);
    expect(changeTaskStatusSchema.safeParse({ id: "1", status: "cancelled" }).success).toBe(true);
  });

  it("не принимает 'open' — это не переход, а начальное состояние", () => {
    expect(changeTaskStatusSchema.safeParse({ id: "1", status: "open" }).success).toBe(false);
  });

  it("произвольная строка отклоняется", () => {
    expect(changeTaskStatusSchema.safeParse({ id: "1", status: "hacked" }).success).toBe(false);
  });
});

describe("parseTaskCatalogFilters", () => {
  it("пустая query-строка — status по умолчанию 'open', остальное не задано", () => {
    expect(parseTaskCatalogFilters({})).toEqual({
      categorySlug: undefined,
      cityName: undefined,
      status: "open",
    });
  });

  it("валидные category, city и status проходят как есть", () => {
    expect(
      parseTaskCatalogFilters({ category: "digital", city: "Тирасполь", status: "completed" }),
    ).toEqual({
      categorySlug: "digital",
      cityName: "Тирасполь",
      status: "completed",
    });
  });

  it("невалидный status тихо откатывается к 'open', а не валит остальные фильтры", () => {
    // Регрессия: status — enum на уровне БД, мусорное значение уронило бы
    // запрос ошибкой Postgres. Отбрасывать нужно только это поле.
    expect(parseTaskCatalogFilters({ city: "Тирасполь", status: "hacked" })).toEqual({
      categorySlug: undefined,
      cityName: "Тирасполь",
      status: "open",
    });
  });

  it("повтор ключа в query — берётся первое значение", () => {
    expect(parseTaskCatalogFilters({ category: ["digital", "auto"] })).toEqual({
      categorySlug: "digital",
      cityName: undefined,
      status: "open",
    });
  });
});
