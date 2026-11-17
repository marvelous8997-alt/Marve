
import {
  saveBestSellersHeroBannerApi,
  getBestSellersHeroBannerApi,
  getBestSellersHeroBannerByUuidApi,
  updateBestSellersHeroBannerStatusApi,
} from "@/src/api/admin/bestSellersHeroBanner.api";

import {
  saveBestSellersHeroBannerSchema,
  updateBestSellersHeroBannerStatusSchema,
} from "@/src/validations/admin/bestSellersHeroBanner.validation";

import type {
  SaveBestSellersHeroBannerFormValues,
  UpdateBestSellersHeroBannerStatusFormValues,
} from "@/src/validations/admin/bestSellersHeroBanner.validation";

import type {
  SaveBestSellersHeroBannerApiResponse,
  GetBestSellersHeroBannerApiResponse,
  UpdateBestSellersHeroBannerStatusApiResponse,
} from "@/src/types/admin/bestSellersHeroBanner.types";

/* =========================
   SAVE BEST SELLERS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveBestSellersHeroBannerService = async (
  values: SaveBestSellersHeroBannerFormValues
): Promise<SaveBestSellersHeroBannerApiResponse> => {
  const payload = saveBestSellersHeroBannerSchema.parse(values);

  return await saveBestSellersHeroBannerApi(payload);
};

/* =========================
   GET SINGLE BEST SELLERS HERO BANNER
   Admin form
========================= */

export const getBestSellersHeroBannerService =
  async (): Promise<GetBestSellersHeroBannerApiResponse> => {
    return await getBestSellersHeroBannerApi();
  };

/* =========================
   GET BEST SELLERS HERO BANNER BY UUID
========================= */

export const getBestSellersHeroBannerByUuidService = async (
  uuid: string
): Promise<GetBestSellersHeroBannerApiResponse> => {
  return await getBestSellersHeroBannerByUuidApi(uuid);
};

/* =========================
   UPDATE BEST SELLERS HERO BANNER STATUS
========================= */

export const updateBestSellersHeroBannerStatusService = async (
  uuid: string,
  values: UpdateBestSellersHeroBannerStatusFormValues
): Promise<UpdateBestSellersHeroBannerStatusApiResponse> => {
  const payload = updateBestSellersHeroBannerStatusSchema.parse(values);

  return await updateBestSellersHeroBannerStatusApi(uuid, payload);
};
