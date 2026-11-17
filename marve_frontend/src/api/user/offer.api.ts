import axiosInstance from "@/src/lib/axios";

import type {
  GetOffersResponse,
  GetOfferDetailsResponse,
  OfferType,
} from "@/src/types/user/offer.types";

/* ========================= API Configuration ========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  OFFER: {
    GET_ALL: "/user/offers",
    GET_BY_ID: (type: OfferType, uuid: string) =>
      `/user/offers/${type}/${uuid}`,
  },
};

/* ========================= Get All Active Offers API ========================= */

export const getOffersApi = async (): Promise<GetOffersResponse> => {
  const response = await axiosInstance.get<GetOffersResponse>(
    API.OFFER.GET_ALL
  );

  return response.data;
};

/* ========================= Get Active Offer Details API ========================= */

export const getOfferDetailsApi = async (
  type: OfferType,
  uuid: string
): Promise<GetOfferDetailsResponse> => {
  const response = await axiosInstance.get<GetOfferDetailsResponse>(
    API.OFFER.GET_BY_ID(type, uuid)
  );

  return response.data;
};