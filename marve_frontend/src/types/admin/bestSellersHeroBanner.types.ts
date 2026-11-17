
/* =========================
   BEST SELLERS HERO BANNER TYPES
========================= */

export type BestSellersHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type BestSellersHeroBannerType = "BEST_SELLERS_HERO";

/* =========================
   BEST SELLERS HERO BANNER
========================= */

export interface BestSellersHeroBanner {
  id: number | string;
  uuid: string;

  type: BestSellersHeroBannerType;

  image: string | null;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  rating_text: string;

  button_text: string;
  button_link: string;

  floating_label: string;
  floating_title: string;
  floating_description: string;

  bottom_label: string;

  status: BestSellersHeroBannerStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SAVE BEST SELLERS HERO BANNER REQUEST
========================= */

export interface SaveBestSellersHeroBannerRequest {
  type?: BestSellersHeroBannerType;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  rating_text: string;

  button_text: string;
  button_link: string;

  floating_label: string;
  floating_title: string;
  floating_description: string;

  bottom_label: string;

  status?: BestSellersHeroBannerStatus;

  image?: File | null;
}

/* =========================
   UPDATE BANNER STATUS REQUEST
========================= */

export interface UpdateBestSellersHeroBannerStatusRequest {
  status: BestSellersHeroBannerStatus;
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
   BEST SELLERS HERO BANNER API RESPONSES
========================= */

export type SaveBestSellersHeroBannerApiResponse =
  ApiResponse<BestSellersHeroBanner>;

export type GetBestSellersHeroBannerApiResponse =
  ApiResponse<BestSellersHeroBanner>;

export type UpdateBestSellersHeroBannerStatusApiResponse =
  ApiResponse<BestSellersHeroBanner>;

export type GetActiveBestSellersHeroBannerApiResponse =
  ApiResponse<BestSellersHeroBanner>;
