import { headers } from "next/headers";
import { UserBanToggle } from "@/features/admin/components/UserBanToggle";
import { getUsersForAdmin } from "@/features/admin/queries";
import { auth } from "@/lib/auth";
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
  const [session, users] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getUsersForAdmin(),
  ]);

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-1">Пользователи</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Блокировка закрывает вход и завершает активные сессии. Опубликованные объявления она не
        скрывает — их убирают на вкладках «Объявления» и «Задания»
      </p>

      {users.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
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

            const isSelf = user.id === session?.user.id;
            const isBanned = Boolean(user.banned);

            return (
              <div
                key={user.id}
                className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
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
                  {isBanned && user.banReason && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      Причина: {user.banReason}
                    </p>
                  )}
                </div>

                <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">
                  {formatShortDate(user.createdAt)}
                </span>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    isBanned
                      ? "bg-destructive/10 text-destructive"
                      : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  }`}
                >
                  {isBanned ? "Заблокирован" : "Активен"}
                </span>

                {/* Себя заблокировать нельзя — это запрещает и плагин, и действие.
                    Кнопку не показываем, чтобы не предлагать невозможное. */}
                {isSelf ? (
                  <span className="text-xs text-muted-foreground flex-shrink-0 w-8 text-center">
                    вы
                  </span>
                ) : (
                  <UserBanToggle userId={user.id} isBanned={isBanned} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
