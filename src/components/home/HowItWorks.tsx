const clientSteps = [
  { n: 1, title: 'Найдите исполнителя', desc: 'Используйте поиск или категории услуг' },
  { n: 2, title: 'Или создайте задание', desc: 'Опишите задачу, исполнители откликнутся сами' },
  { n: 3, title: 'Свяжитесь напрямую', desc: 'Договаривайтесь без посредников и комиссий' },
]

const executorSteps = [
  { n: 1, title: 'Зарегистрируйтесь', desc: 'Создайте профиль и расскажите об услугах' },
  { n: 2, title: 'Разместите объявление', desc: 'Клиенты найдут вас через поиск' },
  { n: 3, title: 'Откликайтесь на задания', desc: 'Предлагайте условия напрямую' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 scroll-mt-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Как это работает
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Выберите свой путь на платформе
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto relative">

          {/* Для клиентов */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Для клиентов</h3>
            {clientSteps.map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#8BC68F]/20 text-[#0d7a5f] border-2 border-[#8BC68F] font-bold text-lg">
                    {step.n}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Разделитель */}
          <div className="hidden md:block absolute left-1/2 top-16 bottom-0 w-px bg-gradient-to-b from-[#7EBFB3]/50 via-[#5C9F7E]/50 to-[#7EBFB3]/50 -translate-x-1/2" />

          {/* Для исполнителей */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Для исполнителей</h3>
            {executorSteps.map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0d7a5f] text-white font-bold text-lg shadow-md">
                    {step.n}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
