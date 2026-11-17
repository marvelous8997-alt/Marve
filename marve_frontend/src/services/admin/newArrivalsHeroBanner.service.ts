import {
  saveNewArrivalsHeroBannerApi,
  getNewArrivalsHeroBannerApi,
  getNewArrivalsHeroBannerByUuidApi,
  updateNewArrivalsHeroBannerStatusApi,
} from "@/src/api/admin/newArrivalsHeroBanner.api";

import {
  saveNewArrivalsHeroBannerSchema,
  updateNewArrivalsHeroBannerStatusSchema,
} from "@/src/validations/admin/newArrivalsHeroBanner.validation";

import type {
  SaveNewArrivalsHeroBannerFormValues,
  UpdateNewArrivalsHeroBannerStatusFormValues,
} from "@/src/validations/admin/newArrivalsHeroBanner.validation";

import type {
  SaveNewArrivalsHeroBannerApiResponse,
  GetNewArrivalsHeroBannerApiResponse,
  UpdateNewArrivalsHeroBannerStatusApiResponse,
} from "@/src/types/admin/newArrivalsHeroBanner.types";

/* =========================
   SAVE NEW ARRIVALS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveNewArrivalsHeroBannerService = async (
  values: SaveNewArrivalsHeroBannerFormValues
): Promise<SaveNewArrivalsHeroBannerApiResponse> => {
  const payload = saveNewArrivalsHeroBannerSchema.parse(values);

  return await saveNewArrivalsHeroBannerApi(payload);
};

/* =========================
   GET SINGLE NEW ARRIVALS HERO BANNER
   Admin form
========================= */

export const getNewArrivalsHeroBannerService =
  async (): Promise<GetNewArrivalsHeroBannerApiResponse> => {
    return await getNewArrivalsHeroBannerApi();
  };

/* =========================
   GET NEW ARRIVALS HERO BANNER BY UUID
========================= */

export const getNewArrivalsHeroBannerByUuidService = async (
  uuid: string
): Promise<GetNewArrivalsHeroBannerApiResponse> => {
  return await getNewArrivalsHeroBannerByUuidApi(uuid);
};

/* =========================
   UPDATE NEW ARRIVALS HERO BANNER STATUS
========================= */

export const updateNewArrivalsHeroBannerStatusService = async (
  uuid: string,
  values: UpdateNewArrivalsHeroBannerStatusFormValues
): Promise<UpdateNewArrivalsHeroBannerStatusApiResponse> => {
  const payload = updateNewArrivalsHeroBannerStatusSchema.parse(values);

  return await updateNewArrivalsHeroBannerStatusApi(uuid, payload);
};