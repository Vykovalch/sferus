"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServiceImageUrls, getServiceOwner } from "@/features/services/queries";
import {
  createServiceSchema,
  toggleServiceSchema,
  updateServiceSchema,
} from "@/features/services/schemas";
import { authedAction, ForbiddenError, NotFoundError } from "@/lib/action-client";
import { db } from "@/lib/db";
import { categories, serviceImages, services } from "@/lib/db/schema";
import { deleteImages } from "@/lib/storage";

/**
 * Мутации услуг.
 *
 * Каждый экспорт отсюда — публичный HTTP-эндпоинт, доступный прямым POST-запросом,
 * а не только через форму на странице. `authedAction` закрывает проверку сессии
 * и валидацию входа; проверка прав на конкретный объект остаётся здесь, в теле
 * обработчика, и обобщению не подлежит.
 */

/**
 * Фотографии объявления — полное состояние из формы, а не патч.
 *
 * Строки переписываются целиком: порядок задаётся позицией в массиве, а снятые
 * фотографии удаляются из хранилища. Тот же приём, что у контактов профиля —
 * форма является источником истины, и сравнивать её с базой по одной записи
 * незачем.
 *
 * Файлы удаляются **после** записи в БД и best-effort: если хранилище недоступно,
 * объявление всё равно должно сохраниться, а осиротевший файл — это мусор,
 * а не поломка.
 */
async function replaceServiceImages(serviceId: number, urls: string[]) {
  const previous = await getServiceImageUrls(serviceId);

  await db.delete(serviceImages).where(eq(serviceImages.serviceId, serviceId));

  if (urls.length > 0) {
    await db.insert(serviceImages).values(
      urls.map((url, index) => ({
        serviceId,
        url,
        order: index,
      })),
    );
  }

  const kept = new Set(urls);
  await deleteImages(previous.filter((url) => !kept.has(url)));
}

/** Slug категории нужен, чтобы собрать адрес созданной услуги. */
async function getCategorySlug(categoryId: number) {
  const [row] = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  return row?.slug ?? null;
}

export const createService = authedAction(createServiceSchema, async (input, { userId }) => {
  const slug = await getCategorySlug(input.categoryId);
  if (!slug) throw new NotFoundError("Категория не найдена");

  const [created] = await db
    .insert(services)
    .values({
      userId,
      title: input.title,
      description: input.description,
      price: input.price,
      isNegotiable: input.isNegotiable,
      priceUnit: input.priceUnit,
      categoryId: input.categoryId,
      cityId: input.cityId,
      homeVisit: input.homeVisit,
    })
    .returning({ id: services.id });

  if (input.imageUrls.length > 0) {
    await db.insert(serviceImages).values(
      input.imageUrls.map((url, index) => ({
        serviceId: created.id,
        url,
        order: index,
      })),
    );
  }

  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/dashboard/services");

  redirect(`/services/${slug}/${created.id}`);
});

export const updateService = authedAction(updateServiceSchema, async (input, { userId }) => {
  // Проверка прав на конкретный объект. Обёртка знает, кто пришёл,
  // но не знает, к чему он обращается — поэтому проверка здесь.
  const existing = await getServiceOwner(input.id);
  if (!existing) throw new NotFoundError("Объявление не найдено");
  if (existing.userId !== userId) throw new ForbiddenError();

  const slug = await getCategorySlug(input.categoryId);
  if (!slug) throw new NotFoundError("Категория не найдена");

  await db
    .update(services)
    .set({
      title: input.title,
      description: input.description,
      price: input.price,
      isNegotiable: input.isNegotiable,
      priceUnit: input.priceUnit,
      categoryId: input.categoryId,
      cityId: input.cityId,
      homeVisit: input.homeVisit,
    })
    .where(eq(services.id, input.id));

  await replaceServiceImages(input.id, input.imageUrls);

  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath(`/services/${slug}/${input.id}`);
  revalidatePath("/dashboard/services");

  redirect("/dashboard/services");
});

/**
 * Включение и выключение объявления владельцем.
 *
 * Меняет только `isActive`. Флаг модерации трогать нельзя: иначе пользователь
 * снимет скрытие, наложенное администратором.
 */
export const toggleServiceActive = authedAction(toggleServiceSchema, async (input, { userId }) => {
  const existing = await getServiceOwner(input.id);
  if (!existing) throw new NotFoundError("Объявление не найдено");
  if (existing.userId !== userId) throw new ForbiddenError();

  await db.update(services).set({ isActive: input.isActive }).where(eq(services.id, input.id));

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
});
