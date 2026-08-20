import { describe, expect, it } from "vitest";
import { safeCallbackUrl } from "./safe-redirect";

describe("safeCallbackUrl", () => {
  it("пропускает внутренние пути вместе с query и якорем", () => {
    expect(safeCallbackUrl("/dashboard/profile")).toBe("/dashboard/profile");
    expect(safeCallbackUrl("/services/repair?city=Тирасполь")).toBe(
      "/services/repair?city=Тирасполь",
    );
    expect(safeCallbackUrl("/tasks#top")).toBe("/tasks#top");
  });

  it("отвергает внешние адреса", () => {
    expect(safeCallbackUrl("https://evil.com")).toBe("/");
    expect(safeCallbackUrl("http://evil.com/login")).toBe("/");
  });

  it("отвергает протокол-относительный адрес", () => {
    // `//evil.com` начинается со слэша, но уводит на внешний домен —
    // ровно то, что пропустила бы проверка «начинается с /».
    expect(safeCallbackUrl("//evil.com")).toBe("/");
    expect(safeCallbackUrl("//evil.com/path")).toBe("/");
  });

  it("отвергает обратный слэш — браузеры трактуют его как второй прямой", () => {
    expect(safeCallbackUrl("/\\evil.com")).toBe("/");
  });

  it("отвергает схемы без слэша в начале", () => {
    expect(safeCallbackUrl("javascript:alert(1)")).toBe("/");
    expect(safeCallbackUrl("evil.com")).toBe("/");
  });

  it("пустое значение и отсутствие параметра дают запасной адрес", () => {
    expect(safeCallbackUrl(null)).toBe("/");
    expect(safeCallbackUrl(undefined)).toBe("/");
    expect(safeCallbackUrl("")).toBe("/");
  });

  it("запасной адрес можно задать", () => {
    expect(safeCallbackUrl("https://evil.com", "/dashboard")).toBe("/dashboard");
  });
});
