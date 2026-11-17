
/* =========================
   HOME COUPON BANNER TYPES
========================= */

export type HomeCouponBannerStatus = "ACTIVE" | "INACTIVE";

export type HomeCouponBannerType = "HOME_COUPON";

export type HomeCouponDiscountType = "PERCENTAGE" | "FIXED";

/* =========================
   HOME COUPON BANNER
========================= */

export interface HomeCouponBanner {
  id: number | string;
  uuid: string;

  type: HomeCouponBannerType;

  image: string | null;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;

  offer_text: string;
  discount_value: number;
  discount_type: HomeCouponDiscountType;
  coupon_code: string;
  terms_text: string;

  status: HomeCouponBannerStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SAVE HOME COUPON BANNER REQUEST
========================= */

export interface SaveHomeCouponBannerRequest {
  type?: HomeCouponBannerType;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;

  offer_text: string;
  discount_value: number;
  discount_type: HomeCouponDiscountType;
  coupon_code: string;
  terms_text: string;

  status?: HomeCouponBannerStatus;

  image?: File | null;
}

/* =========================
   UPDATE BANNER STATUS REQUEST
========================= */

export interface UpdateHomeCouponBannerStatusRequest {
  status: HomeCouponBannerStatus;
}

/* =========================
   API RESPONSE
========================= */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   HOME COUPON BANNER API RESPONSES
========================= */

export type SaveHomeCouponBannerApiResponse =
  ApiResponse<HomeCouponBanner>;

export type GetHomeCouponBannerApiResponse =
  ApiResponse<HomeCouponBanner>;

export type UpdateHomeCouponBannerStatusApiResponse =
  ApiResponse<HomeCouponBanner>;

export type GetActiveHomeCouponBannerApiResponse =
  ApiResponse<HomeCouponBanner>;
