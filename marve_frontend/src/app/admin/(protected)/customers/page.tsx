
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import CustomerHeader from "@/src/components/admin/customer/CustomerHeader";

import CustomerSearch, {
  CustomerStatusFilter,
} from "@/src/components/admin/customer/CustomerSearch";

import CustomerTable from "@/src/components/admin/customer/CustomerTable";

import CustomerPagination from "@/src/components/admin/customer/CustomerPagination";

import CustomerSkeleton from "@/src/components/admin/customer/CustomerSkeleton";

import CustomerModal from "@/src/components/admin/customer/CustomerModal";

import useCustomer from "@/src/hooks/admin/useCustomer";

import type {
  Customer,
  CustomerStatus,
} from "@/src/types/admin/customer.types";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Page ========================= */

export default function CustomersPage() {
  /* ========================= API Hook ========================= */

  const {
    customers,
    selectedCustomer,
    pagination,
    statusCounts,
    isLoading,
    isFetchingDetails,
    isUpdatingStatus,
    isRefreshing,
    fetchCustomers,
    fetchCustomerDetails,
    updateCustomerStatus,
    fetchCustomerStatusCounts,
  } = useCustomer();

  /* ========================= Local UI State ========================= */

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<CustomerStatusFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [isCustomerModalOpen, setIsCustomerModalOpen] =
    useState(false);

  /* ========================= Load Customers ========================= */

  const loadCustomers = useCallback(async () => {
    try {
      await fetchCustomers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search.trim(),
        status,
      });
    } catch {
      // useCustomer handles API errors and displays notifications.
    }
  }, [
    fetchCustomers,
    currentPage,
    search,
    status,
  ]);

  /* ========================= Initial Load / Filter Changes ========================= */

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  /* ========================= Load Status Counts ========================= */

  const loadStatusCounts = useCallback(async () => {
    try {
      await fetchCustomerStatusCounts();
    } catch {
      // Error notification is handled by the hook.
    }
  }, [fetchCustomerStatusCounts]);

  useEffect(() => {
    void loadStatusCounts();
  }, [loadStatusCounts]);

  /* ========================= Search ========================= */

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearch(value);
  };

  /* ========================= Status Filter ========================= */

  const handleStatusChange = (
    value: CustomerStatusFilter,
  ) => {
    setCurrentPage(1);
    setStatus(value);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setCurrentPage(1);
  };

  /* ========================= View Customer ========================= */

  const handleView = async (customer: Customer) => {
    setIsCustomerModalOpen(true);

    try {
      await fetchCustomerDetails(customer.id);
    } catch {
      // The hook handles the API error notification.
    }
  };

  /* ========================= Update Customer Status ========================= */

  const handleToggleStatus = async (customer: Customer) => {
    let nextStatus: CustomerStatus;

    if (customer.status === "ACTIVE") {
      nextStatus = "INACTIVE";
    } else {
      // INACTIVE and BLOCKED customers can be reactivated.
      nextStatus = "ACTIVE";
    }

    try {
      await updateCustomerStatus(customer.id, nextStatus);

      await Promise.all([
        loadCustomers(),
        loadStatusCounts(),
      ]);
    } catch {
      // The hook handles the API error notification.
    }
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    try {
      await Promise.all([
        loadCustomers(),
        loadStatusCounts(),
      ]);

      toast.success("Customer list refreshed.");
    } catch {
      // Errors are handled by the hook.
    }
  };

  /* ========================= Close Modal ========================= */

  const handleCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    pagination.totalPages || 1,
  );

  const totalItems = pagination.count;

  /*
   * If the current page becomes invalid after a deletion,
   * return to the last available page.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* ========================= Navbar ========================= */}

      <AdminNavbar />

      {/* ========================= Main Content ========================= */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* ========================= Header ========================= */}

          <CustomerHeader
            totalCustomers={statusCounts.ALL}
            onRefresh={handleRefresh}
            isLoading={
              isLoading ||
              isRefreshing ||
              isUpdatingStatus
            }
          />

          {/* ========================= Search / Filters ========================= */}

          <CustomerSearch
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onReset={handleReset}
          />

          {/* ========================= Status Summary ========================= */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                {
                  label: "All Customers",
                  value: statusCounts.ALL,
                },
                {
                  label: "Active",
                  value: statusCounts.ACTIVE,
                },
                {
                  label: "Inactive",
                  value: statusCounts.INACTIVE,
                },
                {
                  label: "Blocked",
                  value: statusCounts.BLOCKED,
                },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#6B3E1E]/10 bg-white p-4"
              >
                <p className="text-[10px] font-medium text-[#8A7D72]">
                  {item.label}
                </p>

                <p className="mt-1 text-xl font-semibold text-[#29231F]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* ========================= Table ========================= */}

          {isLoading ? (
            <CustomerSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <CustomerTable
              customers={customers}
              onView={handleView}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading && totalItems > 0 && (
            <CustomerPagination
              currentPage={pagination.page || currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pagination.limit || ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ========================= Customer Details Modal ========================= */}

      <CustomerModal
        isOpen={isCustomerModalOpen}
        customer={selectedCustomer}
        isLoading={isFetchingDetails}
        onClose={handleCloseModal}
      />

    </main>
  );
}
