import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { auth } from "@/lib/auth";

// Временные данные — позже заменить на запрос к БД по userId + id
const mockTaskDetails: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    city: string;
    budget: string;
    negotiable: boolean;
    deadline: string;
  }
> = {
  "1": {
    title: "Разработка сайта-визитки для стоматологии",
    description:
      'Нужен современный сайт для стоматологической клиники. Требования: адаптивный дизайн, страницы "О нас", "Услуги", "Врачи", "Контакты". Форма записи на приём.',
    category: "IT и Digital",
    city: "Тирасполь",
    budget: "800",
    negotiable: false,
    deadline: "2 недели",
  },
  "2": {
    title: "Нужен электрик для замены проводки",
    description:
      "Замена старой проводки в квартире 2 комнаты, установка новых розеток и выключателей.",
    category: "Строительство и ремонт",
    city: "Тирасполь",
    budget: "500",
    negotiable: false,
    deadline: "",
  },
  "3": {
    title: "Уборка офиса 200 кв.м.",
    description: "Регулярная уборка офисного помещения, 2 раза в неделю.",
    category: "Дом, быт и уход",
    city: "Тирасполь",
    budget: "",
    negotiable: true,
    deadline: "",
  },
};

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?callbackUrl=/dashboard/tasks/${id}/edit`);

  const task = mockTaskDetails[id];
  if (!task) notFound();

  const [cities, categories] = await Promise.all([getCities(), getCategories()]);

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Редактировать задание</h1>
      <CreateTaskForm cities={cities} categories={categories} mode="edit" initialValues={task} />
    </>
  );
}
