type StepItem = {
  n: number;
  title: string;
  desc: string;
};

const clientSteps: StepItem[] = [
  { n: 1, title: "Найдите исполнителя", desc: "Используйте поиск или категории услуг" },
  { n: 2, title: "Или создайте задание", desc: "Опишите задачу, исполнители откликнутся сами" },
  { n: 3, title: "Свяжитесь напрямую", desc: "Договаривайтесь без посредников и комиссий" },
];

const executorSteps: StepItem[] = [
  { n: 1, title: "Зарегистрируйтесь", desc: "Создайте профиль и расскажите об услугах" },
  { n: 2, title: "Разместите объявление", desc: "Клиенты найдут вас через поиск" },
  { n: 3, title: "Откликайтесь на задания", desc: "Предлагайте условия напрямую" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 scroll-mt-16 bg-secondary/4">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-3">
          Как это работает
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg max-w-md mx-auto">
          Выберите свой путь на платформе
        </p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-5xl mx-auto relative">
          {/* Путь: Для клиентов */}
          <div className="space-y-10">
            <h3 className="text-xl sm:text-2xl font-medium text-center md:text-left mb-8">
              Для клиентов
            </h3>
            {clientSteps.map((step: StepItem) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full font-semibold text-lg border-2"
                    style={{
                      /* Изменено на более глубокий тон #3a8a7a */
                      borderColor: "#3a8a7a",
                      color: "#3a8a7a",
                      backgroundColor: "transparent",
                    }}
                  >
                    {step.n}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-lg font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Минималистичный системный разделитель */}
          <div className="hidden md:block absolute left-1/2 top-16 bottom-4 w-px bg-border -translate-x-1/2 opacity-70" />

          {/* Путь: Для исполнителей */}
          <div className="space-y-10">
            <h3 className="text-xl sm:text-2xl font-medium text-center md:text-left mb-8">
              Для исполнителей
            </h3>
            {executorSteps.map((step: StepItem) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold text-lg shadow-sm"
                    /* Изменено на более глубокий тон #3a8a7a */
                    style={{ backgroundColor: "#3a8a7a" }}
                  >
                    {step.n}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-lg font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}