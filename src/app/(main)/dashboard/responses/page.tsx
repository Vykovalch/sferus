import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProposalsPage() {
  const proposals = [{ id: 1, task: "Ремонт стиральной машины", status: "На рассмотрении" }];

  return (
    <div className="container mx-auto max-w-xl p-4 py-8 space-y-4">
      <h1 className="text-xl font-bold">Мои отклики</h1>
      <div className="space-y-2">
        {proposals.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <p className="font-medium text-sm">{item.task}</p>
              <Badge variant="outline">{item.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}