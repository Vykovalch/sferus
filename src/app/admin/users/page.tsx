import { UserBanToggle } from "@/features/admin/components/UserBanToggle";
import { requireAdminSession } from "@/features/admin/guard";
import { getUsersForAdmin } from "@/features/admin/queries";
import { formatShortDate } from "@/lib/format";

/**
 * Пользователи и блокировка доступа.
 *
 * Ролей «заказчик» и «исполнитель» в проекте нет: пользователь универсален
 * и может одновременно публиковать услуги и создавать задания
 * (DATA-MODEL.md, «Пользователь универсален»). Единственная роль в списке —
 * административная, она приходит из плагина `admin`.
 */
export default async function AdminUsersPage() {
  // Layout не перерендеривается при клиентской навигации, поэтому проверка
  // роли стоит и здесь. Заодно отсюда берётся сессия — второй запрос не нужен.
  const session = await requireAdminSession();
  const users = await getUsersForAdmin();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Пользователи</h1>
      <p className="text-sm text-muted-foreground mb-4 lg:mb-6">
        Блокировка закрывает вход и завершает активные сессии. Опубликованные объявления она не
        скрывает — их убирают на вкладках «Объявления» и «Задания»
      </p>

      {users.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет пользователей
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const initials = user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const isSelf = user.id === session.user.id;
            const isBanned = Boolean(user.banned);

            return (
              // Строка по общим правилам списков кабинета. Дата регистрации
              // и состояние ушли в ту же строку, что email: до 2026-10-01
              // аватар, имя, дата, плашка и кнопка стояли в один ряд, и на
              // 375px имени с адресом оставалось около 70px.
              <div
                key={user.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-start gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-sm font-bold text-brand flex-shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    {user.role === "admin" && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand/10 text-brand flex-shrink-0">
                        Админ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatShortDate(user.createdAt)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        isBanned
                          ? "bg-destructive/10 text-destructive"
                          : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      }`}
                    >
                      {isBanned ? "Заблокирован" : "Активен"}
                    </span>
                    {isBanned && user.banReason && <span>Причина: {user.banReason}</span>}
                  </div>
                </div>

                {/* Себя заблокировать нельзя — это запрещает и плагин, и действие.
                    Кнопку не показываем, чтобы не предлагать невозможное. */}
                <div className="w-full sm:w-auto flex items-center justify-end flex-shrink-0">
                  {isSelf ? (
                    <span className="text-xs text-muted-foreground w-10 text-center">вы</span>
                  ) : (
                    <UserBanToggle userId={user.id} isBanned={isBanned} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
