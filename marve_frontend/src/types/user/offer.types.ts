export type OfferStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SCHEDULED";

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type OfferType = "DISCOUNT" | "BOGO";

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface UserOfferProduct {
  id: number;
  productId: number | null;
  product: {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    sku: string | null;
    price: number | string;
    compare_at_price: number | string | null;
    status: ProductStatus;
  } | null;
}

export interface UserDiscountOffer {
  id: number;
  uuid: string;
  type: "DISCOUNT";
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderValue: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  sortOrder: number;
}

export interface UserBogoOffer {
  id: number;
  uuid: string;
  type: "BOGO";
  code: string;
  name: string;
  description: string | null;
  buyQuantity: number;
  getQuantity: number;
  minimumOrderValue: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  sortOrder: number;
  buyProducts: UserOfferProduct[];
  getProducts: UserOfferProduct[];
}

export type UserOffer = UserDiscountOffer | UserBogoOffer;

export interface OfferSummary {
  total: number;
  discountCount: number;
  bogoCount: number;
}

export interface GetOffersData {
  offers: UserOffer[];
  summary: OfferSummary;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type GetOffersResponse = ApiResponse<GetOffersData>;

export type GetOfferDetailsResponse = ApiResponse<UserOffer>;