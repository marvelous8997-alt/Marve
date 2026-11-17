"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import CategoryHeader from "@/src/components/admin/category/CategoryHeader";
import CategorySearch, { type CategoryStatusFilter } from "@/src/components/admin/category/CategorySearch";
import CategoryTable from "@/src/components/admin/category/CategoryTable";
import CategoryPagination from "@/src/components/admin/category/CategoryPagination";
import CategorySkeleton from "@/src/components/admin/category/CategorySkeleton";
import CategoryModal from "@/src/components/admin/category/CategoryModal";
import CategoryDetails from "@/src/components/admin/category/CategoryDetails";
import useCategory from "@/src/hooks/admin/useCategory";
import type { Category, CategoryIcon, CategoryStatus } from "@/src/types/admin/category.types";
import type { CreateCategoryFormValues, UpdateCategoryFormValues } from "@/src/validations/admin/category.validation";
import CategoryDeleteModal from "@/src/components/admin/category/CategoryDeleteModal";

const ITEMS_PER_PAGE = 8;

type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
  image: File | null;
  icon: CategoryIcon;
  status: CategoryStatus;
  sortOrder: number;
};

export default function CategoriesPage() {
  const {
    categories,
    selectedCategory: hookSelectedCategory,
    pagination,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    fetchCategories,
    fetchCategoryDetails,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
    clearSelectedCategory,
  } = useCategory();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CategoryStatusFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load categories
  const loadCategories = useCallback(
    async (page = currentPage) => {
      try {
        await fetchCategories({
          page,
          limit: ITEMS_PER_PAGE,
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(status !== "ALL" ? { status } : {}),
        });
      } catch {
        // The hook already displays the API error using toast.
      }
    },
    [fetchCategories, currentPage, search, status],
  );

  useEffect(() => {
    void loadCategories(currentPage);
  }, [loadCategories, currentPage]);

  const totalItems = pagination.count;
  const totalPages = Math.max(
    1,
    pagination.totalPages ||
      Math.ceil(totalItems / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (hookSelectedCategory) {
      setSelectedCategory(hookSelectedCategory);
    }
  }, [hookSelectedCategory]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: CategoryStatusFilter) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setCurrentPage(1);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    clearSelectedCategory();
    setIsModalOpen(true);
  };

  const handleViewCategory = async (category: Category) => {
    setSelectedCategory(category);
    setIsDetailsOpen(true);

    try {
      await fetchCategoryDetails(category.uuid);
    } catch {
      // Keep the list item's data visible if details cannot be loaded.
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
  };

const handleDeleteCategory = (category: Category) => {
  setCategoryToDelete(category);
};

const handleConfirmDelete = async () => {
  if (!categoryToDelete) return;
  const category = categoryToDelete;
  try {
    await deleteCategory(category.uuid);
    const nextPage =
      categories.length === 1 && currentPage > 1
        ? currentPage - 1
        : currentPage;

    setCategoryToDelete(null);
    setCurrentPage(nextPage);
    await loadCategories(nextPage);
    if (selectedCategory?.uuid === category.uuid) {
      setSelectedCategory(null);
      setIsDetailsOpen(false);
      clearSelectedCategory();
    }
  } catch {
    // Hook already displays the API error.
  }
};

  const handleToggleStatus = async (category: Category) => {
    const nextStatus: CategoryStatus =
      category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateCategoryStatus(category.uuid, {
        status: nextStatus,
      });
      await loadCategories(currentPage);
    } catch {
      // The hook handles and displays the API error.
    }
  };

  const handleSubmitCategory = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        const payload: UpdateCategoryFormValues = {
          name: data.name,
          slug: data.slug,
          description: data.description,
          icon: data.icon,
          status: data.status,
          sort_order: data.sortOrder,
          ...(data.image ? { image: data.image } : {}),
        };

        await updateCategory(selectedCategory.uuid, payload);
      } else {
        const payload: CreateCategoryFormValues = {
          name: data.name,
          slug: data.slug,
          description: data.description,
          icon: data.icon,
          status: data.status,
          sort_order: data.sortOrder,
          ...(data.image ? { image: data.image } : {}),
        };
        await createCategory(payload);
        setCurrentPage(1);
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
      clearSelectedCategory();
      await loadCategories(selectedCategory ? currentPage : 1);
    } catch {
      // The hook displays the API error. Keep the modal open so the user
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadCategories(currentPage);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePageChange = (page: number) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(safePage);
  };

  const headerTotal = useMemo(
    () => totalItems,
    [totalItems],
  );

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />
      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          <CategoryHeader
            totalCategories={headerTotal}
            onAdd={handleAddCategory}/>
          <CategorySearch
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onReset={handleResetFilters}/>
          {isLoading ? (
            <CategorySkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <CategoryTable
              categories={categories}
              onView={handleViewCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onToggleStatus={handleToggleStatus}/>
          )}
          {!isLoading && totalItems > 0 && (
            <CategoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pagination.limit || ITEMS_PER_PAGE}
              onPageChange={handlePageChange}/>
          )}
          {error && !isLoading && categories.length === 0 && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="text-xs font-medium text-[#8A7D72] transition-colors hover:text-[#6B3E1E] disabled:opacity-50">
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        category={selectedCategory}
        onClose={() => {
          if (isSubmitting) return;
          setIsModalOpen(false);
          setSelectedCategory(null);
          clearSelectedCategory();
        }}
        onSubmit={handleSubmitCategory}
        isSubmitting={isSubmitting}/>
      {isDetailsOpen && selectedCategory && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsDetailsOpen(false);
              setSelectedCategory(null);
              clearSelectedCategory();
            }
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-details-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="category-details-title"
                  className="text-base font-semibold text-[#29231F]">
                  Category Details
                </h2>
                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View category information and configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDetailsOpen(false);
                  setSelectedCategory(null);
                  clearSelectedCategory();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                aria-label="Close category details">
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <CategoryDetails
                category={selectedCategory}
                onEdit={handleEditCategory}/>
            </div>
          </div>
        </div>
      )}
      <CategoryDeleteModal
        isOpen={Boolean(categoryToDelete)}
        categoryName={categoryToDelete?.name ?? ""}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setCategoryToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}