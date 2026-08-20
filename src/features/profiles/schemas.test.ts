import { describe, expect, it } from "vitest";
import {
  type ContactRow,
  toContactFormValues,
  toContactRows,
  updateAvatarSchema,
  updateContactsSchema,
  updateProfileSchema,
} from "./schemas";

/** Вход как из настоящего FormData: только строки, невыбранных чекбоксов нет. */
const validInput = {
  phone: "+373 777 12345",
  phoneVisible: "on",
  whatsappVisible: "on",
  viberVisible: "on",
  telegram: "@ivan_petrov",
  telegramVisible: "on",
};

describe("updateContactsSchema", () => {
  it("принимает полный валидный вход и приводит чекбоксы к булевым", () => {
    const result = updateContactsSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.phone).toBe("+373 777 12345");
    expect(result.data.phoneVisible).toBe(true);
    expect(result.data.telegram).toBe("@ivan_petrov");
    expect(result.data.telegramVisible).toBe(true);
  });

  it("невыбранный чекбокс отсутствует в FormData — видимость false", () => {
    const { whatsappVisible: _omitted, ...withoutWhatsapp } = validInput;
    const result = updateContactsSchema.safeParse(withoutWhatsapp);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.whatsappVisible).toBe(false);
    expect(result.data.phoneVisible).toBe(true);
  });

  it("«false» строкой — невалидное значение чекбокса, а не false", () => {
    expect(updateContactsSchema.safeParse({ ...validInput, viberVisible: "false" }).success).toBe(
      false,
    );
  });

  it("отсутствующее поле значения разбирается как пустая строка", () => {
    const result = updateContactsSchema.safeParse({});
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.phone).toBe("");
    expect(result.data.telegram).toBe("");
  });

  it("полностью пустая форма валидна — это очистка контактов", () => {
    const result = updateContactsSchema.safeParse({ phone: "", telegram: "" });
    expect(result.success).toBe(true);
  });

  it("галочки при пустом телефоне не ошибка", () => {
    const result = updateContactsSchema.safeParse({ ...validInput, phone: "" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.phone).toBe("");
    expect(result.data.phoneVisible).toBe(true);
  });

  it("пробелы по краям обрезаются", () => {
    const result = updateContactsSchema.safeParse({
      ...validInput,
      phone: "  +373 777 12345  ",
      telegram: "  @ivan_petrov  ",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.phone).toBe("+373 777 12345");
    expect(result.data.telegram).toBe("@ivan_petrov");
  });

  it("телефон из букв или слишком короткий отклоняется", () => {
    expect(updateContactsSchema.safeParse({ ...validInput, phone: "позвоните мне" }).success).toBe(
      false,
    );
    expect(updateContactsSchema.safeParse({ ...validInput, phone: "12345" }).success).toBe(false);
  });

  it("телефон в разных распространённых форматах принимается", () => {
    for (const phone of ["+373 777 12345", "0 777 12345", "(533) 5-12-34", "+373-777-12345"]) {
      expect(updateContactsSchema.safeParse({ ...validInput, phone }).success).toBe(true);
    }
  });

  it("telegram принимается с «@» и без неё", () => {
    expect(updateContactsSchema.safeParse({ ...validInput, telegram: "ivan_petrov" }).success).toBe(
      true,
    );
    expect(
      updateContactsSchema.safeParse({ ...validInput, telegram: "@ivan_petrov" }).success,
    ).toBe(true);
  });

  it("telegram кириллицей или короче пяти символов отклоняется", () => {
    expect(updateContactsSchema.safeParse({ ...validInput, telegram: "@иван" }).success).toBe(
      false,
    );
    expect(updateContactsSchema.safeParse({ ...validInput, telegram: "@abc" }).success).toBe(false);
  });

  it("значение длиннее лимита отклоняется", () => {
    const result = updateContactsSchema.safeParse({ ...validInput, phone: "1".repeat(65) });
    expect(result.success).toBe(false);
  });

  it("ошибка привязана к своему полю", () => {
    const result = updateContactsSchema.safeParse({ ...validInput, telegram: "@иван" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.every((issue) => issue.path.join(".") === "telegram")).toBe(true);
  });
});

describe("toContactRows", () => {
  it("один номер превращается в три канала с собственной видимостью", () => {
    const parsed = updateContactsSchema.parse({
      ...validInput,
      viberVisible: undefined,
      telegram: "",
    });
    const rows = toContactRows(parsed);

    expect(rows).toEqual([
      { channel: "phone", value: "+373 777 12345", isVisible: true },
      { channel: "whatsapp", value: "+373 777 12345", isVisible: true },
      { channel: "viber", value: "+373 777 12345", isVisible: false },
    ]);
  });

  it("пустой телефон не порождает ни одного канала, галочки игнорируются", () => {
    const parsed = updateContactsSchema.parse({ ...validInput, phone: "", telegram: "" });
    expect(toContactRows(parsed)).toEqual([]);
  });

  it("telegram попадает отдельной строкой со своим значением", () => {
    const parsed = updateContactsSchema.parse({ phone: "", telegram: "@ivan_petrov" });
    expect(toContactRows(parsed)).toEqual([
      { channel: "telegram", value: "@ivan_petrov", isVisible: false },
    ]);
  });

  it("номер сохраняется, даже когда сняты все три галочки", () => {
    const parsed = updateContactsSchema.parse({ phone: "+373 777 12345", telegram: "" });
    const rows = toContactRows(parsed);
    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.isVisible === false)).toBe(true);
  });
});

describe("toContactFormValues", () => {
  it("пустой профиль — все галочки включены по умолчанию", () => {
    expect(toContactFormValues([])).toEqual({
      phone: "",
      phoneVisible: true,
      whatsappVisible: true,
      viberVisible: true,
      telegram: "",
      telegramVisible: true,
    });
  });

  it("восстанавливает снятую видимость, а не подставляет умолчание", () => {
    const rows: ContactRow[] = [
      { channel: "phone", value: "+373 777 12345", isVisible: false },
      { channel: "whatsapp", value: "+373 777 12345", isVisible: true },
      { channel: "viber", value: "+373 777 12345", isVisible: false },
    ];

    expect(toContactFormValues(rows)).toEqual({
      phone: "+373 777 12345",
      phoneVisible: false,
      whatsappVisible: true,
      viberVisible: false,
      telegram: "",
      telegramVisible: true,
    });
  });

  it("обратное преобразование к toContactRows не теряет данные", () => {
    const parsed = updateContactsSchema.parse(validInput);
    const restored = toContactFormValues(toContactRows(parsed));
    expect(restored).toEqual(parsed);
  });
});

const validProfile = {
  name: "Виктор Петров",
  type: "individual",
  cityId: "1",
  experienceYears: "10",
  bio: "Электромонтажные работы любой сложности.",
};

describe("updateProfileSchema", () => {
  it("принимает полный валидный вход и приводит числа", () => {
    const result = updateProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe("Виктор Петров");
    expect(result.data.type).toBe("individual");
    expect(result.data.cityId).toBe(1);
    expect(result.data.experienceYears).toBe(10);
  });

  it("пробелы по краям обрезаются у имени и описания", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      name: "  Виктор Петров  ",
      bio: "  Электрик  ",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe("Виктор Петров");
    expect(result.data.bio).toBe("Электрик");
  });

  it("имя короче двух символов и длиннее ста отклоняется", () => {
    expect(updateProfileSchema.safeParse({ ...validProfile, name: "В" }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ ...validProfile, name: "и".repeat(101) }).success).toBe(
      false,
    );
  });

  it("тип вне enum отклоняется — иначе запрос упал бы ошибкой Postgres", () => {
    expect(updateProfileSchema.safeParse({ ...validProfile, type: "hacked" }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ ...validProfile, type: "company" }).success).toBe(true);
  });

  it("пустой город — это null, а не ошибка", () => {
    const result = updateProfileSchema.safeParse({ ...validProfile, cityId: "" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.cityId).toBeNull();
  });

  it("нечисловой или нулевой город отклоняется", () => {
    expect(updateProfileSchema.safeParse({ ...validProfile, cityId: "abc" }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ ...validProfile, cityId: "0" }).success).toBe(false);
  });

  it("пустой опыт — null, ноль лет допустим", () => {
    const empty = updateProfileSchema.safeParse({ ...validProfile, experienceYears: "" });
    expect(empty.success).toBe(true);
    if (empty.success) expect(empty.data.experienceYears).toBeNull();

    const zero = updateProfileSchema.safeParse({ ...validProfile, experienceYears: "0" });
    expect(zero.success).toBe(true);
    if (zero.success) expect(zero.data.experienceYears).toBe(0);
  });

  it("отрицательный, дробный и неправдоподобно большой опыт отклоняются", () => {
    for (const experienceYears of ["-1", "3.5", "81"]) {
      expect(updateProfileSchema.safeParse({ ...validProfile, experienceYears }).success).toBe(
        false,
      );
    }
  });

  it("пустое описание — null, слишком длинное отклоняется", () => {
    const empty = updateProfileSchema.safeParse({ ...validProfile, bio: "" });
    expect(empty.success).toBe(true);
    if (empty.success) expect(empty.data.bio).toBeNull();

    expect(updateProfileSchema.safeParse({ ...validProfile, bio: "и".repeat(1001) }).success).toBe(
      false,
    );
  });

  it("отсутствующие необязательные поля разбираются как null", () => {
    const result = updateProfileSchema.safeParse({ name: "Виктор Петров", type: "company" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.cityId).toBeNull();
    expect(result.data.experienceYears).toBeNull();
    expect(result.data.bio).toBeNull();
  });

  it("присланный email отбрасывается: смена email — отдельный сценарий", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      email: "hacker@example.com",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).not.toHaveProperty("email");
  });
});

describe("updateAvatarSchema", () => {
  const BLOB = "https://abc123.public.blob.vercel-storage.com";

  it("принимает адрес из нашего хранилища", () => {
    const result = updateAvatarSchema.safeParse({ imageUrl: `${BLOB}/avatar.webp` });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.imageUrl).toBe(`${BLOB}/avatar.webp`);
  });

  it("пустая строка означает «убрать фотографию»", () => {
    const result = updateAvatarSchema.safeParse({ imageUrl: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.imageUrl).toBe("");
  });

  it("отсутствующий ключ разбирается как пустая строка", () => {
    const result = updateAvatarSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.imageUrl).toBe("");
  });

  it("чужой домен отклоняется", () => {
    for (const imageUrl of [
      "https://example.com/avatar.webp",
      "http://abc123.public.blob.vercel-storage.com/avatar.webp",
      "https://evil.com/abc.public.blob.vercel-storage.com/avatar.webp",
      "javascript:alert(1)",
    ]) {
      expect(updateAvatarSchema.safeParse({ imageUrl }).success).toBe(false);
    }
  });
});
