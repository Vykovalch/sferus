import { describe, expect, it } from "vitest";
import { formatMonthYear, formatYears } from "./format";

/**
 * Intl ставит перед «г.» узкий неразрывной пробел (U+202F) — это правильная
 * русская типографика, и портить её ради теста нельзя. Но и вписывать
 * невидимый символ в ожидаемую строку не стоит: такой тест не читается
 * глазами и ломается, если ICU поменяет разделитель. Поэтому сравниваем
 * с точностью до вида пробела.
 */
const spaces = (value: string) => value.replace(/\s/g, " ");

describe("formatMonthYear", () => {
  it("ставит месяц в родительный падеж — строка читается как «На платформе с …»", () => {
    // Полдень UTC, а не полночь: даты разбираются в местном поясе, и полночь
    // уехала бы на соседний месяц в любом поясе западнее Гринвича.
    // Именительный («июнь 2026 г.») — то, что Intl отдаёт без `day` в опциях.
    expect(spaces(formatMonthYear(new Date("2026-06-15T12:00:00Z")))).toBe("июня 2026 г.");
    expect(spaces(formatMonthYear(new Date("2025-01-20T12:00:00Z")))).toBe("января 2025 г.");
    expect(spaces(formatMonthYear(new Date("2024-08-02T12:00:00Z")))).toBe("августа 2024 г.");
  });

  it("день в результат не попадает ни при какой дате месяца", () => {
    expect(spaces(formatMonthYear(new Date("2026-03-02T12:00:00Z")))).toBe("марта 2026 г.");
    expect(spaces(formatMonthYear(new Date("2026-03-30T12:00:00Z")))).toBe("марта 2026 г.");
  });
});

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
