
import axiosInstance from "@/src/lib/axios";

import type {
  SaveBestSellersHeroBannerRequest,
  SaveBestSellersHeroBannerApiResponse,
  GetBestSellersHeroBannerApiResponse,
  UpdateBestSellersHeroBannerStatusRequest,
  UpdateBestSellersHeroBannerStatusApiResponse,
} from "@/src/types/admin/bestSellersHeroBanner.types";

/* =========================
   API ENDPOINTS
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  BEST_SELLERS_HERO_BANNER: {
    SAVE: "/admin/best-sellers-hero-banner/save",
    DETAILS: "/admin/best-sellers-hero-banner",
    DETAILS_BY_UUID: (uuid: string) =>
      `/admin/best-sellers-hero-banner/${uuid}`,
    STATUS: (uuid: string) =>
      `/admin/best-sellers-hero-banner/status/${uuid}`,
  },
};

/* =========================
   SAVE BEST SELLERS HERO BANNER
   Create if missing, otherwise update
========================= */

export const saveBestSellersHeroBannerApi = async (
  payload: SaveBestSellersHeroBannerRequest
): Promise<SaveBestSellersHeroBannerApiResponse> => {
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
  formData.append("rating_text", payload.rating_text);

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
    await axiosInstance.post<SaveBestSellersHeroBannerApiResponse>(
      API.BEST_SELLERS_HERO_BANNER.SAVE,
      formData
    );

  return response.data;
};

/* =========================
   GET SINGLE BEST SELLERS HERO BANNER
   Admin form
========================= */

export const getBestSellersHeroBannerApi =
  async (): Promise<GetBestSellersHeroBannerApiResponse> => {
    const response =
      await axiosInstance.get<GetBestSellersHeroBannerApiResponse>(
        API.BEST_SELLERS_HERO_BANNER.DETAILS
      );

    return response.data;
  };

/* =========================
   GET BEST SELLERS HERO BANNER BY UUID
========================= */

export const getBestSellersHeroBannerByUuidApi = async (
  uuid: string
): Promise<GetBestSellersHeroBannerApiResponse> => {
  const response =
    await axiosInstance.get<GetBestSellersHeroBannerApiResponse>(
      API.BEST_SELLERS_HERO_BANNER.DETAILS_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   UPDATE BEST SELLERS HERO BANNER STATUS
========================= */

export const updateBestSellersHeroBannerStatusApi = async (
  uuid: string,
  payload: UpdateBestSellersHeroBannerStatusRequest
): Promise<UpdateBestSellersHeroBannerStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateBestSellersHeroBannerStatusApiResponse>(
      API.BEST_SELLERS_HERO_BANNER.STATUS(uuid),
      payload
    );

  return response.data;
};
