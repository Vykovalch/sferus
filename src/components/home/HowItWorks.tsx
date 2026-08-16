import { ShoppingCart, Wrench } from "lucide-react";

type StepItem = {
  n: number;
  title: string;
  desc: string;
};

const clientSteps: StepItem[] = [
  { n: 1, title: "Найдите исполнителя", desc: "Используйте поиск или категории услуг для быстрого подбора." },
  { n: 2, title: "Или создайте задание", desc: "Опишите задачу, и исполнители сами предложат свои услуги." },
  { n: 3, title: "Свяжитесь напрямую", desc: "Договаривайтесь без посредников и скрытых комиссий." },
];

const executorSteps: StepItem[] = [
  { n: 1, title: "Зарегистрируйтесь", desc: "Создайте профессиональный профиль и расскажите о своих навыках." },
  { n: 2, title: "Разместите объявление", desc: "Клиенты смогут легко найти вас через поисковую систему сервиса." },
  { n: 3, title: "Откликайтесь на задания", desc: "Предлагайте свои условия напрямую заинтересованным клиентам." },
];

/**
 * Средняя ступень светлой шкалы (98.26%): белый занят витриной «Свежих
 * объявлений» выше, а два белых раздела подряд слиплись бы в один.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 scroll-mt-16 bg-background">
      <div className="container mx-auto px-4">

        {/* Заголовок */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Как это работает
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Выберите свой путь на платформе
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto relative">

          {/* Разделитель */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 opacity-50" />

          {/* Для клиентов */}
          <div id="how-it-works-clients" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-primary flex items-center gap-3 mb-10">
              <ShoppingCart className="h-7 w-7" />
              Для клиентов
            </h3>
            <div className="relative pl-8 border-l-2 border-primary/20 space-y-8">
              {clientSteps.map((step) => (
                <div key={step.n} className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary ring-4 ring-background" />
                  <h4 className="text-base font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Для исполнителей */}
          <div id="how-it-works-executors" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-secondary flex items-center gap-3 mb-10">
              <Wrench className="h-7 w-7" />
              Для исполнителей
            </h3>
            <div className="relative pl-8 border-l-2 border-secondary/20 space-y-8">
              {executorSteps.map((step) => (
                <div key={step.n} className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-secondary ring-4 ring-background" />
                  <h4 className="text-base font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}