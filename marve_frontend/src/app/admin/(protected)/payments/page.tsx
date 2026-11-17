"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import AdminNavbar from "@/src/components/admin/AdminNavbar";
import PaymentHeader from "@/src/components/admin/payment/PaymentHeader";
import PaymentSummary from "@/src/components/admin/payment/PaymentSummary";
import PaymentSearch, {
  PaymentMethodFilter,
  PaymentStatusFilter,
} from "@/src/components/admin/payment/PaymentSearch";
import PaymentTable, {
  mapApiPaymentToTablePayment,
} from "@/src/components/admin/payment/PaymentTable";
import PaymentPagination from "@/src/components/admin/payment/PaymentPagination";
import PaymentSkeleton from "@/src/components/admin/payment/PaymentSkeleton";
import PaymentModal from "@/src/components/admin/payment/PaymentModal";
import PaymentRefundModal from "@/src/components/admin/payment/PaymentRefundModal";

import usePayment from "@/src/hooks/admin/usePayment";

import type {
  Payment as ApiPayment,
  PaymentFilters,
  PaymentMethod,
  PaymentStatus,
} from "@/src/types/admin/payment.types";
import type { TablePayment } from "@/src/components/admin/payment/PaymentTable";

import type {
  RefundPaymentFormValues,
} from "@/src/validations/admin/payment.validation";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Page ========================= */

export default function PaymentsPage() {
const {
  payments: apiPayments,
  summary,
  pagination,
  isLoading,
  isRefunding,
  fetchPayments,
  fetchPaymentDetails,
  fetchPaymentSummary,
  refundPayment,
} = usePayment();

  /* ========================= UI State ========================= */

  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusFilter>("ALL");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isPaymentModalOpen, setIsPaymentModalOpen] =
    useState(false);
const [selectedPayment, setSelectedPayment] =
  useState<ApiPayment | null>(null);

const [isRefundModalOpen, setIsRefundModalOpen] =
  useState(false);

const [selectedRefundPayment, setSelectedRefundPayment] =
  useState<ApiPayment | null>(null);

  /* ========================= Map API Data ========================= */

const payments = useMemo<TablePayment[]>(
  () => apiPayments.map(mapApiPaymentToTablePayment),
  [apiPayments],
);

  /* ========================= Fetch Payments ========================= */

  const loadPayments = useCallback(async () => {
    const filters: PaymentFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status:
        paymentStatus === "ALL"
          ? undefined
          : (paymentStatus as PaymentStatus),
      method:
        paymentMethod === "ALL"
          ? undefined
          : (paymentMethod as PaymentMethod),
      sortBy: "createdAt",
      sortOrder: "DESC",
    };

    try {
      await fetchPayments(filters);
    } catch {
      // Error is already handled by usePayment.
    }
  }, [
    currentPage,
    search,
    paymentStatus,
    paymentMethod,
    fetchPayments,
  ]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  /* ========================= Fetch Summary ========================= */

  const loadSummary = useCallback(async () => {
    try {
      await fetchPaymentSummary();
    } catch {
      // Error is already handled by usePayment.
    }
  }, [fetchPaymentSummary]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  /* ========================= Pagination ========================= */

  const totalItems = pagination.count;
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ========================= Search / Filters ========================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePaymentStatusChange = (
    value: PaymentStatusFilter,
  ) => {
    setPaymentStatus(value);
    setCurrentPage(1);
  };

  const handlePaymentMethodChange = (
    value: PaymentMethodFilter,
  ) => {
    setPaymentMethod(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setPaymentStatus("ALL");
    setPaymentMethod("ALL");
    setCurrentPage(1);
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    await Promise.all([
      loadPayments(),
      loadSummary(),
    ]);

    toast.success("Payments refreshed.");
  };

  /* ========================= View Payment ========================= */
const handleView = async (payment: ApiPayment) => {
  if (!payment.uuid) {
    toast.error("Payment UUID is missing.");
    return;
  }

  setSelectedPayment(payment);

  try {
    await fetchPaymentDetails(payment.uuid);
    setIsPaymentModalOpen(true);
  } catch {
    // Error is already handled by usePayment.
  }
};

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  /* ========================= Refund Modal ========================= */

const handleRefund = (payment: ApiPayment) => {
  if (!payment.uuid) {
    toast.error("Payment UUID is missing.");
    return;
  }

  if (
    payment.status !== "PAID" &&
    payment.status !== "CAPTURED"
  ) {
    toast.error("Only captured payments can be refunded.");
    return;
  }

  setSelectedRefundPayment(payment);
  setIsRefundModalOpen(true);
};

  const handleCloseRefundModal = () => {
    if (isRefunding) return;

    setIsRefundModalOpen(false);
    setSelectedRefundPayment(null);
  };

  /* ========================= Confirm Refund ========================= */

const handleConfirmRefund = async (
  payment: ApiPayment,
  refundAmount: number,
  reason: string,
) => {
  const identifier = payment.uuid;

  if (!identifier) {
    toast.error("Payment UUID is missing.");
    return;
  }

  const allowedReasons = [
    "CUSTOMER_REQUEST",
    "ORDER_CANCELLED",
    "PRODUCT_RETURNED",
    "PRODUCT_DAMAGED",
    "DUPLICATE_PAYMENT",
    "PAYMENT_ERROR",
    "OTHER",
  ] as const;

  const normalizedReason = reason.toUpperCase();

  if (
    !allowedReasons.includes(
      normalizedReason as (typeof allowedReasons)[number],
    )
  ) {
    toast.error("Please select a valid refund reason.");
    return;
  }

  const refundValues: RefundPaymentFormValues = {
    amount: refundAmount,
    reason:
      normalizedReason as RefundPaymentFormValues["reason"],
  };

  try {
    await refundPayment(identifier, refundValues);

    setIsRefundModalOpen(false);
    setSelectedRefundPayment(null);

    await Promise.all([
      loadPayments(),
      loadSummary(),
    ]);
  } catch {
    // Error is already handled by usePayment.
  }
};

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* Header */}

          <PaymentHeader
            totalPayments={totalItems}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* Summary */}

          <PaymentSummary
            payments={payments}
            summary={summary}
          />

          {/* Search / Filters */}

          <PaymentSearch
            search={search}
            paymentStatus={paymentStatus}
            paymentMethod={paymentMethod}
            onSearchChange={handleSearchChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onPaymentMethodChange={handlePaymentMethodChange}
            onReset={handleReset}
          />

          {/* Table */}

          {isLoading ? (
            <PaymentSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <PaymentTable
              payments={payments}
              onView={handleView}
              onRefund={handleRefund}
              isRefunding={isRefunding}
            />
          )}

          {/* Pagination */}

          {!isLoading && totalItems > 0 && (
            <PaymentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Payment Details Modal */}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        payment={selectedPayment}
        onClose={handleClosePaymentModal}
      />

      {/* Refund Modal */}

      <PaymentRefundModal
        isOpen={isRefundModalOpen}
        payment={selectedRefundPayment}
        onClose={handleCloseRefundModal}
        onConfirm={handleConfirmRefund}
        isLoading={isRefunding}
      />
    </main>
  );
}