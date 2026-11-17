
"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getOrdersService,
  getOrderDetailsService,
  updateOrderStatusService,
  updatePaymentStatusService,
  cancelOrderService,
} from "@/src/services/admin/order.service";

import type {
  Order,
  OrderFilters,
  OrderListResult,
  OrderStatus,
  PaymentStatus,
} from "@/src/types/admin/order.types";

import type {
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
} from "@/src/api/admin/order.api";

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getOrderErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid order details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage orders."
      );
    }

    if (status === 404) {
      return serverMessage || "Order not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "This order cannot be updated in its current state."
      );
    }

    if (status === 422) {
      return serverMessage || "Please check the submitted details.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================================================
   HOOK
========================================================= */

export default function useOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPaymentStatus, setIsUpdatingPaymentStatus] =
    useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = useCallback(
    async (params: OrderFilters = {}): Promise<OrderListResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getOrdersService(params);

        if (!result || !Array.isArray(result.orders)) {
          throw new Error("Unable to fetch orders.");
        }

        setOrders(result.orders);

        const meta = result.pagination;
        const total = Number(meta?.total ?? result.orders.length);
        const page = Number(meta?.page ?? params.page ?? 1);
        const limit = Math.max(
          1,
          Number(meta?.limit ?? params.limit ?? pagination.limit)
        );

        const safeTotal = Number.isFinite(total)
          ? total
          : result.orders.length;

        const safePage =
          Number.isFinite(page) && page > 0 ? page : 1;

        setPagination({
          count: safeTotal,
          page: safePage,
          limit,
          totalPages: Number(
            meta?.totalPages ??
              Math.ceil(safeTotal / limit)
          ),
        });

        return result;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to fetch orders."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit]
  );

  /* =========================================================
     FETCH ORDER DETAILS
  ========================================================= */

  const fetchOrderDetails = useCallback(async (uuid: string) => {
    if (!uuid) {
      const message = "Order ID is required.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsFetchingDetails(true);
    setError(null);

    try {
      const order = await getOrderDetailsService(uuid);

      if (!order) {
        throw new Error("Unable to fetch order details.");
      }

      setSelectedOrder(order);

      setOrders((previous) =>
        previous.map((item) =>
          item.uuid === uuid ? order : item
        )
      );

      return order;
    } catch (err: unknown) {
      const message = getOrderErrorMessage(
        err,
        "Unable to fetch order details."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsFetchingDetails(false);
    }
  }, []);

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  const updateOrderStatus = useCallback(
    async (
      uuid: string,
      status: OrderStatus
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const payload: UpdateOrderStatusRequest = { status };
        const response = await updateOrderStatusService(uuid, payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update order status."
          );
        }

        const updatedOrder = response.data;

        setOrders((previous) =>
          previous.map((order) =>
            order.uuid === uuid ? updatedOrder : order
          )
        );

        setSelectedOrder((previous) =>
          previous?.uuid === uuid ? updatedOrder : previous
        );

        toast.success(
          response.message || "Order status updated successfully."
        );

        return updatedOrder;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to update order status."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    []
  );

  /* =========================================================
     UPDATE PAYMENT STATUS
  ========================================================= */

  const updateOrderPaymentStatus = useCallback(
    async (
      uuid: string,
      paymentStatus: PaymentStatus
    ) => {
      setIsUpdatingPaymentStatus(true);
      setError(null);

      try {
        const payload: UpdatePaymentStatusRequest = {
          paymentStatus,
        };

        const response = await updatePaymentStatusService(
          uuid,
          payload
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update payment status."
          );
        }

        const updatedOrder = response.data;

        setOrders((previous) =>
          previous.map((order) =>
            order.uuid === uuid ? updatedOrder : order
          )
        );

        setSelectedOrder((previous) =>
          previous?.uuid === uuid ? updatedOrder : previous
        );

        toast.success(
          response.message ||
            "Payment status updated successfully."
        );

        return updatedOrder;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to update payment status."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsUpdatingPaymentStatus(false);
      }
    },
    []
  );

  /* =========================================================
     CANCEL ORDER
  ========================================================= */

  const cancelOrder = useCallback(async (uuid: string) => {
    if (!uuid) {
      const message = "Order ID is required.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsCancelling(true);
    setError(null);

    try {
      const response = await cancelOrderService(uuid);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to cancel order."
        );
      }

      const cancelledOrder = response.data;

      // Keep the cancelled order in the list with updated status.
      setOrders((previous) =>
        previous.map((order) =>
          order.uuid === uuid ? cancelledOrder : order
        )
      );

      // Update selected order if it is currently open.
      setSelectedOrder((previous) =>
        previous?.uuid === uuid ? cancelledOrder : previous
      );

      toast.success(
        response.message || "Order cancelled successfully."
      );

      return cancelledOrder;
    } catch (err: unknown) {
      const message = getOrderErrorMessage(
        err,
        "Unable to cancel order."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsCancelling(false);
    }
  }, []);

  /* =========================================================
     REFRESH ORDER DETAILS
  ========================================================= */

  const refreshOrderDetails = useCallback(
    async (uuid: string) => {
      return await fetchOrderDetails(uuid);
    },
    [fetchOrderDetails]
  );

  /* =========================================================
     CLEAR HELPERS
  ========================================================= */

  const clearSelectedOrder = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    orders,
    selectedOrder,
    pagination,

    isLoading,
    isFetchingDetails,
    isUpdatingStatus,
    isUpdatingPaymentStatus,
    isCancelling,
    error,

    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus,
    updateOrderPaymentStatus,
    cancelOrder,
    refreshOrderDetails,

    clearSelectedOrder,
    clearError,
  };
}
