import { describe, expect, it } from "vitest";
import {
  buildPageHref,
  isPageOutOfRange,
  offsetFor,
  PAGE_SIZE,
  pageCount,
  pageWindow,
  parsePageParam,
} from "./pagination";

describe("parsePageParam", () => {
  it("нормальный ввод", () => {
    expect(parsePageParam("1")).toBe(1);
    expect(parsePageParam("7")).toBe(7);
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("мусор сводится к первой странице, а не роняет каталог", () => {
    // `?page=` правит рукой кто угодно — падать на этом нельзя.
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam("")).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-3")).toBe(1);
    expect(parsePageParam("1.5")).toBe(1);
    expect(parsePageParam("Infinity")).toBe(1);
    expect(parsePageParam("1e3")).toBe(1000); // Number("1e3") — целое, это допустимая страница
  });

  it("повторённый параметр: берётся первый", () => {
    expect(parsePageParam(["2", "9"])).toBe(2);
  });
});

describe("offsetFor", () => {
  it("первая страница ничего не пропускает", () => {
    expect(offsetFor(1)).toBe(0);
    expect(offsetFor(2)).toBe(PAGE_SIZE);
    expect(offsetFor(5, 10)).toBe(40);
  });
});

describe("pageCount", () => {
  it("считает страницы с округлением вверх", () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(1)).toBe(1);
    expect(pageCount(PAGE_SIZE)).toBe(1);
    expect(pageCount(PAGE_SIZE + 1)).toBe(2);
    expect(pageCount(95, 10)).toBe(10);
  });

  it("пустой список — одна страница, иначе она отдавала бы 404", () => {
    expect(pageCount(0)).toBe(1);
    expect(isPageOutOfRange(1, 0)).toBe(false);
  });
});

describe("isPageOutOfRange", () => {
  it("за пределом диапазона", () => {
    expect(isPageOutOfRange(2, 5, 10)).toBe(true);
    expect(isPageOutOfRange(1, 5, 10)).toBe(false);
    expect(isPageOutOfRange(10, 95, 10)).toBe(false);
    expect(isPageOutOfRange(11, 95, 10)).toBe(true);
  });
});

describe("buildPageHref", () => {
  it("первая страница остаётся без параметра — иначе это дубль адреса", () => {
    const params = new URLSearchParams({ city: "Тирасполь" });
    expect(buildPageHref("/services", params, 1)).toBe(
      "/services?city=%D0%A2%D0%B8%D1%80%D0%B0%D1%81%D0%BF%D0%BE%D0%BB%D1%8C",
    );
    expect(buildPageHref("/services", new URLSearchParams(), 1)).toBe("/services");
  });

  it("остальные страницы получают номер, фильтры сохраняются", () => {
    const params = new URLSearchParams({ q: "уборка", city: "Бендеры" });
    const href = buildPageHref("/services", params, 3);

    expect(href.startsWith("/services?")).toBe(true);
    const parsed = new URLSearchParams(href.slice(href.indexOf("?") + 1));
    expect(parsed.get("page")).toBe("3");
    expect(parsed.get("q")).toBe("уборка");
    expect(parsed.get("city")).toBe("Бендеры");
  });

  it("не изменяет переданный набор параметров", () => {
    // Один и тот же набор используется для всех ссылок пагинации сразу.
    const params = new URLSearchParams({ q: "уборка" });
    buildPageHref("/services", params, 2);
    buildPageHref("/services", params, 3);

    expect(params.has("page")).toBe(false);
  });

  it("заменяет номер, если он уже был в наборе", () => {
    const params = new URLSearchParams({ page: "4" });
    expect(buildPageHref("/tasks", params, 2)).toBe("/tasks?page=2");
    expect(buildPageHref("/tasks", params, 1)).toBe("/tasks");
  });
});

describe("pageWindow", () => {
  it("короткий список показывается целиком", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
    expect(pageWindow(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("длинный список сворачивается многоточиями вокруг текущей", () => {
    expect(pageWindow(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10]);
    expect(pageWindow(1, 10)).toEqual([1, 2, "gap", 10]);
    expect(pageWindow(10, 10)).toEqual([1, "gap", 9, 10]);
  });

  it("пропуск в одну страницу разворачивается, а не прячется за многоточием", () => {
    // «1 … 3» заняло бы столько же места, сколько «1 2 3», но спрятало бы
    // страницу, на которую человек мог хотеть перейти.
    expect(pageWindow(4, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("номера не повторяются на границах", () => {
    for (const total of [1, 2, 3, 7, 20]) {
      for (let page = 1; page <= total; page++) {
        const numbers = pageWindow(page, total).filter((item): item is number => item !== "gap");
        expect(new Set(numbers).size).toBe(numbers.length);
      }
    }
  });
});
