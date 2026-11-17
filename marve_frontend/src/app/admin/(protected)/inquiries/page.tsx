"use client";

import { useCallback, useEffect, useState } from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";
import InquiryHeader from "@/src/components/admin/inquiry/InquiryHeader";
import InquirySearch, {
  InquiryStatusFilter,
  InquirySubjectFilter,
} from "@/src/components/admin/inquiry/InquirySearch";
import InquiryTable, {
  Inquiry,
} from "@/src/components/admin/inquiry/InquiryTable";
import InquiryPagination from "@/src/components/admin/inquiry/InquiryPagination";
import InquirySkeleton from "@/src/components/admin/inquiry/InquirySkeleton";
import InquiryModal from "@/src/components/admin/inquiry/InquiryModal";
import InquiryDeleteModal from "@/src/components/admin/inquiry/InquiryDeleteModal";

import useInquiry from "@/src/hooks/admin/useInquiry";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;

/* ========================= Page ========================= */

export default function InquiriesPage() {
  const {
    inquiries,
    selectedInquiry,
    pagination,
    isLoading,
    isDeleting,
    error,
    fetchInquiries,
    fetchInquiryDetails,
    updateInquiryStatus,
    deleteInquiry,
    clearSelectedInquiry,
  } = useInquiry();

  /* ========================= Local State ========================= */

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<InquiryStatusFilter>("ALL");

  const [subject, setSubject] =
    useState<InquirySubjectFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [isInquiryModalOpen, setIsInquiryModalOpen] =
    useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [inquiryToDelete, setInquiryToDelete] =
    useState<Inquiry | null>(null);

  /* ========================= Fetch Inquiries ========================= */

  const loadInquiries = useCallback(async () => {
    await fetchInquiries({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      subject: subject === "ALL" ? undefined : subject,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
  }, [
    fetchInquiries,
    currentPage,
    search,
    status,
    subject,
  ]);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  /* ========================= Search ========================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ========================= Status Filter ========================= */

  const handleStatusChange = (
    value: InquiryStatusFilter,
  ) => {
    setStatus(value);
    setCurrentPage(1);
  };

  /* ========================= Subject Filter ========================= */

  const handleSubjectChange = (
    value: InquirySubjectFilter,
  ) => {
    setSubject(value);
    setCurrentPage(1);
  };

  /* ========================= Reset Filters ========================= */

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setSubject("ALL");
    setCurrentPage(1);
  };

  /* ========================= View Inquiry ========================= */

  const handleView = async (inquiry: Inquiry) => {
    setIsInquiryModalOpen(true);

    try {
      await fetchInquiryDetails(inquiry.uuid ?? inquiry.id);

      if (inquiry.status === "NEW") {
        await updateInquiryStatus(
          inquiry.uuid ?? inquiry.id,
          "READ",
        );

        await loadInquiries();
      }
    } catch (err) {
      console.error("Failed to open inquiry:", err);
    }
  };

  /* ========================= Open Delete Modal ========================= */

  const handleDelete = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry);
    setIsDeleteModalOpen(true);
  };

  /* ========================= Close Delete Modal ========================= */

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setInquiryToDelete(null);
  };

  /* ========================= Confirm Delete ========================= */

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete || isDeleting) return;

    const inquiry = inquiryToDelete;

    try {
      await deleteInquiry(inquiry.uuid ?? inquiry.id);

      if (
        selectedInquiry &&
        (
          selectedInquiry.id === inquiry.id ||
          (
            selectedInquiry.uuid &&
            selectedInquiry.uuid === inquiry.uuid
          )
        )
      ) {
        handleCloseInquiryModal();
      }

      setIsDeleteModalOpen(false);
      setInquiryToDelete(null);

      // If the last item on a page was deleted,
      // move to the previous page when possible.
      if (inquiries.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await loadInquiries();
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  /* ========================= Toggle Inquiry Status ========================= */

  const handleToggleStatus = async (inquiry: Inquiry) => {
    const nextStatus: Inquiry["status"] =
      inquiry.status === "NEW"
        ? "READ"
        : inquiry.status === "READ"
          ? "RESOLVED"
          : "READ";

    try {
      await updateInquiryStatus(
        inquiry.uuid ?? inquiry.id,
        nextStatus,
      );

      await loadInquiries();

      if (
        selectedInquiry &&
        (
          selectedInquiry.id === inquiry.id ||
          selectedInquiry.uuid === inquiry.uuid
        )
      ) {
        await fetchInquiryDetails(
          inquiry.uuid ?? inquiry.id,
        );
      }
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    }
  };

  /* ========================= Close Inquiry Modal ========================= */

  const handleCloseInquiryModal = () => {
    setIsInquiryModalOpen(false);
    clearSelectedInquiry();
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    await loadInquiries();
  };

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(1, pagination.totalPages);

  /* ========================= Customer Name ========================= */

  const deleteInquiryName = inquiryToDelete
    ? (
        `${inquiryToDelete.firstName ?? inquiryToDelete.first_name ?? ""} ${
          inquiryToDelete.lastName ?? inquiryToDelete.last_name ?? ""
        }`.trim() || inquiryToDelete.email || "this customer"
      )
    : "";

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* Header */}

          <InquiryHeader
            totalInquiries={pagination.count}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* Search and Filters */}

          <InquirySearch
            search={search}
            status={status}
            subject={subject}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onSubjectChange={handleSubjectChange}
            onReset={handleReset}
          />

          {/* Error */}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Table */}

          {isLoading ? (
            <InquirySkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <InquiryTable
              inquiries={inquiries}
              onView={handleView}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {/* Pagination */}

          {!isLoading && pagination.count > 0 && (
            <InquiryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={pagination.count}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Inquiry Details Modal */}

      <InquiryModal
        isOpen={isInquiryModalOpen}
        inquiry={selectedInquiry}
        onClose={handleCloseInquiryModal}
      />

      {/* Delete Confirmation Modal */}

      <InquiryDeleteModal
        isOpen={isDeleteModalOpen}
        inquiryName={deleteInquiryName}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}