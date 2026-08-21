import { describe, expect, it } from "vitest";
import { absoluteUrl, META_DESCRIPTION_MAX, metaDescription, SITE_URL } from "./site";

describe("SITE_URL", () => {
  it("без завершающего слэша — адреса собираются склейкой", () => {
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("абсолютный адрес", () => {
    expect(() => new URL(SITE_URL)).not.toThrow();
  });
});

describe("absoluteUrl", () => {
  it("склеивает путь с адресом сайта", () => {
    expect(absoluteUrl("/services")).toBe(`${SITE_URL}/services`);
  });

  it("добавляет ведущий слэш, если его забыли", () => {
    expect(absoluteUrl("services")).toBe(`${SITE_URL}/services`);
  });

  it("не даёт двойного слэша", () => {
    expect(absoluteUrl("/services").includes("//services")).toBe(false);
  });
});

describe("metaDescription", () => {
  it("короткий текст остаётся как есть", () => {
    expect(metaDescription("Уборка квартир в Тирасполе")).toBe("Уборка квартир в Тирасполе");
  });

  it("схлопывает переводы строк и двойные пробелы в одну строку", () => {
    // Описания пишут люди: в `<meta>` это должно приехать одной строкой.
    expect(metaDescription("Уборка\n\nквартир   и  офисов")).toBe("Уборка квартир и офисов");
    expect(metaDescription("  с краёв  ")).toBe("с краёв");
  });

  it("режет по границе слова, а не посреди", () => {
    const text = "Ремонт стиральных машин любой сложности с выездом на дом по всему Приднестровью";
    const result = metaDescription(text, 30);

    expect(result.length).toBeLessThanOrEqual(30);
    expect(result.endsWith("…")).toBe(true);
    // Обрыв посреди слова читается как поломка.
    expect(text.startsWith(result.slice(0, -1))).toBe(true);
    expect(result.slice(0, -1).endsWith(" ")).toBe(false);
  });

  it("не оставляет висящую запятую или дефис перед многоточием", () => {
    expect(metaDescription("Уборка, ремонт, всё остальное", 10)).toBe("Уборка…");
  });

  it("одно слово длиннее лимита обрезается принудительно", () => {
    const result = metaDescription("Электрогидродинамика".repeat(20), 20);
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result.endsWith("…")).toBe(true);
  });

  it("укладывается в лимит по умолчанию", () => {
    const long = "Слово ".repeat(100);
    expect(metaDescription(long).length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
  });
});
