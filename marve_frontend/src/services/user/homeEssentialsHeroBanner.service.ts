
import {
  getActiveHomeEssentialsHeroBannerApi,
} from "@/src/api/user/homeEssentialsHeroBanner.api";

import type {
  GetActiveHomeEssentialsHeroBannerResponse,
} from "@/src/types/user/homeEssentialsHeroBanner.types";

/* =========================
   GET ACTIVE HOME ESSENTIALS HERO BANNER
========================= */

export const getActiveHomeEssentialsHeroBannerService =
  async (): Promise<GetActiveHomeEssentialsHeroBannerResponse> => {
    return await getActiveHomeEssentialsHeroBannerApi();
  };
