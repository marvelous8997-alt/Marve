
import axiosInstance from "@/src/lib/axios";

import type {
  SaveKitchenEssentialsHeroBannerRequest,
  SaveKitchenEssentialsHeroBannerApiResponse,
  GetKitchenEssentialsHeroBannerApiResponse,
  UpdateKitchenEssentialsHeroBannerStatusRequest,
  UpdateKitchenEssentialsHeroBannerStatusApiResponse,
} from "@/src/types/admin/kitchenEssentialsHeroBanner.types";

/* =========================
   API ENDPOINTS
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  KITCHEN_ESSENTIALS_HERO_BANNER: {
    SAVE: "/admin/kitchen-essentials-hero-banner/save",
    DETAILS: "/admin/kitchen-essentials-hero-banner",
    DETAILS_BY_UUID: (uuid: string) =>
      `/admin/kitchen-essentials-hero-banner/${uuid}`,
    STATUS: (uuid: string) =>
      `/admin/kitchen-essentials-hero-banner/status/${uuid}`,
  },
};

/* =========================
   SAVE KITCHEN ESSENTIALS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveKitchenEssentialsHeroBannerApi = async (
  payload: SaveKitchenEssentialsHeroBannerRequest
): Promise<SaveKitchenEssentialsHeroBannerApiResponse> => {
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

  formData.append("floating_label", payload.floating_label);
  formData.append("floating_title", payload.floating_title);

  formData.append(
    "floating_description",
    payload.floating_description
  );

  formData.append(
    "floating_bottom_label",
    payload.floating_bottom_label
  );

  formData.append("bottom_label", payload.bottom_label);

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response =
    await axiosInstance.post<SaveKitchenEssentialsHeroBannerApiResponse>(
      API.KITCHEN_ESSENTIALS_HERO_BANNER.SAVE,
      formData
    );

  return response.data;
};

/* =========================
   GET KITCHEN ESSENTIALS HERO BANNER
   Admin form
========================= */

export const getKitchenEssentialsHeroBannerApi =
  async (): Promise<GetKitchenEssentialsHeroBannerApiResponse> => {
    const response =
      await axiosInstance.get<GetKitchenEssentialsHeroBannerApiResponse>(
        API.KITCHEN_ESSENTIALS_HERO_BANNER.DETAILS
      );

    return response.data;
  };

/* =========================
   GET KITCHEN ESSENTIALS HERO BANNER BY UUID
========================= */

export const getKitchenEssentialsHeroBannerByUuidApi = async (
  uuid: string
): Promise<GetKitchenEssentialsHeroBannerApiResponse> => {
  const response =
    await axiosInstance.get<GetKitchenEssentialsHeroBannerApiResponse>(
      API.KITCHEN_ESSENTIALS_HERO_BANNER.DETAILS_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   UPDATE KITCHEN ESSENTIALS HERO BANNER STATUS
========================= */

export const updateKitchenEssentialsHeroBannerStatusApi = async (
  uuid: string,
  payload: UpdateKitchenEssentialsHeroBannerStatusRequest
): Promise<UpdateKitchenEssentialsHeroBannerStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateKitchenEssentialsHeroBannerStatusApiResponse>(
      API.KITCHEN_ESSENTIALS_HERO_BANNER.STATUS(uuid),
      payload
    );

  return response.data;
};
