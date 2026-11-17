
import {
  saveHomeCouponBannerApi,
  getHomeCouponBannerApi,
  getHomeCouponBannerByUuidApi,
  updateHomeCouponBannerStatusApi,
} from "@/src/api/admin/homeCouponBanner.api";

import {
  saveHomeCouponBannerSchema,
  updateHomeCouponBannerStatusSchema,
} from "@/src/validations/admin/homeCouponBanner.validation";

import type {
  SaveHomeCouponBannerFormValues,
  UpdateHomeCouponBannerStatusFormValues,
} from "@/src/validations/admin/homeCouponBanner.validation";

import type {
  SaveHomeCouponBannerApiResponse,
  GetHomeCouponBannerApiResponse,
  UpdateHomeCouponBannerStatusApiResponse,
} from "@/src/types/admin/homeCouponBanner.types";

/* =========================
   SAVE HOME COUPON BANNER
   Create if missing, otherwise update
========================= */

export const saveHomeCouponBannerService = async (
  values: SaveHomeCouponBannerFormValues
): Promise<SaveHomeCouponBannerApiResponse> => {
  const payload = saveHomeCouponBannerSchema.parse(values);

  return await saveHomeCouponBannerApi(payload);
};

/* =========================
   GET SINGLE HOME COUPON BANNER
   Admin form
========================= */

export const getHomeCouponBannerService =
  async (): Promise<GetHomeCouponBannerApiResponse> => {
    return await getHomeCouponBannerApi();
  };

/* =========================
   GET HOME COUPON BANNER BY UUID
========================= */

export const getHomeCouponBannerByUuidService = async (
  uuid: string
): Promise<GetHomeCouponBannerApiResponse> => {
  return await getHomeCouponBannerByUuidApi(uuid);
};

/* =========================
   UPDATE HOME COUPON BANNER STATUS
========================= */

export const updateHomeCouponBannerStatusService = async (
  uuid: string,
  values: UpdateHomeCouponBannerStatusFormValues
): Promise<UpdateHomeCouponBannerStatusApiResponse> => {
  const payload = updateHomeCouponBannerStatusSchema.parse(values);

  return await updateHomeCouponBannerStatusApi(uuid, payload);
};
