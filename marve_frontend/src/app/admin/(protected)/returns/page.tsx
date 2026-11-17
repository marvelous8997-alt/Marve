
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import AdminNavbar from "@/src/components/admin/AdminNavbar";
import ReturnsHeader from "@/src/components/admin/returns/ReturnsHeader";
import ReturnsSummary from "@/src/components/admin/returns/ReturnsSummary";
import ReturnsSearch, {
  ReturnStatusFilter,
} from "@/src/components/admin/returns/ReturnsSearch";
import ReturnsTable from "@/src/components/admin/returns/ReturnsTable";
import ReturnsPagination from "@/src/components/admin/returns/ReturnsPagination";
import ReturnsSkeleton from "@/src/components/admin/returns/ReturnsSkeleton";
import ReturnsModal from "@/src/components/admin/returns/ReturnsModal";

import useReturnRequest from "@/src/hooks/admin/useReturnRequest";
import ReturnApproveModal from "@/src/components/admin/returns/ReturnApproveModal";
import ReturnRejectModal from "@/src/components/admin/returns/ReturnRejectModal";
import ReturnsTracking from "@/src/components/admin/returns/ReturnsTracking";

import type {
  ReturnRequestFilters,
  ReturnRequest,
} from "@/src/types/admin/returnRequest.types";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Page ========================= */

export default function ReturnsPage() {
  /* ========================= Hook ========================= */

  const {
    returnRequests,
    selectedReturnRequest,
    pagination,
    statusCounts,

    isLoading,
    isFetchingDetails,
    isApproving,
    isRejecting,
    isRetryingPickup,
    isRefreshingTracking,
    error,

    fetchReturnRequests,
    fetchReturnRequestDetails,
    approveReturnRequest,
    rejectReturnRequest,
    fetchReturnStatusCounts,
    clearSelectedReturnRequest,
    retryReturnPickup,
    refreshReturnTracking,
  } = useReturnRequest();

  /* ========================= State ========================= */

  const [search, setSearch] = useState("");

  const [returnStatus, setReturnStatus] =
    useState<ReturnStatusFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [isReturnsModalOpen, setIsReturnsModalOpen] =
    useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
const [returnToApprove, setReturnToApprove] =
  useState<ReturnRequest | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
const [returnToReject, setReturnToReject] =
  useState<ReturnRequest | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] =
  useState(false);
  /* ========================= Fetch Returns ========================= */

  const loadReturns = useCallback(async () => {
    const filters: ReturnRequestFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status:
        returnStatus === "ALL"
          ? undefined
          : returnStatus,
    };

    await fetchReturnRequests(filters);
  }, [
    currentPage,
    search,
    returnStatus,
    fetchReturnRequests,
  ]);

  /* ========================= Initial / Filter Fetch ========================= */

useEffect(() => {
  loadReturns().catch(() => {
    // Hook already handles and displays the error.
  });
}, [loadReturns]);

  /* ========================= Fetch Status Counts ========================= */

  useEffect(() => {
    void fetchReturnStatusCounts().catch(() => {
      // Hook already handles and displays the error.
    });
  }, [fetchReturnStatusCounts]);

  /* ========================= Search ========================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ========================= Status Filter ========================= */

  const handleReturnStatusChange = (
    value: ReturnStatusFilter
  ) => {
    setReturnStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setReturnStatus("ALL");
    setCurrentPage(1);
  };

  /* ========================= View Details ========================= */

  const handleView = async (returnRequest: ReturnRequest) => {
    try {
      await fetchReturnRequestDetails(returnRequest.uuid);
      setIsReturnsModalOpen(true);
    } catch {
      // Hook already handles and displays the error.
    }
  };

  /* ========================= Approve Return ========================= */

const handleApprove = (returnRequest: ReturnRequest) => {
  setReturnToApprove(returnRequest);
  setIsApproveModalOpen(true);
};

const confirmApprove = async () => {
  if (!returnToApprove) return;

  const approvedUuid = returnToApprove.uuid;

  try {
    await approveReturnRequest(approvedUuid, {});

    setIsApproveModalOpen(false);
    setReturnToApprove(null);

    await Promise.all([
      loadReturns(),
      fetchReturnStatusCounts(),
    ]);

    // Refresh details if the details modal is open.
    if (isReturnsModalOpen) {
      await fetchReturnRequestDetails(approvedUuid);
    }
  } catch {
    // Hook already handles and displays the error.
  }
};

  /* ========================= Reject Return ========================= */

const handleReject = (returnRequest: ReturnRequest) => {
  setReturnToReject(returnRequest);
  setIsRejectModalOpen(true);
};

const confirmReject = async (rejectionReason: string) => {
  if (!returnToReject || !rejectionReason.trim()) return;

  try {
    await rejectReturnRequest(returnToReject.uuid, {
      rejectionReason: rejectionReason.trim(),
    });

    setIsRejectModalOpen(false);
    setReturnToReject(null);

    await Promise.all([
      loadReturns(),
      fetchReturnStatusCounts(),
    ]);
  } catch {
    // Hook already handles and displays the error.
  }
};

/* ========================= Retry Return Pickup ========================= */

const handleRetryPickup = async (
  returnRequest: ReturnRequest
) => {
  try {
    await retryReturnPickup(returnRequest.uuid);

    await Promise.all([
      loadReturns(),
      fetchReturnStatusCounts(),
    ]);

    if (isReturnsModalOpen) {
      await fetchReturnRequestDetails(returnRequest.uuid);
    }
  } catch {
    // Hook already handles and displays the error.
  }
};

/* ========================= Track Return ========================= */

const handleTrackReturn = async (
  returnRequest: ReturnRequest
) => {
  try {
    // Fetch complete details, including shipment tracking events.
    await fetchReturnRequestDetails(returnRequest.uuid);

    setIsTrackingModalOpen(true);
  } catch {
    // Hook already handles and displays the error.
  }
};

/* ========================= Refresh Return Tracking ========================= */

const handleRefreshTracking = async (uuid: string) => {
  try {
    await refreshReturnTracking(uuid);

    await Promise.all([
      loadReturns(),
      fetchReturnStatusCounts(),
    ]);

    // Keep tracking/details modal data updated.
    await fetchReturnRequestDetails(uuid);
  } catch {
    // Hook already handles and displays the error.
  }
};

/* ========================= Close Tracking Modal ========================= */

const handleCloseTrackingModal = () => {
  setIsTrackingModalOpen(false);
  clearSelectedReturnRequest();
};

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        loadReturns(),
        fetchReturnStatusCounts(),
      ]);

      toast.success("Return requests refreshed.");
    } catch {
      // Hook already handles and displays the error.
    } finally {
      setIsRefreshing(false);
    }
  };

  /* ========================= Close Details Modal ========================= */

  const handleCloseReturnsModal = () => {
    setIsReturnsModalOpen(false);
    clearSelectedReturnRequest();
  };

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    pagination.totalPages
  );

  const totalItems = pagination.count;

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* ========================= Navbar ========================= */}

      <AdminNavbar />

      {/* ========================= Main Content ========================= */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">

          {/* ========================= Header ========================= */}

          <ReturnsHeader
            totalReturns={totalItems}
            onRefresh={handleRefresh}
            isLoading={isLoading || isRefreshing}
          />

          {/* ========================= Summary ========================= */}

          <ReturnsSummary
            returns={returnRequests}
            statusCounts={statusCounts ?? undefined}
          />

          {/* ========================= Search / Filters ========================= */}

          <ReturnsSearch
            search={search}
            returnStatus={returnStatus}
            onSearchChange={handleSearchChange}
            onReturnStatusChange={handleReturnStatusChange}
            onReset={handleReset}
          />

          {/* ========================= Error ========================= */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ========================= Table ========================= */}

          {isLoading ? (
            <ReturnsSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
              <ReturnsTable
                returns={returnRequests}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onRetryPickup={handleRetryPickup}
                onTrack={handleTrackReturn}
                isApproving={isApproving}
                isRejecting={isRejecting}
                isRetryingPickup={isRetryingPickup}
              />
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading && totalItems > 0 && (
            <ReturnsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ========================= Return Details Modal ========================= */}

      <ReturnsModal
        isOpen={isReturnsModalOpen}
        returnRequest={selectedReturnRequest}
        onClose={handleCloseReturnsModal}
      />

      {/* ========================= Return Tracking Modal ========================= */}

<ReturnsTracking
  isOpen={isTrackingModalOpen}
  returnRequest={selectedReturnRequest}
  onClose={handleCloseTrackingModal}
  onRefreshTracking={handleRefreshTracking}
  isRefreshingTracking={isRefreshingTracking}
/>

      {/* ========================= Details Loading ========================= */}

      {isFetchingDetails && (
        <div className="sr-only" aria-live="polite">
          Loading return request details...
        </div>
      )}

      <ReturnApproveModal
  isOpen={isApproveModalOpen}
  returnNumber={returnToApprove?.returnNumber ?? ""}
  isApproving={isApproving}
  onClose={() => {
    if (isApproving) return;

    setIsApproveModalOpen(false);
    setReturnToApprove(null);
  }}
  onConfirm={confirmApprove}
/>

<ReturnRejectModal
  isOpen={isRejectModalOpen}
  returnNumber={returnToReject?.returnNumber ?? ""}
  isRejecting={isRejecting}
  onClose={() => {
    if (isRejecting) return;

    setIsRejectModalOpen(false);
    setReturnToReject(null);
  }}
  onConfirm={confirmReject}
/>
    </main>
  );
}
