
import axiosInstance from "@/src/lib/axios";

import type {
  SaveHomeCouponBannerRequest,
  SaveHomeCouponBannerApiResponse,
  GetHomeCouponBannerApiResponse,
  UpdateHomeCouponBannerStatusRequest,
  UpdateHomeCouponBannerStatusApiResponse,
} from "@/src/types/admin/homeCouponBanner.types";

/* =========================
   API ENDPOINTS
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  HOME_COUPON_BANNER: {
    SAVE: "/admin/home-coupon-banner/save",
    DETAILS: "/admin/home-coupon-banner",
    DETAILS_BY_UUID: (uuid: string) =>
      `/admin/home-coupon-banner/${uuid}`,
    STATUS: (uuid: string) =>
      `/admin/home-coupon-banner/status/${uuid}`,
  },
};

/* =========================
   SAVE HOME COUPON BANNER
   Create if missing, otherwise update
========================= */

export const saveHomeCouponBannerApi = async (
  payload: SaveHomeCouponBannerRequest
): Promise<SaveHomeCouponBannerApiResponse> => {
  const formData = new FormData();

  if (payload.type !== undefined) {
    formData.append("type", payload.type);
  }

  formData.append("eyebrow", payload.eyebrow);
  formData.append("heading", payload.heading);

  formData.append(
    "highlighted_heading",
    payload.highlighted_heading
  );

  formData.append("description", payload.description);
  formData.append("button_text", payload.button_text);
  formData.append("button_link", payload.button_link);

  formData.append("offer_text", payload.offer_text);
  formData.append(
    "discount_value",
    String(payload.discount_value)
  );
  formData.append("discount_type", payload.discount_type);
  formData.append("coupon_code", payload.coupon_code);
  formData.append("terms_text", payload.terms_text);

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response =
    await axiosInstance.post<SaveHomeCouponBannerApiResponse>(
      API.HOME_COUPON_BANNER.SAVE,
      formData
    );

  return response.data;
};

/* =========================
   GET SINGLE HOME COUPON BANNER
   Admin form
========================= */

export const getHomeCouponBannerApi =
  async (): Promise<GetHomeCouponBannerApiResponse> => {
    const response =
      await axiosInstance.get<GetHomeCouponBannerApiResponse>(
        API.HOME_COUPON_BANNER.DETAILS
      );

    return response.data;
  };

/* =========================
   GET HOME COUPON BANNER BY UUID
========================= */

export const getHomeCouponBannerByUuidApi = async (
  uuid: string
): Promise<GetHomeCouponBannerApiResponse> => {
  const response =
    await axiosInstance.get<GetHomeCouponBannerApiResponse>(
      API.HOME_COUPON_BANNER.DETAILS_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   UPDATE HOME COUPON BANNER STATUS
========================= */

export const updateHomeCouponBannerStatusApi = async (
  uuid: string,
  payload: UpdateHomeCouponBannerStatusRequest
): Promise<UpdateHomeCouponBannerStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateHomeCouponBannerStatusApiResponse>(
      API.HOME_COUPON_BANNER.STATUS(uuid),
      payload
    );

  return response.data;
};
