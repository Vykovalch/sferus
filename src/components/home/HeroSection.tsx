import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";
import { SearchBar } from "@/components/shared/SearchBar";
import { getCities } from "@/features/cities/queries";

export async function HeroSection() {
  const cities = await getCities();

  return (
    <section
      className="relative py-16 md:py-32 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 250, 250, 0.85), rgba(250, 250, 250, 0.85)), url('/hero-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
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
            <SearchBar cities={cities} trackVisibility />
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
            <span className="text-muted-foreground font-medium">
              Нужен исполнитель под конкретную задачу?
            </span>
            {/* Тёмный текст с золотым подчёркиванием (решение владельца,
                2026-09-20). Раньше текст был золотой (`--primary`, #8A6A00):
                этот цвет рассчитан на белый фон, где даёт 5.1:1, а поверх
                фотографии под осветляющим слоем фон гуляет и контраст падает
                до 3.46:1 при норме 4.5. Осветлением это не лечится — чтобы
                золото вытянуло норму на самом тёмном участке, слой пришлось бы
                довести до 96% и фотография исчезла бы.

                Роли разделены: текст держит контраст (11.6:1 на любом снимке,
                который сюда поставят потом), подчёркивание держит цвет бренда
                и сообщает, что это ссылка. Линии хватает 3:1 как нелинейному
                элементу, и золото их даёт (3.46 в худшем месте). Фирменная
                `--brand-fill` (#FFC825) не годится: по светлоте она почти
                совпадает с фоном первого экрана — 1.06:1, линию не видно.

                На наведении подчёркивание утолщается, а цвет не меняется:
                у цветного отклика была бы та же беда с контрастом.

                Плотность 600, а не 700: жирность стояла здесь, пока текст был
                золотой и ей приходилось вытягивать слабый контраст. Теперь
                ссылку выдают тёмный цвет и линия, и две ступени разрыва
                с подписью рядом (500) читались бы как перекос. */}
            <Link
              href="/tasks/new"
              className="relative tap-target inline-flex items-center gap-1.5 text-foreground font-semibold underline decoration-brand underline-offset-4 hover:decoration-2 transition-all"
            >
              Создать задание
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
