"use client";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

interface ReturnApproveModalProps {
  isOpen: boolean;
  returnNumber: string;
  isApproving?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReturnApproveModal({
  isOpen,
  returnNumber,
  isApproving = false,
  onClose,
  onConfirm,
}: ReturnApproveModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#29231F]/50 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isApproving) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="return-approve-title"
        aria-describedby="return-approve-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={20} strokeWidth={1.8} />
            </div>

            <div>
              <h2
                id="return-approve-title"
                className="text-sm font-semibold text-[#29231F]"
              >
                Approve Return Request
              </h2>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Confirm your action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isApproving}
            aria-label="Close approval confirmation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          <p
            id="return-approve-description"
            className="text-sm leading-6 text-[#665B53]"
          >
            Are you sure you want to approve return request{" "}
            <span className="break-words font-semibold text-[#39312B]">
              &quot;{returnNumber}&quot;
            </span>
            ?
          </p>

          <div className="mt-4 flex gap-3 rounded-xl border border-green-100 bg-green-50/70 p-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <p className="text-xs leading-5 text-green-800">
              Approving this request will allow the return process to proceed
              to the reverse pickup stage. Please verify the request details
              before continuing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isApproving}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/15 bg-white px-4 text-xs font-semibold text-[#665B53] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isApproving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApproving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Approve Return
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}