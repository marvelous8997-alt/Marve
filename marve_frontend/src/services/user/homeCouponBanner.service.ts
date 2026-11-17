
import {
  getActiveHomeCouponBannerApi,
} from "@/src/api/user/homeCouponBanner.api";

import type {
  GetActiveHomeCouponBannerResponse,
} from "@/src/types/user/homeCouponBanner.types";

/* =========================
   GET ACTIVE HOME COUPON BANNER
========================= */

export const getActiveHomeCouponBannerService =
  async (): Promise<GetActiveHomeCouponBannerResponse> => {
    return await getActiveHomeCouponBannerApi();
  };
