import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CreateServiceForm } from "@/features/services/components/CreateServiceForm";
import { auth } from "@/lib/auth";

// Временные данные — позже заменить на запрос к БД по userId + id
const mockServiceDetails: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    city: string;
    price: string;
    priceUnit: string;
    homeVisit: boolean;
  }
> = {
  "1": {
    title: "Электромонтажные работы",
    description:
      "Выполняю все виды электромонтажных работ: замена проводки, установка розеток и выключателей, монтаж щитков.",
    category: "Строительство и ремонт",
    city: "Тирасполь",
    price: "80",
    priceUnit: "hour",
    homeVisit: true,
  },
  "2": {
    title: "Установка видеонаблюдения",
    description:
      "Проектирование и монтаж систем видеонаблюдения для дома и офиса, настройка удалённого доступа.",
    category: "Охрана и безопасность",
    city: "Тирасполь",
    price: "200",
    priceUnit: "job",
    homeVisit: true,
  },
  "3": {
    title: "Подключение электроплит",
    description:
      "Подключение и настройка электроплит любой сложности с соблюдением норм безопасности.",
    category: "Строительство и ремонт",
    city: "Тирасполь",
    price: "50",
    priceUnit: "job",
    homeVisit: true,
  },
};

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?callbackUrl=/dashboard/services/${id}/edit`);

  const service = mockServiceDetails[id];
  if (!service) notFound();

  const [cities, categories] = await Promise.all([getCities(), getCategories()]);

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Редактировать объявление</h1>
      <CreateServiceForm
        userName={session.user.name}
        cities={cities}
        categories={categories}
        mode="edit"
        initialValues={service}
      />
    </>
  );
}
