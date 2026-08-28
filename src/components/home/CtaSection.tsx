import { Briefcase } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

export function CtaSection({ isAuthenticated }: CtaSectionProps) {
  return (
    <section className="py-20 bg-muted">
      <PageContainer>
        <div className="p-12 md:p-16 rounded-3xl bg-white border-2 border-secondary relative overflow-hidden group flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="absolute top-8 right-8 opacity-5 text-secondary group-hover:scale-125 transition-transform duration-500 hidden md:block">
            <Briefcase className="h-32 w-32" />
          </div>

          <div className="relative z-10 max-w-xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-secondary">
              Принимаете заказы?
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Разместите услугу за 2 минуты. Без комиссий, без предоплаты — заказы напрямую от
              клиентов.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
            <Link
              href={isAuthenticated ? "/services/new" : "/register"}
              className="inline-block w-full md:w-auto text-center border-2 border-secondary text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-secondary hover:text-white transition-all active:scale-95"
            >
              Разместить услугу
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
