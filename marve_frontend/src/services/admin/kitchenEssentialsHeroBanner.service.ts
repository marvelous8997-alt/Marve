
import {
  saveKitchenEssentialsHeroBannerApi,
  getKitchenEssentialsHeroBannerApi,
  getKitchenEssentialsHeroBannerByUuidApi,
  updateKitchenEssentialsHeroBannerStatusApi,
} from "@/src/api/admin/kitchenEssentialsHeroBanner.api";

import {
  saveKitchenEssentialsHeroBannerSchema,
  updateKitchenEssentialsHeroBannerStatusSchema,
} from "@/src/validations/admin/kitchenEssentialsHeroBanner.validation";

import type {
  SaveKitchenEssentialsHeroBannerFormValues,
  UpdateKitchenEssentialsHeroBannerStatusFormValues,
} from "@/src/validations/admin/kitchenEssentialsHeroBanner.validation";

import type {
  SaveKitchenEssentialsHeroBannerApiResponse,
  GetKitchenEssentialsHeroBannerApiResponse,
  UpdateKitchenEssentialsHeroBannerStatusApiResponse,
} from "@/src/types/admin/kitchenEssentialsHeroBanner.types";

/* =========================
   SAVE KITCHEN ESSENTIALS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveKitchenEssentialsHeroBannerService = async (
  values: SaveKitchenEssentialsHeroBannerFormValues
): Promise<SaveKitchenEssentialsHeroBannerApiResponse> => {
  const payload = saveKitchenEssentialsHeroBannerSchema.parse(values);

  return await saveKitchenEssentialsHeroBannerApi(payload);
};

/* =========================
   GET KITCHEN ESSENTIALS HERO BANNER
   Admin form
========================= */

export const getKitchenEssentialsHeroBannerService =
  async (): Promise<GetKitchenEssentialsHeroBannerApiResponse> => {
    return await getKitchenEssentialsHeroBannerApi();
  };

/* =========================
   GET KITCHEN ESSENTIALS HERO BANNER BY UUID
========================= */

export const getKitchenEssentialsHeroBannerByUuidService = async (
  uuid: string
): Promise<GetKitchenEssentialsHeroBannerApiResponse> => {
  return await getKitchenEssentialsHeroBannerByUuidApi(uuid);
};

/* =========================
   UPDATE KITCHEN ESSENTIALS HERO BANNER STATUS
========================= */

export const updateKitchenEssentialsHeroBannerStatusService = async (
  uuid: string,
  values: UpdateKitchenEssentialsHeroBannerStatusFormValues
): Promise<UpdateKitchenEssentialsHeroBannerStatusApiResponse> => {
  const payload = updateKitchenEssentialsHeroBannerStatusSchema.parse(values);

  return await updateKitchenEssentialsHeroBannerStatusApi(uuid, payload);
};
