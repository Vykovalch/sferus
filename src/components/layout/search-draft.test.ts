import { describe, expect, it } from "vitest";
import { catalogFiltersFromUrl, resolveSearchDraft, searchParamsToRecord } from "./search-draft";

describe("searchParamsToRecord", () => {
  it("одиночный ключ — строка, повторяющийся — массив, как в searchParams страницы", () => {
    const params = new URLSearchParams("q=ремонт&city=Бендеры&city=Тирасполь");
    expect(searchParamsToRecord(params)).toEqual({
      q: "ремонт",
      city: ["Бендеры", "Тирасполь"],
    });
  });
});

describe("catalogFiltersFromUrl", () => {
  it("на /services разбирает запрос и фильтры тем же разбором, что страница", () => {
    const params = new URLSearchParams("q=ремонт&city=Бендеры&city=Тирасполь&type=company");
    expect(catalogFiltersFromUrl("/services", params)).toEqual({
      query: "ремонт",
      // Первое значение при повторе — как на сервере, не последнее.
      cityName: "Бендеры",
      executorType: "company",
    });
  });

  it("на других страницах фильтров нет, даже если параметры совпадают по имени", () => {
    const params = new URLSearchParams("city=Бендеры&q=ремонт");
    expect(catalogFiltersFromUrl("/tasks", params)).toEqual({});
    expect(catalogFiltersFromUrl("/", params)).toEqual({});
  });
});

describe("resolveSearchDraft", () => {
  const urlFilters = { query: "ремонт", cityName: "Бендеры" };

  it("без правок черновик равен значениям из адреса", () => {
    expect(resolveSearchDraft(null, "/services?q=ремонт", urlFilters)).toEqual({
      query: "ремонт",
      city: "Бендеры",
    });
  });

  it("пустой адрес — пустой текст и «Все города»", () => {
    expect(resolveSearchDraft(null, "/?", {})).toEqual({ query: "", city: undefined });
  });

  it("правка на этом же адресе важнее значений из адреса", () => {
    // Главная: выбрал город в Hero — шапка на том же адресе видит его же.
    const stored = { urlKey: "/?", draft: { query: "уборка", city: "Тирасполь" } };
    expect(resolveSearchDraft(stored, "/?", {})).toEqual({ query: "уборка", city: "Тирасполь" });
  });

  it("правка с другого адреса игнорируется — после перехода видны значения нового адреса", () => {
    const stored = { urlKey: "/?", draft: { query: "уборка", city: "Тирасполь" } };
    expect(resolveSearchDraft(stored, "/services?q=ремонт", urlFilters)).toEqual({
      query: "ремонт",
      city: "Бендеры",
    });
  });

  it("снятый город в правке остаётся снятым, а не берётся из адреса", () => {
    // `city: undefined` — это выбор «Все города», а не отсутствие правки.
    const stored = { urlKey: "/services?q=ремонт", draft: { query: "ремонт", city: undefined } };
    expect(resolveSearchDraft(stored, "/services?q=ремонт", urlFilters).city).toBeUndefined();
  });
});
