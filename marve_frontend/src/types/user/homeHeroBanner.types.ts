
export type HomeHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type HomeHeroBannerType = "HOME_HERO";

export interface UserHomeHeroBanner {
  id: number;
  uuid: string;
  type: HomeHeroBannerType;
  image: string | null;
  eyebrow: string | null;
  heading: string;
  highlighted_heading: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  bottom_label: string | null;
  status: HomeHeroBannerStatus;
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

export type GetActiveHomeHeroBannerResponse =
  ApiResponse<UserHomeHeroBanner>;
