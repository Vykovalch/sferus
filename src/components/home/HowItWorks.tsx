import { ShoppingCart, Wrench } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";

type StepItem = {
  n: number;
  title: string;
  desc: string;
};

/**
 * Тексты описывают то, что площадка умеет в v1.
 *
 * Откликов в v1 нет (DATA-MODEL.md, «Отложено»), поэтому шаги не обещают
 * ни отклика, ни предложения от исполнителя: связь между людьми происходит
 * только через раскрытие контактов. Раздел «Как это работает» — единственное
 * место, где площадка объясняет свой сценарий словами, и расходиться
 * с реальностью ему нельзя.
 */
const clientSteps: StepItem[] = [
  {
    n: 1,
    title: "Найдите исполнителя",
    desc: "Используйте поиск или категории услуг для быстрого подбора.",
  },
  {
    n: 2,
    title: "Или создайте задание",
    desc: "Опишите задачу — исполнители найдут её на доске и свяжутся с вами.",
  },
  {
    n: 3,
    title: "Свяжитесь напрямую",
    desc: "Договаривайтесь без посредников и скрытых комиссий.",
  },
];

const executorSteps: StepItem[] = [
  {
    n: 1,
    title: "Зарегистрируйтесь",
    desc: "Создайте профессиональный профиль и расскажите о своих навыках.",
  },
  {
    n: 2,
    title: "Разместите объявление",
    desc: "Клиенты смогут легко найти вас через поисковую систему сервиса.",
  },
  {
    n: 3,
    title: "Следите за доской заданий",
    desc: "Открывайте контакты заказчика и предлагайте свои условия напрямую.",
  },
];

/**
 * Тёмная полоса в середине страницы (решение владельца, 2026-09-21): первый
 * экран стал жёлтым, а дальше шли четыре почти белые секции подряд. Раздел без
 * карточек — единственный, который можно затемнить, не переверстывая карточки,
 * и это же место, где страница объясняет свой сценарий словами.
 *
 * Поверхность — `--footer-bg` (#383E41), та же, что у подвала: нового тёмного
 * оттенка в палитре не заводим. Стороны площадки на тёмном различаются так же,
 * как в тёмной теме: клиентская жёлтая (7.0:1), исполнительская белая (10.9:1).
 * Серый `--secondary` (1.8:1) и золотой `--brand` (2.1:1) здесь не читаются.
 * Подписи — `neutral-300`, как в подвале (7.3:1).
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 scroll-mt-16 lg:scroll-mt-[72px] bg-footer-bg">
      <PageContainer>
        {/* Заголовок. Подзаголовок «Выберите свой путь на платформе» убран
            (решение владельца, 2026-09-20): он пересказывал заголовок и ничего
            не добавлял. Такой же пустой подзаголовок раньше убрали у «Новых
            объявлений» — правило в DESIGN.md, раздел 5. */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Как это работает
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto relative">
          {/* Разделитель */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />

          {/* Для клиентов */}
          <div id="how-it-works-clients" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-brand-fill flex items-center gap-3 mb-10">
              <ShoppingCart className="h-7 w-7" />
              Для клиентов
            </h3>
            <div className="relative pl-8 border-l-2 border-brand-fill/40 space-y-8">
              {clientSteps.map((step) => (
                <div key={step.n} className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-brand-fill ring-4 ring-footer-bg" />
                  <h4 className="text-base font-semibold text-white mb-1">{step.title}</h4>
                  {/* min-h-12 ≈ 2 строки text-sm/leading-relaxed — грубая
                      подгонка под сегодняшний текст, чтобы однострочные пункты
                      клиента не расходились с двухстрочными у исполнителей.
                      Не переживёт правку текста без пересчёта вручную — если
                      понадобится настоящая синхронизация по фактической
                      высоте контента, а не по текущей длине строк, тут нужен
                      CSS subgrid, а не min-height. */}
                  <p className="text-sm text-neutral-300 leading-relaxed min-h-12">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Для исполнителей */}
          <div id="how-it-works-executors" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3 mb-10">
              <Wrench className="h-7 w-7" />
              Для исполнителей
            </h3>
            <div className="relative pl-8 border-l-2 border-white/30 space-y-8">
              {executorSteps.map((step) => (
                <div key={step.n} className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white ring-4 ring-footer-bg" />
                  <h4 className="text-base font-semibold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed min-h-12">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
