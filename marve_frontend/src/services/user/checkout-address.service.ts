import {
  getCheckoutAddressesApi,
  getCheckoutAddressByIdApi,
  createCheckoutAddressApi,
  updateCheckoutAddressApi,
  deleteCheckoutAddressApi,
  setDefaultCheckoutAddressApi,
} from "@/src/api/user/checkout-address.api";

import type {
  GetCheckoutAddressesResponse,
  GetCheckoutAddressResponse,
  CreateCheckoutAddressResponse,
  UpdateCheckoutAddressResponse,
  DeleteCheckoutAddressResponse,
  SetDefaultCheckoutAddressResponse,
  CreateCheckoutAddressRequest,
  UpdateCheckoutAddressRequest,
} from "@/src/types/user/checkout-address.types";

/* =========================
   Get All Checkout Addresses Service
========================= */

export const getCheckoutAddressesService =
  async (): Promise<GetCheckoutAddressesResponse> => {
    return await getCheckoutAddressesApi();
  };

/* =========================
   Get Checkout Address By ID Service
========================= */

export const getCheckoutAddressByIdService = async (
  id: number | string
): Promise<GetCheckoutAddressResponse> => {
  return await getCheckoutAddressByIdApi(id);
};

/* =========================
   Create Checkout Address Service
========================= */

export const createCheckoutAddressService = async (
  payload: CreateCheckoutAddressRequest
): Promise<CreateCheckoutAddressResponse> => {
  return await createCheckoutAddressApi(payload);
};

/* =========================
   Update Checkout Address Service
========================= */

export const updateCheckoutAddressService = async (
  id: number | string,
  payload: UpdateCheckoutAddressRequest
): Promise<UpdateCheckoutAddressResponse> => {
  return await updateCheckoutAddressApi(id, payload);
};

/* =========================
   Delete Checkout Address Service
========================= */

export const deleteCheckoutAddressService = async (
  id: number | string
): Promise<DeleteCheckoutAddressResponse> => {
  return await deleteCheckoutAddressApi(id);
};

/* =========================
   Set Default Checkout Address Service
========================= */

export const setDefaultCheckoutAddressService = async (
  id: number | string
): Promise<SetDefaultCheckoutAddressResponse> => {
  return await setDefaultCheckoutAddressApi(id);
};