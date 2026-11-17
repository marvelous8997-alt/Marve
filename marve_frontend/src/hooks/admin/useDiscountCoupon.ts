
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  createDiscountCouponService,
  getDiscountCouponsService,
  getDiscountCouponDetailsService,
  updateDiscountCouponService,
  updateDiscountCouponStatusService,
  deleteDiscountCouponService,
} from "@/src/services/admin/discountCoupon.service";

import type {
  DiscountCoupon,
  GetDiscountCouponsParams,
} from "@/src/types/admin/discountCoupon.types";

import type {
  CreateDiscountCouponFormValues,
  UpdateDiscountCouponFormValues,
  UpdateDiscountCouponStatusFormValues,
} from "@/src/validations/admin/discountCoupon.validation";

/* ========================= Error Handler ========================= */

const getDiscountCouponErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your discount coupon details."
    );
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid discount coupon details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage discount coupons."
      );
    }

    if (status === 404) {
      return serverMessage || "Discount coupon not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A discount coupon with this code already exists."
      );
    }

    if (status === 413) {
      return serverMessage || "The submitted data is too large.";
    }

    if (status === 422) {
      return (
        serverMessage ||
        "Please check your discount coupon details."
      );
    }

    if (status === 429) {
      return (
        serverMessage ||
        "Too many requests. Please try again later."
      );
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

/* ========================= Hook ========================= */

export default function useDiscountCoupon() {
  const [discountCoupons, setDiscountCoupons] = useState<
    DiscountCoupon[]
  >([]);

  const [selectedDiscountCoupon, setSelectedDiscountCoupon] =
    useState<DiscountCoupon | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ========================= Fetch Coupon List ========================= */

  const fetchDiscountCoupons = useCallback(
    async (params: GetDiscountCouponsParams = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getDiscountCouponsService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch discount coupons."
          );
        }

        const mappedCoupons = response.data.rows.map(
          (coupon) => ({
            ...coupon,
            discountType:
              coupon.discountType ??
              coupon.discount_type ??
              "FIXED",
            discountValue: Number(
              coupon.discountValue ??
                coupon.discount_value ??
                0
            ),
            maximumDiscount:
              coupon.maximumDiscount ??
              coupon.maximum_discount ??
              null,
            minimumOrderValue:
              coupon.minimumOrderValue ??
              coupon.minimum_order_value ??
              null,
            usageLimit:
              coupon.usageLimit ??
              coupon.usage_limit ??
              null,
            usageCount: Number(
              coupon.usageCount ??
                coupon.usage_count ??
                0
            ),
            perCustomerLimit:
              coupon.perCustomerLimit ??
              coupon.per_customer_limit ??
              null,
            startDate:
              coupon.startDate ??
              coupon.start_date ??
              "",
            endDate:
              coupon.endDate ??
              coupon.end_date ??
              "",
            sortOrder: Number(
              coupon.sortOrder ??
                coupon.sort_order ??
                0
            ),
          })
        ) as DiscountCoupon[];

        console.table(
  mappedCoupons.map((coupon) => ({
    code: coupon.code,
    status: coupon.status,
    display_status: coupon.display_status,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
  })),
);

        setDiscountCoupons(mappedCoupons);

        setPagination({
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });

        return response.data;
      } catch (err: unknown) {
        const message = getDiscountCouponErrorMessage(
          err,
          "Unable to fetch discount coupons."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Fetch Coupon Details ========================= */

  const fetchDiscountCouponDetails = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getDiscountCouponDetailsService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch discount coupon details."
          );
        }

        const coupon = response.data;

        const mappedCoupon: DiscountCoupon = {
          ...coupon,
          discountType:
            coupon.discountType ??
            coupon.discount_type ??
            "FIXED",
          discountValue: Number(
            coupon.discountValue ??
              coupon.discount_value ??
              0
          ),
          maximumDiscount:
            coupon.maximumDiscount ??
            coupon.maximum_discount ??
            null,
          minimumOrderValue:
            coupon.minimumOrderValue ??
            coupon.minimum_order_value ??
            null,
          usageLimit:
            coupon.usageLimit ??
            coupon.usage_limit ??
            null,
          usageCount: Number(
            coupon.usageCount ??
              coupon.usage_count ??
              0
          ),
          perCustomerLimit:
            coupon.perCustomerLimit ??
            coupon.per_customer_limit ??
            null,
          startDate:
            coupon.startDate ??
            coupon.start_date ??
            "",
          endDate:
            coupon.endDate ??
            coupon.end_date ??
            "",
          sortOrder: Number(
            coupon.sortOrder ??
              coupon.sort_order ??
              0
          ),
        };

        setSelectedDiscountCoupon(mappedCoupon);

        return mappedCoupon;
      } catch (err: unknown) {
        const message = getDiscountCouponErrorMessage(
          err,
          "Unable to fetch discount coupon details."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Create Coupon ========================= */

  const createDiscountCoupon = useCallback(
    async (values: CreateDiscountCouponFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await createDiscountCouponService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to create discount coupon."
          );
        }

        const createdCoupon = response.data;

        setDiscountCoupons((previous) => [
          createdCoupon,
          ...previous,
        ]);

        setPagination((previous) => ({
          ...previous,
          count: previous.count + 1,
        }));

        toast.success(
          response.message ||
            "Discount coupon created successfully."
        );

        return createdCoupon;
      } catch (err: unknown) {
        const message = getDiscountCouponErrorMessage(
          err,
          "Unable to create discount coupon."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  /* ========================= Update Coupon ========================= */

  const updateDiscountCoupon = useCallback(
    async (
      uuid: string,
      values: UpdateDiscountCouponFormValues
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await updateDiscountCouponService(uuid, values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update discount coupon."
          );
        }

        const updatedCoupon = response.data;

        setDiscountCoupons((previous) =>
          previous.map((coupon) =>
            coupon.uuid === uuid
              ? { ...coupon, ...updatedCoupon }
              : coupon
          )
        );

        setSelectedDiscountCoupon((previous) =>
          previous?.uuid === uuid
            ? { ...previous, ...updatedCoupon }
            : previous
        );

        toast.success(
          response.message ||
            "Discount coupon updated successfully."
        );

        return updatedCoupon;
      } catch (err: unknown) {
        const message = getDiscountCouponErrorMessage(
          err,
          "Unable to update discount coupon."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  /* ========================= Update Coupon Status ========================= */

  const updateDiscountCouponStatus = useCallback(
    async (
      uuid: string,
      values: UpdateDiscountCouponStatusFormValues
    ) => {
      setError(null);

      try {
        const response =
          await updateDiscountCouponStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update discount coupon status."
          );
        }

        const updatedCoupon = response.data;

        setDiscountCoupons((previous) =>
          previous.map((coupon) =>
            coupon.uuid === uuid
              ? { ...coupon, ...updatedCoupon }
              : coupon
          )
        );

        setSelectedDiscountCoupon((previous) =>
          previous?.uuid === uuid
            ? { ...previous, ...updatedCoupon }
            : previous
        );

        toast.success(
          response.message ||
            "Discount coupon status updated successfully."
        );

        return updatedCoupon;
      } catch (err: unknown) {
        const message = getDiscountCouponErrorMessage(
          err,
          "Unable to update discount coupon status."
        );

        setError(message);
        toast.error(message);
        throw err;
      }
    },
    []
  );

  /* ========================= Delete Coupon ========================= */

  const deleteDiscountCoupon = useCallback(
    async (uuid: string) => {
      setIsDeleting(true);
      setError(null);

      try {
        const response =
          await deleteDiscountCouponService(uuid);

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to delete discount coupon."
          );
        }

        setDiscountCoupons((previous) =>
          previous.filter((coupon) => coupon.uuid !== uuid)
        );

        setSelectedDiscountCoupon((previous) =>
          previous?.uuid === uuid ? null : previous
        );

        setPagination((previous) => ({
          ...previous,
          count: Math.max(0, previous.count - 1),
        }));

        toast.success(
          response.message ||
            "Discount coupon deleted successfully."
        );

        return response;
      } catch (err: unknown) {
        const message = getDiscountCouponErrorMessage(
          err,
          "Unable to delete discount coupon."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  /* ========================= Clear Selection & Error ========================= */

  const clearSelectedDiscountCoupon = useCallback(() => {
    setSelectedDiscountCoupon(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ========================= Return ========================= */

  return {
    discountCoupons,
    selectedDiscountCoupon,
    pagination,

    isLoading,
    isSubmitting,
    isDeleting,
    error,

    fetchDiscountCoupons,
    fetchDiscountCouponDetails,
    createDiscountCoupon,
    updateDiscountCoupon,
    updateDiscountCouponStatus,
    deleteDiscountCoupon,

    clearSelectedDiscountCoupon,
    clearError,
  };
}
