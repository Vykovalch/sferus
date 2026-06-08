import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/dashboard", "/tasks/new", "/services/new"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // 1. Защищённые роуты — требуют авторизации
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Авторизованный не должен видеть /login, /register и т.д.
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    // Проверяем что сессия реально валидна, а не только кука существует
    const sessionRes = await fetch(new URL("/api/auth/get-session", request.url), {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });

    if (sessionRes.ok) {
      const data = await sessionRes.json();
      if (data?.user) {
        // Сессия валидна — редиректим на главную
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Кука есть, но сессия невалидна — пропускаем на /login
    return NextResponse.next();
  }

  // 3. Проверка подтверждения email для защищённых роутов
  if (isAuthenticated && isProtected) {
    if (!pathname.startsWith("/verify-email")) {
      const sessionRes = await fetch(new URL("/api/auth/get-session", request.url), {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });
      if (sessionRes.ok) {
        const data = await sessionRes.json();
        if (data?.user && !data.user.emailVerified) {
          const url = new URL("/verify-email", request.url);
          url.searchParams.set("email", data.user.email);
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon\\.svg|apple-icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};