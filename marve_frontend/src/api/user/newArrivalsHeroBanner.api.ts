
import axiosInstance from "@/src/lib/axios";

import type {
  GetActiveNewArrivalsHeroBannerResponse,
} from "@/src/types/user/newArrivalsHeroBanner.types";

/* =========================
   API CONFIGURATION
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  NEW_ARRIVALS_HERO_BANNER: {
    GET_ACTIVE: "/user/new-arrivals-hero-banner",
  },
};

/* =========================
   GET ACTIVE NEW ARRIVALS HERO BANNER
========================= */

export const getActiveNewArrivalsHeroBannerApi =
  async (): Promise<GetActiveNewArrivalsHeroBannerResponse> => {
    const response =
      await axiosInstance.get<GetActiveNewArrivalsHeroBannerResponse>(
        API.NEW_ARRIVALS_HERO_BANNER.GET_ACTIVE
      );

    return response.data;
  };
