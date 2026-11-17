
/* =========================
   HOME ESSENTIALS HERO BANNER TYPES
========================= */

export type HomeEssentialsHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type HomeEssentialsHeroBannerType = "HOME_ESSENTIALS_HERO";

/* =========================
   HOME ESSENTIALS HERO BANNER
========================= */

export interface HomeEssentialsHeroBanner {
  id: number | string;
  uuid: string;

  type: HomeEssentialsHeroBannerType;

  image: string | null;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;

  floating_label: string;
  floating_title: string;
  floating_description: string;

  bottom_label: string;

  status: HomeEssentialsHeroBannerStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SAVE HOME ESSENTIALS HERO BANNER REQUEST
========================= */

export interface SaveHomeEssentialsHeroBannerRequest {
  type?: HomeEssentialsHeroBannerType;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;

  floating_label: string;
  floating_title: string;
  floating_description: string;

  bottom_label: string;

  status?: HomeEssentialsHeroBannerStatus;

  image?: File | null;
}

/* =========================
   UPDATE BANNER STATUS REQUEST
========================= */

export interface UpdateHomeEssentialsHeroBannerStatusRequest {
  status: HomeEssentialsHeroBannerStatus;
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
   HOME ESSENTIALS HERO BANNER API RESPONSES
========================= */

export type SaveHomeEssentialsHeroBannerApiResponse =
  ApiResponse<HomeEssentialsHeroBanner>;

export type GetHomeEssentialsHeroBannerApiResponse =
  ApiResponse<HomeEssentialsHeroBanner>;

export type UpdateHomeEssentialsHeroBannerStatusApiResponse =
  ApiResponse<HomeEssentialsHeroBanner>;

export type GetActiveHomeEssentialsHeroBannerApiResponse =
  ApiResponse<HomeEssentialsHeroBanner>;
