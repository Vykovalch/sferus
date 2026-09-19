import { describe, expect, it } from "vitest";
import {
  formatAmount,
  formatListingCount,
  formatMonthYear,
  formatServicePrice,
  formatTaskBudget,
  formatYears,
} from "./format";

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

describe("formatAmount", () => {
  it("четырёхзначные не делит — правило русской типографики", () => {
    expect(formatAmount(150)).toBe("150");
    expect(formatAmount(1000)).toBe("1000");
    expect(formatAmount(9999)).toBe("9999");
  });

  it("с пяти знаков делит разряды", () => {
    expect(spaces(formatAmount(10000))).toBe("10 000");
    expect(spaces(formatAmount(15000))).toBe("15 000");
    expect(spaces(formatAmount(1500000))).toBe("1 500 000");
  });

  it("разделитель неразрывный — число не разорвётся переносом строки", () => {
    expect(formatAmount(15000)).not.toContain(" ");
  });
});

describe("formatServicePrice", () => {
  it("сумма с разрядами, единица цены", () => {
    expect(spaces(formatServicePrice(15000, false, "job"))).toBe("от 15 000 руб. за работу");
    expect(formatServicePrice(1000, false, "hour")).toBe("от 1000 руб. за час");
  });

  it("договорная — без суммы, даже если сумма в строке есть", () => {
    expect(formatServicePrice(null, true, "hour")).toBe("Договорная");
    expect(formatServicePrice(500, true, "hour")).toBe("Договорная");
  });
});

describe("formatTaskBudget", () => {
  it("сумма с разрядами либо договорной", () => {
    expect(spaces(formatTaskBudget(120000, false))).toBe("до 120 000 руб.");
    expect(formatTaskBudget(500, false)).toBe("до 500 руб.");
    expect(formatTaskBudget(null, true)).toBe("Договорной");
  });
});

describe("formatListingCount", () => {
  it("склоняет по правилам русского языка", () => {
    expect(formatListingCount(1)).toBe("1 объявление");
    expect(formatListingCount(2)).toBe("2 объявления");
    expect(formatListingCount(4)).toBe("4 объявления");
    expect(formatListingCount(5)).toBe("5 объявлений");
    expect(formatListingCount(21)).toBe("21 объявление");
    expect(formatListingCount(22)).toBe("22 объявления");
    expect(formatListingCount(25)).toBe("25 объявлений");
  });

  it("11–14 — исключение из правила последней цифры", () => {
    expect(formatListingCount(11)).toBe("11 объявлений");
    expect(formatListingCount(12)).toBe("12 объявлений");
    expect(formatListingCount(14)).toBe("14 объявлений");
    expect(formatListingCount(111)).toBe("111 объявлений");
  });

  it("ноль — пустая категория на странице всех услуг", () => {
    expect(formatListingCount(0)).toBe("0 объявлений");
  });
});
