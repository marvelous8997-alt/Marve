
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  createBogoCouponService,
  getBogoCouponsService,
  getBogoCouponDetailsService,
  updateBogoCouponService,
  updateBogoCouponStatusService,
  getActiveBogoCouponsForDropdownService,
  deleteBogoCouponService,
} from "@/src/services/admin/bogoCoupon.service";

import type {
  BogoCoupon,
  ActiveBogoCouponOption,
  GetBogoCouponsParams,
} from "@/src/types/admin/bogoCoupon.types";

import type {
  CreateBogoCouponFormValues,
  UpdateBogoCouponFormValues,
  UpdateBogoCouponStatusFormValues,
} from "@/src/validations/admin/bogoCoupon.validation";

/* ========================= Error Handler ========================= */

const getBogoCouponErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your BOGO coupon details."
    );
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid BOGO coupon details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage BOGO coupons."
      );
    }

    if (status === 404) {
      return serverMessage || "BOGO coupon not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A BOGO coupon with this code already exists."
      );
    }

    if (status === 413) {
      return serverMessage || "The submitted data is too large.";
    }

    if (status === 422) {
      return (
        serverMessage ||
        "Please check your BOGO coupon details."
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

export default function useBogoCoupon() {
  const [bogoCoupons, setBogoCoupons] = useState<BogoCoupon[]>([]);

  const [selectedBogoCoupon, setSelectedBogoCoupon] =
    useState<BogoCoupon | null>(null);

  const [activeBogoCoupons, setActiveBogoCoupons] = useState<
    ActiveBogoCouponOption[]
  >([]);

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

  /* ========================= Normalize Coupon ========================= */

  const normalizeBogoCoupon = useCallback(
    (coupon: BogoCoupon): BogoCoupon => ({
      ...coupon,

      buyQuantity: Number(
        coupon.buyQuantity ?? coupon.buy_quantity ?? 1
      ),

      getQuantity: Number(
        coupon.getQuantity ?? coupon.get_quantity ?? 1
      ),

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

      buyProducts:
        coupon.buyProducts ??
        coupon.buy_products ??
        [],

      getProducts:
        coupon.getProducts ??
        coupon.get_products ??
        [],
    }),
    []
  );

  /* ========================= Fetch Coupon List ========================= */

  const fetchBogoCoupons = useCallback(
    async (params: GetBogoCouponsParams = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBogoCouponsService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch BOGO coupons."
          );
        }

        const mappedCoupons = response.data.rows.map(
          normalizeBogoCoupon
        );

        setBogoCoupons(mappedCoupons);

        setPagination({
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });

        return {
          ...response.data,
          rows: mappedCoupons,
        };
      } catch (err: unknown) {
        const message = getBogoCouponErrorMessage(
          err,
          "Unable to fetch BOGO coupons."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [normalizeBogoCoupon]
  );

  /* ========================= Fetch Coupon Details ========================= */

  const fetchBogoCouponDetails = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBogoCouponDetailsService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch BOGO coupon details."
          );
        }

        const coupon = normalizeBogoCoupon(response.data);

        setSelectedBogoCoupon(coupon);

        return coupon;
      } catch (err: unknown) {
        const message = getBogoCouponErrorMessage(
          err,
          "Unable to fetch BOGO coupon details."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [normalizeBogoCoupon]
  );

  /* ========================= Fetch Active Coupons ========================= */

  const fetchActiveBogoCoupons = useCallback(async () => {
    setError(null);

    try {
      const response =
        await getActiveBogoCouponsForDropdownService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to fetch active BOGO coupons."
        );
      }

      setActiveBogoCoupons(response.data);

      return response.data;
    } catch (err: unknown) {
      const message = getBogoCouponErrorMessage(
        err,
        "Unable to fetch active BOGO coupons."
      );

      setError(message);
      toast.error(message);
      throw err;
    }
  }, []);

  /* ========================= Create Coupon ========================= */

  const createBogoCoupon = useCallback(
    async (values: CreateBogoCouponFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await createBogoCouponService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create BOGO coupon."
          );
        }

        const createdCoupon = normalizeBogoCoupon(response.data);

        setBogoCoupons((previous) => [
          createdCoupon,
          ...previous,
        ]);

        setPagination((previous) => ({
          ...previous,
          count: previous.count + 1,
        }));

        toast.success(
          response.message || "BOGO coupon created successfully."
        );

        return createdCoupon;
      } catch (err: unknown) {
        const message = getBogoCouponErrorMessage(
          err,
          "Unable to create BOGO coupon."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [normalizeBogoCoupon]
  );

  /* ========================= Update Coupon ========================= */

  const updateBogoCoupon = useCallback(
    async (
      uuid: string,
      values: UpdateBogoCouponFormValues
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await updateBogoCouponService(
          uuid,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update BOGO coupon."
          );
        }

        const updatedCoupon = normalizeBogoCoupon(response.data);

        setBogoCoupons((previous) =>
          previous.map((coupon) =>
            coupon.uuid === uuid
              ? { ...coupon, ...updatedCoupon }
              : coupon
          )
        );

        setSelectedBogoCoupon((previous) =>
          previous?.uuid === uuid
            ? { ...previous, ...updatedCoupon }
            : previous
        );

        toast.success(
          response.message || "BOGO coupon updated successfully."
        );

        return updatedCoupon;
      } catch (err: unknown) {
        const message = getBogoCouponErrorMessage(
          err,
          "Unable to update BOGO coupon."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [normalizeBogoCoupon]
  );

  /* ========================= Update Coupon Status ========================= */

  const updateBogoCouponStatus = useCallback(
    async (
      uuid: string,
      values: UpdateBogoCouponStatusFormValues
    ) => {
      setError(null);

      try {
        const response = await updateBogoCouponStatusService(
          uuid,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update BOGO coupon status."
          );
        }

        const updatedCoupon = normalizeBogoCoupon(response.data);

        setBogoCoupons((previous) =>
          previous.map((coupon) =>
            coupon.uuid === uuid
              ? { ...coupon, ...updatedCoupon }
              : coupon
          )
        );

        setSelectedBogoCoupon((previous) =>
          previous?.uuid === uuid
            ? { ...previous, ...updatedCoupon }
            : previous
        );

        toast.success(
          response.message ||
            "BOGO coupon status updated successfully."
        );

        return updatedCoupon;
      } catch (err: unknown) {
        const message = getBogoCouponErrorMessage(
          err,
          "Unable to update BOGO coupon status."
        );

        setError(message);
        toast.error(message);
        throw err;
      }
    },
    [normalizeBogoCoupon]
  );

  /* ========================= Delete Coupon ========================= */

  const deleteBogoCoupon = useCallback(
    async (uuid: string) => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await deleteBogoCouponService(uuid);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to delete BOGO coupon."
          );
        }

        setBogoCoupons((previous) =>
          previous.filter((coupon) => coupon.uuid !== uuid)
        );

        setSelectedBogoCoupon((previous) =>
          previous?.uuid === uuid ? null : previous
        );

        setActiveBogoCoupons((previous) =>
          previous.filter((coupon) => coupon.uuid !== uuid)
        );

        setPagination((previous) => ({
          ...previous,
          count: Math.max(0, previous.count - 1),
        }));

        toast.success(
          response.message || "BOGO coupon deleted successfully."
        );

        return response;
      } catch (err: unknown) {
        const message = getBogoCouponErrorMessage(
          err,
          "Unable to delete BOGO coupon."
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

  const clearSelectedBogoCoupon = useCallback(() => {
    setSelectedBogoCoupon(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ========================= Return ========================= */

  return {
    bogoCoupons,
    selectedBogoCoupon,
    activeBogoCoupons,
    pagination,

    isLoading,
    isSubmitting,
    isDeleting,
    error,

    fetchBogoCoupons,
    fetchBogoCouponDetails,
    fetchActiveBogoCoupons,
    createBogoCoupon,
    updateBogoCoupon,
    updateBogoCouponStatus,
    deleteBogoCoupon,

    clearSelectedBogoCoupon,
    clearError,
  };
}
