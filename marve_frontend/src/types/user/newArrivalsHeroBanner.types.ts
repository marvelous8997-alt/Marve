
export type NewArrivalsHeroBannerStatus = "ACTIVE" | "INACTIVE";

export type NewArrivalsHeroBannerType = "NEW_ARRIVALS_HERO";

export interface UserNewArrivalsHeroBanner {
  id: number;
  uuid: string;
  type: NewArrivalsHeroBannerType;

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

  status: NewArrivalsHeroBannerStatus;

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

export type GetActiveNewArrivalsHeroBannerResponse =
  ApiResponse<UserNewArrivalsHeroBanner>;
