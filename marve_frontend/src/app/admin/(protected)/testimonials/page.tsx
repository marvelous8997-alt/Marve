"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import TestimonialHeader from "@/src/components/admin/testimonial/TestimonialHeader";

import TestimonialSearch, {
  TestimonialFeaturedFilter,
  TestimonialRatingFilter,
  TestimonialStatusFilter,
} from "@/src/components/admin/testimonial/TestimonialSearch";

import TestimonialTable, {
  Testimonial,
} from "@/src/components/admin/testimonial/TestimonialTable";

import TestimonialPagination from "@/src/components/admin/testimonial/TestimonialPagination";

import TestimonialSkeleton from "@/src/components/admin/testimonial/TestimonialSkeleton";

import TestimonialModal from "@/src/components/admin/testimonial/TestimonialModal";

import TestimonialDetails from "@/src/components/admin/testimonial/TestimonialDetails";

import type { TestimonialFormData } from "@/src/components/admin/testimonial/TestimonialForm";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Demo Data ========================= */

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    customerName: "Riya Shah",
    customerRole: "Home Decor Enthusiast",
    customerCompany: "",
    customerImage: "",
    message:
      "The quality and finishing of the products were amazing. MARVE made my shopping experience really special.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: true,
    sortOrder: 1,
    createdAt: "2026-09-10",
    updatedAt: "2026-09-10",
  },

  {
    id: 2,
    customerName: "Aarav Mehta",
    customerRole: "Interior Designer",
    customerCompany: "Mehta Interiors",
    customerImage: "",
    message:
      "I absolutely loved the collection. The products feel premium, look beautiful, and the overall shopping experience was smooth.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: true,
    sortOrder: 2,
    createdAt: "2026-09-11",
    updatedAt: "2026-09-11",
  },

  {
    id: 3,
    customerName: "Neha Patel",
    customerRole: "Homemaker",
    customerCompany: "",
    customerImage: "",
    message:
      "MARVE has a beautiful range of home and kitchen products. The quality was exactly what I expected from the pictures.",
    rating: 4,
    status: "ACTIVE",
    isFeatured: false,
    sortOrder: 3,
    createdAt: "2026-09-12",
    updatedAt: "2026-09-12",
  },

  {
    id: 4,
    customerName: "Kabir Desai",
    customerRole: "Business Owner",
    customerCompany: "Desai Living",
    customerImage: "",
    message:
      "The packaging was neat and the product quality was excellent. Everything arrived safely and looked even better in person.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: true,
    sortOrder: 4,
    createdAt: "2026-09-13",
    updatedAt: "2026-09-13",
  },

  {
    id: 5,
    customerName: "Maya Joshi",
    customerRole: "Lifestyle Blogger",
    customerCompany: "",
    customerImage: "",
    message:
      "I really enjoyed shopping from MARVE. The collection is elegant and the products have a very premium feel.",
    rating: 4,
    status: "ACTIVE",
    isFeatured: false,
    sortOrder: 5,
    createdAt: "2026-09-14",
    updatedAt: "2026-09-14",
  },

  {
    id: 6,
    customerName: "Dhruv Shah",
    customerRole: "Architect",
    customerCompany: "Studio DS",
    customerImage: "",
    message:
      "The minimal designs and finishing of the products are impressive. MARVE has a very thoughtful collection.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: true,
    sortOrder: 6,
    createdAt: "2026-09-15",
    updatedAt: "2026-09-15",
  },

  {
    id: 7,
    customerName: "Ananya Mehta",
    customerRole: "Content Creator",
    customerCompany: "",
    customerImage: "",
    message:
      "Beautiful products and great quality. I especially loved the home decor collection and would definitely shop again.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: false,
    sortOrder: 7,
    createdAt: "2026-09-16",
    updatedAt: "2026-09-16",
  },

  {
    id: 8,
    customerName: "Yash Thakkar",
    customerRole: "Entrepreneur",
    customerCompany: "YT Ventures",
    customerImage: "",
    message:
      "The ordering process was simple and the products were delivered in excellent condition. Very happy with my purchase.",
    rating: 4,
    status: "ACTIVE",
    isFeatured: false,
    sortOrder: 8,
    createdAt: "2026-09-16",
    updatedAt: "2026-09-16",
  },

  {
    id: 9,
    customerName: "Simran Patel",
    customerRole: "Home Styling Consultant",
    customerCompany: "",
    customerImage: "",
    message:
      "The products have a lovely premium finish and fit beautifully into my home. The quality is definitely noticeable.",
    rating: 5,
    status: "INACTIVE",
    isFeatured: false,
    sortOrder: 9,
    createdAt: "2026-09-17",
    updatedAt: "2026-09-17",
  },

  {
    id: 10,
    customerName: "Kunal Shah",
    customerRole: "Marketing Professional",
    customerCompany: "",
    customerImage: "",
    message:
      "Great experience overall. The product looked exactly like the website and the quality was really good.",
    rating: 4,
    status: "ACTIVE",
    isFeatured: false,
    sortOrder: 10,
    createdAt: "2026-09-18",
    updatedAt: "2026-09-18",
  },

  {
    id: 11,
    customerName: "Pooja Desai",
    customerRole: "Interior Enthusiast",
    customerCompany: "",
    customerImage: "",
    message:
      "MARVE has such a clean and elegant collection. I loved the details and the products feel very well made.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: true,
    sortOrder: 11,
    createdAt: "2026-09-18",
    updatedAt: "2026-09-18",
  },

  {
    id: 12,
    customerName: "Rahul Joshi",
    customerRole: "Consultant",
    customerCompany: "",
    customerImage: "",
    message:
      "The product quality was good and delivery was smooth. I would definitely consider buying from MARVE again.",
    rating: 3,
    status: "ACTIVE",
    isFeatured: false,
    sortOrder: 12,
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
  },

  {
    id: 13,
    customerName: "Isha Shah",
    customerRole: "Fashion & Lifestyle Creator",
    customerCompany: "",
    customerImage: "",
    message:
      "The entire experience felt premium, from browsing the collection to receiving the product. Really impressed with MARVE.",
    rating: 5,
    status: "ACTIVE",
    isFeatured: true,
    sortOrder: 13,
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
  },
];

/* ========================= Page ========================= */

export default function TestimonialsPage() {
  /* ========================= State ========================= */

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(
      INITIAL_TESTIMONIALS,
    );

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<TestimonialStatusFilter>(
      "ALL",
    );

  const [rating, setRating] =
    useState<TestimonialRatingFilter>(
      "ALL",
    );

  const [featured, setFeatured] =
    useState<TestimonialFeaturedFilter>(
      "ALL",
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(false);

  /* ========================= Modal State ========================= */

  const [
    isTestimonialModalOpen,
    setIsTestimonialModalOpen,
  ] = useState(false);

  const [
    selectedTestimonial,
    setSelectedTestimonial,
  ] = useState<Testimonial | null>(
    null,
  );

  const [
    detailsTestimonial,
    setDetailsTestimonial,
  ] = useState<Testimonial | null>(
    null,
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  /* ========================= Filtering ========================= */

  const filteredTestimonials = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return testimonials.filter(
      (testimonial) => {
        /* ========================= Search ========================= */

        const matchesSearch =
          normalizedSearch.length === 0 ||
          testimonial.customerName
            .toLowerCase()
            .includes(normalizedSearch) ||
          testimonial.message
            .toLowerCase()
            .includes(normalizedSearch) ||
          testimonial.customerRole
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          testimonial.customerCompany
            ?.toLowerCase()
            .includes(normalizedSearch);

        /* ========================= Status ========================= */

        const matchesStatus =
          status === "ALL" ||
          testimonial.status === status;

        /* ========================= Rating ========================= */

        const matchesRating =
          rating === "ALL" ||
          testimonial.rating ===
            Number(rating);

        /* ========================= Featured ========================= */

        const matchesFeatured =
          featured === "ALL" ||
          (featured === "FEATURED" &&
            testimonial.isFeatured) ||
          (featured === "NOT_FEATURED" &&
            !testimonial.isFeatured);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesRating &&
          matchesFeatured
        );
      },
    );
  }, [
    testimonials,
    search,
    status,
    rating,
    featured,
  ]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTestimonials.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedTestimonials =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      return filteredTestimonials.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
      );
    }, [
      filteredTestimonials,
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
    value: TestimonialStatusFilter,
  ) => {
    setStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Rating ========================= */

  const handleRatingChange = (
    value: TestimonialRatingFilter,
  ) => {
    setRating(value);
    setCurrentPage(1);
  };

  /* ========================= Featured ========================= */

  const handleFeaturedChange = (
    value: TestimonialFeaturedFilter,
  ) => {
    setFeatured(value);
    setCurrentPage(1);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setRating("ALL");
    setFeatured("ALL");
    setCurrentPage(1);
  };

  /* ========================= Add ========================= */

  const handleAddTestimonial = () => {
    setSelectedTestimonial(null);
    setIsTestimonialModalOpen(true);
  };

  /* ========================= View ========================= */

  const handleView = (
    testimonial: Testimonial,
  ) => {
    setDetailsTestimonial(testimonial);
  };

  /* ========================= Edit ========================= */

  const handleEdit = (
    testimonial: Testimonial,
  ) => {
    setSelectedTestimonial(testimonial);
    setDetailsTestimonial(null);
    setIsTestimonialModalOpen(true);
  };

  /* ========================= Delete ========================= */

  const handleDelete = (
    testimonial: Testimonial,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the testimonial from "${testimonial.customerName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setTestimonials((previous) =>
      previous.filter(
        (item) => item.id !== testimonial.id,
      ),
    );

    if (
      detailsTestimonial?.id ===
      testimonial.id
    ) {
      setDetailsTestimonial(null);
    }
  };

  /* ========================= Toggle Status ========================= */

  const handleToggleStatus = (
    testimonial: Testimonial,
  ) => {
    setTestimonials((previous) =>
      previous.map((item) =>
        item.id === testimonial.id
          ? {
              ...item,
              status:
                item.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
              updatedAt:
                new Date()
                  .toISOString()
                  .split("T")[0],
            }
          : item,
      ),
    );

    setDetailsTestimonial((previous) => {
      if (
        !previous ||
        previous.id !== testimonial.id
      ) {
        return previous;
      }

      return {
        ...previous,
        status:
          previous.status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      };
    });
  };

  /* ========================= Toggle Featured ========================= */

  const handleToggleFeatured = (
    testimonial: Testimonial,
  ) => {
    setTestimonials((previous) =>
      previous.map((item) =>
        item.id === testimonial.id
          ? {
              ...item,
              isFeatured:
                !item.isFeatured,
              updatedAt:
                new Date()
                  .toISOString()
                  .split("T")[0],
            }
          : item,
      ),
    );

    setDetailsTestimonial((previous) => {
      if (
        !previous ||
        previous.id !== testimonial.id
      ) {
        return previous;
      }

      return {
        ...previous,
        isFeatured:
          !previous.isFeatured,
      };
    });
  };

  /* ========================= Submit ========================= */

  const handleSubmit = async (
    data: TestimonialFormData,
  ) => {
    setIsSubmitting(true);

    /*
     * API integration will be added here later.
     * For now, simulate a small save delay.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    /* ========================= Edit ========================= */

    if (selectedTestimonial) {
      setTestimonials((previous) =>
        previous.map((testimonial) =>
          testimonial.id ===
          selectedTestimonial.id
            ? {
                ...testimonial,

                customerName:
                  data.customerName,

                customerRole:
                  data.customerRole,

                customerCompany:
                  data.customerCompany,

                customerImage:
                  data.customerImage,

                message: data.message,

                rating: Number(
                  data.rating,
                ),

                status: data.status,

                isFeatured:
                  data.isFeatured,

                sortOrder: Number(
                  data.sortOrder,
                ),

                updatedAt:
                  new Date()
                    .toISOString()
                    .split("T")[0],
              }
            : testimonial,
        ),
      );
    }

    /* ========================= Add ========================= */

    else {
      const newTestimonial: Testimonial =
        {
          id: Date.now(),

          customerName:
            data.customerName,

          customerRole:
            data.customerRole,

          customerCompany:
            data.customerCompany,

          customerImage:
            data.customerImage,

          message: data.message,

          rating: Number(
            data.rating,
          ),

          status: data.status,

          isFeatured:
            data.isFeatured,

          sortOrder: Number(
            data.sortOrder,
          ),

          createdAt:
            new Date()
              .toISOString()
              .split("T")[0],

          updatedAt:
            new Date()
              .toISOString()
              .split("T")[0],
        };

      setTestimonials((previous) => [
        ...previous,
        newTestimonial,
      ]);
    }

    /* ========================= Close ========================= */

    setIsSubmitting(false);
    setIsTestimonialModalOpen(false);
    setSelectedTestimonial(null);
    setCurrentPage(1);
  };

  /* ========================= Close Testimonial Modal ========================= */

  const handleCloseModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsTestimonialModalOpen(false);
    setSelectedTestimonial(null);
  };

  /* ========================= Close Details ========================= */

  const handleCloseDetails = () => {
    setDetailsTestimonial(null);
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

          <TestimonialHeader
            totalTestimonials={
              testimonials.length
            }
            onAdd={
              handleAddTestimonial
            }
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* ========================= Search / Filters ========================= */}

          <TestimonialSearch
            search={search}
            status={status}
            rating={rating}
            featured={featured}
            onSearchChange={
              handleSearchChange
            }
            onStatusChange={
              handleStatusChange
            }
            onRatingChange={
              handleRatingChange
            }
            onFeaturedChange={
              handleFeaturedChange
            }
            onReset={handleReset}
          />

          {/* ========================= Table ========================= */}

          {isLoading ? (
            <TestimonialSkeleton
              rows={ITEMS_PER_PAGE}
            />
          ) : (
            <TestimonialTable
              testimonials={
                paginatedTestimonials
              }
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={
                handleToggleStatus
              }
              onToggleFeatured={
                handleToggleFeatured
              }
            />
          )}

          {/* ========================= Pagination ========================= */}

          {!isLoading &&
            filteredTestimonials.length >
              0 && (
              <TestimonialPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={
                  filteredTestimonials.length
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

      {/* ========================= Add / Edit Testimonial Modal ========================= */}

      <TestimonialModal
        isOpen={
          isTestimonialModalOpen
        }
        testimonial={
          selectedTestimonial
        }
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* ========================= Testimonial Details Modal ========================= */}

      {detailsTestimonial && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseDetails();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-details-title"
            className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* ========================= Details Header ========================= */}

            <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="testimonial-details-title"
                  className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
                >
                  Testimonial Details
                </h2>

                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  View customer feedback,
                  rating, status, and
                  display settings.
                </p>
              </div>

              {/* Close */}

              <button
                type="button"
                onClick={
                  handleCloseDetails
                }
                aria-label="Close testimonial details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* ========================= Details Content ========================= */}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <TestimonialDetails
                testimonial={
                  detailsTestimonial
                }
                onEdit={(
                  testimonial,
                ) => {
                  handleCloseDetails();

                  handleEdit(
                    testimonial,
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}