"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getProductsService,
  getProductByIdService,
  getProductBySlugService,
  getProductsByCategoryIdService,
  getProductsBySubcategoryIdService,
  getNewArrivalsService,
  getBestSellersService,
  getFeaturedProductsService,
  getSaleProductsService,
  getOfferProductsService,
  getGiftProductsService,
} from "@/src/services/user/product.service";

import type {
  UserProductWithRelations,
  GetProductsParams,
  ProductSection,
  PaginatedProductsData,
} from "@/src/types/user/product.types";

/* =========================
   Error Message Handler
========================= */

const getProductErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "Product not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid product request.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================
   Custom Product Hook
========================= */

export default function useProduct() {
  const [products, setProducts] = useState<
    UserProductWithRelations[]
  >([]);

  const [product, setProduct] =
    useState<UserProductWithRelations | null>(null);

  const [productsByCategory, setProductsByCategory] =
    useState<UserProductWithRelations[]>([]);

  const [productsBySubcategory, setProductsBySubcategory] =
    useState<UserProductWithRelations[]>([]);

  const [newArrivals, setNewArrivals] = useState<
    UserProductWithRelations[]
  >([]);

  const [bestSellers, setBestSellers] = useState<
    UserProductWithRelations[]
  >([]);

  const [featuredProducts, setFeaturedProducts] = useState<
    UserProductWithRelations[]
  >([]);

  const [saleProducts, setSaleProducts] = useState<
    UserProductWithRelations[]
  >([]);

  const [offerProducts, setOfferProducts] = useState<
    UserProductWithRelations[]
  >([]);

  const [giftProducts, setGiftProducts] = useState<
    UserProductWithRelations[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] =
    useState(false);
  const [isFetchingByCategory, setIsFetchingByCategory] =
    useState(false);
  const [isFetchingBySubcategory, setIsFetchingBySubcategory] =
    useState(false);
  const [isFetchingSection, setIsFetchingSection] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Get All Active Products
  ========================= */

const fetchProducts = useCallback(
  async (
    params?: GetProductsParams,
    showErrorToast = false
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductsService(params);

      if (
        !response.success ||
        !response.data ||
        !Array.isArray(response.data.products)
      ) {
        throw new Error(
          response.message || "Unable to fetch products."
        );
      }

      const productList = response.data.products;

      setProducts(productList);
      return productList;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to fetch products. Please try again."
      );

      setError(message);

      if (showErrorToast) {
        toast.error(message);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  },
  []
);

  /* =========================
     Get Product By ID
  ========================= */

  const fetchProductById = useCallback(
    async (id: number | string) => {
      setIsFetchingProduct(true);
      setError(null);
      setProduct(null);

      try {
        const response = await getProductByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch product."
          );
        }

        setProduct(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getProductErrorMessage(
          err,
          "Unable to fetch product. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingProduct(false);
      }
    },
    []
  );

  /* =========================
     Get Product By Slug
  ========================= */

  const fetchProductBySlug = useCallback(
    async (slug: string) => {
      setIsFetchingProduct(true);
      setError(null);
      setProduct(null);

      try {
        const response = await getProductBySlugService(slug);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch product."
          );
        }

        setProduct(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getProductErrorMessage(
          err,
          "Unable to fetch product details. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingProduct(false);
      }
    },
    []
  );

  /* =========================
     Get Products By Category ID
  ========================= */

const fetchProductsByCategoryId = useCallback(
  async (
    categoryId: number | string,
    params?: GetProductsParams
  ) => {
    setIsFetchingByCategory(true);
    setError(null);
    setProductsByCategory([]);

    try {
      const response =
        await getProductsByCategoryIdService(
          categoryId,
          params
        );

      if (
        !response.success ||
        !response.data ||
        !Array.isArray(response.data.products)
      ) {
        throw new Error(
          response.message ||
            "Unable to fetch products for this category."
        );
      }

      const categoryProducts = response.data.products;

      setProductsByCategory(categoryProducts);
      return categoryProducts;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to fetch category products. Please try again."
      );

      setError(message);
      return null;
    } finally {
      setIsFetchingByCategory(false);
    }
  },
  []
);

  /* =========================
     Get Products By Subcategory ID
  ========================= */

const fetchProductsBySubcategoryId = useCallback(
  async (
    subcategoryId: number | string,
    params?: GetProductsParams
  ) => {
    setIsFetchingBySubcategory(true);
    setError(null);
    setProductsBySubcategory([]);

    try {
      const response =
        await getProductsBySubcategoryIdService(
          subcategoryId,
          params
        );

      if (
        !response.success ||
        !response.data ||
        !Array.isArray(response.data.products)
      ) {
        throw new Error(
          response.message ||
            "Unable to fetch products for this subcategory."
        );
      }

      const subcategoryProducts = response.data.products;

      setProductsBySubcategory(subcategoryProducts);
      return subcategoryProducts;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to fetch subcategory products. Please try again."
      );

      setError(message);
      return null;
    } finally {
      setIsFetchingBySubcategory(false);
    }
  },
  []
);

  /* =========================
     Get Products By Section
  ========================= */


const fetchProductsBySection = useCallback(
  async (
    section: ProductSection,
    params?: GetProductsParams
  ) => {
    setIsFetchingSection(true);
    setError(null);

    try {
        let response;

      switch (section) {
        case "new-arrivals":
          response = await getNewArrivalsService(params);
          break;

        case "best-sellers":
          response = await getBestSellersService(params);
          break;

        case "featured":
          response = await getFeaturedProductsService(params);
          break;

        case "sale":
          response = await getSaleProductsService(params);
          break;

        case "offers":
          response = await getOfferProductsService(params);
          break;

        case "gifts":
          response = await getGiftProductsService(params);
          break;

        default:
          throw new Error("Invalid product section.");
      }

      const sectionData = response.data;

      if (
        !response.success ||
        !sectionData ||
        !Array.isArray(sectionData.products)
      ) {
        throw new Error(
          response.message ||
            "Unable to fetch products for this section."
        );
      }

      const sectionProducts = sectionData.products;

      switch (section) {
        case "new-arrivals":
          setNewArrivals(sectionProducts);
          break;

        case "best-sellers":
          setBestSellers(sectionProducts);
          break;

        case "featured":
          setFeaturedProducts(sectionProducts);
          break;

        case "sale":
          setSaleProducts(sectionProducts);
          break;

        case "offers":
          setOfferProducts(sectionProducts);
          break;

        case "gifts":
          setGiftProducts(sectionProducts);
          break;
      }

      return sectionProducts;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to fetch section products. Please try again."
      );

      setError(message);
      return null;
    } finally {
      setIsFetchingSection(false);
    }
  },
  []
);


  /* =========================
     Individual Section Methods
  ========================= */

  const fetchNewArrivals = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProductsBySection(
        "new-arrivals",
        params
      );
    },
    [fetchProductsBySection]
  );

  const fetchBestSellers = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProductsBySection(
        "best-sellers",
        params
      );
    },
    [fetchProductsBySection]
  );

  const fetchFeaturedProducts = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProductsBySection(
        "featured",
        params
      );
    },
    [fetchProductsBySection]
  );

  const fetchSaleProducts = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProductsBySection("sale", params);
    },
    [fetchProductsBySection]
  );

  const fetchOfferProducts = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProductsBySection("offers", params);
    },
    [fetchProductsBySection]
  );

  const fetchGiftProducts = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProductsBySection("gifts", params);
    },
    [fetchProductsBySection]
  );

  /* =========================
     Refresh Products
  ========================= */

  const refreshProducts = useCallback(
    async (params?: GetProductsParams) => {
      return await fetchProducts(params, true);
    },
    [fetchProducts]
  );

  /* =========================
     Initial Products Fetch
  ========================= */

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Return
  ========================= */

  return {
    products,
    product,
    productsByCategory,
    productsBySubcategory,

    newArrivals,
    bestSellers,
    featuredProducts,
    saleProducts,
    offerProducts,
    giftProducts,

    isLoading,
    isFetchingProduct,
    isFetchingByCategory,
    isFetchingBySubcategory,
    isFetchingSection,

    error,

    fetchProducts,
    fetchProductById,
    fetchProductBySlug,
    fetchProductsByCategoryId,
    fetchProductsBySubcategoryId,

    fetchProductsBySection,
    fetchNewArrivals,
    fetchBestSellers,
    fetchFeaturedProducts,
    fetchSaleProducts,
    fetchOfferProducts,
    fetchGiftProducts,

    refreshProducts,
    clearError,
  };
}