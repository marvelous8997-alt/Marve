"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import OrderHeader from "@/src/components/admin/order/OrderHeader";

import OrderTabs from "@/src/components/admin/order/OrderTabs";

import type {
  OrderTab,
} from "@/src/components/admin/order/OrderTabs";

import OrderSearch from "@/src/components/admin/order/OrderSearch";

import type {
  OrderAdvancedFilters,
  OrderStatusFilter,
  PaymentStatusFilter,
} from "@/src/components/admin/order/OrderSearch";
import useOrder from "@/src/hooks/admin/useOrder";

import OrderTable from "@/src/components/admin/order/OrderTable";

import type {
  Order,
} from "@/src/types/admin/order.types";

import OrderPagination from "@/src/components/admin/order/OrderPagination";

import OrderSkeleton from "@/src/components/admin/order/OrderSkeleton";

import OrderModal from "@/src/components/admin/order/OrderModal";
import CreateShipmentModal from "@/src/components/admin/shipping/CreateShipmentModal";
import OrderCancelModal from "@/src/components/admin/order/OrderCancelModal";
/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Page ========================= */

export default function OrdersPage() {
  /* ========================= State ========================= */

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<OrderStatusFilter>("ALL");

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusFilter>("ALL");

    const [advancedFilters, setAdvancedFilters] =
  useState<OrderAdvancedFilters>({
    orderId: "",
    customer: "",
    phone: "",
    product: "",
    paymentStatus: "ALL",
    status: "ALL",
    dateFrom: "",
    dateTo: "",
  });

const {
  orders,
  fetchOrders,
  isLoading,
  cancelOrder,
  isCancelling,
  updateOrderStatus,
} = useOrder();

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

    const [cancelOrderTarget, setCancelOrderTarget] =
  useState<Order | null>(null);

const [isCancelModalOpen, setIsCancelModalOpen] =
  useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] =
    useState(false);
const [isCreateShipmentModalOpen, setIsCreateShipmentModalOpen] =
  useState(false);

const [shipmentOrder, setShipmentOrder] =
  useState<Order | null>(null);
const [createdShipmentOrderIds, setCreatedShipmentOrderIds] =
  useState<Set<string>>(new Set());
  
    useEffect(() => {
  fetchOrders({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "DESC",
  }).catch((error) => {
    console.error("Failed to fetch orders:", error);
  });
}, [fetchOrders]);

  /* ========================= Filtering ========================= */

const filteredOrders = useMemo(() => {
  const normalizedSearch =
    search.trim().toLowerCase();

  const normalizedOrderId =
    advancedFilters.orderId
      .trim()
      .toLowerCase();

  const normalizedCustomer =
    advancedFilters.customer
      .trim()
      .toLowerCase();

  const normalizedPhone =
    advancedFilters.phone
      .trim()
      .toLowerCase();

  const normalizedProduct =
    advancedFilters.product
      .trim()
      .toLowerCase();

  return orders.filter((order) => {
    /* ========================= General Search ========================= */

const orderItems = Array.isArray(order.items)
  ? order.items
  : [];

const matchesSearch =
  normalizedSearch.length === 0 ||
  order.orderNumber?.toLowerCase().includes(normalizedSearch) ||
  order.customerName?.toLowerCase().includes(normalizedSearch) ||
  order.customerEmail?.toLowerCase().includes(normalizedSearch) ||
  order.customerPhone?.toLowerCase().includes(normalizedSearch) ||
  orderItems.some(
    (item) =>
      item.productName?.toLowerCase().includes(normalizedSearch) ||
      item.sku?.toLowerCase().includes(normalizedSearch),
  );

    /* ========================= Order ID ========================= */

    const matchesOrderId =
      normalizedOrderId.length === 0 ||
      order.orderNumber
        ?.toLowerCase()
        .includes(normalizedOrderId) ||
      String(order.id)
        .toLowerCase()
        .includes(normalizedOrderId);

    /* ========================= Customer ========================= */

    const matchesCustomer =
      normalizedCustomer.length === 0 ||
      order.customerName
        ?.toLowerCase()
        .includes(normalizedCustomer) ||
      order.customerEmail
        ?.toLowerCase()
        .includes(normalizedCustomer);

    /* ========================= Phone ========================= */

    const matchesPhone =
      normalizedPhone.length === 0 ||
      order.customerPhone
        ?.toLowerCase()
        .includes(normalizedPhone);

    /* ========================= Product ========================= */

    const matchesProduct =
  normalizedProduct.length === 0 ||
  orderItems.some(
    (item) =>
      item.productName
        ?.toLowerCase()
        .includes(normalizedProduct) ||
      item.sku
        ?.toLowerCase()
        .includes(normalizedProduct),
  );

    /* ========================= Status ========================= */

    const matchesStatus =
      status === "ALL" ||
      order.status === status;

    /* ========================= Payment ========================= */

    const matchesPaymentStatus =
      paymentStatus === "ALL" ||
      order.paymentStatus ===
        paymentStatus;

    /* ========================= Date ========================= */

    const orderDate = order.createdAt
      ? new Date(order.createdAt)
      : null;

    const fromDate =
      advancedFilters.dateFrom
        ? new Date(
            `${advancedFilters.dateFrom}T00:00:00`,
          )
        : null;

    const toDate =
      advancedFilters.dateTo
        ? new Date(
            `${advancedFilters.dateTo}T23:59:59.999`,
          )
        : null;

    const matchesDateFrom =
      !fromDate ||
      !orderDate ||
      orderDate >= fromDate;

    const matchesDateTo =
      !toDate ||
      !orderDate ||
      orderDate <= toDate;

    return (
      matchesSearch &&
      matchesOrderId &&
      matchesCustomer &&
      matchesPhone &&
      matchesProduct &&
      matchesStatus &&
      matchesPaymentStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });
}, [
  orders,
  search,
  status,
  paymentStatus,
  advancedFilters,
]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredOrders.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [
    filteredOrders,
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

  /* ========================= Order Status ========================= */

  const handleStatusChange = (
    value: OrderStatusFilter,
  ) => {
    setStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Payment Status ========================= */

  const handlePaymentStatusChange = (
    value: PaymentStatusFilter,
  ) => {
    setPaymentStatus(value);
    setCurrentPage(1);
  };

  const handleAdvancedFiltersChange = (
  filters: OrderAdvancedFilters,
) => {
  setAdvancedFilters(filters);
  setCurrentPage(1);
};

  /* ========================= Reset Filters ========================= */

const handleReset = () => {
  setSearch("");
  setStatus("ALL");
  setPaymentStatus("ALL");

  setAdvancedFilters({
    orderId: "",
    customer: "",
    phone: "",
    product: "",
    paymentStatus: "ALL",
    status: "ALL",
    dateFrom: "",
    dateTo: "",
  });

  setCurrentPage(1);
};

  /* ========================= View ========================= */

  const handleView = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  /* ========================= Create Shipment ========================= */

const handleCreateShipment = (order: Order) => {
  if (order.status !== "PROCESSING") return;

  const orderIdentifier = String(order.uuid || order.id);

  // Prevent opening modal if shipment already created
  if (createdShipmentOrderIds.has(orderIdentifier)) {
    return;
  }

  setShipmentOrder(order);
  setIsCreateShipmentModalOpen(true);
};

/* ========================= Close Create Shipment Modal ========================= */

const handleCloseCreateShipmentModal = () => {
  if (isCreateShipmentModalOpen) {
    setIsCreateShipmentModalOpen(false);
    setShipmentOrder(null);
  }
};

/* ========================= Shipment Created ========================= */

const handleShipmentCreated = async () => {
  try {
    // Mark shipment as created for this order
    if (shipmentOrder) {
      const orderIdentifier = String(
        shipmentOrder.uuid || shipmentOrder.id
      );

      setCreatedShipmentOrderIds((previous) => {
        const updated = new Set(previous);
        updated.add(orderIdentifier);
        return updated;
      });
    }

    await fetchOrders({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

    setCurrentPage(1);
    setIsCreateShipmentModalOpen(false);
    setShipmentOrder(null);
  } catch (error) {
    console.error(
      "Failed to refresh orders after shipment creation:",
      error
    );
  }
};
/* ========================= Cancel Order ========================= */

const handleCancelOrder = (order: Order) => {
  setCancelOrderTarget(order);
  setIsCancelModalOpen(true);
};

/* ========================= Close Cancel Modal ========================= */

const handleCloseCancelModal = () => {
  if (isCancelling) return;

  setIsCancelModalOpen(false);
  setCancelOrderTarget(null);
};

/* ========================= Confirm Cancel Order ========================= */

const handleConfirmCancelOrder = async () => {
  if (!cancelOrderTarget) return;

  try {
    await cancelOrder(String(cancelOrderTarget.uuid));

    setIsCancelModalOpen(false);
    setCancelOrderTarget(null);

    // Keep the updated cancelled order visible in the list.
    // useOrder hook updates the order status in its local state.
  } catch (error) {
    console.error("Failed to cancel order:", error);
  }
};

const handleToggleStatus = async (order: Order) => {
  const statusFlow: Partial<
    Record<Order["status"], Order["status"]>
  > = {
    PENDING_PAYMENT: "CONFIRMED",
    CONFIRMED: "PROCESSING",
  };

  const nextStatus = statusFlow[order.status];

  if (!nextStatus) return;

  try {
    await updateOrderStatus(String(order.uuid), nextStatus);
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
};

  /* ========================= Close Modal ========================= */

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const orderTabCounts = useMemo(() => {
  return {
    all: orders.length,

pending: orders.filter(
  (order) => order.status === "PENDING_PAYMENT",
).length,

    confirmed: orders.filter(
      (order) =>
        order.status === "CONFIRMED",
    ).length,

    processing: orders.filter(
      (order) =>
        order.status === "PROCESSING",
    ).length,

    shipped: orders.filter(
      (order) =>
        order.status === "SHIPPED",
    ).length,

    delivered: orders.filter(
      (order) =>
        order.status === "DELIVERED",
    ).length,

    cancelled: orders.filter(
      (order) =>
        order.status === "CANCELLED",
    ).length,

    returned: orders.filter(
      (order) =>
        order.status === "RETURNED",
    ).length,
  };
}, [orders]);


const handleTabChange = (
  value: OrderTab,
) => {
  setStatus(value);
  setCurrentPage(1);

  setAdvancedFilters((previous) => ({
    ...previous,
    status: value,
  }));
};
  /* ========================= Refresh ========================= */

const handleRefresh = async () => {
  try {
    await fetchOrders({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

    setCurrentPage(1);
  } catch (error) {
    console.error("Failed to refresh orders:", error);
  }
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

<OrderHeader
  totalOrders={orders.length}
  onRefresh={handleRefresh}
  isLoading={isLoading}
/>

{/* ========================= Order Status Tabs ========================= */}

<OrderTabs
  activeTab={status as OrderTab}
  counts={orderTabCounts}
  onChange={handleTabChange}
/>

{/* ========================= Search + Filters ========================= */}

<OrderSearch
  search={search}
  status={status}
  paymentStatus={paymentStatus}
  onSearchChange={
    handleSearchChange
  }
  onStatusChange={
    handleStatusChange
  }
  onPaymentStatusChange={
    handlePaymentStatusChange
  }
  onAdvancedFiltersChange={
    handleAdvancedFiltersChange
  }
  onReset={handleReset}
/>

          {/* ========================= Table ========================= */}

          {isLoading ? (
            <OrderSkeleton
              rows={ITEMS_PER_PAGE}
            />
          ) : (
<OrderTable
  orders={paginatedOrders}
  onView={handleView}
  onCancel={handleCancelOrder}
  onToggleStatus={handleToggleStatus}
  onCreateShipment={handleCreateShipment}
/>
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading &&
            filteredOrders.length > 0 && (
              <OrderPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={
                  filteredOrders.length
                }
                itemsPerPage={
                  ITEMS_PER_PAGE
                }
                onPageChange={
                  setCurrentPage
                }
              />
            )}
        </div>
      </div>

      {/* ========================= Order Details Modal ========================= */}

      <OrderModal
        isOpen={isOrderModalOpen}
        order={selectedOrder}
        onClose={handleCloseModal}
      />

      {/* ========================= Create Shipment Modal ========================= */}

<CreateShipmentModal
  isOpen={isCreateShipmentModalOpen}
  order={shipmentOrder}
  onClose={handleCloseCreateShipmentModal}
  onSuccess={handleShipmentCreated}
/>

<OrderCancelModal
  isOpen={isCancelModalOpen}
  orderNumber={cancelOrderTarget?.orderNumber || ""}
  isCancelling={isCancelling}
  onClose={handleCloseCancelModal}
  onConfirm={handleConfirmCancelOrder}
/>
    </main>
  );
}