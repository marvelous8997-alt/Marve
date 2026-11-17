
import axiosInstance from "@/src/lib/axios";

import type {
  GetActiveBestSellersHeroBannerResponse,
} from "@/src/types/user/bestSellersHeroBanner.types";

/* =========================
   API CONFIGURATION
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  BEST_SELLERS_HERO_BANNER: {
    GET_ACTIVE: "/user/best-sellers-hero-banner",
  },
};

/* =========================
   GET ACTIVE BEST SELLERS HERO BANNER
========================= */

export const getActiveBestSellersHeroBannerApi =
  async (): Promise<GetActiveBestSellersHeroBannerResponse> => {
    const response =
      await axiosInstance.get<GetActiveBestSellersHeroBannerResponse>(
        API.BEST_SELLERS_HERO_BANNER.GET_ACTIVE
      );

    return response.data;
  };
