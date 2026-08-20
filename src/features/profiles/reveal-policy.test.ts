import { describe, expect, it } from "vitest";
import {
  isRepeatReveal,
  isRevealAllowed,
  REVEAL_LIMIT_PER_DAY,
  shouldRecordReveal,
} from "./reveal-policy";

describe("isRevealAllowed", () => {
  it("пропускает, пока квота не исчерпана", () => {
    expect(isRevealAllowed({ total: 0, sameTarget: 0 })).toBe(true);
    expect(isRevealAllowed({ total: REVEAL_LIMIT_PER_DAY - 1, sameTarget: 0 })).toBe(true);
  });

  it("останавливает ровно на пределе, а не после него", () => {
    // Граница именно здесь: тридцатое раскрытие — последнее разрешённое,
    // тридцать первое уже нет.
    expect(isRevealAllowed({ total: REVEAL_LIMIT_PER_DAY, sameTarget: 0 })).toBe(false);
    expect(isRevealAllowed({ total: REVEAL_LIMIT_PER_DAY + 5, sameTarget: 0 })).toBe(false);
  });

  it("повторное открытие того же контакта проходит даже при исчерпанной квоте", () => {
    // Человек вернулся к объявлению, которое уже смотрел, — наказывать его
    // за это нельзя: ограничиваем число разных контактов, а не нажатий.
    expect(isRevealAllowed({ total: REVEAL_LIMIT_PER_DAY + 100, sameTarget: 1 })).toBe(true);
  });

  it("предел настраивается — параметр важнее умолчания", () => {
    expect(isRevealAllowed({ total: 5, sameTarget: 0 }, 5)).toBe(false);
    expect(isRevealAllowed({ total: 5, sameTarget: 0 }, 10)).toBe(true);
  });
});

describe("isRepeatReveal", () => {
  it("повтор определяется по тому же объекту, а не по общему счётчику", () => {
    expect(isRepeatReveal({ total: 50, sameTarget: 0 })).toBe(false);
    expect(isRepeatReveal({ total: 1, sameTarget: 1 })).toBe(true);
  });
});

describe("shouldRecordReveal", () => {
  it("записывает первое раскрытие с непустыми контактами", () => {
    expect(shouldRecordReveal({ total: 0, sameTarget: 0 }, 3)).toBe(true);
  });

  it("не записывает повтор — иначе журнал распухнет от возвратов к объявлению", () => {
    expect(shouldRecordReveal({ total: 10, sameTarget: 1 }, 3)).toBe(false);
  });

  it("не записывает пустое раскрытие", () => {
    // Контактов у владельца нет — доступа никто не получил, писать нечего,
    // и чужую квоту такое тратить не должно.
    expect(shouldRecordReveal({ total: 0, sameTarget: 0 }, 0)).toBe(false);
  });
});
