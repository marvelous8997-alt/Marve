
import {
  saveHomeEssentialsHeroBannerApi,
  getHomeEssentialsHeroBannerApi,
  getHomeEssentialsHeroBannerByUuidApi,
  updateHomeEssentialsHeroBannerStatusApi,
} from "@/src/api/admin/homeEssentialsHeroBanner.api";

import {
  saveHomeEssentialsHeroBannerSchema,
  updateHomeEssentialsHeroBannerStatusSchema,
} from "@/src/validations/admin/homeEssentialsHeroBanner.validation";

import type {
  SaveHomeEssentialsHeroBannerFormValues,
  UpdateHomeEssentialsHeroBannerStatusFormValues,
} from "@/src/validations/admin/homeEssentialsHeroBanner.validation";

import type {
  SaveHomeEssentialsHeroBannerApiResponse,
  GetHomeEssentialsHeroBannerApiResponse,
  UpdateHomeEssentialsHeroBannerStatusApiResponse,
} from "@/src/types/admin/homeEssentialsHeroBanner.types";

/* =========================
   SAVE HOME ESSENTIALS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveHomeEssentialsHeroBannerService = async (
  values: SaveHomeEssentialsHeroBannerFormValues
): Promise<SaveHomeEssentialsHeroBannerApiResponse> => {
  const payload = saveHomeEssentialsHeroBannerSchema.parse(values);

  return await saveHomeEssentialsHeroBannerApi(payload);
};

/* =========================
   GET SINGLE HOME ESSENTIALS HERO BANNER
   Admin form
========================= */

export const getHomeEssentialsHeroBannerService =
  async (): Promise<GetHomeEssentialsHeroBannerApiResponse> => {
    return await getHomeEssentialsHeroBannerApi();
  };

/* =========================
   GET HOME ESSENTIALS HERO BANNER BY UUID
========================= */

export const getHomeEssentialsHeroBannerByUuidService = async (
  uuid: string
): Promise<GetHomeEssentialsHeroBannerApiResponse> => {
  return await getHomeEssentialsHeroBannerByUuidApi(uuid);
};

/* =========================
   UPDATE HOME ESSENTIALS HERO BANNER STATUS
========================= */

export const updateHomeEssentialsHeroBannerStatusService = async (
  uuid: string,
  values: UpdateHomeEssentialsHeroBannerStatusFormValues
): Promise<UpdateHomeEssentialsHeroBannerStatusApiResponse> => {
  const payload = updateHomeEssentialsHeroBannerStatusSchema.parse(values);

  return await updateHomeEssentialsHeroBannerStatusApi(uuid, payload);
};
