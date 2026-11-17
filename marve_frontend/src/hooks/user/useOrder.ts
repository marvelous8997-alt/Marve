"use client";

import {
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  cancelOrderService,
} from "@/src/services/user/order.service";

import type {
  CreateOrderRequest,
  OrderDetails,
  GetOrdersQuery,
} from "@/src/types/user/order.types";

/* =========================
   Error Message Handler
========================= */

const getOrderErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Please check your order details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in to continue.";
    }

    if (status === 403) {
      return serverMessage || "You are not allowed to access this order.";
    }

    if (status === 404) {
      return serverMessage || "Order not found.";
    }

    if (status === 409) {
      return serverMessage || "This order conflicts with an existing request.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "A server error occurred. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================
   Order Hook
========================= */

export default function useOrder() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  const [order, setOrder] = useState<OrderDetails | null>(null);

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  const [isFetchingOrder, setIsFetchingOrder] = useState(false);

  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Create Order
  ========================= */

  const createOrder = useCallback(
    async (payload: CreateOrderRequest) => {
      setIsCreatingOrder(true);
      setError(null);

      try {
        const response = await createOrderService(payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create your order."
          );
        }

        const createdOrder = response.data;

        setOrder(createdOrder);

        setOrders((previousOrders) => {
          const alreadyExists = previousOrders.some(
            (item) => item.id === createdOrder.id
          );

          if (alreadyExists) {
            return previousOrders.map((item) =>
              item.id === createdOrder.id ? createdOrder : item
            );
          }

          return [createdOrder, ...previousOrders];
        });

        toast.success(
          response.message || "Order placed successfully."
        );

        return createdOrder;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to place your order. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsCreatingOrder(false);
      }
    },
    []
  );

  /* =========================
     Fetch All User Orders
  ========================= */

  const fetchOrders = useCallback(
    async (params: GetOrdersQuery = {}) => {
      setIsFetchingOrders(true);
      setError(null);

      try {
        const response = await getOrdersService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch your orders."
          );
        }

        setOrders(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to fetch your orders. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingOrders(false);
      }
    },
    []
  );

  /* =========================
     Fetch Order By ID
  ========================= */

  const fetchOrderById = useCallback(
    async (id: number | string) => {
      setIsFetchingOrder(true);
      setError(null);

      try {
        const response = await getOrderByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch order details."
          );
        }

        const fetchedOrder = response.data;

        setOrder(fetchedOrder);

        setOrders((previousOrders) => {
          const alreadyExists = previousOrders.some(
            (item) => item.id === fetchedOrder.id
          );

          if (!alreadyExists) {
            return previousOrders;
          }

          return previousOrders.map((item) =>
            item.id === fetchedOrder.id ? fetchedOrder : item
          );
        });

        return fetchedOrder;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to fetch order details. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingOrder(false);
      }
    },
    []
  );

  /* =========================
     Cancel Order
  ========================= */

  const cancelOrder = useCallback(
    async (id: number | string) => {
      setIsCancellingOrder(true);
      setError(null);

      try {
        const response = await cancelOrderService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to cancel your order."
          );
        }

        const cancelledOrder = response.data;

        setOrder((previousOrder) =>
          previousOrder?.id === cancelledOrder.id
            ? cancelledOrder
            : previousOrder
        );

        setOrders((previousOrders) =>
          previousOrders.map((item) =>
            item.id === cancelledOrder.id
              ? cancelledOrder
              : item
          )
        );

        toast.success(
          response.message || "Order cancelled successfully."
        );

        return cancelledOrder;
      } catch (err: unknown) {
        const message = getOrderErrorMessage(
          err,
          "Unable to cancel your order. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsCancellingOrder(false);
      }
    },
    []
  );

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Reset Order State
  ========================= */

  const resetOrder = useCallback(() => {
    setOrder(null);
    setError(null);
  }, []);

  /* =========================
     Return Hook Values
  ========================= */

  return {
    orders,
    order,

    isCreatingOrder,
    isFetchingOrders,
    isFetchingOrder,
    isCancellingOrder,

    error,

    createOrder,
    fetchOrders,
    fetchOrderById,
    cancelOrder,

    clearError,
    resetOrder,
  };
}