
export type KitchenEssentialsHeroBannerStatus =
  | "ACTIVE"
  | "INACTIVE";

export type KitchenEssentialsHeroBannerType =
  | "KITCHEN_ESSENTIALS_HERO";

export interface UserKitchenEssentialsHeroBanner {
  id: number;
  uuid: string;
  type: KitchenEssentialsHeroBannerType;

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
  floating_bottom_label: string | null;

  bottom_label: string | null;

  status: KitchenEssentialsHeroBannerStatus;

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

export type GetActiveKitchenEssentialsHeroBannerResponse =
  ApiResponse<UserKitchenEssentialsHeroBanner>;
