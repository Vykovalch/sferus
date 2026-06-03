import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-xl p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Настройки профиля</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="user-name" className="text-xs font-medium">
              Имя
            </label>
            <Input id="user-name" defaultValue="Иван Иванов" />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-phone" className="text-xs font-medium">
              Телефон
            </label>
            <Input id="user-phone" defaultValue="+373 (777) 12-345" />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-telegram" className="text-xs font-medium">
              Telegram
            </label>
            <Input id="user-telegram" defaultValue="@ivan_pmr" />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-about" className="text-xs font-medium">
              О себе
            </label>
            <Textarea
              id="user-about"
              defaultValue="Предоставляю услуги по ремонту и отделке квартир."
              rows={3}
            />
          </div>
          <Button className="w-full">Сохранить изменения</Button>
        </CardContent>
      </Card>
    </div>
  );
}