
import axiosInstance from "@/src/lib/axios";

import type {
  GetActiveHomeEssentialsHeroBannerResponse,
} from "@/src/types/user/homeEssentialsHeroBanner.types";

/* =========================
   API CONFIGURATION
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  HOME_ESSENTIALS_HERO_BANNER: {
    GET_ACTIVE: "/user/home-essentials-hero-banner",
  },
};

/* =========================
   GET ACTIVE HOME ESSENTIALS HERO BANNER
========================= */

export const getActiveHomeEssentialsHeroBannerApi =
  async (): Promise<GetActiveHomeEssentialsHeroBannerResponse> => {
    const response =
      await axiosInstance.get<GetActiveHomeEssentialsHeroBannerResponse>(
        API.HOME_ESSENTIALS_HERO_BANNER.GET_ACTIVE
      );

    return response.data;
  };
