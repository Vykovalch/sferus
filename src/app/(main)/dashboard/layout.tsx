import { PageContainer } from "@/components/shared/PageContainer";

/**
 * Кабинет: одна колонка по центру.
 *
 * **Сайдбара с разделами здесь больше нет** (решение владельца, 2026-09-21):
 * те же пять разделов появились в меню под аватаром, и вторая навигация
 * в интерфейсе стала лишней. Где находишься, говорит заголовок страницы
 * («Мой профиль», «Мои услуги», «Избранное» и так далее).
 *
 * Колонка центрируется: без сайдбара прижатый к левому краю текст шириной
 * `max-w-2xl` висел бы у края широкого экрана.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="py-8">
        <div className="mx-auto max-w-2xl">{children}</div>
      </PageContainer>
    </div>
  );
}
