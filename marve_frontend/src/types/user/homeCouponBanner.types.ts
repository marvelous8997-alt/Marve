
export type HomeCouponBannerStatus = "ACTIVE" | "INACTIVE";

export type HomeCouponBannerType = "HOME_COUPON";

export type HomeCouponDiscountType = "PERCENTAGE" | "FIXED";

export interface UserHomeCouponBanner {
  id: number;
  uuid: string;
  type: HomeCouponBannerType;

  image: string | null;

  eyebrow: string | null;
  heading: string;
  highlighted_heading: string | null;
  description: string | null;

  button_text: string | null;
  button_link: string | null;

  offer_text: string | null;
  discount_value: number;
  discount_type: HomeCouponDiscountType;
  coupon_code: string;
  terms_text: string | null;

  status: HomeCouponBannerStatus;

  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type GetActiveHomeCouponBannerResponse =
  ApiResponse<UserHomeCouponBanner>;
