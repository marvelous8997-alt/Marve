
/* =========================
   KITCHEN ESSENTIALS HERO BANNER TYPES
========================= */

export type KitchenEssentialsHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type KitchenEssentialsHeroBannerType = "KITCHEN_ESSENTIALS_HERO";

/* =========================
   KITCHEN ESSENTIALS HERO BANNER
========================= */

export interface KitchenEssentialsHeroBanner {
  id: number | string;
  uuid: string;

  type: KitchenEssentialsHeroBannerType;

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
  floating_bottom_label: string;

  bottom_label: string;

  status: KitchenEssentialsHeroBannerStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SAVE KITCHEN ESSENTIALS HERO BANNER REQUEST
========================= */

export interface SaveKitchenEssentialsHeroBannerRequest {
  type?: KitchenEssentialsHeroBannerType;

  eyebrow: string;
  heading: string;
  highlighted_heading: string;
  description: string;

  button_text: string;
  button_link: string;

  floating_label: string;
  floating_title: string;
  floating_description: string;
  floating_bottom_label: string;

  bottom_label: string;

  status?: KitchenEssentialsHeroBannerStatus;

  image?: File | null;
}

/* =========================
   UPDATE BANNER STATUS REQUEST
========================= */

export interface UpdateKitchenEssentialsHeroBannerStatusRequest {
  status: KitchenEssentialsHeroBannerStatus;
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
   KITCHEN ESSENTIALS HERO BANNER API RESPONSES
========================= */

export type SaveKitchenEssentialsHeroBannerApiResponse =
  ApiResponse<KitchenEssentialsHeroBanner>;

export type GetKitchenEssentialsHeroBannerApiResponse =
  ApiResponse<KitchenEssentialsHeroBanner>;

export type UpdateKitchenEssentialsHeroBannerStatusApiResponse =
  ApiResponse<KitchenEssentialsHeroBanner>;

export type GetActiveKitchenEssentialsHeroBannerApiResponse =
  ApiResponse<KitchenEssentialsHeroBanner>;
