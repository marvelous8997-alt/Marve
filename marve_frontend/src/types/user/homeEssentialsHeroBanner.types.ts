
export type HomeEssentialsHeroBannerStatus =
  | "ACTIVE"
  | "INACTIVE";

export type HomeEssentialsHeroBannerType =
  | "HOME_ESSENTIALS_HERO";

export interface UserHomeEssentialsHeroBanner {
  id: number;
  uuid: string;
  type: HomeEssentialsHeroBannerType;

  image: string | null;

  eyebrow: string | null;
  heading: string;
  highlighted_heading: string | null;
  description: string | null;

  button_text: string | null;
  button_link: string | null;

  floating_label: string | null;
  floating_title: string | null;
  floating_description: string | null;

  bottom_label: string | null;

  status: HomeEssentialsHeroBannerStatus;

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

export type GetActiveHomeEssentialsHeroBannerResponse =
  ApiResponse<UserHomeEssentialsHeroBanner>;
