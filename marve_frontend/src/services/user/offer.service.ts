import {
  getOffersApi,
  getOfferDetailsApi,
} from "@/src/api/user/offer.api";

import type {
  GetOffersResponse,
  GetOfferDetailsResponse,
  OfferType,
} from "@/src/types/user/offer.types";

/* ========================= Get All Active Offers Service ========================= */

export const getOffersService =
  async (): Promise<GetOffersResponse> => {
    return await getOffersApi();
  };

/* ========================= Get Active Offer Details Service ========================= */

export const getOfferDetailsService = async (
  type: OfferType,
  uuid: string
): Promise<GetOfferDetailsResponse> => {
  return await getOfferDetailsApi(type, uuid);
};