import axiosInstance from "@/src/lib/axios";

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
   API Endpoints
========================= */

export const CHECKOUT_ADDRESS_API = {
  BASE: "/user/checkout-addresses",

  GET_ALL: "/user/checkout-addresses",

  GET_BY_ID: (id: number | string) =>
    `/user/checkout-addresses/${id}`,

  CREATE: "/user/checkout-addresses",

  UPDATE: (id: number | string) =>
    `/user/checkout-addresses/${id}`,

  DELETE: (id: number | string) =>
    `/user/checkout-addresses/${id}`,

  SET_DEFAULT: (id: number | string) =>
    `/user/checkout-addresses/${id}/default`,
};

/* =========================
   Get All Checkout Addresses API
========================= */

export const getCheckoutAddressesApi =
  async (): Promise<GetCheckoutAddressesResponse> => {
    const response =
      await axiosInstance.get<GetCheckoutAddressesResponse>(
        CHECKOUT_ADDRESS_API.GET_ALL
      );

    return response.data;
  };

/* =========================
   Get Checkout Address By ID API
========================= */

export const getCheckoutAddressByIdApi = async (
  id: number | string
): Promise<GetCheckoutAddressResponse> => {
  const response =
    await axiosInstance.get<GetCheckoutAddressResponse>(
      CHECKOUT_ADDRESS_API.GET_BY_ID(id)
    );

  return response.data;
};

/* =========================
   Create Checkout Address API
========================= */

export const createCheckoutAddressApi = async (
  payload: CreateCheckoutAddressRequest
): Promise<CreateCheckoutAddressResponse> => {
  const response =
    await axiosInstance.post<CreateCheckoutAddressResponse>(
      CHECKOUT_ADDRESS_API.CREATE,
      payload
    );

  return response.data;
};

/* =========================
   Update Checkout Address API
========================= */

export const updateCheckoutAddressApi = async (
  id: number | string,
  payload: UpdateCheckoutAddressRequest
): Promise<UpdateCheckoutAddressResponse> => {
  const response =
    await axiosInstance.patch<UpdateCheckoutAddressResponse>(
      CHECKOUT_ADDRESS_API.UPDATE(id),
      payload
    );

  return response.data;
};

/* =========================
   Delete Checkout Address API
========================= */

export const deleteCheckoutAddressApi = async (
  id: number | string
): Promise<DeleteCheckoutAddressResponse> => {
  const response =
    await axiosInstance.delete<DeleteCheckoutAddressResponse>(
      CHECKOUT_ADDRESS_API.DELETE(id)
    );

  return response.data;
};

/* =========================
   Set Default Checkout Address API
========================= */

export const setDefaultCheckoutAddressApi = async (
  id: number | string
): Promise<SetDefaultCheckoutAddressResponse> => {
  const response =
    await axiosInstance.patch<SetDefaultCheckoutAddressResponse>(
      CHECKOUT_ADDRESS_API.SET_DEFAULT(id)
    );

  return response.data;
};