
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import ShippingHeader from "@/src/components/admin/shipping/ShippingHeader";
import ShippingSummary from "@/src/components/admin/shipping/ShippingSummary";

import ShippingSearch, {
  ShippingStatusFilter,
} from "@/src/components/admin/shipping/ShippingSearch";

import ShippingTable from "@/src/components/admin/shipping/ShippingTable";
import ShippingPagination from "@/src/components/admin/shipping/ShippingPagination";
import ShippingSkeleton from "@/src/components/admin/shipping/ShippingSkeleton";
import ShippingModal from "@/src/components/admin/shipping/ShippingModal";
import ShippingTracking from "@/src/components/admin/shipping/ShippingTracking";

import useShipment from "@/src/hooks/admin/useShipment";

import type { Shipment } from "@/src/types/admin/shipment.types";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Helpers ========================= */

function getOrderNumber(shipment: Shipment): string {
  return (
    shipment.order?.orderNumber ||
    shipment.order?.order_number ||
    shipment.orderId?.toString() ||
    shipment.order_id?.toString() ||
    ""
  );
}

function getCustomerName(shipment: Shipment): string {
  const order = shipment.order;

  return (
    order?.customerName ||
    order?.customer_name ||
    order?.deliveryFullName ||
    order?.delivery_full_name ||
    order?.customer?.name ||
    [
      order?.customer?.firstName || order?.customer?.first_name,
      order?.customer?.lastName || order?.customer?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    ""
  );
}

function getCustomerEmail(shipment: Shipment): string {
  return (
    shipment.order?.customerEmail ||
    shipment.order?.customer_email ||
    shipment.order?.customer?.email ||
    ""
  );
}

function getCustomerPhone(shipment: Shipment): string {
  return (
    shipment.order?.customerPhone ||
    shipment.order?.customer_phone ||
    shipment.order?.deliveryPhone ||
    shipment.order?.delivery_phone ||
    shipment.order?.customer?.phone ||
    ""
  );
}

function getCourierName(shipment: Shipment): string {
  return (
    shipment.courierName ||
    shipment.courier_name ||
    ""
  );
}

function getTrackingNumber(shipment: Shipment): string {
  return (
    shipment.awbNumber ||
    shipment.awb_number ||
    shipment.trackingNumber ||
    shipment.tracking_number ||
    ""
  );
}

/* ========================= Page ========================= */

export default function ShippingPage() {
  /* ========================= Shipment Hook ========================= */

const {
  shipments,
  selectedShipment: trackingShipment,
  isLoading,
  isSyncingTracking,
  error,
  fetchShipments,
  fetchShipmentDetails,
  syncShipmentTracking,
  clearSelectedShipment,
} = useShipment();

  /* ========================= State ========================= */

  const [search, setSearch] = useState("");

  const [shippingStatus, setShippingStatus] =
    useState<ShippingStatusFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ========================= View Modal ========================= */

  const [isShippingModalOpen, setIsShippingModalOpen] =
    useState(false);

  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  /* ========================= Tracking Modal ========================= */

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);


  /* ========================= Initial Fetch ========================= */

  useEffect(() => {
    void fetchShipments();
  }, [fetchShipments]);

  /* ========================= Automatic Shipment List Refresh ========================= */

useEffect(() => {
  const intervalId = window.setInterval(() => {
    void fetchShipments().catch(() => {
      // Background refresh errors are handled by the hook.
    });
  }, 30_000);

  return () => {
    window.clearInterval(intervalId);
  };
}, [fetchShipments]);

  /* ========================= Filtering ========================= */

  const filteredShipments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        (shipment.uuid ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (shipment.id?.toString() ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        getOrderNumber(shipment)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getCustomerName(shipment)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getCustomerEmail(shipment)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getCustomerPhone(shipment)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getTrackingNumber(shipment)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getCourierName(shipment)
          .toLowerCase()
          .includes(normalizedSearch) ||
        (shipment.shiprocketOrderId?.toString() ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (shipment.shiprocketShipmentId?.toString() ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        shippingStatus === "ALL" ||
        shipment.status === shippingStatus;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, search, shippingStatus]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / ITEMS_PER_PAGE),
  );

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredShipments.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredShipments, currentPage]);

  /* ========================= Page Safety ========================= */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ========================= Search ========================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ========================= Status Filter ========================= */

  const handleShippingStatusChange = (
    value: ShippingStatusFilter,
  ) => {
    setShippingStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setShippingStatus("ALL");
    setCurrentPage(1);
  };

  /* ========================= View Shipment ========================= */

  const handleView = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsShippingModalOpen(true);
  };

  /* ========================= Track Shipment ========================= */

const handleTracking = async (shipment: Shipment) => {
  try {
    await fetchShipmentDetails(String(shipment.id));
    setIsTrackingOpen(true);
  } catch {
    // Error is already handled by useShipment hook.
  }
};

/* ========================= Sync Shipment Tracking ========================= */

const handleSyncTracking = async () => {
  if (!trackingShipment?.id) return;

  try {
    await syncShipmentTracking(trackingShipment.id);
  } catch {
    // Error is already handled by useShipment hook.
  }
};

  /* ========================= Close Shipping Modal ========================= */

  const handleCloseShippingModal = () => {
    setIsShippingModalOpen(false);
    setSelectedShipment(null);
  };

  /* ========================= Close Tracking Modal ========================= */

const handleCloseTracking = () => {
  setIsTrackingOpen(false);
  clearSelectedShipment();
};

  /* ========================= Refresh ========================= */

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await fetchShipments();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchShipments]);

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* ========================= Navbar ========================= */}

      <AdminNavbar />

      {/* ========================= Main Content ========================= */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">

          {/* ========================= Header ========================= */}

          <ShippingHeader
            totalShipments={shipments.length}
            onRefresh={handleRefresh}
            isLoading={isRefreshing || isLoading}
          />

          {/* ========================= Summary ========================= */}

          <ShippingSummary shipments={shipments} />

          {/* ========================= Search / Filters ========================= */}

          <ShippingSearch
            search={search}
            shippingStatus={shippingStatus}
            onSearchChange={handleSearchChange}
            onShippingStatusChange={handleShippingStatusChange}
            onReset={handleReset}
          />

          {/* ========================= Error ========================= */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs font-medium text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-2 text-xs font-semibold text-red-700 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {/* ========================= Table ========================= */}

          {isLoading && shipments.length === 0 ? (
            <ShippingSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <ShippingTable
              shipments={paginatedShipments}
              onView={handleView}
              onTracking={handleTracking}
            />
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading && filteredShipments.length > 0 && (
            <ShippingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredShipments.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}

          {/* ========================= Empty State ========================= */}

          {!isLoading && filteredShipments.length === 0 && (
            <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white px-6 py-12 text-center shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
              <p className="text-sm font-semibold text-[#39312B]">
                {error ? "Unable to load shipments" : "No shipments found"}
              </p>

              <p className="mt-1 text-xs text-[#8A7D72]">
                {error
                  ? "Please try refreshing the shipment list."
                  : "Try changing your search or filters."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================= Shipment Details Modal ========================= */}

      <ShippingModal
        isOpen={isShippingModalOpen}
        shipment={selectedShipment}
        onClose={handleCloseShippingModal}
      />

      {/* ========================= Tracking Modal ========================= */}

<ShippingTracking
  isOpen={isTrackingOpen}
  shipment={trackingShipment}
  onClose={handleCloseTracking}
  onSyncTracking={handleSyncTracking}
  isSyncingTracking={isSyncingTracking}
/>
    </main>
  );
}
