
/* =========================
   HOME HERO BANNER TYPES
========================= */

export type HomeHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type HomeHeroBannerType = "HOME_HERO";

/* =========================
   HOME HERO BANNER
========================= */

export interface HomeHeroBanner {
  id: number | string;
  uuid: string;

  type: HomeHeroBannerType;

  image: string | null;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;
  bottom_label: string;

  status: HomeHeroBannerStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SAVE HOME HERO BANNER REQUEST
========================= */

export interface SaveHomeHeroBannerRequest {
  type?: HomeHeroBannerType;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;
  bottom_label: string;

  status?: HomeHeroBannerStatus;

  image?: File | null;
}

/* =========================
   UPDATE BANNER STATUS REQUEST
========================= */

export interface UpdateHomeHeroBannerStatusRequest {
  status: HomeHeroBannerStatus;
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
   HOME HERO BANNER API RESPONSES
========================= */

export type SaveHomeHeroBannerApiResponse =
  ApiResponse<HomeHeroBanner>;

export type GetHomeHeroBannerApiResponse =
  ApiResponse<HomeHeroBanner>;

export type UpdateHomeHeroBannerStatusApiResponse =
  ApiResponse<HomeHeroBanner>;

export type GetActiveHomeHeroBannerApiResponse =
  ApiResponse<HomeHeroBanner>;
