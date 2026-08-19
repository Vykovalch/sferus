import { describe, expect, it } from "vitest";
import { parseFavoritesFilter, toggleFavoriteSchema } from "./schemas";

describe("toggleFavoriteSchema", () => {
  it("принимает услугу и задание, приводя id к числу", () => {
    const service = toggleFavoriteSchema.safeParse({ kind: "service", id: "42" });
    expect(service.success).toBe(true);
    if (service.success) expect(service.data).toEqual({ kind: "service", id: 42 });

    const task = toggleFavoriteSchema.safeParse({ kind: "task", id: "7" });
    expect(task.success).toBe(true);
    if (task.success) expect(task.data.kind).toBe("task");
  });

  it("неизвестный тип отклоняется", () => {
    expect(toggleFavoriteSchema.safeParse({ kind: "profile", id: "1" }).success).toBe(false);
    expect(toggleFavoriteSchema.safeParse({ kind: "", id: "1" }).success).toBe(false);
  });

  it("нечисловой, нулевой и отрицательный id отклоняются", () => {
    for (const id of ["abc", "0", "-3", "1.5"]) {
      expect(toggleFavoriteSchema.safeParse({ kind: "service", id }).success).toBe(false);
    }
  });

  it("отсутствующие поля отклоняются — это не форма с необязательным вводом", () => {
    expect(toggleFavoriteSchema.safeParse({ kind: "service" }).success).toBe(false);
    expect(toggleFavoriteSchema.safeParse({ id: "1" }).success).toBe(false);
    expect(toggleFavoriteSchema.safeParse({}).success).toBe(false);
  });
});

describe("parseFavoritesFilter", () => {
  it("разбирает оба типа", () => {
    expect(parseFavoritesFilter({ type: "service" })).toEqual({ kind: "service" });
    expect(parseFavoritesFilter({ type: "task" })).toEqual({ kind: "task" });
  });

  it("без параметра — «все», а не пусто", () => {
    expect(parseFavoritesFilter({})).toEqual({ kind: undefined });
  });

  it("мусор в query тихо откатывается к «все», а не роняет страницу", () => {
    expect(parseFavoritesFilter({ type: "hacked" })).toEqual({ kind: undefined });
    expect(parseFavoritesFilter({ type: "" })).toEqual({ kind: undefined });
  });

  it("повтор ключа в URL — берётся первое значение", () => {
    expect(parseFavoritesFilter({ type: ["task", "service"] })).toEqual({ kind: "task" });
  });

  it("посторонние параметры игнорируются", () => {
    expect(parseFavoritesFilter({ city: "Тирасполь", type: "service" })).toEqual({
      kind: "service",
    });
  });
});
