
import axiosInstance from "@/src/lib/axios";

import type {
  GetActiveHomeHeroBannerResponse,
} from "@/src/types/user/homeHeroBanner.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  HOME_HERO_BANNER: {
    GET_ACTIVE: "/user/home-hero-banner",
  },
};

// Get Active Home Hero Banner API
export const getActiveHomeHeroBannerApi =
  async (): Promise<GetActiveHomeHeroBannerResponse> => {
    const response =
      await axiosInstance.get<GetActiveHomeHeroBannerResponse>(
        API.HOME_HERO_BANNER.GET_ACTIVE
      );

    return response.data;
  };
