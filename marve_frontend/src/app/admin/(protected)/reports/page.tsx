"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import ReportsHeader from "@/src/components/admin/reports/ReportsHeader";

import ReportsSummary from "@/src/components/admin/reports/ReportsSummary";

import ReportsSearch, {
  ReportDateRangeFilter,
  ReportStatusFilter,
  ReportTypeFilter,
} from "@/src/components/admin/reports/ReportsSearch";

import ReportsTable, {
  Report,
} from "@/src/components/admin/reports/ReportsTable";

import ReportsPagination from "@/src/components/admin/reports/ReportsPagination";

import ReportsSkeleton from "@/src/components/admin/reports/ReportsSkeleton";

import ReportsModal from "@/src/components/admin/reports/ReportsModal";

import ReportsExportModal from "@/src/components/admin/reports/ReportsExportModal";

import ReportsChart from "@/src/components/admin/reports/ReportsChart";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Demo Data ========================= */

const INITIAL_REPORTS: Report[] = [
  {
    id: 1,
    reportId: "RPT-2026-001",
    type: "SALES",
    status: "COMPLETED",
    title: "September Sales Report",
    description:
      "Sales performance report for September 2026.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T18:30:00",
    totalAmount: 248950,
    totalOrders: 86,
    totalItems: 142,
    createdAt: "2026-09-30T18:30:00",
    updatedAt: "2026-09-30T18:30:00",
  },

  {
    id: 2,
    reportId: "RPT-2026-002",
    type: "ORDERS",
    status: "COMPLETED",
    title: "September Orders Report",
    description:
      "Order activity and fulfillment summary.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T17:45:00",
    totalOrders: 86,
    totalItems: 142,
    createdAt: "2026-09-30T17:45:00",
    updatedAt: "2026-09-30T17:45:00",
  },

  {
    id: 3,
    reportId: "RPT-2026-003",
    type: "PRODUCTS",
    status: "COMPLETED",
    title: "Product Performance Report",
    description:
      "Product sales and performance overview.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T16:20:00",
    totalProducts: 128,
    totalItems: 142,
    totalAmount: 198500,
    productName:
      "Premium Ceramic Dinner Set",
    categoryName: "Dining & Serveware",
    createdAt: "2026-09-30T16:20:00",
    updatedAt: "2026-09-30T16:20:00",
  },

  {
    id: 4,
    reportId: "RPT-2026-004",
    type: "CUSTOMERS",
    status: "COMPLETED",
    title: "Customer Activity Report",
    description:
      "Customer growth and purchase activity.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T15:10:00",
    totalCustomers: 64,
    totalOrders: 86,
    totalAmount: 248950,
    customerName: "Aarav Mehta",
    customerEmail:
      "aarav.mehta@example.com",
    createdAt: "2026-09-30T15:10:00",
    updatedAt: "2026-09-30T15:10:00",
  },

  {
    id: 5,
    reportId: "RPT-2026-005",
    type: "INVENTORY",
    status: "COMPLETED",
    title: "Inventory Status Report",
    description:
      "Current inventory and stock status.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T14:30:00",
    totalProducts: 128,
    totalItems: 742,
    categoryName: "Kitchen Essentials",
    createdAt: "2026-09-30T14:30:00",
    updatedAt: "2026-09-30T14:30:00",
  },

  {
    id: 6,
    reportId: "RPT-2026-006",
    type: "PAYMENTS",
    status: "COMPLETED",
    title: "Payment Summary Report",
    description:
      "Payment collection and transaction summary.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T13:40:00",
    totalAmount: 241500,
    totalOrders: 86,
    paymentMethod: "UPI",
    createdAt: "2026-09-30T13:40:00",
    updatedAt: "2026-09-30T13:40:00",
  },

  {
    id: 7,
    reportId: "RPT-2026-007",
    type: "RETURNS",
    status: "COMPLETED",
    title: "Returns & Refunds Report",
    description:
      "Return requests and refund activity.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T12:20:00",
    totalOrders: 9,
    totalAmount: 10891,
    refundAmount: 10891,
    totalItems: 9,
    createdAt: "2026-09-30T12:20:00",
    updatedAt: "2026-09-30T12:20:00",
  },

  {
    id: 8,
    reportId: "RPT-2026-008",
    type: "OFFERS",
    status: "ACTIVE",
    title: "Offer Performance Report",
    description:
      "Offer usage and discount performance.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T11:10:00",
    totalAmount: 78500,
    totalOrders: 24,
    discountAmount: 6400,
    createdAt: "2026-09-30T11:10:00",
    updatedAt: "2026-09-30T11:10:00",
  },

  {
    id: 9,
    reportId: "RPT-2026-009",
    type: "SALES",
    status: "COMPLETED",
    title: "Last 7 Days Sales Report",
    description:
      "Sales performance for the last seven days.",
    startDate: "2026-09-24T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-30T10:20:00",
    totalAmount: 68450,
    totalOrders: 24,
    totalItems: 39,
    createdAt: "2026-09-30T10:20:00",
    updatedAt: "2026-09-30T10:20:00",
  },

  {
    id: 10,
    reportId: "RPT-2026-010",
    type: "ORDERS",
    status: "PROCESSING",
    title: "Pending Order Analysis",
    description:
      "Orders currently requiring fulfillment.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-29T18:30:00",
    totalOrders: 12,
    totalItems: 19,
    createdAt: "2026-09-29T18:30:00",
    updatedAt: "2026-09-29T18:30:00",
  },

  {
    id: 11,
    reportId: "RPT-2026-011",
    type: "PRODUCTS",
    status: "PENDING",
    title: "Low Stock Product Report",
    description:
      "Products requiring inventory attention.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-29T16:15:00",
    totalProducts: 14,
    totalItems: 28,
    productName:
      "Modern Kitchen Container Set",
    categoryName: "Storage & Organizers",
    createdAt: "2026-09-29T16:15:00",
    updatedAt: "2026-09-29T16:15:00",
  },

  {
    id: 12,
    reportId: "RPT-2026-012",
    type: "CUSTOMERS",
    status: "COMPLETED",
    title: "New Customer Report",
    description:
      "New customer registrations for the current period.",
    startDate: "2026-09-24T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-29T14:40:00",
    totalCustomers: 18,
    totalOrders: 11,
    totalAmount: 28600,
    customerName: "Diya Shah",
    customerEmail:
      "diya.shah@example.com",
    createdAt: "2026-09-29T14:40:00",
    updatedAt: "2026-09-29T14:40:00",
  },

  {
    id: 13,
    reportId: "RPT-2026-013",
    type: "PAYMENTS",
    status: "FAILED",
    title: "Failed Payment Report",
    description:
      "Payment transactions that require review.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-29T13:20:00",
    totalAmount: 12800,
    totalOrders: 5,
    paymentMethod: "CARD",
    createdAt: "2026-09-29T13:20:00",
    updatedAt: "2026-09-29T13:20:00",
  },

  {
    id: 14,
    reportId: "RPT-2026-014",
    type: "RETURNS",
    status: "PENDING",
    title: "Pending Return Requests",
    description:
      "Return requests waiting for admin review.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-29T11:50:00",
    totalOrders: 6,
    refundAmount: 7490,
    totalAmount: 7490,
    totalItems: 6,
    createdAt: "2026-09-29T11:50:00",
    updatedAt: "2026-09-29T11:50:00",
  },

  {
    id: 15,
    reportId: "RPT-2026-015",
    type: "OFFERS",
    status: "INACTIVE",
    title: "Inactive Offers Report",
    description:
      "Offers that are no longer active.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-28T17:10:00",
    totalOrders: 31,
    totalAmount: 92400,
    discountAmount: 8200,
    createdAt: "2026-09-28T17:10:00",
    updatedAt: "2026-09-28T17:10:00",
  },

  {
    id: 16,
    reportId: "RPT-2026-016",
    type: "INVENTORY",
    status: "FAILED",
    title: "Inventory Sync Report",
    description:
      "Inventory synchronization report requiring attention.",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-09-30T23:59:59",
    date: "2026-09-28T15:30:00",
    totalProducts: 128,
    totalItems: 742,
    categoryName: "All Categories",
    createdAt: "2026-09-28T15:30:00",
    updatedAt: "2026-09-28T15:30:00",
  },
];

/* ========================= Page ========================= */

export default function ReportsPage() {
  /* ========================= State ========================= */

  const [reports, setReports] =
    useState<Report[]>(INITIAL_REPORTS);

  const [search, setSearch] =
    useState("");

  const [reportType, setReportType] =
    useState<ReportTypeFilter>("ALL");

  const [reportStatus, setReportStatus] =
    useState<ReportStatusFilter>("ALL");

  const [dateRange, setDateRange] =
    useState<ReportDateRangeFilter>("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    isReportsModalOpen,
    setIsReportsModalOpen,
  ] = useState(false);

  const [
    selectedReport,
    setSelectedReport,
  ] = useState<Report | null>(null);

  const [
    isExportModalOpen,
    setIsExportModalOpen,
  ] = useState(false);

  /* ========================= Filtering ========================= */

  const filteredReports = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return reports.filter((report) => {
      /* ========================= Search ========================= */

      const matchesSearch =
        normalizedSearch.length === 0 ||
        (
          report.reportId ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        report.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.description ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        report.type
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.status ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.customerName ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.customerEmail ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.productName ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.categoryName ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          report.paymentMethod ?? ""
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          report.id,
        )
          .toLowerCase()
          .includes(normalizedSearch);

      /* ========================= Type ========================= */

      const matchesType =
        reportType === "ALL" ||
        report.type === reportType;

      /* ========================= Status ========================= */

      const matchesStatus =
        reportStatus === "ALL" ||
        report.status === reportStatus;

      /* ========================= Date Range ========================= */

      const matchesDateRange =
        matchesReportDateRange(
          report,
          dateRange,
        );

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDateRange
      );
    });
  }, [
    reports,
    search,
    reportType,
    reportStatus,
    dateRange,
  ]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReports.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedReports = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredReports.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [
    filteredReports,
    currentPage,
  ]);

  /* ========================= Page Safety ========================= */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* ========================= Search ========================= */

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ========================= Type Filter ========================= */

  const handleReportTypeChange = (
    value: ReportTypeFilter,
  ) => {
    setReportType(value);
    setCurrentPage(1);
  };

  /* ========================= Status Filter ========================= */

  const handleReportStatusChange = (
    value: ReportStatusFilter,
  ) => {
    setReportStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Date Filter ========================= */

  const handleDateRangeChange = (
    value: ReportDateRangeFilter,
  ) => {
    setDateRange(value);
    setCurrentPage(1);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setReportType("ALL");
    setReportStatus("ALL");
    setDateRange("ALL");
    setCurrentPage(1);
  };

  /* ========================= View Report ========================= */

  const handleView = (
    report: Report,
  ) => {
    setSelectedReport(report);
    setIsReportsModalOpen(true);
  };

  /* ========================= Close Details Modal ========================= */

  const handleCloseReportsModal =
    () => {
      setIsReportsModalOpen(false);
      setSelectedReport(null);
    };

  /* ========================= Export ========================= */

  const handleOpenExport = () => {
    setIsExportModalOpen(true);
  };

  const handleCloseExport = () => {
    setIsExportModalOpen(false);
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    setReports(INITIAL_REPORTS);

    setIsLoading(false);
  };

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* ========================= Navbar ========================= */}

      <AdminNavbar />

      {/* ========================= Main Content ========================= */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* ========================= Header ========================= */}

          <ReportsHeader
            totalReports={reports.length}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* ========================= Summary ========================= */}

          <ReportsSummary
            reports={reports}
          />

          {/* ========================= Search / Filters ========================= */}

          <ReportsSearch
            search={search}
            reportType={reportType}
            reportStatus={reportStatus}
            dateRange={dateRange}
            onSearchChange={
              handleSearchChange
            }
            onReportTypeChange={
              handleReportTypeChange
            }
            onReportStatusChange={
              handleReportStatusChange
            }
            onDateRangeChange={
              handleDateRangeChange
            }
            onReset={handleReset}
          />

          {/* ========================= Report Actions ========================= */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleOpenExport}
              disabled={
                isLoading ||
                filteredReports.length === 0
              }
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#6B3E1E] px-4 text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(107,62,30,0.12)] transition-all duration-150 hover:bg-[#593218] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export Reports
            </button>
          </div>

          {/* ========================= Table ========================= */}

          {isLoading ? (
            <ReportsSkeleton
              rows={ITEMS_PER_PAGE}
            />
          ) : (
            <ReportsTable
              reports={paginatedReports}
              onView={handleView}
            />
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading &&
            filteredReports.length > 0 && (
              <ReportsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={
                  filteredReports.length
                }
                itemsPerPage={
                  ITEMS_PER_PAGE
                }
                onPageChange={
                  setCurrentPage
                }
              />
            )}
            {/* ========================= Reports Charts ========================= */}

            <ReportsChart />
            
        </div>
      </div>

      {/* ========================= Report Details Modal ========================= */}

      <ReportsModal
        isOpen={isReportsModalOpen}
        report={selectedReport}
        onClose={handleCloseReportsModal}
      />

      {/* ========================= Export Modal ========================= */}

      <ReportsExportModal
        isOpen={isExportModalOpen}
        reports={filteredReports}
        onClose={handleCloseExport}
      />
    </main>
  );
}

/* ========================= Date Range Helper ========================= */

function matchesReportDateRange(
  report: Report,
  dateRange: ReportDateRangeFilter,
) {
  if (dateRange === "ALL") {
    return true;
  }

  if (dateRange === "CUSTOM") {
    /*
     * Custom range ke actual From / To dates
     * later page-level date picker se connect
     * kiye ja sakte hain.
     *
     * Abhi CUSTOM selected hone par available
     * reports ko hide nahi kar rahe.
     */
    return true;
  }

  const reportDateValue =
    report.date ??
    report.updatedAt ??
    report.createdAt ??
    report.endDate ??
    report.startDate;

  if (!reportDateValue) {
    return false;
  }

  const reportDate =
    new Date(reportDateValue);

  if (
    Number.isNaN(
      reportDate.getTime(),
    )
  ) {
    return false;
  }

  const now = new Date();

  /* ========================= Today ========================= */

  if (dateRange === "TODAY") {
    return isSameDay(
      reportDate,
      now,
    );
  }

  /* ========================= Yesterday ========================= */

  if (dateRange === "YESTERDAY") {
    const yesterday =
      new Date(now);

    yesterday.setDate(
      yesterday.getDate() - 1,
    );

    return isSameDay(
      reportDate,
      yesterday,
    );
  }

  /* ========================= Last 7 Days ========================= */

  if (dateRange === "LAST_7_DAYS") {
    const start =
      new Date(now);

    start.setDate(
      start.getDate() - 6,
    );

    start.setHours(
      0,
      0,
      0,
      0,
    );

    const end =
      new Date(now);

    end.setHours(
      23,
      59,
      59,
      999,
    );

    return (
      reportDate >= start &&
      reportDate <= end
    );
  }

  /* ========================= Last 30 Days ========================= */

  if (dateRange === "LAST_30_DAYS") {
    const start =
      new Date(now);

    start.setDate(
      start.getDate() - 29,
    );

    start.setHours(
      0,
      0,
      0,
      0,
    );

    const end =
      new Date(now);

    end.setHours(
      23,
      59,
      59,
      999,
    );

    return (
      reportDate >= start &&
      reportDate <= end
    );
  }

  /* ========================= This Month ========================= */

  if (dateRange === "THIS_MONTH") {
    const start =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );

    const end =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

    return (
      reportDate >= start &&
      reportDate <= end
    );
  }

  /* ========================= Last Month ========================= */

  if (dateRange === "LAST_MONTH") {
    const start =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );

    const end =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999,
      );

    return (
      reportDate >= start &&
      reportDate <= end
    );
  }

  return true;
}

/* ========================= Same Day ========================= */

function isSameDay(
  first: Date,
  second: Date,
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}