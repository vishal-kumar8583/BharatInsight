import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Dashboard – Bharat Insight",
};

export default function DashboardPage() {
  return (
    <PageTransition>
      <DashboardLayout />
    </PageTransition>
  );
}
