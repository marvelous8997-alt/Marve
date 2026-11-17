
import {
  getActiveNewArrivalsHeroBannerApi,
} from "@/src/api/user/newArrivalsHeroBanner.api";

import type {
  GetActiveNewArrivalsHeroBannerResponse,
} from "@/src/types/user/newArrivalsHeroBanner.types";

/* =========================
   GET ACTIVE NEW ARRIVALS HERO BANNER
========================= */

export const getActiveNewArrivalsHeroBannerService =
  async (): Promise<GetActiveNewArrivalsHeroBannerResponse> => {
    return await getActiveNewArrivalsHeroBannerApi();
  };
