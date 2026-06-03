import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const services = [
    { id: 1, title: "Укладка ламината", price: "80 руб. ПМР / кв.м" },
    { id: 2, title: "Выравнивание стен под покраску", price: "120 руб. ПМР / кв.м" },
  ];

  return (
    <div className="container mx-auto max-w-xl p-4 py-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Мои услуги</h1>
        <Button size="sm">+ Добавить услугу</Button>
      </div>
      <div className="space-y-2">
        {services.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-primary">{item.price}</p>
              </div>
              <Button variant="outline" size="sm">
                Удалить
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}