import axiosInstance from "@/src/lib/axios";

import type {
  SaveNewArrivalsHeroBannerRequest,
  SaveNewArrivalsHeroBannerApiResponse,
  GetNewArrivalsHeroBannerApiResponse,
  UpdateNewArrivalsHeroBannerStatusRequest,
  UpdateNewArrivalsHeroBannerStatusApiResponse,
} from "@/src/types/admin/newArrivalsHeroBanner.types";

/* =========================
   API ENDPOINTS
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  NEW_ARRIVALS_HERO_BANNER: {
    SAVE: "/admin/new-arrivals-hero-banner/save",
    DETAILS: "/admin/new-arrivals-hero-banner",
    DETAILS_BY_UUID: (uuid: string) =>
      `/admin/new-arrivals-hero-banner/${uuid}`,
    STATUS: (uuid: string) =>
      `/admin/new-arrivals-hero-banner/status/${uuid}`,
  },
};

/* =========================
   SAVE NEW ARRIVALS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveNewArrivalsHeroBannerApi = async (
  payload: SaveNewArrivalsHeroBannerRequest
): Promise<SaveNewArrivalsHeroBannerApiResponse> => {
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
    await axiosInstance.post<SaveNewArrivalsHeroBannerApiResponse>(
      API.NEW_ARRIVALS_HERO_BANNER.SAVE,
      formData
    );

  return response.data;
};

/* =========================
   GET SINGLE NEW ARRIVALS HERO BANNER
   Admin form
========================= */

export const getNewArrivalsHeroBannerApi =
  async (): Promise<GetNewArrivalsHeroBannerApiResponse> => {
    const response =
      await axiosInstance.get<GetNewArrivalsHeroBannerApiResponse>(
        API.NEW_ARRIVALS_HERO_BANNER.DETAILS
      );

    return response.data;
  };

/* =========================
   GET NEW ARRIVALS HERO BANNER BY UUID
========================= */

export const getNewArrivalsHeroBannerByUuidApi = async (
  uuid: string
): Promise<GetNewArrivalsHeroBannerApiResponse> => {
  const response =
    await axiosInstance.get<GetNewArrivalsHeroBannerApiResponse>(
      API.NEW_ARRIVALS_HERO_BANNER.DETAILS_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   UPDATE NEW ARRIVALS HERO BANNER STATUS
========================= */

export const updateNewArrivalsHeroBannerStatusApi = async (
  uuid: string,
  payload: UpdateNewArrivalsHeroBannerStatusRequest
): Promise<UpdateNewArrivalsHeroBannerStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateNewArrivalsHeroBannerStatusApiResponse>(
      API.NEW_ARRIVALS_HERO_BANNER.STATUS(uuid),
      payload
    );

  return response.data;
};