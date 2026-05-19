import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Войти — Sferus",
};

export default function LoginPage() {
  return (
    <>
      <AuthBrand />
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
