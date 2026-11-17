"use client";

import {
  CalendarDays,
  Mail,
  MessageCircleQuestion,
  Phone,
  UserRound,
} from "lucide-react";

import InquiryActionMenu from "@/src/components/admin/inquiry/InquiryActionMenu";

/* ========================= Types ========================= */

export type InquiryStatus =
  | "NEW"
  | "READ"
  | "RESOLVED";

export type InquirySubject =
  | "ORDER"
  | "PRODUCT"
  | "DELIVERY"
  | "RETURN"
  | "OTHER";

export interface Inquiry {
  id: number | string;
  uuid?: string;

  firstName: string;
  lastName?: string | null;

  first_name?: string;
  last_name?: string | null;

  email: string;
  phone?: string | null;

  subject: InquirySubject;
  message: string;
  status: InquiryStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Props ========================= */

interface InquiryTableProps {
  inquiries: Inquiry[];

  onView?: (inquiry: Inquiry) => void;
  onDelete?: (inquiry: Inquiry) => void;
  onToggleStatus?: (inquiry: Inquiry) => void;
}

/* ========================= Helpers ========================= */

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInquiryName(inquiry: Inquiry) {
  return `${inquiry.firstName} ${inquiry.lastName ?? ""}`.trim();
}

function getSubjectLabel(subject: InquirySubject) {
  switch (subject) {
    case "ORDER":
      return "Order Support";

    case "PRODUCT":
      return "Product Question";

    case "DELIVERY":
      return "Delivery & Shipping";

    case "RETURN":
      return "Return & Exchange";

    case "OTHER":
      return "Other";

    default:
      return "Other";
  }
}

function getStatusLabel(status: InquiryStatus) {
  switch (status) {
    case "NEW":
      return "New";

    case "READ":
      return "Read";

    case "RESOLVED":
      return "Resolved";

    default:
      return status;
  }
}

/* ========================= Component ========================= */

export default function InquiryTable({
  inquiries,
  onView,
  onDelete,
  onToggleStatus,
}: InquiryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Contact
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Subject
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Message
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Received
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {inquiries.map((inquiry) => {
              const inquiryName =
                getInquiryName(inquiry);

              return (
                <tr
                  key={inquiry.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Customer ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Avatar */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <UserRound
                          size={18}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      {/* Customer Info */}

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-[#29231F]">
                          {inquiryName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#A0958C]">
                          Inquiry ID: {inquiry.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Contact ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      {/* Email */}

                      <div className="flex min-w-0 items-center gap-1.5">
                        <Mail
                          size={11}
                          strokeWidth={1.7}
                          className="shrink-0 text-[#A66A32]"
                        />

                        <span className="max-w-[190px] truncate text-[10px] font-medium text-[#665B53]">
                          {inquiry.email}
                        </span>
                      </div>

                      {/* Phone */}

                      {inquiry.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone
                            size={11}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A66A32]"
                          />

                          <span className="text-[10px] text-[#A0958C]">
                            {inquiry.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ========================= Subject ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0]">
                        <MessageCircleQuestion
                          size={14}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                      </div>

                      <span className="max-w-[150px] text-[10px] font-semibold leading-4 text-[#39312B]">
                        {getSubjectLabel(
                          inquiry.subject,
                        )}
                      </span>
                    </div>
                  </td>

                  {/* ========================= Message ========================= */}

                  <td className="max-w-[260px] px-4 py-4">
                    <p
                      className="line-clamp-2 text-[10px] leading-4 text-[#665B53]"
                      title={inquiry.message}
                    >
                      {inquiry.message}
                    </p>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        inquiry.status === "NEW"
                          ? "bg-[#A66A32]/10 text-[#A66A32]"
                          : inquiry.status ===
                              "READ"
                            ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                            : "bg-[#F3F0ED] text-[#665B53]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          inquiry.status === "NEW"
                            ? "bg-[#A66A32]"
                            : inquiry.status ===
                                "READ"
                              ? "bg-[#6B3E1E]"
                              : "bg-[#A0958C]"
                        }`}
                      />

                      {getStatusLabel(
                        inquiry.status,
                      )}
                    </span>
                  </td>

                  {/* ========================= Received ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        inquiry.createdAt,
                      )}
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <InquiryActionMenu
                      inquiry={inquiry}
                      onView={onView}
                      onDelete={onDelete}
                      onToggleStatus={
                        onToggleStatus
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {inquiries.map((inquiry) => {
          const inquiryName =
            getInquiryName(inquiry);

          return (
            <div
              key={inquiry.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Top Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Avatar */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <UserRound
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                {/* Inquiry Info */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {inquiryName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        {inquiry.email}
                      </p>

                      {inquiry.phone && (
                        <p className="mt-0.5 truncate text-[10px] text-[#B0A49B]">
                          {inquiry.phone}
                        </p>
                      )}
                    </div>

                    {/* Status */}

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        inquiry.status ===
                        "NEW"
                          ? "bg-[#A66A32]/10 text-[#A66A32]"
                          : inquiry.status ===
                              "READ"
                            ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                            : "bg-[#F3F0ED] text-[#665B53]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          inquiry.status ===
                          "NEW"
                            ? "bg-[#A66A32]"
                            : inquiry.status ===
                                "READ"
                              ? "bg-[#6B3E1E]"
                              : "bg-[#A0958C]"
                        }`}
                      />

                      {getStatusLabel(
                        inquiry.status,
                      )}
                    </span>

                    {/* Actions */}

                    <InquiryActionMenu
                      inquiry={inquiry}
                      onView={onView}
                      onDelete={onDelete}
                      onToggleStatus={
                        onToggleStatus
                      }
                    />
                  </div>

                  {/* ========================= Subject ========================= */}

                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <MessageCircleQuestion
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {getSubjectLabel(
                        inquiry.subject,
                      )}
                    </span>
                  </div>

                  {/* ========================= Message ========================= */}

                  <div className="mt-3 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-3">
                    <p className="line-clamp-3 text-[10px] leading-4 text-[#665B53]">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Status */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          inquiry.status ===
                          "NEW"
                            ? "bg-[#A66A32]"
                            : inquiry.status ===
                                "READ"
                              ? "bg-[#6B3E1E]"
                              : "bg-[#A0958C]"
                        }`}
                      />

                      {getStatusLabel(
                        inquiry.status,
                      )}
                    </span>

                    {/* Received */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        inquiry.createdAt,
                      )}
                    </span>

                    {/* Inquiry ID */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <MessageCircleQuestion
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      #{inquiry.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {inquiries.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <MessageCircleQuestion
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No inquiries found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer inquiries will appear
              here when customers submit the
              contact form from the storefront.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}