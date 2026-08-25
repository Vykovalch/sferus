import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { PageContainer } from "@/components/shared/PageContainer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-56 flex-shrink-0 lg:sticky lg:top-6">
            <DashboardSidebar />
          </aside>
          <div className="flex-1 min-w-0 max-w-2xl">{children}</div>
        </div>
      </PageContainer>
    </div>
  );
}
