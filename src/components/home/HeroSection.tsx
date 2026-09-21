import Link from "next/link";
import { LogoMark } from "@/components/shared/LogoMark";
import { PageContainer } from "@/components/shared/PageContainer";
import { SearchBar } from "@/components/shared/SearchBar";
import { getCities } from "@/features/cities/queries";

export async function HeroSection() {
  const cities = await getCities();

  return (
    // Первый экран — единственное крупное поле фирменного жёлтого на сайте
    // (решение владельца, 2026-09-21). До этого здесь лежало стоковое фото под
    // белым слоем 85%: снимок был не местный, под слоем от него оставались
    // бледные силуэты, и вся страница шла пятью почти белыми секциями подряд.
    // Правило «заливка брендом на первом экране — только у „Найти“» заменено:
    // теперь наоборот, поле жёлтое, а целевое действие — тёмное.
    //
    // Знак — фоновая графика, одним цветом (`monochrome`): двухцветный знак
    // потерял бы на жёлтом свою жёлтую половину. 8% тёмного — это фактура,
    // а не элемент: контраст со знаком 1.2:1, он не спорит с текстом.
    <section className="relative py-16 md:py-32 overflow-hidden bg-brand-fill">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-40 hidden sm:block"
      >
        <LogoMark monochrome className="h-[34rem] text-foreground/8" />
      </span>

      <PageContainer className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide mb-12 leading-[1.15] text-balance">
            Найди услугу
            <br className="hidden sm:inline" />
            {/* Весь заголовок одним цветом текста: цвет бренда на первом экране —
                только у кнопки «Найти», целевого действия. Пробел нужен на
                мобильном, где перенос скрыт. */}
            {" в Приднестровье"}
          </h1>

          <div className="mb-10 max-w-3xl mx-auto">
            <SearchBar cities={cities} trackVisibility variant="onBrand" />
          </div>

          {/* Счётчики «400+ исполнителей / 500+ объявлений / 50+ активных заданий»
              удалены: цифры были вписаны руками и не сходились с базой на два
              порядка. Для площадки услуг это не украшение вёрстки, а заявление
              о размере рынка, и оно должно быть правдой.

              Реальные значения сюда не подставлены сознательно: на старте они
              честные, но выглядят хуже, чем их отсутствие. Вернуть счётчики
              имеет смысл тогда, когда цифра начнёт работать на площадку —
              и уже запросом к БД, а не константой в разметке. */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-base">
            {/* Приглушение — прозрачностью тёмного, а не серым токеном:
                на цветном поле серый читается как грязь, а `--muted-foreground`
                (холодный, 294°) спорит с жёлтым. Тёмный на 80% смешивается
                с фоном в тёплый коричневый, 6.8:1. */}
            <span className="text-foreground/80 font-medium">
              Нужен исполнитель под конкретную задачу?
            </span>
            {/* Тёмный текст с тёмным подчёркиванием. Решение владельца
                2026-09-20 — золотое подчёркивание на тёмном тексте — принято
                для фотографии под осветляющим слоем: тогда золото было
                единственным цветом бренда на первом экране. С жёлтым полем
                (2026-09-21) поле само стало брендом, и золотая линия на нём
                мутнеет (3.3:1). Линию держит тёмный: 11:1, ссылку видно.

                На наведении подчёркивание утолщается, цвет не меняется. */}
            <Link
              href="/tasks/new"
              className="relative tap-target inline-flex items-center gap-1.5 text-foreground font-semibold underline decoration-foreground/70 underline-offset-4 hover:decoration-2 transition-all"
            >
              Создать задание
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
