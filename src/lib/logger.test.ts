import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logError } from "./logger";

/** Перехватывает то, что ушло в `console.error`, и разбирает обратно из JSON. */
function captured(): Record<string, unknown> {
  const spy = console.error as unknown as ReturnType<typeof vi.fn>;
  expect(spy).toHaveBeenCalledTimes(1);

  const [line] = spy.mock.calls[0] as [string];
  expect(typeof line).toBe("string");
  // Одна строка на запись: иначе облачные логи разорвут её на несколько.
  expect(line.includes("\n")).toBe(false);

  return JSON.parse(line);
}

describe("logError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("пишет уровень, область и время", () => {
    logError("action", new Error("не удалось"));
    const entry = captured();

    expect(entry.level).toBe("error");
    expect(entry.scope).toBe("action");
    expect(typeof entry.time).toBe("string");
    expect(Number.isNaN(Date.parse(entry.time as string))).toBe(false);
  });

  it("сохраняет имя, сообщение и стек ошибки", () => {
    logError("action", new TypeError("плохой тип"));
    const entry = captured();

    expect(entry.name).toBe("TypeError");
    expect(entry.message).toBe("плохой тип");
    expect(typeof entry.stack).toBe("string");
  });

  it("сохраняет digest — по нему запись связывается с тем, что увидел пользователь", () => {
    const error = Object.assign(new Error("сбой рендера"), { digest: "3141592653" });
    logError("request", error);

    expect(captured().digest).toBe("3141592653");
  });

  it("переносит контекст в запись", () => {
    logError("request", new Error("сбой"), { path: "/services", routeType: "render" });
    const entry = captured();

    expect(entry.path).toBe("/services");
    expect(entry.routeType).toBe("render");
  });

  it("не теряет то, что брошено не через Error", () => {
    // Бросить в JavaScript можно что угодно; такие случаи тоже должны попасть в лог.
    logError("action", "просто строка");
    expect(captured().message).toBe("просто строка");
  });

  it("переживает объект без сообщения и undefined", () => {
    logError("action", { code: 42 });
    expect(captured().message).toBe('{"code":42}');

    vi.restoreAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});

    logError("action", undefined);
    expect(typeof captured().message).toBe("string");
  });
});
