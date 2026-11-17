"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

interface BogoCouponDeleteModalProps {
  isOpen: boolean;
  couponName: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BogoCouponDeleteModal({
  isOpen,
  couponName,
  isDeleting = false,
  onClose,
  onConfirm,
}: BogoCouponDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#29231F]/50 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isDeleting
        ) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="bogo-coupon-delete-title"
        aria-describedby="bogo-coupon-delete-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2
                id="bogo-coupon-delete-title"
                className="text-sm font-semibold text-[#29231F]"
              >
                Delete BOGO Coupon
              </h2>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Confirm your action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close delete confirmation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          <p
            id="bogo-coupon-delete-description"
            className="text-sm leading-6 text-[#665B53]"
          >
            Are you sure you want to delete the BOGO coupon{" "}
            <span className="break-words font-semibold text-[#39312B]">
              &quot;{couponName}&quot;
            </span>
            ?
          </p>

          <div className="mt-4 flex gap-3 rounded-xl border border-red-100 bg-red-50/70 p-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-xs leading-5 text-red-700">
              This action may not be reversible. Customers will
              no longer be able to use this Buy One Get One
              coupon.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/15 bg-white px-4 text-xs font-semibold text-[#665B53] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete Coupon
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}