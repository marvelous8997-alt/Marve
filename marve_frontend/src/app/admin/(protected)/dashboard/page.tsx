import type { Metadata } from "next";

import AdminNavbar from "@/src/components/admin/AdminNavbar";
import DashboardWelcome from "@/src/components/admin/dashboard/DashboardWelcome";
import DashboardStats from "@/src/components/admin/dashboard/DashboardStats";
import DashboardSalesOverview from "@/src/components/admin/dashboard/DashboardSalesOverview";
import DashboardRecentOrders from "@/src/components/admin/dashboard/DashboardRecentOrders";
import DashboardTopProducts from "@/src/components/admin/dashboard/DashboardTopProducts";
import DashboardRecentTestimonials from "@/src/components/admin/dashboard/DashboardRecentTestimonials";

export const metadata: Metadata = {
  title: "Dashboard | MARVE Admin",
  description:
    "Manage and monitor your MARVE store from the admin dashboard.",
};

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          <DashboardWelcome />

          <DashboardStats />

          <DashboardSalesOverview />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
            <DashboardRecentOrders />

            <DashboardTopProducts />
          </div>

          <DashboardRecentTestimonials />
        </div>
      </div>
    </main>
  );
}