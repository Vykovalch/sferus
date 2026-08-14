import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { getTaskForEdit } from "@/features/tasks/queries";
import { auth } from "@/lib/auth";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?callbackUrl=/dashboard/tasks/${id}/edit`);

  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId <= 0) notFound();

  const task = await getTaskForEdit(taskId);

  // Чужое задание — notFound, а не 403: посторонний не должен даже узнать,
  // что задание с таким идентификатором существует.
  if (!task || task.userId !== session.user.id) notFound();

  const [cities, categories] = await Promise.all([getCities(), getCategories()]);

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Редактировать задание</h1>
      <CreateTaskForm
        cities={cities}
        categories={categories}
        mode="edit"
        initialValues={{
          id: task.id,
          title: task.title,
          description: task.description,
          categoryId: task.categoryId,
          cityId: task.cityId,
          budget: task.budget,
          isNegotiable: task.isNegotiable,
        }}
      />
    </>
  );
}
