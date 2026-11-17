export type InventoryItemType = "PRODUCT" | "VARIATION";

export type InventoryStockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

export type InventoryMovementReason =
  | "PURCHASE"
  | "RESTOCK"
  | "RETURN"
  | "DAMAGED"
  | "LOST"
  | "CORRECTION"
  | "ORDER"
  | "CANCELLATION"
  | "OTHER";

/* ========================= Inventory Item ========================= */

export interface InventoryCategoryInfo {
  id: number;
  uuid?: string;
  name: string;
  slug?: string;
}

export interface InventoryImage {
  id?: number;
  uuid?: string;
  productId?: number;
  product_id?: number;
  imageUrl?: string;
  image_url?: string;
  altText?: string;
  alt_text?: string;
  isPrimary?: boolean;
  is_primary?: boolean;
  sortOrder?: number;
  sort_order?: number;
}

export interface InventoryProductInfo {
  id: number;
  uuid?: string;
  name: string;
  slug?: string;
  sku?: string | null;
  price?: number;
  categoryId?: number;
  category_id?: number;
  subcategoryId?: number;
  subcategory_id?: number;
  category?: InventoryCategoryInfo;
  subcategory?: InventoryCategoryInfo;
  images?: InventoryImage[];
}

export interface InventoryItem {
  id: number;
  uuid?: string;

  itemType: InventoryItemType;
  itemId?: number;

  productId: number;
  product_id?: number;
  productName: string;
  productImage: string | null;

  sku: string | null;

  variationId?: number | null;
  variation_id?: number | null;
  variationName?: string | null;
  variation_name?: string | null;
  variationAttributes?: Record<string, string> | null;

  categoryId?: number;
  category_id?: number;
  categoryName?: string | null;
  category?: InventoryCategoryInfo;

  subcategoryId?: number;
  subcategory_id?: number;
  subcategoryName?: string | null;
  subcategory?: InventoryCategoryInfo;

  product?: InventoryProductInfo;

  price: number;
  stock: number;
  lowStockThreshold: number;
  status: InventoryStockStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Inventory Filters ========================= */

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;

  categoryId?: number | "";
  subcategoryId?: number | "";

  stockStatus?: InventoryStockStatus | "";

  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/* ========================= Inventory Pagination ========================= */

export interface InventoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InventorySummary {
  totalItems: number;
  totalStock: number;
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export interface InventoryListResult {
  items: InventoryItem[];
  pagination: InventoryPagination;
  summary?: InventorySummary;
}

/* ========================= Stock Adjustment ========================= */

export interface InventoryStockAdjustmentData {
  adjustmentQuantity: number;
  reason: InventoryMovementReason | string;
  notes?: string;
}

export interface InventoryStockAdjustmentResult {
  itemType: InventoryItemType;
  itemId: number;
  previousStock: number;
  adjustmentQuantity: number;
  newStock: number;
  status: InventoryStockStatus;
  movement?: InventoryStockMovement;
}

/* ========================= Stock Movement History ========================= */

export interface InventoryStockMovement {
  id: number;
  uuid?: string;

  itemType: InventoryItemType;
  item_type?: InventoryItemType;

  itemId: number;
  item_id?: number;

  previousStock: number;
  previous_stock?: number;

  adjustmentQuantity: number;
  adjustment_quantity?: number;

  newStock: number;
  new_stock?: number;

  reason: string;
  notes?: string | null;

  createdBy?: number | null;
  created_by?: number | null;

  createdByAdmin?: {
    id: number;
    name?: string;
    email?: string;
  } | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryMovementFilters {
  page?: number;
  limit?: number;
  itemType?: InventoryItemType;
  itemId?: number;
  createdBy?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface InventoryMovementListResult {
  movements: InventoryStockMovement[];
  pagination: InventoryPagination;
}

/* ========================= API Responses ========================= */

export interface InventoryApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}