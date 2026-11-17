
import {
  getActiveHomeHeroBannerApi,
} from "@/src/api/user/homeHeroBanner.api";

import type {
  GetActiveHomeHeroBannerResponse,
} from "@/src/types/user/homeHeroBanner.types";

// Get Active Home Hero Banner Service
export const getActiveHomeHeroBannerService =
  async (): Promise<GetActiveHomeHeroBannerResponse> => {
    return await getActiveHomeHeroBannerApi();
  };
