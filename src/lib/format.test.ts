import { describe, expect, it } from "vitest";
import { formatYears } from "./format";

describe("formatYears", () => {
  it("склоняет по правилам русского языка", () => {
    expect(formatYears(1)).toBe("1 год");
    expect(formatYears(2)).toBe("2 года");
    expect(formatYears(4)).toBe("4 года");
    expect(formatYears(5)).toBe("5 лет");
    expect(formatYears(11)).toBe("11 лет");
    expect(formatYears(21)).toBe("21 год");
    expect(formatYears(22)).toBe("22 года");
    expect(formatYears(25)).toBe("25 лет");
  });

  it("ноль и границы диапазона формы", () => {
    // Опыт 0 допустим схемой профиля, 80 — верхняя граница.
    expect(formatYears(0)).toBe("0 лет");
    expect(formatYears(80)).toBe("80 лет");
  });
});
