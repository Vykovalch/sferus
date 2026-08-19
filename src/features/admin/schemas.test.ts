import { describe, expect, it } from "vitest";
import { deleteListingSchema, setModerationSchema, setUserBanSchema } from "./schemas";

describe("setModerationSchema", () => {
  it("принимает оба админских состояния и приводит id к числу", () => {
    const blocked = setModerationSchema.safeParse({ id: "12", status: "blocked" });
    expect(blocked.success).toBe(true);
    if (blocked.success) expect(blocked.data).toEqual({ id: 12, status: "blocked" });

    expect(setModerationSchema.safeParse({ id: "1", status: "approved" }).success).toBe(true);
  });

  it("состояния, которых в v1 нет, отклоняются", () => {
    // pending и rejected существуют в pg-enum заделом под премодерацию,
    // но админка ими не оперирует — прямой POST не должен их проставить.
    expect(setModerationSchema.safeParse({ id: "1", status: "pending" }).success).toBe(false);
    expect(setModerationSchema.safeParse({ id: "1", status: "rejected" }).success).toBe(false);
  });

  it("мусор в состоянии отклоняется — иначе запрос упал бы ошибкой Postgres", () => {
    expect(setModerationSchema.safeParse({ id: "1", status: "hacked" }).success).toBe(false);
    expect(setModerationSchema.safeParse({ id: "1", status: "" }).success).toBe(false);
  });

  it("некорректный id отклоняется", () => {
    for (const id of ["abc", "0", "-4", "2.5"]) {
      expect(setModerationSchema.safeParse({ id, status: "blocked" }).success).toBe(false);
    }
  });

  it("без обязательных полей отклоняется", () => {
    expect(setModerationSchema.safeParse({ id: "1" }).success).toBe(false);
    expect(setModerationSchema.safeParse({ status: "blocked" }).success).toBe(false);
  });
});

describe("deleteListingSchema", () => {
  it("принимает только положительный целый id", () => {
    const parsed = deleteListingSchema.safeParse({ id: "7" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.id).toBe(7);

    for (const id of ["", "abc", "0", "-1"]) {
      expect(deleteListingSchema.safeParse({ id }).success).toBe(false);
    }
  });

  it("посторонние поля не проходят в результат", () => {
    const parsed = deleteListingSchema.safeParse({ id: "7", status: "approved" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).toEqual({ id: 7 });
  });
});

describe("setUserBanSchema", () => {
  it("приводит строковое состояние к булеву", () => {
    const banned = setUserBanSchema.safeParse({ userId: "abc123", banned: "true" });
    expect(banned.success).toBe(true);
    if (banned.success) expect(banned.data).toEqual({ userId: "abc123", banned: true });

    const unbanned = setUserBanSchema.safeParse({ userId: "abc123", banned: "false" });
    expect(unbanned.success).toBe(true);
    if (unbanned.success) expect(unbanned.data.banned).toBe(false);
  });

  it("идентификатор пользователя строковый — это не bigint доменных таблиц", () => {
    expect(setUserBanSchema.safeParse({ userId: "kZ9_x-1", banned: "true" }).success).toBe(true);
    expect(setUserBanSchema.safeParse({ userId: "", banned: "true" }).success).toBe(false);
    expect(setUserBanSchema.safeParse({ userId: "   ", banned: "true" }).success).toBe(false);
  });

  it("значение состояния вне двух литералов отклоняется", () => {
    // Отсутствие ключа означало бы «снять блокировку» — для кнопки, которая
    // умеет и то и другое, это молчаливо неверное поведение.
    expect(setUserBanSchema.safeParse({ userId: "abc", banned: "on" }).success).toBe(false);
    expect(setUserBanSchema.safeParse({ userId: "abc" }).success).toBe(false);
  });
});
