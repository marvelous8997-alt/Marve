
import axiosInstance from "@/src/lib/axios";

import type {
  GetActiveKitchenEssentialsHeroBannerResponse,
} from "@/src/types/user/kitchenEssentialsHeroBanner.types";

/* =========================
   API CONFIGURATION
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  KITCHEN_ESSENTIALS_HERO_BANNER: {
    GET_ACTIVE: "/user/kitchen-essentials-hero-banner",
  },
};

/* =========================
   GET ACTIVE KITCHEN ESSENTIALS HERO BANNER
========================= */

export const getActiveKitchenEssentialsHeroBannerApi =
  async (): Promise<GetActiveKitchenEssentialsHeroBannerResponse> => {
    const response =
      await axiosInstance.get<GetActiveKitchenEssentialsHeroBannerResponse>(
        API.KITCHEN_ESSENTIALS_HERO_BANNER.GET_ACTIVE,
      );

    return response.data;
  };
