"use client";

import { ArrowLeft, Package } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import ProductVariationHeader from "@/src/components/admin/product/variation/ProductVariationHeader";
import ProductVariationSearch, {
  ProductVariationStatus as VariationFilterStatus,
} from "@/src/components/admin/product/variation/ProductVariationSearch";
import ProductVariationTable from "@/src/components/admin/product/variation/ProductVariationTable";
import ProductVariationPagination from "@/src/components/admin/product/variation/ProductVariationPagination";
import ProductVariationSkeleton from "@/src/components/admin/product/variation/ProductVariationSkeleton";
import ProductVariationDetails from "@/src/components/admin/product/variation/ProductVariationDetails";
import ProductVariationDeleteModal from "@/src/components/admin/product/variation/ProductVariationDeleteModal";
import type {
  BulkCreateProductVariationsFormValues,
} from "@/src/validations/admin/productVariation.validation";
import type {
  ProductVariation,
  ProductVariationBulkItem,
} from "@/src/types/admin/productVariation.types";

import ProductVariationBulkForm from "@/src/components/admin/product/variation/ProductVariationForm";

import useProductVariation from "@/src/hooks/admin/useProductVariation";
import useProduct from "@/src/hooks/admin/useProduct";


const ITEMS_PER_PAGE = 8;

interface ProductVariationPageProps {
  params: Promise<{
    productId: string;
  }>;
}

interface ParentProduct {
  id: number;
  uuid?: string;
  name: string;
  sku: string;
  categoryName: string;
  subcategoryName: string;
}

export default function ProductVariationsPage({
  params,
}: ProductVariationPageProps) {
  const router = useRouter();

  const { productId } = use(params);

const {
  variations,
  pagination,
  isLoading,
  isSubmitting,
  isDeleting,
  isUpdatingStatus,
  isBulkCreating,
  error,
  fetchProductVariations,
  createProductVariation,
  bulkCreateProductVariations,
  updateProductVariation,
  updateProductVariationStatus,
  deleteProductVariation,
} = useProductVariation();

const { fetchProductDetails } = useProduct();

const [selectedProduct, setSelectedProduct] =
  useState<ParentProduct | null>(null);

const [isProductLoading, setIsProductLoading] =
  useState(true);

useEffect(() => {
  let isMounted = true;

  const loadProduct = async () => {
    setIsProductLoading(true);

    try {
      const product = await fetchProductDetails(productId);

      if (!isMounted) return;

      
      setSelectedProduct({
        id: product.id,
        uuid: product.uuid,
        name: product.name,
        sku: product.sku ?? "—",
        categoryName: product.category?.name ?? "—",
        subcategoryName: product.subcategory?.name ?? "—",
      });

    } catch {
      if (isMounted) {
        setSelectedProduct(null);
      }
    } finally {
      if (isMounted) {
        setIsProductLoading(false);
      }
    }
  };

  void loadProduct();

  return () => {
    isMounted = false;
  };
}, [productId, fetchProductDetails]);

const [search, setSearch] = useState("");
const [status, setStatus] =
  useState<VariationFilterStatus>("ALL");

const [currentPage, setCurrentPage] = useState(1);

const [isVariationModalOpen, setIsVariationModalOpen] =
  useState(false);
const [isBulkCreateOpen, setIsBulkCreateOpen] =
  useState(false);
const [selectedVariation, setSelectedVariation] =
  useState<ProductVariation | null>(null);

const [detailsVariation, setDetailsVariation] =
  useState<ProductVariation | null>(null);
  const [variationToDelete, setVariationToDelete] =
  useState<ProductVariation | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]); 

  const handleBulkAdd = () => {
  if (!selectedProduct || isBulkCreating) return;
  setIsBulkCreateOpen(true);
};

  const handleView = (variation: ProductVariation) => {
    setDetailsVariation(variation);
  };

  const handleEdit = (variation: ProductVariation) => {
    setDetailsVariation(null);
    setSelectedVariation(variation);
    setIsVariationModalOpen(true);
  };

const handleDelete = (variation: ProductVariation) => {
  if (!selectedProduct || isDeleting) return;

  setVariationToDelete(variation);
};

const handleConfirmDelete = async () => {
  if (!selectedProduct || !variationToDelete || isDeleting) {
    return;
  }

  const variation = variationToDelete;

  try {
    await deleteProductVariation(variation.uuid);

    setDetailsVariation((previous) =>
      previous?.uuid === variation.uuid ? null : previous
    );

    setVariationToDelete(null);

    await fetchProductVariations({
      productId: selectedProduct.id,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim(),
      status: status === "ALL" ? "" : status,
    });
  } catch {
    // Hook error aur toast handle karta hai.
  }
};

const handleToggleStatus = async (
  variation: ProductVariation
) => {
  if (!selectedProduct) return;
  const nextStatus =
    variation.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  try {
    const updatedVariation = await updateProductVariationStatus(
      variation.uuid,
      { status: nextStatus }
    );

    setDetailsVariation((previous) =>
      previous?.uuid === variation.uuid
        ? updatedVariation
        : previous
    );

    await fetchProductVariations({
      productId: selectedProduct.id,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim(),
      status: status === "ALL" ? "" : status,
    });
  } catch {
    // Hook error aur toast handle karta hai.
  }
};

const handleBulkSubmit = async (
  data: BulkCreateProductVariationsFormValues
) => {
  if (!selectedProduct || isBulkCreating) return;

  try {
    await bulkCreateProductVariations(data);

    setIsBulkCreateOpen(false);
    setCurrentPage(1);

    await fetchProductVariations({
      productId: selectedProduct.id,
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: search.trim(),
      status: status === "ALL" ? "" : status,
    });
  } catch {
    // Hook error aur toast handle karta hai.
  }
};

const handleRefresh = async () => {
  if (!selectedProduct) return;
  if (isLoading) return;

  setSearch("");
  setStatus("ALL");
  setCurrentPage(1);

  await fetchProductVariations({
    productId: selectedProduct.id,
    page: 1,
    limit: ITEMS_PER_PAGE,
    search: "",
    status: "",
  }).catch(() => {
    // Hook error aur toast handle karta hai.
  });
};

  const handleBackToProduct = () => {
    router.push(
      `/admin/products`,
    );
  };

useEffect(() => {
  if (!selectedProduct) return;

  const timer = window.setTimeout(() => {
    void fetchProductVariations({
      productId: selectedProduct.id,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim(),
      status: status === "ALL" ? "" : status,
    });
  }, search.trim() ? 350 : 0);

  return () => window.clearTimeout(timer);
}, [
  selectedProduct,
  currentPage,
  search,
  status,
  fetchProductVariations,
]);

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* BACK */}
          <button
            type="button"
            onClick={handleBackToProduct}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 text-[10px] font-semibold text-[#665B53] transition-all duration-150 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.8}
            />

            Back to Products
          </button>

          {/* HEADER */}
          <ProductVariationHeader
            productName={selectedProduct?.name ?? "Loading product..."}
            totalVariations={pagination.count}
            onBulkAdd={handleBulkAdd}
            isBulkCreating={isBulkCreating}
            onRefresh={handleRefresh}
            isLoading={isLoading || isProductLoading}
          />

          {/* PRODUCT SUMMARY */}
          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8">
                  <Package
                    size={18}
                    strokeWidth={1.7}
                    className="text-[#6B3E1E]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
                    Parent Product
                  </p>

                  <h2 className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                    {selectedProduct?.name ?? "—"}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:items-center sm:gap-6">
                <ProductMeta
                  label="SKU"
                  value={selectedProduct?.sku ?? "—"}
                />

                <ProductMeta
                  label="Category"
                  value={selectedProduct?.categoryName ?? "—"}
                />

                <ProductMeta
                  label="Subcategory"
                  value={selectedProduct?.subcategoryName ?? "—"}
                />
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <ProductVariationSearch
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onReset={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />

          {/* TABLE / SKELETON */}
          {isLoading ? (
            <ProductVariationSkeleton />
          ) : (
           <ProductVariationTable
              variations={variations}
              onView={handleView}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          )}

          {/* PAGINATION */}
          {!isLoading && (
            <ProductVariationPagination
              currentPage={pagination.page}
              totalItems={pagination.count}
              itemsPerPage={pagination.limit}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
{isBulkCreateOpen && selectedProduct && (
  <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5">
    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-t-2xl bg-white p-4 sm:rounded-2xl sm:p-6">
      <ProductVariationBulkForm
        product={{
          id: selectedProduct.id,
          name: selectedProduct.name,
          sku: selectedProduct.sku,
        }}
        onSubmit={handleBulkSubmit}
        onCancel={() => {
          if (!isBulkCreating) {
            setIsBulkCreateOpen(false);
          }
        }}
        isSubmitting={isBulkCreating}
      />
    </div>
  </div>
)}

      {/* DETAILS MODAL */}
      {detailsVariation && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setDetailsVariation(null);
            }
          }}
        >
          {detailsVariation && selectedProduct && (
            <ProductVariationDetails
              variation={detailsVariation}
              product={{
                id: selectedProduct.id,
                name: selectedProduct.name,
              }}
              onClose={() =>
                setDetailsVariation(null)
              }
              onEdit={handleEdit}
            />
          )}
        </div>
      )}

      
{/* DELETE VARIATION MODAL */}
<ProductVariationDeleteModal
  isOpen={Boolean(variationToDelete)}
  variationName={variationToDelete?.name ?? ""}
  isDeleting={isDeleting}
  onClose={() => {
    if (!isDeleting) {
      setVariationToDelete(null);
    }
  }}
  onConfirm={handleConfirmDelete}
/>

    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Product Meta                                                               */
/* -------------------------------------------------------------------------- */

function ProductMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
        {label}
      </p>

      <p
        title={value}
        className="mt-0.5 max-w-[180px] truncate text-[10px] font-semibold text-[#665B53]"
      >
        {value}
      </p>
    </div>
  );
}