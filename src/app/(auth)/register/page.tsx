import type { Metadata } from "next";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация — Sferus",
};

export default function RegisterPage() {
  return (
    <>
      <AuthBrand />

      <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-background w-full">
        <div className="w-full max-w-[400px] mx-auto">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
