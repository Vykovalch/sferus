import { Card, CardContent } from "@/components/ui/card";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto max-w-xl p-4 py-8 space-y-4">
      <h1 className="text-xl font-bold">Избранное</h1>
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Список избранного пуст.
        </CardContent>
      </Card>
    </div>
  );
}