"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import OfferHeader from "@/src/components/admin/offer/OfferHeader";
import OfferTabs, {
  OfferTab,
} from "@/src/components/admin/offer/OfferTabs";
import OfferSearch, {
  OfferStatusFilter,
  OfferTypeFilter,
} from "@/src/components/admin/offer/OfferSearch";
import OfferPagination from "@/src/components/admin/offer/OfferPagination";
import OfferSkeleton from "@/src/components/admin/offer/OfferSkeleton";

import AllCouponTable, {
  Coupon,
} from "@/src/components/admin/offer/AllCouponTable";
import DiscountCouponDeleteModal from "@/src/components/admin/offer/DiscountCouponDeleteModal";
import DiscountCouponTable from "@/src/components/admin/offer/DiscountCouponTable";
import useProduct from "@/src/hooks/admin/useProduct";
import type {
  DiscountCoupon,
} from "@/src/types/admin/discountCoupon.types";
import type {
  BogoCoupon as BogoCouponType,
  BogoCouponProduct,
} from "@/src/types/admin/bogoCoupon.types";
import type {
  CreateDiscountCouponFormValues,
  UpdateDiscountCouponFormValues,
} from "@/src/validations/admin/discountCoupon.validation";
import useBogoCoupon from "@/src/hooks/admin/useBogoCoupon";
import useDiscountCoupon from "@/src/hooks/admin/useDiscountCoupon";
import BogoCouponDeleteModal from "@/src/components/admin/offer/BogoCouponDeleteModal";
import DiscountCouponModal from "@/src/components/admin/offer/DiscountCouponModal";
import DiscountCouponDetails from "@/src/components/admin/offer/DiscountCouponDetails";

import BogoCouponTable from "@/src/components/admin/offer/BogoCouponTable";
import type { BogoCoupon } from "@/src/types/admin/bogoCoupon.types";

import BogoCouponModal from "@/src/components/admin/offer/BogoCouponModal";
import BogoCouponDetails from "@/src/components/admin/offer/BogoCouponDetails";

import type { DiscountCouponFormData } from "@/src/components/admin/offer/DiscountCouponForm";
import type { BogoCouponFormData } from "@/src/components/admin/offer/BogoCouponForm";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Page ========================= */

export default function OffersPage() {
  /* ========================= State ========================= */

  const [activeTab, setActiveTab] =
    useState<OfferTab>("ALL");
const {
  discountCoupons,
  pagination: discountPagination,
  isLoading: isDiscountLoading,
  isSubmitting: isDiscountSubmitting,
  isDeleting: isDiscountDeleting,
  fetchDiscountCoupons,
  createDiscountCoupon,
  updateDiscountCoupon,
  updateDiscountCouponStatus,
  deleteDiscountCoupon,
} = useDiscountCoupon();

const {
  bogoCoupons,
  isLoading: isBogoLoading,
  isSubmitting: isBogoSubmitting,
  isDeleting: isBogoDeletingFromHook,
  fetchBogoCoupons,
  fetchBogoCouponDetails, // ADD THIS
  createBogoCoupon,
  updateBogoCoupon,
  updateBogoCouponStatus,
  deleteBogoCoupon,
} = useBogoCoupon();

const {
  products: adminProducts,
  fetchProducts,
  isLoading: isProductsLoading,
} = useProduct();

useEffect(() => {
  void fetchProducts({
    page: 1,
    limit: 1000,
    status: "ACTIVE",
    sortBy: "sort_order",
    sortOrder: "ASC",
  }).catch((error) => {
    console.error("BOGO product fetch failed:", error);
  });
}, [fetchProducts]);

/* ========================= Fetch BOGO Coupons ========================= */

useEffect(() => {
  void fetchBogoCoupons({
    page: 1,
    limit: 1000,
    sortBy: "sort_order",
    sortOrder: "ASC",
  }).catch((error) => {
    console.error("BOGO coupon fetch failed:", error);
  });
}, [fetchBogoCoupons]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<OfferStatusFilter>("ALL");

  const [type, setType] =
    useState<OfferTypeFilter>("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    isDiscountModalOpen,
    setIsDiscountModalOpen,
  ] = useState(false);

  const [
    selectedDiscountCoupon,
    setSelectedDiscountCoupon,
  ] = useState<DiscountCoupon | null>(
    null,
  );

  const [
    detailsDiscountCoupon,
    setDetailsDiscountCoupon,
  ] = useState<DiscountCoupon | null>(
    null,
  );

  const [
    isBogoModalOpen,
    setIsBogoModalOpen,
  ] = useState(false);

  const [isBogoEditLoading, setIsBogoEditLoading] =
  useState(false);

  const [
    selectedBogoCoupon,
    setSelectedBogoCoupon,
  ] = useState<BogoCoupon | null>(
    null,
  );

  const [
    detailsBogoCoupon,
    setDetailsBogoCoupon,
  ] = useState<BogoCoupon | null>(
    null,
  );

  const [
    detailsAllCoupon,
    setDetailsAllCoupon,
  ] = useState<Coupon | null>(
    null,
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  type CouponDisplayStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SCHEDULED";

function getCouponDisplayStatus(coupon: {
  status: string;
  display_status?: CouponDisplayStatus;
  startDate?: string | null;
  endDate?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}): CouponDisplayStatus {
  if (coupon.display_status) {
    return coupon.display_status;
  }

  const getDateKey = (value?: string | null) => {
    if (!value) return null;

    const datePart = value.slice(0, 10);

    return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
      ? datePart
      : null;
  };

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const startDate = getDateKey(
    coupon.startDate ?? coupon.start_date,
  );

  const endDate = getDateKey(
    coupon.endDate ?? coupon.end_date,
  );

  if (endDate && endDate < today) {
    return "EXPIRED";
  }

  if (coupon.status !== "ACTIVE") {
    return "INACTIVE";
  }

  if (startDate && startDate > today) {
    return "SCHEDULED";
  }

  return "ACTIVE";
}

const mapDiscountCoupon = (
  coupon: DiscountCoupon,
): Coupon => ({
  id: coupon.id,
  code: coupon.code,
  name: coupon.name,
  type: "DISCOUNT",
  status: coupon.status,
  display_status: getCouponDisplayStatus(coupon),
  description: coupon.description ?? undefined,

  discountType: coupon.discountType,
  discountValue: Number(coupon.discountValue),

  maximumDiscount:
    coupon.maximumDiscount == null
      ? undefined
      : Number(coupon.maximumDiscount),

  minimumOrderValue:
    coupon.minimumOrderValue == null
      ? undefined
      : Number(coupon.minimumOrderValue),

  usageLimit: coupon.usageLimit ?? undefined,
  usageCount: coupon.usageCount,
  perCustomerLimit:
    coupon.perCustomerLimit ?? undefined,

  startDate: coupon.startDate,
  endDate: coupon.endDate,
  createdAt: coupon.createdAt,
  updatedAt: coupon.updatedAt,
  sortOrder: coupon.sortOrder,
});

const mapBogoCoupon = (
  coupon: BogoCoupon,
): Coupon => ({
  id: coupon.id,
  code: coupon.code,
  name: coupon.name,
  type: "BOGO",
  status: coupon.status,
  display_status: getCouponDisplayStatus(coupon),
  description: coupon.description ?? undefined,

  buyQuantity: coupon.buyQuantity,
  getQuantity: coupon.getQuantity,

  minimumOrderValue:
    coupon.minimumOrderValue == null
      ? undefined
      : Number(coupon.minimumOrderValue),

  usageLimit: coupon.usageLimit ?? undefined,
  usageCount: coupon.usageCount,
  perCustomerLimit:
    coupon.perCustomerLimit ?? undefined,

  startDate: coupon.startDate,
  endDate: coupon.endDate,
  createdAt: coupon.createdAt,
  updatedAt: coupon.updatedAt,
  sortOrder: coupon.sortOrder,
});

const allCoupons = useMemo<Coupon[]>(() => {
  const discountItems = discountCoupons.map(
    mapDiscountCoupon,
  );

  const bogoItems = bogoCoupons.map(
    mapBogoCoupon,
  );

  return [...discountItems, ...bogoItems];
}, [discountCoupons, bogoCoupons]);

const currentCoupons = useMemo<Coupon[]>(() => {
  if (activeTab === "DISCOUNT") {
    return discountCoupons.map(mapDiscountCoupon);
  }

  if (activeTab === "BOGO") {
    return bogoCoupons.map(mapBogoCoupon);
  }

  return allCoupons;
}, [
  activeTab,
  discountCoupons,
  bogoCoupons,
  allCoupons,
]);

  /* ========================= Counts ========================= */

  const counts = useMemo(
    () => ({
      all: allCoupons.length,
      discount: discountCoupons.length,
      bogo: bogoCoupons.length,
    }),
    [
      allCoupons.length,
      discountCoupons.length,
      bogoCoupons.length,
    ],
  );

  /* ========================= Filtering ========================= */

  const filteredCoupons = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return currentCoupons.filter(
      (coupon) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          coupon.code
            .toLowerCase()
            .includes(normalizedSearch) ||
          coupon.name
            .toLowerCase()
            .includes(normalizedSearch);

const matchesStatus =
  status === "ALL" ||
  getCouponDisplayStatus(coupon) === status;

        const matchesType =
            activeTab !== "ALL" ||
            type === "ALL" ||
            coupon.type === type;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType
        );
      },
    );
  }, [
    currentCoupons,
    search,
    status,
    type,
    activeTab,
  ]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCoupons.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedCoupons =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      return filteredCoupons.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
      );
    }, [
      filteredCoupons,
      currentPage,
    ]);

    const paginatedBogoCoupons = useMemo<BogoCoupon[]>(() => {
  if (activeTab !== "BOGO") {
    return [];
  }

  return bogoCoupons.filter((coupon) =>
    paginatedCoupons.some(
      (item) =>
        item.type === "BOGO" &&
        String(item.id) === String(coupon.id),
    ),
  );
}, [activeTab, bogoCoupons, paginatedCoupons]);
  /* ========================= Page Safety ========================= */

useEffect(() => {
  void fetchDiscountCoupons({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
    status:
      status === "ALL"
        ? undefined
        : status,
    discountType:
      activeTab === "DISCOUNT" &&
      type !== "ALL"
        ? (type as "PERCENTAGE" | "FIXED")
        : undefined,
    sortBy: "sort_order",
    sortOrder: "ASC",
  });
}, [
  fetchDiscountCoupons,
  currentPage,
  search,
  status,
  type,
  activeTab,
]);

const bogoProducts = useMemo<BogoCouponProduct[]>(
  () =>
    adminProducts
      .filter(
        (product) =>
          product.status === "ACTIVE" &&
          Number.isFinite(Number(product.id)) &&
          Number(product.id) > 0,
      )
      .map((product) => ({
        id: product.id,
        uuid: product.uuid,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        salePrice: product.compareAtPrice,
        image:
          product.images?.find(
            (item) => item.isPrimary || item.is_primary,
          )?.imageUrl ??
          product.images?.[0]?.imageUrl ??
          product.images?.[0]?.image_url ??
          null,
        status: product.status,
      })),
  [adminProducts],
);
  /* ========================= Tab ========================= */

  const handleTabChange = (
    value: OfferTab,
  ) => {
    setActiveTab(value);

    setSearch("");
    setStatus("ALL");
    setType("ALL");
    setCurrentPage(1);

    setDetailsAllCoupon(null);
    setDetailsDiscountCoupon(null);
    setDetailsBogoCoupon(null);
  };

  /* ========================= Search ========================= */

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ========================= Status ========================= */

  const handleStatusChange = (
    value: OfferStatusFilter,
  ) => {
    setStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Type ========================= */

  const handleTypeChange = (
    value: OfferTypeFilter,
  ) => {
    setType(value);
    setCurrentPage(1);
  };

  /* ========================= Reset ========================= */

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setType("ALL");
    setCurrentPage(1);
  };

  /* ========================= Add Discount ========================= */

  const handleAddDiscount = () => {
    setSelectedDiscountCoupon(null);
    setDetailsDiscountCoupon(null);
    setIsDiscountModalOpen(true);
  };

  /* ========================= View Discount ========================= */

  const handleViewDiscount = (
    coupon: DiscountCoupon,
  ) => {
    setDetailsDiscountCoupon(coupon);
  };

  /* ========================= Edit Discount ========================= */

  const handleEditDiscount = (
    coupon: DiscountCoupon,
  ) => {
    setSelectedDiscountCoupon(coupon);
    setDetailsDiscountCoupon(null);
    setIsDiscountModalOpen(true);
  };

  /* ========================= Delete Discount ========================= */

/* ========================= Delete Discount ========================= */

const handleDeleteDiscount = (
  coupon: DiscountCoupon,
) => {
  setCouponToDelete(coupon);
};

const [
  bogoCouponToDelete,
  setBogoCouponToDelete,
] = useState<BogoCoupon | null>(null);


/* ========================= Confirm Discount Delete ========================= */

const handleConfirmDeleteDiscount = async () => {
  if (!couponToDelete) return;

  try {
    await deleteDiscountCoupon(couponToDelete.uuid);

    setCouponToDelete(null);
    setDetailsDiscountCoupon(null);
    setDetailsAllCoupon(null);

    await fetchDiscountCoupons({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      discountType:
        activeTab === "DISCOUNT" && type !== "ALL"
          ? (type as "PERCENTAGE" | "FIXED")
          : undefined,
      sortBy: "sort_order",
      sortOrder: "ASC",
    });
  } catch (error) {
    console.error("Discount coupon delete failed:", error);
  }
};
  /* ========================= Toggle Discount Status ========================= */

const handleToggleDiscountStatus = async (
  coupon: DiscountCoupon,
) => {
  const nextStatus =
    coupon.status === "ACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

  try {
    await updateDiscountCouponStatus(
      coupon.uuid,
      { status: nextStatus },
    );

    await fetchDiscountCoupons({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      discountType:
        activeTab === "DISCOUNT" &&
        type !== "ALL"
          ? (type as "PERCENTAGE" | "FIXED")
          : undefined,
      sortBy: "sort_order",
      sortOrder: "ASC",
    });
  } catch (error) {
    console.error("Discount coupon status update failed:", error);
  }
};

  /* ========================= Submit Discount ========================= */

const handleDiscountSubmit = async (
  data: DiscountCouponFormData,
) => {
  try {

const payload = {
  code: data.code.trim().toUpperCase(),
  name: data.name.trim(),
  description: data.description.trim(),

  discountType: data.discountType,
  discountValue: Number(data.discountValue),

  maximumDiscount:
    data.discountType === "PERCENTAGE" &&
    data.maximumDiscount !== ""
      ? Number(data.maximumDiscount)
      : null,

  minimumOrderValue:
    data.minimumOrderValue !== ""
      ? Number(data.minimumOrderValue)
      : null,

  usageLimit:
    data.usageLimit !== ""
      ? Number(data.usageLimit)
      : null,

  perCustomerLimit:
    data.perCustomerLimit !== ""
      ? Number(data.perCustomerLimit)
      : null,

  startDate: data.startDate,
  endDate: data.endDate,
  status: data.status,
  sortOrder: Number(data.sortOrder),
};

if (selectedDiscountCoupon) {
  const updatePayload: UpdateDiscountCouponFormValues = {
    ...payload,
  };

  await updateDiscountCoupon(
    selectedDiscountCoupon.uuid,
    updatePayload,
  );
} else {
  const createPayload: CreateDiscountCouponFormValues = {
    ...payload,
  };

  await createDiscountCoupon(createPayload);
}


    setIsDiscountModalOpen(false);
    setSelectedDiscountCoupon(null);
    setCurrentPage(1);

    await fetchDiscountCoupons({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      discountType:
        activeTab === "DISCOUNT" &&
        type !== "ALL"
          ? (type as "PERCENTAGE" | "FIXED")
          : undefined,
      sortBy: "sort_order",
      sortOrder: "ASC",
    });
  } catch (error) {
    console.error("Discount coupon save failed:", error);
  }
};

const [
  couponToDelete,
  setCouponToDelete,
] = useState<DiscountCoupon | null>(null);
  /* ========================= Close Discount Modal ========================= */

const handleCloseDiscountModal = () => {
  if (isDiscountSubmitting) {
    return;
  }

  setIsDiscountModalOpen(false);
  setSelectedDiscountCoupon(null);
};

  /* ========================= Add BOGO ========================= */

  const handleAddBogo = () => {
    setSelectedBogoCoupon(null);
    setDetailsBogoCoupon(null);
    setIsBogoModalOpen(true);
  };

  /* ========================= View BOGO ========================= */

  const handleViewBogo = (
    coupon: BogoCoupon,
  ) => {
    setDetailsBogoCoupon(coupon);
  };

  /* ========================= Edit BOGO ========================= */

/* ========================= Edit BOGO ========================= */

const handleEditBogo = async (
  coupon: BogoCoupon,
) => {
  if (isBogoEditLoading || isBogoSubmitting) {
    return;
  }

  setIsBogoEditLoading(true);

  try {
    // Fetch complete coupon details, including product mappings.
    const detailedCoupon = await fetchBogoCouponDetails(
      coupon.uuid,
    );

    // Set complete data before opening the modal.
    setSelectedBogoCoupon(detailedCoupon);
    setDetailsBogoCoupon(null);
    setIsBogoModalOpen(true);
  } catch (error) {
    console.error(
      "Failed to fetch BOGO coupon details for editing:",
      error,
    );
  } finally {
    setIsBogoEditLoading(false);
  }
};
  /* ========================= Delete BOGO ========================= */

/* ========================= Delete BOGO ========================= */

const handleDeleteBogo = (
  coupon: BogoCoupon,
) => {
  setBogoCouponToDelete(coupon);
};

/* ========================= Confirm BOGO Delete ========================= */

const handleConfirmDeleteBogo = async () => {
  if (!bogoCouponToDelete || isBogoDeletingFromHook) {
    return;
  }

  try {
    await deleteBogoCoupon(bogoCouponToDelete.uuid);

    setDetailsBogoCoupon(null);
    setDetailsAllCoupon(null);
    setBogoCouponToDelete(null);

    // Current list ko fresh backend data se sync karo.
    await fetchBogoCoupons({
      page: 1,
      limit: 1000,
      sortBy: "sort_order",
      sortOrder: "ASC",
    });
  } catch (error) {
    console.error("BOGO coupon delete failed:", error);
  }
};

  /* ========================= Toggle BOGO Status ========================= */

/* ========================= Toggle BOGO Status ========================= */

const handleToggleBogoStatus = async (
  coupon: BogoCoupon,
) => {
  try {
    await updateBogoCouponStatus(coupon.uuid, {
      status:
        coupon.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
    });

    await fetchBogoCoupons({
      page: 1,
      limit: 1000,
      sortBy: "sort_order",
      sortOrder: "ASC",
    });
  } catch (error) {
    console.error("BOGO coupon status update failed:", error);
  }
};

  /* ========================= Submit BOGO ========================= */

/* ========================= Submit BOGO ========================= */

const handleBogoSubmit = async (
  data: BogoCouponFormData,
) => {
  try {
    const payload = {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      description: data.description.trim(),

      buyQuantity: Number(data.buyQuantity),
      getQuantity: Number(data.getQuantity),

      minimumOrderValue:
        data.minimumOrderValue === ""
          ? null
          : Number(data.minimumOrderValue),

      usageLimit:
        data.usageLimit === ""
          ? null
          : Number(data.usageLimit),

      perCustomerLimit:
        data.perCustomerLimit === ""
          ? null
          : Number(data.perCustomerLimit),

      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      sortOrder: Number(data.sortOrder),

      buyProductIds: data.buyProductIds.map(Number),
      getProductIds: data.getProductIds.map(Number),
    };

    if (selectedBogoCoupon) {
      await updateBogoCoupon(
        selectedBogoCoupon.uuid,
        payload,
      );
    } else {
      await createBogoCoupon(payload);
    }

    setIsBogoModalOpen(false);
    setSelectedBogoCoupon(null);
    setDetailsBogoCoupon(null);
    setCurrentPage(1);

    await fetchBogoCoupons({
      page: 1,
      limit: 1000,
      sortBy: "sort_order",
      sortOrder: "ASC",
    });
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Unable to save BOGO coupon. Please check your details.";

  if (
    message.includes(
      "The same product cannot be selected in both Buy Products and Get Products.",
    )
  ) {
    toast.error(
      "A product cannot be selected in both Buy Products and Get Products.",
    );
    return;
  }

  console.error("BOGO coupon save failed:", error);
}
};

  /* ========================= Close BOGO Modal ========================= */
const handleCloseBogoModal = () => {
  if (isBogoSubmitting) {
    return;
  }

  setIsBogoModalOpen(false);
  setSelectedBogoCoupon(null);
};

  /* ========================= All Coupon View ========================= */

  const handleViewAllCoupon = (
    coupon: Coupon,
  ) => {
    setDetailsAllCoupon(coupon);
  };

  /* ========================= Delete All Coupon ========================= */

const handleDeleteAllCoupon = async (coupon: Coupon) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${coupon.code}"?`,
  );

  if (!confirmed) return;

  try {
    if (coupon.type === "DISCOUNT") {
      const discountCoupon = discountCoupons.find(
        (item) => String(item.id) === String(coupon.id),
      );

      if (!discountCoupon) {
        throw new Error("Discount coupon not found.");
      }

      await deleteDiscountCoupon(discountCoupon.uuid);

      await fetchDiscountCoupons({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        sortBy: "sort_order",
        sortOrder: "ASC",
      });
    } else {
      const bogoCoupon = bogoCoupons.find(
        (item) => String(item.id) === String(coupon.id),
      );

      if (!bogoCoupon) {
        throw new Error("BOGO coupon not found.");
      }

      await deleteBogoCoupon(bogoCoupon.uuid);

      await fetchBogoCoupons({
        page: 1,
        limit: 1000,
        sortBy: "sort_order",
        sortOrder: "ASC",
      });
    }

    setDetailsAllCoupon(null);
  } catch (error) {
    console.error("Coupon delete failed:", error);
  }
};

  /* ========================= Toggle All Coupon Status ========================= */

const handleToggleAllCouponStatus = async (coupon: Coupon) => {
  try {
    if (coupon.type === "DISCOUNT") {
      const discountCoupon = discountCoupons.find(
        (item) => String(item.id) === String(coupon.id),
      );

      if (!discountCoupon) {
        throw new Error("Discount coupon not found.");
      }

      await updateDiscountCouponStatus(discountCoupon.uuid, {
        status:
          discountCoupon.status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      });

      await fetchDiscountCoupons({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        sortBy: "sort_order",
        sortOrder: "ASC",
      });
    } else {
      const bogoCoupon = bogoCoupons.find(
        (item) => String(item.id) === String(coupon.id),
      );

      if (!bogoCoupon) {
        throw new Error("BOGO coupon not found.");
      }

      await updateBogoCouponStatus(bogoCoupon.uuid, {
        status:
          bogoCoupon.status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      });

      await fetchBogoCoupons({
        page: 1,
        limit: 1000,
        sortBy: "sort_order",
        sortOrder: "ASC",
      });
    }
  } catch (error) {
    console.error("Coupon status update failed:", error);
  }
};

  /* ========================= Refresh ========================= */

/* ========================= Refresh ========================= */

const handleRefresh = async () => {
  setIsLoading(true);

  try {
    const tasks: Promise<unknown>[] = [];

    if (activeTab !== "BOGO") {
      tasks.push(
        fetchDiscountCoupons({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: search.trim() || undefined,
          status: status === "ALL" ? undefined : status,
          discountType:
            activeTab === "DISCOUNT" && type !== "ALL"
              ? (type as "PERCENTAGE" | "FIXED")
              : undefined,
          sortBy: "sort_order",
          sortOrder: "ASC",
        }),
      );
    }

    if (activeTab !== "DISCOUNT") {
      tasks.push(
        fetchBogoCoupons({
          page: 1,
          limit: 1000,
          sortBy: "sort_order",
          sortOrder: "ASC",
        }),
      );
    }

    await Promise.all(tasks);
  } catch (error) {
    console.error("Offers refresh failed:", error);
  } finally {
    setIsLoading(false);
  }
};

  /* ========================= Add Current Offer ========================= */

  const handleAddCurrentOffer = () => {
    if (activeTab === "DISCOUNT") {
      handleAddDiscount();
      return;
    }

    if (activeTab === "BOGO") {
      handleAddBogo();
      return;
    }
  };

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* ========================= Navbar ========================= */}

      <AdminNavbar />

      {/* ========================= Main Content ========================= */}

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* ========================= Header ========================= */}

          <OfferHeader
            totalOffers={allCoupons.length}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* ========================= Tabs ========================= */}

          <OfferTabs
            activeTab={activeTab}
            counts={counts}
            onChange={handleTabChange}
          />

          {/* ========================= Search / Filters ========================= */}

          <OfferSearch
            search={search}
            status={status}
            type={type}
            onSearchChange={
              handleSearchChange
            }
            onStatusChange={
              handleStatusChange
            }
            onTypeChange={
              handleTypeChange
            }
            onReset={handleReset}
            showTypeFilter={
              activeTab === "ALL"
            }
          />

          {/* ========================= Add Button ========================= */}

          {activeTab !== "ALL" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={
                  handleAddCurrentOffer
                }
                className="inline-flex h-10 items-center rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#593217] hover:shadow-md"
              >
                {activeTab === "DISCOUNT"
                  ? "Add Discount Coupon"
                  : "Add Buy 1 Get 1"}
              </button>
            </div>
          )}

          {/* ========================= Table ========================= */}

{isLoading ||
isDiscountLoading && activeTab !== "BOGO" ||
isBogoLoading && activeTab !== "DISCOUNT" ? (
  <OfferSkeleton rows={ITEMS_PER_PAGE} />
) : activeTab === "ALL" ? (
  <AllCouponTable
    coupons={paginatedCoupons}
    onView={handleViewAllCoupon}
    onDelete={handleDeleteAllCoupon}
    onToggleStatus={handleToggleAllCouponStatus}
  />
) : activeTab === "DISCOUNT" ? (
  <DiscountCouponTable
    coupons={discountCoupons.filter((coupon) =>
      paginatedCoupons.some(
        (item) => String(item.id) === String(coupon.id),
      ),
    )}
    onView={handleViewDiscount}
    onEdit={handleEditDiscount}
    onDelete={handleDeleteDiscount}
    onToggleStatus={handleToggleDiscountStatus}
  />
) : (
  <BogoCouponTable
    coupons={paginatedBogoCoupons}
    onView={handleViewBogo}
    onEdit={handleEditBogo}
    onDelete={handleDeleteBogo}
    onToggleStatus={handleToggleBogoStatus}
  />
)}

          {/* ========================= Pagination ========================= */}

          {!isLoading &&
            filteredCoupons.length > 0 && (
              <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={
                  filteredCoupons.length
                }
                itemsPerPage={
                  ITEMS_PER_PAGE
                }
                onPageChange={
                  setCurrentPage
                }
              />
            )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* ===================== DISCOUNT MODAL =========================== */}
      {/* ================================================================ */}

      <DiscountCouponModal
        isOpen={
          isDiscountModalOpen
        }
        coupon={
          selectedDiscountCoupon
        }
        onClose={
          handleCloseDiscountModal
        }
        onSubmit={
          handleDiscountSubmit
        }
        isSubmitting={isDiscountSubmitting}
      />

      {/* ========================= Discount Details ========================= */}

      {detailsDiscountCoupon && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDetailsDiscountCoupon(
                null,
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discount-details-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="discount-details-title"
                  className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
                >
                  Discount Coupon Details
                </h2>

                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View discount coupon information and configuration.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDetailsDiscountCoupon(
                    null,
                  )
                }
                aria-label="Close discount coupon details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DiscountCouponDetails
                coupon={
                  detailsDiscountCoupon
                }
                onEdit={
                  handleEditDiscount
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ======================== BOGO MODAL ============================ */}
      {/* ================================================================ */}

    <BogoCouponModal
      isOpen={isBogoModalOpen}
      coupon={selectedBogoCoupon}
      products={bogoProducts}
      onClose={handleCloseBogoModal}
      onSubmit={handleBogoSubmit}
      isSubmitting={
        isBogoSubmitting ||
        isProductsLoading ||
        isBogoEditLoading
      }
    />

      {/* ========================= BOGO Details ========================= */}

      {detailsBogoCoupon && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDetailsBogoCoupon(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bogo-details-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="bogo-details-title"
                  className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
                >
                  Buy 1 Get 1 Offer Details
                </h2>

                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View BOGO offer information and configuration.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDetailsBogoCoupon(null)
                }
                aria-label="Close Buy 1 Get 1 details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <BogoCouponDetails
                coupon={
                  detailsBogoCoupon
                }
                onEdit={
                  handleEditBogo
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ====================== ALL COUPON DETAILS ====================== */}
      {/* ================================================================ */}

      {detailsAllCoupon && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDetailsAllCoupon(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-coupon-details-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* ========================= Header ========================= */}

            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="all-coupon-details-title"
                  className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
                >
                  {detailsAllCoupon.type ===
                  "DISCOUNT"
                    ? "Discount Coupon Details"
                    : "Buy 1 Get 1 Offer Details"}
                </h2>

                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View offer information and configuration.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDetailsAllCoupon(
                    null,
                  )
                }
                aria-label="Close coupon details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* ========================= Details ========================= */}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              {detailsAllCoupon.type === "DISCOUNT" ? (
                (() => {
                  const discountCoupon = discountCoupons.find(
                    (item) =>
                      String(item.id) ===
                      String(detailsAllCoupon.id),
                  );

                  return discountCoupon ? (
                    <DiscountCouponDetails
                      coupon={discountCoupon}
                      onEdit={handleEditDiscount}
                    />
                  ) : (
                    <p className="text-sm text-[#8A7D72]">
                      Discount coupon details not found.
                    </p>
                  );
                })()
              ) : (
                (() => {
                  const bogoCoupon = bogoCoupons.find(
                    (item) =>
                      String(item.id) ===
                      String(detailsAllCoupon.id),
                  );

                  return bogoCoupon ? (
                    <BogoCouponDetails
                      coupon={bogoCoupon}
                      onEdit={handleEditBogo}
                    />
                  ) : (
                    <p className="text-sm text-[#8A7D72]">
                      BOGO offer details not found.
                    </p>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
      {/* ========================= Discount Coupon Delete Modal ========================= */}

<DiscountCouponDeleteModal
  isOpen={Boolean(couponToDelete)}
  couponName={
    couponToDelete
      ? `${couponToDelete.code} — ${couponToDelete.name}`
      : ""
  }
  isDeleting={isDiscountDeleting}
  onClose={() => {
    if (!isDiscountDeleting) {
      setCouponToDelete(null);
    }
  }}
  onConfirm={handleConfirmDeleteDiscount}
/>


{/* ========================= BOGO Coupon Delete Modal ========================= */}

<BogoCouponDeleteModal
  isOpen={Boolean(bogoCouponToDelete)}
  couponName={
    bogoCouponToDelete
      ? `${bogoCouponToDelete.code} — ${bogoCouponToDelete.name}`
      : ""
  }
  isDeleting={isBogoDeletingFromHook}
  onClose={() => {
    if (!isBogoDeletingFromHook) {
      setBogoCouponToDelete(null);
    }
  }}
  onConfirm={handleConfirmDeleteBogo}
/>
    </main>
  );
}