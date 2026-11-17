"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  Mail,
  MessageCircleQuestion,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  Inquiry,
  InquiryStatus,
} from "@/src/components/admin/inquiry/InquiryTable";

/* ========================= Props ========================= */

interface InquiryDetailsProps {
  inquiry: Inquiry;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFullName(inquiry: Inquiry) {
  const firstName =
    inquiry.firstName ?? inquiry.first_name ?? "";

  const lastName =
    inquiry.lastName ?? inquiry.last_name ?? "";

  return `${firstName} ${lastName}`.trim() ||
    "Unnamed Customer";
}

function getSubjectLabel(
  subject: Inquiry["subject"],
) {
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

/* ========================= Status Badge ========================= */

function StatusBadge({
  status,
}: {
  status: InquiryStatus;
}) {
  const config = {
    NEW: {
      label: "New",
      className:
        "bg-[#A66A32]/10 text-[#A66A32]",
      icon: Clock3,
    },

    READ: {
      label: "Read",
      className:
        "bg-[#6B3E1E]/8 text-[#6B3E1E]",
      icon: MessageCircleQuestion,
    },

    RESOLVED: {
      label: "Resolved",
      className:
        "bg-[#F3F0ED] text-[#665B53]",
      icon: CheckCircle2,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
      />

      {config.label}
    </span>
  );
}

/* ========================= Information Card ========================= */

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function InquiryDetails({
  inquiry,
}: InquiryDetailsProps) {
  const fullName = getFullName(inquiry);

  const subjectLabel = getSubjectLabel(
    inquiry.subject,
  );

  return (
    <div className="space-y-5">
      {/* ========================= Inquiry Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Main Info */}

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] text-[#6B3E1E]">
                <MessageCircleQuestion
                  size={25}
                  strokeWidth={1.45}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                    {subjectLabel}
                  </h2>

                  <StatusBadge
                    status={inquiry.status}
                  />
                </div>

                {/* Inquiry ID */}

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                  <Hash
                    size={12}
                    strokeWidth={1.7}
                  />

                  <span>
                    Inquiry ID: {inquiry.id}
                  </span>
                </div>

                {/* Customer */}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#665B53]">
                  <UserRound
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span>
                    Submitted by{" "}
                    <span className="font-semibold text-[#29231F]">
                      {fullName}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Received Date */}

            {inquiry.createdAt && (
              <div className="shrink-0 rounded-xl bg-[#F8F5F0]/70 px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={14}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                      Received
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold text-[#29231F]">
                      {formatDate(
                        inquiry.createdAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================= Customer Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Contact information provided by the
            customer with this inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="First Name"
            value={inquiry.firstName ?? inquiry.first_name ?? "—"}
            icon={UserRound}
          />

          <InfoCard
            label="Last Name"
            value={inquiry.lastName ?? inquiry.last_name ?? "—"}
            icon={UserRound}
          />

          <InfoCard
            label="Email Address"
            value={inquiry.email || "—"}
            icon={Mail}
          />

          <InfoCard
            label="Phone Number"
            value={inquiry.phone || "—"}
            icon={Phone}
          />
        </div>
      </section>

      {/* ========================= Inquiry Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Inquiry Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Subject and current status of this
            customer inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Subject"
            value={subjectLabel}
            icon={MessageCircleQuestion}
          />

          <InfoCard
            label="Status"
            value={
              inquiry.status === "NEW"
                ? "New"
                : inquiry.status === "READ"
                  ? "Read"
                  : "Resolved"
            }
            icon={
              inquiry.status === "RESOLVED"
                ? CheckCircle2
                : Clock3
            }
          />

          <InfoCard
            label="Inquiry ID"
            value={String(inquiry.id)}
            icon={Hash}
          />

          <InfoCard
            label="Received Date"
            value={
              formatDateTime(
                inquiry.createdAt,
              ) || "—"
            }
            icon={CalendarDays}
          />
        </div>
      </section>

      {/* ========================= Customer Message ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
              <MessageCircleQuestion
                size={15}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#29231F]">
                Customer Message
              </h3>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Message submitted through the
                contact form.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/55 p-4 sm:p-5">
          <p className="whitespace-pre-wrap text-xs leading-6 text-[#39312B]">
            {inquiry.message || "No message provided."}
          </p>
        </div>
      </section>

      {/* ========================= Inquiry Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Inquiry Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important dates associated with this
            inquiry.
          </p>
        </div>

        <div className="space-y-3">
          {inquiry.createdAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Inquiry Received
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    inquiry.createdAt,
                  )}
                </p>
              </div>
            </div>
          )}

          {inquiry.updatedAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Clock3
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Last Updated
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    inquiry.updatedAt,
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}