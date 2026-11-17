
import {
  getActiveBestSellersHeroBannerApi,
} from "@/src/api/user/bestSellersHeroBanner.api";

import type {
  GetActiveBestSellersHeroBannerResponse,
} from "@/src/types/user/bestSellersHeroBanner.types";

/* =========================
   GET ACTIVE BEST SELLERS HERO BANNER
========================= */

export const getActiveBestSellersHeroBannerService =
  async (): Promise<GetActiveBestSellersHeroBannerResponse> => {
    return await getActiveBestSellersHeroBannerApi();
  };
