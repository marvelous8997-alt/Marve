
"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ReturnRejectModalProps {
  isOpen: boolean;
  returnNumber: string;
  isRejecting?: boolean;
  onClose: () => void;
  onConfirm: (rejectionReason: string) => void;
}

export default function ReturnRejectModal({
  isOpen,
  returnNumber,
  isRejecting = false,
  onClose,
  onConfirm,
}: ReturnRejectModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRejectionReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const reason = rejectionReason.trim();

    if (!reason || isRejecting) return;

    onConfirm(reason);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#29231F]/50 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isRejecting) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="return-reject-title"
        aria-describedby="return-reject-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={20} strokeWidth={1.8} />
            </div>

            <div>
              <h2
                id="return-reject-title"
                className="text-sm font-semibold text-[#29231F]"
              >
                Reject Return Request
              </h2>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Confirm your action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isRejecting}
            aria-label="Close rejection confirmation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          <p
            id="return-reject-description"
            className="text-sm leading-6 text-[#665B53]"
          >
            You are about to reject return request{" "}
            <span className="break-words font-semibold text-[#39312B]">
              &quot;{returnNumber}&quot;
            </span>
            .
          </p>

          <div className="mt-5">
            <label
              htmlFor="rejection-reason"
              className="mb-2 block text-xs font-semibold text-[#39312B]"
            >
              Rejection Reason <span className="text-red-600">*</span>
            </label>

            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter the reason for rejecting this return request..."
              rows={4}
              maxLength={1000}
              disabled={isRejecting}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/15 bg-white px-3 py-3 text-sm text-[#39312B] outline-none transition-colors placeholder:text-[#A0958C] focus:border-[#A66A32] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] text-[#8A7D72]">
                Please provide a clear reason for the customer.
              </p>

              <span className="text-[10px] text-[#8A7D72]">
                {rejectionReason.length}/1000
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-3 rounded-xl border border-red-100 bg-red-50/70 p-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-xs leading-5 text-red-700">
              Once rejected, this return request cannot proceed through the
              normal return and refund process.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isRejecting}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/15 bg-white px-4 text-xs font-semibold text-[#665B53] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isRejecting || !rejectionReason.trim()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRejecting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <X size={14} />
                Reject Return
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
