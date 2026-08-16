import { ServiceCard } from "@/components/shared/ServiceCard";
import { getLatestServiceCards } from "@/features/services/queries";
import { formatServicePrice } from "@/lib/format";

/**
 * Белый фон — стандарт витрин маркетплейсов: карточки товаров ставят на белое,
 * а роль визуального якоря берёт на себя фото объявления, а не заливка карточки.
 */
export async function TopListings() {
  // Совпадает с числом колонок сетки на широком экране — блок занимает ровно
  // один ряд, последняя карточка не висит одна во втором
  const listings = await getLatestServiceCards(5);

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Свежие объявления</h2>
          <p className="text-muted-foreground mt-1">Специалисты, разместившиеся недавно</p>
        </div>

        {listings.length === 0 ? (
          <p className="text-muted-foreground">Объявлений пока нет</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {listings.map((listing) => (
              <ServiceCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                categorySlug={listing.categorySlug}
                city={listing.cityName}
                price={formatServicePrice(listing.price, listing.isNegotiable, listing.priceUnit)}
                authorName={listing.authorName}
                authorType={listing.authorType}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
