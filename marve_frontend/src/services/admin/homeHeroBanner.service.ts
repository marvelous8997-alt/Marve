
import {
  saveHomeHeroBannerApi,
  getHomeHeroBannerApi,
  getHomeHeroBannerByUuidApi,
  updateHomeHeroBannerStatusApi,
} from "@/src/api/admin/homeHeroBanner.api";

import {
  saveHomeHeroBannerSchema,
  updateHomeHeroBannerStatusSchema,
} from "@/src/validations/admin/homeHeroBanner.validation";

import type {
  SaveHomeHeroBannerFormValues,
  UpdateHomeHeroBannerStatusFormValues,
} from "@/src/validations/admin/homeHeroBanner.validation";

import type {
  SaveHomeHeroBannerApiResponse,
  GetHomeHeroBannerApiResponse,
  UpdateHomeHeroBannerStatusApiResponse,
} from "@/src/types/admin/homeHeroBanner.types";

/* =========================
   SAVE HOME HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveHomeHeroBannerService = async (
  values: SaveHomeHeroBannerFormValues
): Promise<SaveHomeHeroBannerApiResponse> => {
  const payload = saveHomeHeroBannerSchema.parse(values);

  return await saveHomeHeroBannerApi(payload);
};

/* =========================
   GET SINGLE HOME HERO BANNER
   Admin form
========================= */

export const getHomeHeroBannerService =
  async (): Promise<GetHomeHeroBannerApiResponse> => {
    return await getHomeHeroBannerApi();
  };

/* =========================
   GET HOME HERO BANNER BY UUID
========================= */

export const getHomeHeroBannerByUuidService = async (
  uuid: string
): Promise<GetHomeHeroBannerApiResponse> => {
  return await getHomeHeroBannerByUuidApi(uuid);
};

/* =========================
   UPDATE HOME HERO BANNER STATUS
========================= */

export const updateHomeHeroBannerStatusService = async (
  uuid: string,
  values: UpdateHomeHeroBannerStatusFormValues
): Promise<UpdateHomeHeroBannerStatusApiResponse> => {
  const payload =
    updateHomeHeroBannerStatusSchema.parse(values);

  return await updateHomeHeroBannerStatusApi(uuid, payload);
};
