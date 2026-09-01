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
            Найдите услугу
            <br className="hidden sm:inline" />
            {/* Глубокая ступень бренда, а не --brand: заголовок не кликается
                и не должен спорить с кнопкой «Найти» — она в этом же экране
                и она здесь целевое действие. */}
            <span className="text-brand-display"> в Приднестровье</span>
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
            <Link
              href="/tasks/new"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/90 font-bold hover:underline underline-offset-4 transition-all"
            >
              Создать задание
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
