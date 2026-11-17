
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Package,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Loader2,
  IndianRupee,
} from "lucide-react";

import type {
  OrderDetails,
  OrderItemDetails,
} from "@/src/types/user/order.types";

import ReturnItemSelector from "./ReturnItemSelector";
import ReturnReasonSelect from "./ReturnReasonSelect";
import ReturnImageUpload from "./ReturnImageUpload";

/* =========================
   Types
========================= */

export type ReturnReason =
  | "SIZE_TOO_SMALL"
  | "SIZE_TOO_LARGE"
  | "PRODUCT_DAMAGED"
  | "WRONG_PRODUCT"
  | "PRODUCT_NOT_AS_DESCRIBED"
  | "QUALITY_ISSUE"
  | "OTHER";

export interface ReturnItemSelection {
  orderItemUuid: string;
  quantity: number;
}

export interface ReturnRequestFormData {
  orderUuid: string;
  reason: ReturnReason;
  description: string;
  items: ReturnItemSelection[];
  images: File[];
}

interface ReturnRequestModalProps {
  isOpen: boolean;
  order: OrderDetails | null;
  onClose: () => void;
  onSubmit: (data: ReturnRequestFormData) => Promise<void>;
  isSubmitting?: boolean;
}

/* =========================
   Helpers
========================= */

const MINIMUM_RETURN_ORDER_AMOUNT = 200;

const formatPrice = (amount: number | string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getEligibleItems = (items: OrderItemDetails[]) =>
  items.filter((item) => !item.isFreeGift);

const getItemUuid = (item: OrderItemDetails) =>
  item.uuid || "";
/* =========================
   Component
========================= */

export default function ReturnRequestModal({
  isOpen,
  order,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ReturnRequestModalProps) {
  const [selectedItems, setSelectedItems] = useState<
    ReturnItemSelection[]
  >([]);

  const [reason, setReason] = useState<ReturnReason | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [formError, setFormError] = useState("");

  const orderTotal = Number(order?.totalAmount || 0);

  const eligibleItems = order
    ? getEligibleItems(order.items || [])
    : [];

  const canReturn =
    order?.orderStatus === "DELIVERED" &&
    orderTotal > MINIMUM_RETURN_ORDER_AMOUNT;

  useEffect(() => {
    if (!isOpen) return;

    setSelectedItems([]);
    setReason("");
    setDescription("");
    setImages([]);
    setFormError("");
  }, [isOpen, order?.uuid]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!order.uuid) {
      setFormError("Order information is incomplete. Please refresh and try again.");
      return;
    }

    if (!canReturn) {
      setFormError("This order is not eligible for return.");
      return;
    }

    if (selectedItems.length === 0) {
      setFormError("Please select at least one product to return.");
      return;
    }

    if (!reason) {
      setFormError("Please select a return reason.");
      return;
    }

    try {
      await onSubmit({
        orderUuid: order.uuid,
        reason,
        description: description.trim(),
        items: selectedItems,
        images,
      });
    } catch {
      setFormError("Unable to submit your return request. Please try again.");
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-modal-title"
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE5DF] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
              <RotateCcw size={21} />
            </div>

            <div>
              <h2
                id="return-modal-title"
                className="text-lg font-semibold text-[#39312B] sm:text-xl"
              >
                Request a Return
              </h2>
              <p className="mt-0.5 text-xs text-[#8A7D72]">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close return request"
            className="rounded-full p-2 text-[#8A7D72] transition hover:bg-[#F8F5F0] hover:text-[#39312B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7">
            {/* Order Summary */}
            <section className="rounded-xl border border-[#EAE5DF] bg-[#FCFAF7] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#8A7D72]">
                    Order Total
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xl font-bold text-[#6B3E1E]">
                    <IndianRupee size={18} />
                    {orderTotal.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                  <ShieldCheck size={15} />
                  Delivered Order
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 border-t border-[#EAE5DF] pt-3 text-xs leading-5 text-[#8A7D72]">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <p>
                  Return requests are available only for orders above ₹200.
                  Your request will be reviewed before pickup is arranged.
                </p>
              </div>
            </section>

            {!canReturn && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                This order is not eligible for a return request.
              </div>
            )}

            {/* Products */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#39312B]">
                  Select Products
                </h3>
                <p className="mt-1 text-xs text-[#8A7D72]">
                  Select the products and quantities you want to return.
                  Free gift products cannot be returned.
                </p>
              </div>

              <ReturnItemSelector
                items={eligibleItems}
                selectedItems={selectedItems}
                onChange={setSelectedItems}
                disabled={!canReturn || isSubmitting}
              />
            </section>

            {/* Reason */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-[#39312B]">
                Reason for Return
              </h3>

              <ReturnReasonSelect
                value={reason}
                onChange={setReason}
                disabled={!canReturn || isSubmitting}
              />
            </section>

            {/* Description */}
            <section>
              <label
                htmlFor="return-description"
                className="mb-2 block text-sm font-semibold text-[#39312B]"
              >
                Additional Details
                <span className="ml-1 font-normal text-[#A0958C]">
                  (Optional)
                </span>
              </label>

              <textarea
                id="return-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={5000}
                rows={4}
                disabled={!canReturn || isSubmitting}
                placeholder="Please describe the issue with your product..."
                className="w-full resize-none rounded-xl border border-[#EAE5DF] bg-white px-4 py-3 text-sm text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/10 disabled:bg-gray-50"
              />

              <p className="mt-1 text-right text-xs text-[#A0958C]">
                {description.length}/5000
              </p>
            </section>

            {/* Images */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-[#39312B]">
                Product Images
                <span className="ml-1 font-normal text-[#A0958C]">
                  (Optional, up to 5)
                </span>
              </h3>

              <ReturnImageUpload
                files={images}
                onChange={setImages}
                disabled={!canReturn || isSubmitting}
              />
            </section>

            {/* Error */}
            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                {formError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#EAE5DF] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs text-[#8A7D72]">
              <Package size={14} className="mr-1 inline" />
              Return pickup will be arranged after approval.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border border-[#EAE5DF] px-5 py-2.5 text-sm font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0] disabled:opacity-50 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canReturn || isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#593219] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RotateCcw size={16} />
                    Submit Return Request
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
