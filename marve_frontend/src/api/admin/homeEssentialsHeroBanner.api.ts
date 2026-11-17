
import axiosInstance from "@/src/lib/axios";

import type {
  SaveHomeEssentialsHeroBannerRequest,
  SaveHomeEssentialsHeroBannerApiResponse,
  GetHomeEssentialsHeroBannerApiResponse,
  UpdateHomeEssentialsHeroBannerStatusRequest,
  UpdateHomeEssentialsHeroBannerStatusApiResponse,
} from "@/src/types/admin/homeEssentialsHeroBanner.types";

/* =========================
   API ENDPOINTS
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  HOME_ESSENTIALS_HERO_BANNER: {
    SAVE: "/admin/home-essentials-hero-banner/save",
    DETAILS: "/admin/home-essentials-hero-banner",
    DETAILS_BY_UUID: (uuid: string) =>
      `/admin/home-essentials-hero-banner/${uuid}`,
    STATUS: (uuid: string) =>
      `/admin/home-essentials-hero-banner/status/${uuid}`,
  },
};

/* =========================
   SAVE HOME ESSENTIALS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveHomeEssentialsHeroBannerApi = async (
  payload: SaveHomeEssentialsHeroBannerRequest
): Promise<SaveHomeEssentialsHeroBannerApiResponse> => {
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

  formData.append("bottom_label", payload.bottom_label);

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response =
    await axiosInstance.post<SaveHomeEssentialsHeroBannerApiResponse>(
      API.HOME_ESSENTIALS_HERO_BANNER.SAVE,
      formData
    );

  return response.data;
};

/* =========================
   GET SINGLE HOME ESSENTIALS HERO BANNER
   Admin form
========================= */

export const getHomeEssentialsHeroBannerApi =
  async (): Promise<GetHomeEssentialsHeroBannerApiResponse> => {
    const response =
      await axiosInstance.get<GetHomeEssentialsHeroBannerApiResponse>(
        API.HOME_ESSENTIALS_HERO_BANNER.DETAILS
      );

    return response.data;
  };

/* =========================
   GET HOME ESSENTIALS HERO BANNER BY UUID
========================= */

export const getHomeEssentialsHeroBannerByUuidApi = async (
  uuid: string
): Promise<GetHomeEssentialsHeroBannerApiResponse> => {
  const response =
    await axiosInstance.get<GetHomeEssentialsHeroBannerApiResponse>(
      API.HOME_ESSENTIALS_HERO_BANNER.DETAILS_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   UPDATE HOME ESSENTIALS HERO BANNER STATUS
========================= */

export const updateHomeEssentialsHeroBannerStatusApi = async (
  uuid: string,
  payload: UpdateHomeEssentialsHeroBannerStatusRequest
): Promise<UpdateHomeEssentialsHeroBannerStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateHomeEssentialsHeroBannerStatusApiResponse>(
      API.HOME_ESSENTIALS_HERO_BANNER.STATUS(uuid),
      payload
    );

  return response.data;
};
