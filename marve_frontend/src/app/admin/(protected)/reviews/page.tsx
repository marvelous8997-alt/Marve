"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import ReviewHeader from "@/src/components/admin/review/ReviewHeader";

import ReviewSearch, {
  ReviewRatingFilter,
  ReviewStatusFilter,
} from "@/src/components/admin/review/ReviewSearch";

import ReviewTable, {
  ProductReview,
} from "@/src/components/admin/review/ReviewTable";

import ReviewPagination from "@/src/components/admin/review/ReviewPagination";

import ReviewSkeleton from "@/src/components/admin/review/ReviewSkeleton";

import ReviewModal from "@/src/components/admin/review/ReviewModal";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Demo Data ========================= */

const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "Aarav Shah",
    customerEmail: "aarav.shah@example.com",
    customerPhone: "+91 98765 43210",

    productId: 101,
    productName: "Premium Ceramic Dinner Set",
    productImage: "",
    productSku: "MAR-DIN-001",

    orderId: 1001,
    orderNumber: "MRV-10001",

    rating: 5,
    comment:
      "Beautiful dinner set with excellent finishing. The quality is even better than I expected and the packaging was very secure.",
    status: "APPROVED",

    createdAt: "2026-09-18T10:30:00",
    updatedAt: "2026-09-18T12:10:00",
  },

  {
    id: 2,
    customerId: 2,
    customerName: "Diya Patel",
    customerEmail: "diya.patel@example.com",
    customerPhone: "+91 98254 11876",

    productId: 102,
    productName: "Wooden Kitchen Organizer",
    productImage: "",
    productSku: "MAR-STO-002",

    orderId: 1002,
    orderNumber: "MRV-10002",

    rating: 4,
    comment:
      "Very useful organizer and the wooden finish looks premium. Size is perfect for my kitchen counter.",
    status: "PENDING",

    createdAt: "2026-09-18T11:45:00",
  },

  {
    id: 3,
    customerId: 3,
    customerName: "Rohan Mehta",
    customerEmail: "rohan.mehta@example.com",
    customerPhone: "+91 97654 22109",

    productId: 103,
    productName: "Stainless Steel Cookware Set",
    productImage: "",
    productSku: "MAR-CKW-003",

    orderId: 1003,
    orderNumber: "MRV-10003",

    rating: 5,
    comment:
      "Excellent cookware set. The build quality is solid and all the pieces feel durable. Very happy with the purchase.",
    status: "APPROVED",

    createdAt: "2026-09-17T09:20:00",
    updatedAt: "2026-09-17T13:00:00",
  },

  {
    id: 4,
    customerId: 4,
    customerName: "Anaya Desai",
    customerEmail: "anaya.desai@example.com",
    customerPhone: "+91 98980 34567",

    productId: 104,
    productName: "Minimal Ceramic Vase",
    productImage: "",
    productSku: "MAR-DEC-004",

    orderId: 1004,
    orderNumber: "MRV-10004",

    rating: 3,
    comment:
      "The vase looks nice and matches the photos. I expected slightly better finishing around the base.",
    status: "HIDDEN",

    createdAt: "2026-09-16T15:10:00",
    updatedAt: "2026-09-17T09:30:00",
  },

  {
    id: 5,
    customerId: 5,
    customerName: "Vivaan Joshi",
    customerEmail: "vivaan.joshi@example.com",
    customerPhone: "+91 98123 45678",

    productId: 105,
    productName: "Crystal Glass Storage Jar",
    productImage: "",
    productSku: "MAR-STO-005",

    orderId: 1005,
    orderNumber: "MRV-10005",

    rating: 5,
    comment:
      "Absolutely love these jars. They look elegant on the kitchen shelf and the lids fit perfectly.",
    status: "APPROVED",

    createdAt: "2026-09-15T12:40:00",
    updatedAt: "2026-09-15T14:15:00",
  },

  {
    id: 6,
    customerId: 6,
    customerName: "Myra Kapoor",
    customerEmail: "myra.kapoor@example.com",
    customerPhone: "+91 99045 67231",

    productId: 106,
    productName: "Modern Coffee Mug Set",
    productImage: "",
    productSku: "MAR-COF-006",

    orderId: 1006,
    orderNumber: "MRV-10006",

    rating: 4,
    comment:
      "Lovely mugs with a clean modern design. They are comfortable to hold and the finish is smooth.",
    status: "PENDING",

    createdAt: "2026-09-14T10:15:00",
  },

  {
    id: 7,
    customerId: 7,
    customerName: "Aditya Trivedi",
    customerEmail: "aditya.trivedi@example.com",
    customerPhone: "+91 97245 88120",

    productId: 107,
    productName: "Bamboo Serving Tray",
    productImage: "",
    productSku: "MAR-SRV-007",

    orderId: 1007,
    orderNumber: "MRV-10007",

    rating: 5,
    comment:
      "Beautiful tray and very lightweight. The bamboo texture gives it a really premium look.",
    status: "APPROVED",

    createdAt: "2026-09-13T16:30:00",
    updatedAt: "2026-09-14T09:20:00",
  },

  {
    id: 8,
    customerId: 8,
    customerName: "Kiara Soni",
    customerEmail: "kiara.soni@example.com",
    customerPhone: "+91 98452 31987",

    productId: 108,
    productName: "Glass Water Bottle",
    productImage: "",
    productSku: "MAR-HUT-008",

    orderId: 1008,
    orderNumber: "MRV-10008",

    rating: 2,
    comment:
      "The design is good, but I found the bottle heavier than expected for daily use.",
    status: "HIDDEN",

    createdAt: "2026-09-12T13:25:00",
    updatedAt: "2026-09-13T10:10:00",
  },

  {
    id: 9,
    customerId: 9,
    customerName: "Arjun Patel",
    customerEmail: "arjun.patel@example.com",
    customerPhone: "+91 98251 76543",

    productId: 109,
    productName: "Non-Stick Fry Pan",
    productImage: "",
    productSku: "MAR-CKW-009",

    orderId: 1009,
    orderNumber: "MRV-10009",

    rating: 5,
    comment:
      "Very good pan for everyday cooking. It heats evenly and cleaning it is easy.",
    status: "PENDING",

    createdAt: "2026-09-11T08:45:00",
  },

  {
    id: 10,
    customerId: 10,
    customerName: "Ishita Sharma",
    customerEmail: "ishita.sharma@example.com",
    customerPhone: "+91 99123 65478",

    productId: 110,
    productName: "Ceramic Serving Bowl",
    productImage: "",
    productSku: "MAR-DIN-010",

    orderId: 1010,
    orderNumber: "MRV-10010",

    rating: 4,
    comment:
      "Simple and elegant serving bowl. The size works well for family dinners.",
    status: "APPROVED",

    createdAt: "2026-09-10T17:20:00",
    updatedAt: "2026-09-11T10:30:00",
  },

  {
    id: 11,
    customerId: 11,
    customerName: "Kabir Rana",
    customerEmail: "kabir.rana@example.com",
    customerPhone: "+91 97854 23109",

    productId: 111,
    productName: "Wooden Spice Rack",
    productImage: "",
    productSku: "MAR-STO-011",

    orderId: 1011,
    orderNumber: "MRV-10011",

    rating: 4,
    comment:
      "Good quality spice rack and easy to assemble. Looks neat in the kitchen.",
    status: "APPROVED",

    createdAt: "2026-09-09T11:10:00",
    updatedAt: "2026-09-10T09:45:00",
  },

  {
    id: 12,
    customerId: 12,
    customerName: "Meera Bhatia",
    customerEmail: "meera.bhatia@example.com",
    customerPhone: "+91 98670 54321",

    productId: 112,
    productName: "Floral Ceramic Planter",
    productImage: "",
    productSku: "MAR-DEC-012",

    orderId: 1012,
    orderNumber: "MRV-10012",

    rating: 5,
    comment:
      "Such a beautiful planter. It added exactly the decorative touch I wanted for my living room.",
    status: "PENDING",

    createdAt: "2026-09-08T14:50:00",
  },

  {
    id: 13,
    customerId: 13,
    customerName: "Reyansh Vora",
    customerEmail: "reyansh.vora@example.com",
    customerPhone: "+91 99090 11223",

    productId: 113,
    productName: "Kitchen Storage Container Set",
    productImage: "",
    productSku: "MAR-STO-013",

    orderId: 1013,
    orderNumber: "MRV-10013",

    rating: 3,
    comment:
      "Containers are useful, but I expected the lids to feel slightly more secure.",
    status: "HIDDEN",

    createdAt: "2026-09-07T09:35:00",
    updatedAt: "2026-09-08T12:00:00",
  },

  {
    id: 14,
    customerId: 14,
    customerName: "Sara Malhotra",
    customerEmail: "sara.malhotra@example.com",
    customerPhone: "+91 98701 33445",

    productId: 114,
    productName: "Elegant Tea Cup Set",
    productImage: "",
    productSku: "MAR-COF-014",

    orderId: 1014,
    orderNumber: "MRV-10014",

    rating: 5,
    comment:
      "The cups are gorgeous and perfect for evening tea. Packaging was also excellent.",
    status: "APPROVED",

    createdAt: "2026-09-06T16:05:00",
    updatedAt: "2026-09-07T10:15:00",
  },

  {
    id: 15,
    customerId: 15,
    customerName: "Yash Thakkar",
    customerEmail: "yash.thakkar@example.com",
    customerPhone: "+91 98334 55678",

    productId: 115,
    productName: "Marble Kitchen Canister",
    productImage: "",
    productSku: "MAR-STO-015",

    orderId: 1015,
    orderNumber: "MRV-10015",

    rating: 4,
    comment:
      "Looks premium and feels sturdy. The marble finish is very nice.",
    status: "PENDING",

    createdAt: "2026-09-05T12:25:00",
  },

  {
    id: 16,
    customerId: 16,
    customerName: "Nisha Amin",
    customerEmail: "nisha.amin@example.com",
    customerPhone: "+91 97521 90876",

    productId: 116,
    productName: "Stainless Steel Serving Spoon Set",
    productImage: "",
    productSku: "MAR-SRV-016",

    orderId: 1016,
    orderNumber: "MRV-10016",

    rating: 4,
    comment:
      "Good quality serving spoons with a nice polished finish. Happy with the purchase.",
    status: "APPROVED",

    createdAt: "2026-09-04T10:40:00",
    updatedAt: "2026-09-05T11:20:00",
  },
];

/* ========================= Page ========================= */

export default function ReviewsPage() {
  /* ========================= State ========================= */

  const [reviews, setReviews] =
    useState<ProductReview[]>(
      INITIAL_REVIEWS,
    );

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<ReviewStatusFilter>("ALL");

  const [rating, setRating] =
    useState<ReviewRatingFilter>("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    isReviewModalOpen,
    setIsReviewModalOpen,
  ] = useState(false);

  const [
    selectedReview,
    setSelectedReview,
  ] = useState<ProductReview | null>(
    null,
  );

  /* ========================= Filtering ========================= */

  const filteredReviews = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        review.customerName
          .toLowerCase()
          .includes(normalizedSearch) ||
        review.customerEmail
          .toLowerCase()
          .includes(normalizedSearch) ||
        review.productName
          .toLowerCase()
          .includes(normalizedSearch) ||
        review.productSku
          .toLowerCase()
          .includes(normalizedSearch) ||
        review.orderNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        review.comment
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(review.customerId)
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(review.productId)
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(review.orderId)
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" ||
        review.status === status;

      const matchesRating =
        rating === "ALL" ||
        String(review.rating) === rating;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [
    reviews,
    search,
    status,
    rating,
  ]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReviews.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedReviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredReviews.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [
    filteredReviews,
    currentPage,
  ]);

  /* ========================= Page Safety ========================= */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* ========================= Search ========================= */

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ========================= Status ========================= */

  const handleStatusChange = (
    value: ReviewStatusFilter,
  ) => {
    setStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Rating ========================= */

  const handleRatingChange = (
    value: ReviewRatingFilter,
  ) => {
    setRating(value);
    setCurrentPage(1);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setRating("ALL");
    setCurrentPage(1);
  };

  /* ========================= View ========================= */

  const handleView = (
    review: ProductReview,
  ) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  /* ========================= Approve ========================= */

  const handleApprove = (
    review: ProductReview,
  ) => {
    setReviews((previous) =>
      previous.map((item) =>
        item.id === review.id
          ? {
              ...item,
              status: "APPROVED",
              updatedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    );

    if (
      selectedReview?.id === review.id
    ) {
      setSelectedReview((previous) =>
        previous
          ? {
              ...previous,
              status: "APPROVED",
              updatedAt:
                new Date().toISOString(),
            }
          : null,
      );
    }
  };

  /* ========================= Hide ========================= */

  const handleHide = (
    review: ProductReview,
  ) => {
    setReviews((previous) =>
      previous.map((item) =>
        item.id === review.id
          ? {
              ...item,
              status: "HIDDEN",
              updatedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    );

    if (
      selectedReview?.id === review.id
    ) {
      setSelectedReview((previous) =>
        previous
          ? {
              ...previous,
              status: "HIDDEN",
              updatedAt:
                new Date().toISOString(),
            }
          : null,
      );
    }
  };

  /* ========================= Delete ========================= */

  const handleDelete = (
    review: ProductReview,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the review from "${review.customerName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setReviews((previous) =>
      previous.filter(
        (item) =>
          item.id !== review.id,
      ),
    );

    if (
      selectedReview?.id === review.id
    ) {
      setSelectedReview(null);
      setIsReviewModalOpen(false);
    }
  };

  /* ========================= Close Review Modal ========================= */

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setSelectedReview(null);
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    setIsLoading(false);
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

          <ReviewHeader
            totalReviews={reviews.length}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* ========================= Search / Filters ========================= */}

          <ReviewSearch
            search={search}
            status={status}
            rating={rating}
            onSearchChange={
              handleSearchChange
            }
            onStatusChange={
              handleStatusChange
            }
            onRatingChange={
              handleRatingChange
            }
            onReset={handleReset}
          />

          {/* ========================= Table ========================= */}

          {isLoading ? (
            <ReviewSkeleton
              rows={ITEMS_PER_PAGE}
            />
          ) : (
            <ReviewTable
              reviews={paginatedReviews}
              onView={handleView}
              onApprove={handleApprove}
              onHide={handleHide}
              onDelete={handleDelete}
            />
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading &&
            filteredReviews.length > 0 && (
              <ReviewPagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                totalItems={
                  filteredReviews.length
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

      {/* ========================= Review Details Modal ========================= */}

      <ReviewModal
        isOpen={
          isReviewModalOpen
        }
        review={
          selectedReview
        }
        onClose={
          handleCloseModal
        }
      />
    </main>
  );
}