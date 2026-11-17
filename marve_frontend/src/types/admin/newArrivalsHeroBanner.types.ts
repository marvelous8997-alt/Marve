/* =========================
   NEW ARRIVALS HERO BANNER TYPES
========================= */

export type NewArrivalsHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type NewArrivalsHeroBannerType = "NEW_ARRIVALS_HERO";

/* =========================
   NEW ARRIVALS HERO BANNER
========================= */

export interface NewArrivalsHeroBanner {
  id: number | string;
  uuid: string;

  type: NewArrivalsHeroBannerType;

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

  status: NewArrivalsHeroBannerStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SAVE NEW ARRIVALS HERO BANNER REQUEST
========================= */

export interface SaveNewArrivalsHeroBannerRequest {
  type?: NewArrivalsHeroBannerType;

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

  status?: NewArrivalsHeroBannerStatus;

  image?: File | null;
}

/* =========================
   UPDATE BANNER STATUS REQUEST
========================= */

export interface UpdateNewArrivalsHeroBannerStatusRequest {
  status: NewArrivalsHeroBannerStatus;
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
   NEW ARRIVALS HERO BANNER API RESPONSES
========================= */

export type SaveNewArrivalsHeroBannerApiResponse =
  ApiResponse<NewArrivalsHeroBanner>;

export type GetNewArrivalsHeroBannerApiResponse =
  ApiResponse<NewArrivalsHeroBanner>;

export type UpdateNewArrivalsHeroBannerStatusApiResponse =
  ApiResponse<NewArrivalsHeroBanner>;

export type GetActiveNewArrivalsHeroBannerApiResponse =
  ApiResponse<NewArrivalsHeroBanner>;