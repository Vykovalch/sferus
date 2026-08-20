import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CreateServiceForm } from "@/features/services/components/CreateServiceForm";
import { getServiceForEdit, getServiceImageUrls } from "@/features/services/queries";
import { auth } from "@/lib/auth";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?callbackUrl=/dashboard/services/${id}/edit`);

  const serviceId = Number(id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) notFound();

  const service = await getServiceForEdit(serviceId);

  // Чужое объявление — notFound, а не 403: посторонний не должен даже узнать,
  // что объявление с таким идентификатором существует.
  if (!service || service.userId !== session.user.id) notFound();

  const [cities, categories, imageUrls] = await Promise.all([
    getCities(),
    getCategories(),
    getServiceImageUrls(serviceId),
  ]);

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Редактировать объявление</h1>
      <CreateServiceForm
        userName={session.user.name}
        cities={cities}
        categories={categories}
        mode="edit"
        initialValues={{
          id: service.id,
          title: service.title,
          description: service.description,
          categoryId: service.categoryId,
          cityId: service.cityId,
          price: service.price,
          isNegotiable: service.isNegotiable,
          priceUnit: service.priceUnit,
          homeVisit: service.homeVisit,
          imageUrls,
        }}
      />
    </>
  );
}
