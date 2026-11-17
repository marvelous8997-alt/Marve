
import axiosInstance from "@/src/lib/axios";

import type {
  GetActiveHomeCouponBannerResponse,
} from "@/src/types/user/homeCouponBanner.types";

/* =========================
   API CONFIGURATION
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  HOME_COUPON_BANNER: {
    GET_ACTIVE: "/user/home-coupon-banner",
  },
};

/* =========================
   GET ACTIVE HOME COUPON BANNER
========================= */

export const getActiveHomeCouponBannerApi =
  async (): Promise<GetActiveHomeCouponBannerResponse> => {
    const response =
      await axiosInstance.get<GetActiveHomeCouponBannerResponse>(
        API.HOME_COUPON_BANNER.GET_ACTIVE
      );

    return response.data;
  };
