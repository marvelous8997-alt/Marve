import type { Metadata } from "next";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import AnalyticsHeader from "@/src/components/admin/analytics/AnalyticsHeader";
import AnalyticsFilters from "@/src/components/admin/analytics/AnalyticsFilters";
import AnalyticsStats from "@/src/components/admin/analytics/AnalyticsStats";
import AnalyticsSalesOverview from "@/src/components/admin/analytics/AnalyticsSalesOverview";
import AnalyticsOrdersOverview from "@/src/components/admin/analytics/AnalyticsOrdersOverview";
import AnalyticsCustomerInsights from "@/src/components/admin/analytics/AnalyticsCustomerInsights";
import AnalyticsProductPerformance from "@/src/components/admin/analytics/AnalyticsProductPerformance";
import AnalyticsCategoryPerformance from "@/src/components/admin/analytics/AnalyticsCategoryPerformance";
import AnalyticsFulfillment from "@/src/components/admin/analytics/AnalyticsFulfillment";

/* ========================= Metadata ========================= */

export const metadata: Metadata = {
  title: "Analytics | MARVE Admin",
  description:
    "Track sales, orders, customers, products and store performance from the MARVE admin analytics dashboard.",
};

/* ========================= Page ========================= */

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* ========================= Navbar ========================= */}

      <AdminNavbar />

      {/* ========================= Main Content ========================= */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* Page Header */}

          <AnalyticsHeader />

          {/* Date / Period Filters */}

          <AnalyticsFilters />

          {/* Key Metrics */}

          <AnalyticsStats />

          {/* Sales */}

          <AnalyticsSalesOverview />

          {/* Orders */}

          <AnalyticsOrdersOverview />

          {/* Customers */}

          <AnalyticsCustomerInsights />

          {/* Product Performance */}

          <AnalyticsProductPerformance />

          {/* Category Performance */}

          <AnalyticsCategoryPerformance />

          {/* Fulfillment */}

          <AnalyticsFulfillment />
        </div>
      </div>
    </main>
  );
}