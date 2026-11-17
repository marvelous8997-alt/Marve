"use client";

import {
  CalendarDays,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

/* ========================= Types ========================= */

export type OrderStatusFilter =
  | "ALL"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type PaymentStatusFilter =
  | "ALL"
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface OrderAdvancedFilters {
  orderId: string;
  customer: string;
  phone: string;
  product: string;
  paymentStatus: PaymentStatusFilter;
  status: OrderStatusFilter;
  dateFrom: string;
  dateTo: string;
}

/* ========================= Props ========================= */

interface OrderSearchProps {
  search: string;

  status: OrderStatusFilter;

  paymentStatus: PaymentStatusFilter;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: OrderStatusFilter,
  ) => void;

  onPaymentStatusChange: (
    value: PaymentStatusFilter,
  ) => void;

  onReset?: () => void;

  onAdvancedFiltersChange?: (
    filters: OrderAdvancedFilters,
  ) => void;
}

/* ========================= Options ========================= */

const orderStatusOptions: {
  value: OrderStatusFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All Statuses",
  },
  {
    value: "PENDING_PAYMENT",
    label: "Pending Payment",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PROCESSING",
    label: "Processing",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
  {
    value: "RETURN_REQUESTED",
    label: "Return Requested",
  },
  {
    value: "RETURNED",
    label: "Returned",
  },
];

const paymentStatusOptions: {
  value: PaymentStatusFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All Payments",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "PROCESSING",
    label: "Processing",
  },
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "FAILED",
    label: "Failed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
  {
    value: "REFUNDED",
    label: "Refunded",
  },
  {
    value: "PARTIALLY_REFUNDED",
    label: "Partially Refunded",
  },
];

/* ========================= Component ========================= */

export default function OrderSearch({
  search,
  status,
  paymentStatus,
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onReset,
  onAdvancedFiltersChange,
}: OrderSearchProps) {
  /* ========================= Local Filter State ========================= */

  const [orderId, setOrderId] =
    useState("");

  const [customer, setCustomer] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [product, setProduct] =
    useState("");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState<OrderStatusFilter>(
      status,
    );

  const [
    filterPaymentStatus,
    setFilterPaymentStatus,
  ] =
    useState<PaymentStatusFilter>(
      paymentStatus,
    );

  /* ========================= Sync Parent State ========================= */

  useEffect(() => {
    setFilterStatus(status);
  }, [status]);

  useEffect(() => {
    setFilterPaymentStatus(
      paymentStatus,
    );
  }, [paymentStatus]);

  /* ========================= Active Filter Check ========================= */

const hasFilters =
  search.trim().length > 0 ||
  orderId.trim().length > 0 ||
  customer.trim().length > 0 ||
  phone.trim().length > 0 ||
  product.trim().length > 0 ||
  filterStatus !== "ALL" ||
  filterPaymentStatus !== "ALL" ||
  dateFrom.length > 0 ||
  dateTo.length > 0;
  /* ========================= Apply Filters ========================= */

  const handleSearch = () => {
    onStatusChange(
      filterStatus,
    );

    onPaymentStatusChange(
      filterPaymentStatus,
    );

    onAdvancedFiltersChange?.({
      orderId: orderId.trim(),
      customer: customer.trim(),
      phone: phone.trim(),
      product: product.trim(),
      paymentStatus:
        filterPaymentStatus,
      status: filterStatus,
      dateFrom,
      dateTo,
    });
  };

  /* ========================= Clear Filters ========================= */

  const handleClearFilters = () => {
    setOrderId("");
    setCustomer("");
    setPhone("");
    setProduct("");
    setDateFrom("");
    setDateTo("");

    setFilterStatus("ALL");
    setFilterPaymentStatus("ALL");

    onSearchChange("");

    onStatusChange("ALL");
    onPaymentStatusChange("ALL");

    onAdvancedFiltersChange?.({
      orderId: "",
      customer: "",
      phone: "",
      product: "",
      paymentStatus: "ALL",
      status: "ALL",
      dateFrom: "",
      dateTo: "",
    });

    onReset?.();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ================================================================ */}
      {/* Search Row                                                       */}
      {/* ================================================================ */}

      <div className="border-b border-[#6B3E1E]/8 p-3 sm:p-4">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search by order ID or customer"
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 pl-10 pr-4 text-xs text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/25 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-11"
          />
        </div>
      </div>

      {/* ================================================================ */}
      {/* Advanced Filters                                                  */}
      {/* ================================================================ */}

{/* ================================================================ */}
{/* Advanced Filters                                                  */}
{/* ================================================================ */}

<div className="bg-[#F8F5F0]/35 p-3 sm:p-4">

  {/* ========================= Filter Fields ========================= */}

  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

    {/* ========================= Order ID ========================= */}

    <div>
      <label
        htmlFor="order-filter-id"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Order ID
      </label>

      <input
        id="order-filter-id"
        type="text"
        value={orderId}
        onChange={(event) =>
          setOrderId(event.target.value)
        }
        placeholder="Order ID"
        className="h-9 w-full rounded-lg border border-[#6B3E1E]/10 bg-white px-3 text-[10px] text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
      />
    </div>

    {/* ========================= Customer ========================= */}

    <div>
      <label
        htmlFor="order-filter-customer"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Customer
      </label>

      <input
        id="order-filter-customer"
        type="text"
        value={customer}
        onChange={(event) =>
          setCustomer(event.target.value)
        }
        placeholder="First and last name"
        className="h-9 w-full rounded-lg border border-[#6B3E1E]/10 bg-white px-3 text-[10px] text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
      />
    </div>

    {/* ========================= Phone ========================= */}

    <div>
      <label
        htmlFor="order-filter-phone"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Phone Number
      </label>

      <input
        id="order-filter-phone"
        type="text"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value)
        }
        placeholder="Phone number"
        className="h-9 w-full rounded-lg border border-[#6B3E1E]/10 bg-white px-3 text-[10px] text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
      />
    </div>

    {/* ========================= Product ========================= */}

    <div>
      <label
        htmlFor="order-filter-product"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Product
      </label>

      <input
        id="order-filter-product"
        type="text"
        value={product}
        onChange={(event) =>
          setProduct(event.target.value)
        }
        placeholder="Product name or SKU"
        className="h-9 w-full rounded-lg border border-[#6B3E1E]/10 bg-white px-3 text-[10px] text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
      />
    </div>

    {/* ========================= Payment ========================= */}

    <div>
      <label
        htmlFor="order-filter-payment"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Payment
      </label>

      <div className="relative">
        <select
          id="order-filter-payment"
          value={filterPaymentStatus}
          onChange={(event) =>
            setFilterPaymentStatus(
              event.target.value as PaymentStatusFilter,
            )
          }
          className="h-9 w-full appearance-none rounded-lg border border-[#6B3E1E]/10 bg-white px-3 pr-8 text-[10px] text-[#29231F] outline-none transition-all duration-200 focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
        >
          {paymentStatusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={13}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
        />
      </div>
    </div>

    {/* ========================= Status ========================= */}

    <div>
      <label
        htmlFor="order-filter-status"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Status
      </label>

      <div className="relative">
        <select
          id="order-filter-status"
          value={filterStatus}
          onChange={(event) =>
            setFilterStatus(
              event.target.value as OrderStatusFilter,
            )
          }
          className="h-9 w-full appearance-none rounded-lg border border-[#6B3E1E]/10 bg-white px-3 pr-8 text-[10px] text-[#29231F] outline-none transition-all duration-200 focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
        >
          {orderStatusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={13}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
        />
      </div>
    </div>

    {/* ========================= Date From ========================= */}

    <div>
      <label
        htmlFor="order-filter-date-from"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Date From
      </label>

      <div className="relative">
        <CalendarDays
          size={13}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A0958C]"
        />

        <input
          id="order-filter-date-from"
          type="date"
          value={dateFrom}
          onChange={(event) =>
            setDateFrom(event.target.value)
          }
          className="h-9 w-full rounded-lg border border-[#6B3E1E]/10 bg-white pl-9 pr-3 text-[10px] text-[#29231F] outline-none transition-all duration-200 focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
        />
      </div>
    </div>

    {/* ========================= Date To ========================= */}

    <div>
      <label
        htmlFor="order-filter-date-to"
        className="mb-1.5 block text-[10px] font-semibold text-[#665B53]"
      >
        Date To
      </label>

      <div className="relative">
        <CalendarDays
          size={13}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A0958C]"
        />

        <input
          id="order-filter-date-to"
          type="date"
          value={dateTo}
          onChange={(event) =>
            setDateTo(event.target.value)
          }
          className="h-9 w-full rounded-lg border border-[#6B3E1E]/10 bg-white pl-9 pr-3 text-[10px] text-[#29231F] outline-none transition-all duration-200 focus:border-[#6B3E1E]/25 focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-10"
        />
      </div>
    </div>

  </div>

  {/* ================================================================ */}
  {/* Actions                                                           */}
  {/* ================================================================ */}

  <div className="mt-4 flex items-center justify-end gap-2">

    {/* ========================= Search ========================= */}

    <button
      type="button"
      onClick={handleSearch}
      className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#6B3E1E] px-3 text-[10px] font-semibold text-white transition-all duration-200 hover:bg-[#5B3319] active:scale-[0.98] sm:h-10"
    >
      <Search
        size={13}
        strokeWidth={1.8}
      />

      <span>
        Search
      </span>
    </button>

    {/* ========================= Reset ========================= */}

    {hasFilters && (
      <button
        type="button"
        onClick={handleClearFilters}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold text-[#8A7D72] transition-colors duration-150 hover:bg-white hover:text-[#6B3E1E] sm:h-10"
      >
        <X
          size={13}
          strokeWidth={1.8}
        />

        <span>
          Reset
        </span>
      </button>
    )}

  </div>

</div>
    </div>
  );
}