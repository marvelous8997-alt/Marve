
import axiosInstance from "@/src/lib/axios";

import type {
  SaveHomeHeroBannerRequest,
  SaveHomeHeroBannerApiResponse,
  GetHomeHeroBannerApiResponse,
  UpdateHomeHeroBannerStatusRequest,
  UpdateHomeHeroBannerStatusApiResponse,
} from "@/src/types/admin/homeHeroBanner.types";

/* =========================
   API ENDPOINTS
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  HOME_HERO_BANNER: {
    SAVE: "/admin/home-hero-banner/save",
    DETAILS: "/admin/home-hero-banner",
    DETAILS_BY_UUID: (uuid: string) =>
      `/admin/home-hero-banner/${uuid}`,
    STATUS: (uuid: string) =>
      `/admin/home-hero-banner/status/${uuid}`,
  },
};

/* =========================
   SAVE HOME HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveHomeHeroBannerApi = async (
  payload: SaveHomeHeroBannerRequest
): Promise<SaveHomeHeroBannerApiResponse> => {
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
  formData.append("bottom_label", payload.bottom_label);

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response =
    await axiosInstance.post<SaveHomeHeroBannerApiResponse>(
      API.HOME_HERO_BANNER.SAVE,
      formData
    );

  return response.data;
};

/* =========================
   GET SINGLE HOME HERO BANNER
   Admin form
========================= */

export const getHomeHeroBannerApi =
  async (): Promise<GetHomeHeroBannerApiResponse> => {
    const response =
      await axiosInstance.get<GetHomeHeroBannerApiResponse>(
        API.HOME_HERO_BANNER.DETAILS
      );

    return response.data;
  };

/* =========================
   GET HOME HERO BANNER BY UUID
========================= */

export const getHomeHeroBannerByUuidApi = async (
  uuid: string
): Promise<GetHomeHeroBannerApiResponse> => {
  const response =
    await axiosInstance.get<GetHomeHeroBannerApiResponse>(
      API.HOME_HERO_BANNER.DETAILS_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   UPDATE HOME HERO BANNER STATUS
========================= */

export const updateHomeHeroBannerStatusApi = async (
  uuid: string,
  payload: UpdateHomeHeroBannerStatusRequest
): Promise<UpdateHomeHeroBannerStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateHomeHeroBannerStatusApiResponse>(
      API.HOME_HERO_BANNER.STATUS(uuid),
      payload
    );

  return response.data;
};
