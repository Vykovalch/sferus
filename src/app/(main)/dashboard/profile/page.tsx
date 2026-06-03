import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-xl p-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>ИИ</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Иван Иванов</CardTitle>
            <p className="text-sm text-muted-foreground">Тирасполь</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 border-t">
          <div>
            <p className="text-xs font-medium text-muted-foreground">О себе</p>
            <p className="text-sm">Предоставляю услуги по ремонту и отделке квартир.</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Контакты</p>
            <p className="text-sm">Телефон: +373 (777) 12-345</p>
            <p className="text-sm text-primary">Telegram: @ivan_pmr</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}