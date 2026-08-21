import type { MetadataRoute } from "next";
import { getCategories } from "@/features/categories/queries";
import { getServiceSitemapEntries } from "@/features/services/queries";
import { getTaskSitemapEntries } from "@/features/tasks/queries";
import { absoluteUrl } from "@/lib/site";

/**
 * Карта сайта.
 *
 * Перечитывается раз в час, а не на каждый запрос: объявления добавляются
 * штучно, и гонять три запроса к базе на каждое обращение робота незачем.
 * Час — компромисс между свежестью и нагрузкой; новое объявление всё равно
 * находится по внутренним ссылкам раньше, чем робот перечитает карту.
 */
export const revalidate = 3600;

/**
 * В карту попадает только то, что публично доступно и имеет смысл в выдаче.
 *
 * Не попадают: кабинет и админка (закрыты входом), страницы входа
 * и регистрации (в выдаче не нужны), результаты поиска и отфильтрованные
 * каталоги (адресов бесконечно много, а содержимое то же самое),
 * постраничные адреса каталогов (робот дойдёт по ссылкам сам).
 *
 * Ограничение формата — 50 000 адресов на файл. До него далеко; когда
 * приблизимся, карта разбивается через `generateSitemaps`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, services, tasks] = await Promise.all([
    getCategories(),
    getServiceSitemapEntries(),
    getTaskSitemapEntries(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/tasks"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/services/${category.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Объявления — то, ради чего площадка вообще попадает в выдачу,
  // поэтому приоритет у них выше, чем у служебных страниц.
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.categorySlug}/${service.id}`),
    lastModified: service.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const taskPages: MetadataRoute.Sitemap = tasks.map((task) => ({
    url: absoluteUrl(`/tasks/${task.id}`),
    lastModified: task.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...servicePages, ...taskPages];
}
