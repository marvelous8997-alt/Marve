"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import SubcategoryHeader from "@/src/components/admin/subcategory/SubcategoryHeader";
import SubcategorySearch, { SubcategoryStatusFilter } from "@/src/components/admin/subcategory/SubcategorySearch";
import SubcategoryTable from "@/src/components/admin/subcategory/SubcategoryTable";
import type { Subcategory } from "@/src/types/admin/subcategory.types";
import type { CreateSubcategoryFormValues, UpdateSubcategoryFormValues } from "@/src/validations/admin/subcategory.validation";
import { SUBCATEGORY_ICONS } from "@/src/validations/admin/subcategory.validation";
import SubcategoryPagination from "@/src/components/admin/subcategory/SubcategoryPagination";
import SubcategorySkeleton from "@/src/components/admin/subcategory/SubcategorySkeleton";
import SubcategoryModal from "@/src/components/admin/subcategory/SubcategoryModal";
import SubcategoryDeleteModal from "@/src/components/admin/subcategory/SubcategoryDeleteModal";
import SubcategoryDetails from "@/src/components/admin/subcategory/SubcategoryDetails";
import type { SubcategoryFormData } from "@/src/components/admin/subcategory/SubcategoryForm";
import useSubcategory from "@/src/hooks/admin/usesubCategory";
import useCategory from "@/src/hooks/admin/useCategory";

const ITEMS_PER_PAGE = 8;

export default function SubcategoriesPage() {
  const {
    subcategories,
    pagination,
    isLoading,
    isSubmitting,
    isDeleting,
    fetchSubcategories,
    fetchSubcategoryDetails,
    createSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,
  } = useSubcategory();

const {
  activeCategoriesForDropdown,
  fetchActiveCategoriesForDropdown,
} = useCategory();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubcategoryStatusFilter>("ALL");
  const [category, setCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [detailsSubcategory, setDetailsSubcategory] = useState<Subcategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subcategory | null>(null);

useEffect(() => {
  void fetchActiveCategoriesForDropdown().catch(() => {
  });
}, [fetchActiveCategoriesForDropdown]);
  const loadSubcategories = useCallback(async () => {
    try {
      await fetchSubcategories({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        ...(category !== "ALL" && { category_id: category }),
      });
    } catch {
      // The hook already displays the API error toast.
    }
  }, [
    fetchSubcategories,
    currentPage,
    search,
    status,
    category,
  ]);

  useEffect(() => {
    void loadSubcategories();
  }, [loadSubcategories]);

const categoryOptions = useMemo(
  () =>
    activeCategoriesForDropdown
      .filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        status: item.status,
      })),
  [activeCategoriesForDropdown],
);

  const visibleSubcategories = subcategories;
  const totalPages = Math.max(1, pagination.totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: SubcategoryStatusFilter) => {
    setStatus(value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };
  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setCategory("ALL");
    setCurrentPage(1);
  };
  const handleAdd = () => {
    setSelectedSubcategory(null);
    setIsSubcategoryModalOpen(true);
  };
  const handleView = async (subcategory: Subcategory) => {
    if (!subcategory.uuid) return;
    try {
      const details = await fetchSubcategoryDetails(
        String(subcategory.uuid),
      );
      setDetailsSubcategory(details as unknown as Subcategory);
    } catch {
      // The hook displays the API error toast.
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setDetailsSubcategory(null);
    setIsSubcategoryModalOpen(true);
  };

  const handleDelete = (subcategory: Subcategory) => {
    setDeleteTarget(subcategory);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.uuid || isDeleting) return;
    try {
      await deleteSubcategory(String(deleteTarget.uuid));
      setDeleteTarget(null);
      if (subcategories.length === 1 && currentPage > 1) {
        setCurrentPage((previous) => previous - 1);
      } else {
        await loadSubcategories();
      }
    } catch {
      // The hook already displays the API error toast.
    }
  };

const handleCloseDeleteModal = () => {
  if (isDeleting) return;
  setDeleteTarget(null);
};

  const handleToggleStatus = async (subcategory: Subcategory) => {
    if (!subcategory.uuid) return;
    try {
      await updateSubcategoryStatus(String(subcategory.uuid), {
        status:
          subcategory.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });
      await loadSubcategories();
    } catch {
      // The hook displays the API error toast.
    }
  };

const handleSubmit = async (data: SubcategoryFormData) => {
  try {
    const commonValues = {
      category_id: data.categoryId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon:
        data.icon &&
        (SUBCATEGORY_ICONS as readonly string[]).includes(data.icon)
          ? (data.icon as (typeof SUBCATEGORY_ICONS)[number])
          : undefined,
      status: data.status,
      sort_order: Number(data.sortOrder),
      image: data.image,
    };

    if (selectedSubcategory?.uuid) {
      const updateValues: UpdateSubcategoryFormValues = {
        ...commonValues,
      };
      await updateSubcategory(
        String(selectedSubcategory.uuid),
        updateValues,
      );
    } else {
      const createValues: CreateSubcategoryFormValues = {
        ...commonValues,
      };
      await createSubcategory(createValues);
    }
    setIsSubcategoryModalOpen(false);
    setSelectedSubcategory(null);
    setCurrentPage(1);
    await fetchSubcategories({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      ...(category !== "ALL" && { category_id: category }),
    });
  } catch {
    // The hook displays the API error toast.
  }
};



  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsSubcategoryModalOpen(false);
    setSelectedSubcategory(null);
  };
  const handleCloseDetails = () => {
    setDetailsSubcategory(null);
  };
  const handleRefresh = async () => {
    await loadSubcategories();
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />
      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          <SubcategoryHeader
            totalSubcategories={pagination.count}
            onAdd={handleAdd}/>
          <SubcategorySearch
            search={search}
            status={status}
            category={category}
            categories={categoryOptions}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}/>
          {isLoading ? (
            <SubcategorySkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <SubcategoryTable
              subcategories={visibleSubcategories}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}/>
          )}
          {!isLoading && pagination.count > 0 && (
            <SubcategoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={pagination.count}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}/>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs font-medium text-[#8A7D72] transition-colors hover:text-[#6B3E1E] disabled:opacity-50">
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>
      <SubcategoryModal
        isOpen={isSubcategoryModalOpen}
        subcategory={selectedSubcategory}
        categories={categoryOptions}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}/>
      <SubcategoryDeleteModal
        isOpen={Boolean(deleteTarget)}
        subcategoryName={deleteTarget?.name ?? ""}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}/>
      {detailsSubcategory && (
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
            aria-labelledby="subcategory-details-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="subcategory-details-title"
                  className="text-base font-semibold tracking-[-0.01em] text-[#29231F]">
                  Subcategory Details
                </h2>
                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View subcategory information and configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseDetails}
                aria-label="Close subcategory details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]">
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <SubcategoryDetails
                subcategory={detailsSubcategory}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}