
"use client";

import { useCallback, useEffect, useState } from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import FavouriteHeader from "@/src/components/admin/favourite/FavouriteHeader";

import FavouriteSearch, {
  type FavouriteCategoryFilter,
} from "@/src/components/admin/favourite/FavouriteSearch";

import FavouriteTable, {
  type Favourite,
  type FavouriteCategory,
} from "@/src/components/admin/favourite/FavouriteTable";

import FavouritePagination from "@/src/components/admin/favourite/FavouritePagination";

import FavouriteSkeleton from "@/src/components/admin/favourite/FavouriteSkeleton";

import FavouriteModal from "@/src/components/admin/favourite/FavouriteModal";

import useFavourite from "@/src/hooks/admin/useFavourite";

import type {
  Favourite as ApiFavourite,
  GetFavouritesParams,
} from "@/src/types/admin/favourite.types";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Category Mapping ========================= */

function normalizeCategory(
  category?: string | null,
  slug?: string | null
): FavouriteCategory {
  const value = `${slug || ""} ${category || ""}`
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (
    value.includes("kitchen") ||
    value.includes("cookware")
  ) {
    return "KITCHEN";
  }

  if (
    value.includes("dining") ||
    value.includes("serveware")
  ) {
    return "DINING";
  }

  if (
    value.includes("storage") ||
    value.includes("organizer")
  ) {
    return "STORAGE";
  }

  if (
    value.includes("home_decor") ||
    value.includes("homedecor")
  ) {
    return "HOME_DECOR";
  }

  if (
    value.includes("coffee") ||
    value.includes("tea")
  ) {
    return "COFFEE_TEA";
  }

  if (value.includes("cleaning")) {
    return "CLEANING";
  }

  // Safe fallback for an unrecognized backend category.
  return "KITCHEN";
}

/* ========================= API Record Mapping ========================= */

function mapFavourite(
  favourite: ApiFavourite
): Favourite {
  return {
    id: favourite.id,
    customerId: favourite.customerId ?? undefined,
    customerName: favourite.customerName || "Unnamed Customer",
    customerEmail: favourite.customerEmail || "",
    customerPhone: favourite.customerPhone ?? undefined,
    productId: favourite.productId ?? undefined,
    productName: favourite.productName || "Product unavailable",
    productImage: favourite.productImage ?? undefined,
    productSku: favourite.productSku || "",
    category: normalizeCategory(
      favourite.category,
      favourite.categorySlug
    ),
    price: Number(favourite.price ?? 0),
    createdAt: favourite.createdAt ?? undefined,
  };
}

/* ========================= Page ========================= */

export default function FavouritesPage() {
  /* ========================= Backend Hook ========================= */

  const {
    favourites: apiFavourites,
    pagination,
    isLoading,
    isRefreshing,
    fetchFavourites,
    refreshFavourites,
    fetchFavouriteDetails,
  } = useFavourite();

  /* ========================= Local UI State ========================= */

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState<FavouriteCategoryFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFavouriteModalOpen, setIsFavouriteModalOpen] =
    useState(false);

  const [selectedFavourite, setSelectedFavourite] =
    useState<Favourite | null>(null);

  /* ========================= Map API Records ========================= */

  const favourites: Favourite[] =
    apiFavourites.map(mapFavourite);

  /* ========================= Fetch Initial Data ========================= */

  useEffect(() => {
    void fetchFavourites({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
    }).catch(() => {
      // The hook already handles and displays the error.
    });

    // Initial fetch only. Search and pagination fetch explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========================= Build Query Params ========================= */

  const buildParams = useCallback(
    (
      overrides: Partial<GetFavouritesParams> = {}
    ): GetFavouritesParams => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim(),
      category:
        category === "ALL" ? undefined : category,
      sortBy: "createdAt",
      sortOrder: "DESC",
      ...overrides,
    }),
    [currentPage, search, category]
  );

  /* ========================= Fetch Helper ========================= */

  const loadFavourites = useCallback(
    async (params: GetFavouritesParams) => {
      try {
        await fetchFavourites(params);
      } catch {
        // Error toast and error state are managed by the hook.
      }
    },
    [fetchFavourites]
  );

  /* ========================= Search ========================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);

    void loadFavourites({
      ...buildParams({ page: 1, search: value }),
    });
  };

  /* ========================= Category Filter ========================= */

  const handleCategoryChange = (
    value: FavouriteCategoryFilter
  ) => {
    setCategory(value);
    setCurrentPage(1);

    void loadFavourites(
      buildParams({
        page: 1,
        category: value === "ALL" ? undefined : value,
      })
    );
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setCategory("ALL");
    setCurrentPage(1);

    void loadFavourites({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: "",
      category: undefined,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
  };

  /* ========================= Pagination ========================= */

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      page > Math.max(1, pagination.totalPages)
    ) {
      return;
    }

    setCurrentPage(page);

    void loadFavourites(
      buildParams({ page })
    );
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    try {
      await refreshFavourites();
    } catch {
      // The hook already displays the error.
    }
  };

  /* ========================= View Favourite Details ========================= */

  const handleView = async (favourite: Favourite) => {
    try {
      const details = await fetchFavouriteDetails(
        favourite.id
      );

      setSelectedFavourite(mapFavourite(details));
      setIsFavouriteModalOpen(true);
    } catch {
      // The hook already displays the error.
    }
  };

  /* ========================= Close Details Modal ========================= */

  const handleCloseModal = () => {
    setIsFavouriteModalOpen(false);
    setSelectedFavourite(null);
  };

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* Navbar */}

      <AdminNavbar />

      {/* Main Content */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* Header */}

          <FavouriteHeader
            totalFavourites={pagination.count}
            onRefresh={handleRefresh}
            isLoading={isLoading || isRefreshing}
          />

          {/* Search / Filters */}

          <FavouriteSearch
            search={search}
            category={category}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}
          />

          {/* Table */}

          {isLoading ? (
            <FavouriteSkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <FavouriteTable
              favourites={favourites}
              onView={handleView}
            />
          )}

          {/* Pagination */}

          {!isLoading && pagination.count > 0 && (
            <FavouritePagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.count}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Favourite Details Modal */}

      <FavouriteModal
        isOpen={isFavouriteModalOpen}
        favourite={selectedFavourite}
        onClose={handleCloseModal}
      />
    </main>
  );
}
