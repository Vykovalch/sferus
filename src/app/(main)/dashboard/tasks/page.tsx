import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  const tasks = [{ id: 1, title: "Починить розетку на кухне", budget: "50 руб.", count: 2 }];

  return (
    <div className="container mx-auto max-w-xl p-4 py-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Мои задания</h1>
        <Button size="sm">+ Создать задание</Button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-xs text-muted-foreground">Бюджет: {task.budget}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Отклики: {task.count}</Badge>
                <Button size="sm" variant="outline">
                  Смотреть
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}