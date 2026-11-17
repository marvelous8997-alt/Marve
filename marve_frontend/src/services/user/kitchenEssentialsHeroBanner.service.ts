
import {
  getActiveKitchenEssentialsHeroBannerApi,
} from "@/src/api/user/kitchenEssentialsHeroBanner.api";

import type {
  GetActiveKitchenEssentialsHeroBannerResponse,
} from "@/src/types/user/kitchenEssentialsHeroBanner.types";

/* =========================
   GET ACTIVE KITCHEN ESSENTIALS HERO BANNER
========================= */

export const getActiveKitchenEssentialsHeroBannerService =
  async (): Promise<GetActiveKitchenEssentialsHeroBannerResponse> => {
    return await getActiveKitchenEssentialsHeroBannerApi();
  };
