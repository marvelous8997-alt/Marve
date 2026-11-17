
export type BestSellersHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type BestSellersHeroBannerType = "BEST_SELLERS_HERO";

export interface UserBestSellersHeroBanner {
  id: number;
  uuid: string;
  type: BestSellersHeroBannerType;

  image: string | null;

  eyebrow: string | null;
  heading: string;
  highlighted_heading: string | null;
  description: string | null;

  rating_text: string | null;

  button_text: string | null;
  button_link: string | null;

  floating_label: string | null;
  floating_title: string | null;
  floating_description: string | null;

  bottom_label: string | null;

  status: BestSellersHeroBannerStatus;

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

export type GetActiveBestSellersHeroBannerResponse =
  ApiResponse<UserBestSellersHeroBanner>;
