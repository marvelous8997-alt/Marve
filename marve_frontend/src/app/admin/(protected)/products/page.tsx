"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import ProductHeader from "@/src/components/admin/product/ProductHeader";
import ProductSearch, { ProductStatusFilter } from "@/src/components/admin/product/ProductSearch";
import ProductTable from "@/src/components/admin/product/ProductTable";
import ProductPagination from "@/src/components/admin/product/ProductPagination";
import ProductSkeleton from "@/src/components/admin/product/ProductSkeleton";
import ProductModal from "@/src/components/admin/product/ProductModal";
import ProductDetails from "@/src/components/admin/product/ProductDetails";
import useProduct from "@/src/hooks/admin/useProduct";
import useCategory from "@/src/hooks/admin/useCategory";
import useSubcategory from "@/src/hooks/admin/usesubCategory";
import ProductDeleteModal from "@/src/components/admin/product/ProductDeleteModal";
import type { Product } from "@/src/types/admin/product.types";
import type { ProductFilters } from "@/src/types/admin/product.types";
import type { ProductFormData } from "@/src/components/admin/product/ProductForm";
import type { CreateProductFormValues, UpdateProductFormValues } from "@/src/validations/admin/product.validation";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatusFilter>("ALL");
  const [category, setCategory] = useState("ALL");
  const [subcategory, setSubcategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    products,
    pagination,
    isLoading,
    isSubmitting,
    isDeleting,
    isUpdatingStatus,
    fetchProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
  } = useProduct();

  const {
  activeCategoriesForDropdown,
  fetchActiveCategoriesForDropdown,
} = useCategory();

const {
  subcategories,
  fetchSubcategories,
} = useSubcategory();

useEffect(() => {
  void fetchActiveCategoriesForDropdown().catch(() => {
  });
}, [fetchActiveCategoriesForDropdown]);

useEffect(() => {
  void fetchSubcategories({
    page: 1,
    limit: 1000,
    status: "ACTIVE",
  }).catch(() => {
  });
}, [fetchSubcategories]);

const categoryOptions = useMemo(
  () =>
    activeCategoriesForDropdown
      .filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
      })),
  [activeCategoriesForDropdown],
);

const subcategoryOptions = useMemo(
  () =>
    subcategories
      .filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        id: item.id,
        name: item.name,
        categoryId:
          item.categoryId ?? item.category_id,
        status: item.status,
      })),
  [subcategories],
);

// ========================= Category Names =========================
const categoryNames = useMemo(
  () => categoryOptions.map((item) => item.name),
  [categoryOptions],
);

// ========================= Subcategory Options =========================
  const filteredSubcategoryOptions = useMemo(() => {
    if (category === "ALL") {
      return subcategoryOptions;
    }
    const selectedCategory = categoryOptions.find(
      (item) => item.name === category,
    );
    if (!selectedCategory) {
      return [];
    }
    return subcategoryOptions.filter(
      (item) => item.categoryId === selectedCategory.id,
    );
}, [category, categoryOptions, subcategoryOptions]);
  const subcategoryNames = useMemo(
    () => filteredSubcategoryOptions.map((item) => item.name),
    [filteredSubcategoryOptions],
  );
  const requestFilters = useMemo<ProductFilters>(() => {
    const selectedCategory = categoryOptions.find(
      (item) => item.name === category,
    );
    const selectedSubcategory = subcategoryOptions.find(
      (item) => item.name === subcategory,
    );
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status: status === "ALL" ? "" : status,
      categoryId:
        category === "ALL" || !selectedCategory
          ? ""
          : Number(selectedCategory.id),
      subcategoryId:
        subcategory === "ALL" || !selectedSubcategory
          ? ""
          : Number(selectedSubcategory.id),
    };
  }, [
    currentPage,
    search,
    status,
    category,
    subcategory,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProducts(requestFilters).catch(() => {
        // The hook handles API error notifications.
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [fetchProducts, requestFilters]);

  // ========================= Search =========================
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  // ========================= Status Filter =========================
  const handleStatusChange = useCallback(
    (value: ProductStatusFilter) => {
      setStatus(value);
      setCurrentPage(1);
    },
    [],
  );

  // ========================= Category Filter =========================
  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setSubcategory("ALL");
    setCurrentPage(1);
  }, []);

  // ========================= Subcategory Filter =========================
  const handleSubcategoryChange = useCallback(
    (value: string) => {
      setSubcategory(value);
      setCurrentPage(1);
    },
    [],
  );

  // ========================= Reset Filters =========================
  const handleReset = useCallback(() => {
    setSearch("");
    setStatus("ALL");
    setCategory("ALL");
    setSubcategory("ALL");
    setCurrentPage(1);
  }, []);

  // ========================= Add Product =========================
  const handleAdd = useCallback(() => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  }, []);

  // ========================= View Product =========================
  const handleView = useCallback((product: Product) => {
    setDetailsProduct(product);
  }, []);

  // ========================= Edit Product =========================
  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDetailsProduct(null);
    setIsProductModalOpen(true);
  }, []);

  // ========================= Refresh =========================
  const handleRefresh = useCallback(async () => {
    try {
      await fetchProducts(requestFilters);
    } catch {
      // The hook handles API error notifications.
    }
  }, [fetchProducts, requestFilters]);

// ========================= Delete Product =========================
const handleDelete = useCallback((product: Product) => {
  setProductToDelete(product);
  setIsDeleteModalOpen(true);
}, []);

const handleCloseDeleteModal = useCallback(() => {
  if (isDeleting) return;
  setIsDeleteModalOpen(false);
  setProductToDelete(null);
}, [isDeleting]);

const handleConfirmDelete = useCallback(async () => {
  if (!productToDelete || isDeleting) return;
  try {
    await deleteProduct(productToDelete.uuid);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
    await fetchProducts(requestFilters);
  } catch {
    // useProduct hook handles API error notifications.
  }
}, [
  productToDelete,
  isDeleting,
  deleteProduct,
  fetchProducts,
  requestFilters,
]);

  // ========================= Toggle Product Status =========================
  const handleToggleStatus = useCallback(
    async (product: Product) => {
      const nextStatus =
        product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      try {
        await updateProductStatus(product.uuid, {
          status: nextStatus,
        });
        await fetchProducts(requestFilters);
      } catch {
        // The hook handles API error notifications.
      }
    },
    [
      updateProductStatus,
      fetchProducts,
      requestFilters,
    ],
  );

  // ========================= Create / Update Product =========================
  const handleSubmit = useCallback(
    async (data: ProductFormData) => {
      const categoryId = Number(data.categoryId);
      const subcategoryId = Number(data.subcategoryId);
      const price = Number(data.price);
      const compareAtPrice =
        data.compareAtPrice === "" ||
        data.compareAtPrice == null
          ? null
          : Number(data.compareAtPrice);
      const stock = Number(data.stock);
      const sortOrder = Number(data.sortOrder);

      if (
        !Number.isInteger(categoryId) ||
        categoryId <= 0 ||
        !Number.isInteger(subcategoryId) ||
        subcategoryId <= 0
      ) {
        window.alert("Please select a valid category and subcategory.");
        return;
      }

      if (
        !Number.isFinite(price) ||
        price < 0 ||
        (compareAtPrice !== null &&
          (!Number.isFinite(compareAtPrice) ||
            compareAtPrice < price))
      ) {
        window.alert(
          "Please check the selling price and comparison price.",
        );
        return;
      }

      if (
        !Number.isInteger(stock) ||
        stock < 0 ||
        !Number.isInteger(sortOrder) ||
        sortOrder < 0
      ) {
        window.alert(
          "Stock and sort order must be non-negative whole numbers.",
        );
        return;
      }

    const imageFiles: File[] = [];
    const imageManifest = (data.images ?? []).map(
      (image, index) => {
        if (image.file instanceof File) {
          const fileIndex = imageFiles.length;
          imageFiles.push(image.file);
          return {
            kind: "new",
            file_index: fileIndex,
            sort_order: index,
            is_primary: Boolean(image.isPrimary),
            alt_text:
              image.altText ||
              image.alt_text ||
              data.name.trim(),
          };
        }
        return {
          kind: "existing",
          identifier: String(image.uuid ?? image.id ?? ""),
          sort_order: index,
          is_primary: Boolean(image.isPrimary),
          alt_text:
            image.altText ||
            image.alt_text ||
            data.name.trim(),
        };
      },
    );

const commonPayload = {
  category_id: categoryId,
  subcategory_id: subcategoryId,

  name: data.name.trim(),
  slug: data.slug.trim(),
  short_description: data.shortDescription.trim(),
  description: data.description.trim(),
  sku: data.sku.trim(),

  price,
  compare_at_price: compareAtPrice,
  stock,

  // Product dimensions and weight
  height: data.height === "" ? null : Number(data.height),
  width: data.width === "" ? null : Number(data.width),
  length: data.length === "" ? null : Number(data.length),
  weight: data.weight === "" ? null : Number(data.weight),

  dimension_unit: data.dimension_unit,
  weight_unit: data.weight_unit,

  status: data.status,
  featured: data.featured,
  is_new_arrival: data.isNewArrival,
  is_bestseller: data.isBestseller,
  is_sale: data.isSale,
  is_offer: data.isOffer,
  is_gift: data.isGift,
  sort_order: sortOrder,

  images: imageFiles,
  image_manifest: JSON.stringify(imageManifest),
  video: data.video ?? undefined,
};

    try {
      if (selectedProduct) {
        const updatePayload: UpdateProductFormValues = {
          ...commonPayload,
        };
        await updateProduct(
          selectedProduct.uuid,
          updatePayload,
        );
      } else {
        const createPayload: CreateProductFormValues = {
          ...commonPayload,
        };
        await createProduct(createPayload);
      }
      setIsProductModalOpen(false);
      setSelectedProduct(null);
      setCurrentPage(1);
      await fetchProducts({
        ...requestFilters,
        page: 1,
      });
    } catch {
      // useProduct hook handles API error notifications.
    }
    },
    [
      selectedProduct,
      createProduct,
      updateProduct,
      fetchProducts,
      requestFilters,
    ],
  );

  // ========================= Close Product Modal =========================
  const handleCloseModal = useCallback(() => {
    if (isSubmitting) return;

    setIsProductModalOpen(false);
    setSelectedProduct(null);
  }, [isSubmitting]);

  // ========================= Close Details =========================
  const handleCloseDetails = useCallback(() => {
    setDetailsProduct(null);
  }, []);

  // ========================= Manage Variations =========================
const handleManageVariations = useCallback(
  (product: Product) => {
    setDetailsProduct(null);

    router.push(
      `/admin/products/${product.uuid}/variations`,
    );
  },
  [router],
);

  // ========================= Pagination =========================
  const totalItems = pagination.count;
  const totalPages = Math.max(1, pagination.totalPages);
  const paginatedProducts = products;

  // ========================= Render =========================
  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />
      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          <ProductHeader
            totalProducts={totalItems}
            onAdd={handleAdd}
            onRefresh={handleRefresh}
            isLoading={isLoading}/>
          <ProductSearch
            search={search}
            status={status}
            category={category}
            subcategory={subcategory}
            categories={categoryNames}
            subcategories={subcategoryNames}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            onReset={handleReset}/>
          {isLoading ? (
            <ProductSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <ProductTable
              products={paginatedProducts}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}/>
          )}
          {!isLoading && totalItems > 0 && (
            <ProductPagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pagination.limit}
              onPageChange={setCurrentPage}/>
          )}
        </div>
      </div>
      <ProductModal
        isOpen={isProductModalOpen}
        product={selectedProduct}
        categories={categoryOptions}
        subcategories={subcategoryOptions}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}/>
      <ProductDeleteModal
        isOpen={isDeleteModalOpen}
        productName={productToDelete?.name ?? ""}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}/>
      {detailsProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDetails();
            }
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
            className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="product-details-title"
                  className="text-base font-semibold tracking-[-0.01em] text-[#29231F]">
                  Product Details
                </h2>
                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View product information, pricing, images, and
                  store configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseDetails}
                aria-label="Close product details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]">
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <ProductDetails
                product={detailsProduct}
                onEdit={(product) => {
                  handleCloseDetails();
                  handleEdit(product);
                }}
                onManageVariations={handleManageVariations}/>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}