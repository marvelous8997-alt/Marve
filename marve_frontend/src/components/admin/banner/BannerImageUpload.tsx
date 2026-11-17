"use client";

import {
  ImagePlus,
  Upload,
  X,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

/* ========================= Props ========================= */

interface BannerImageUploadProps {
  value?: string;
  onChange?: (file: File | null, previewUrl: string) => void;
  onRemove?: () => void;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  aspectRatio?: "wide" | "square" | "portrait";
}

/* ========================= Component ========================= */

export default function BannerImageUpload({
  value = "",
  onChange,
  onRemove,
  label = "Banner Image",
  description = "Upload a high-quality banner image for your storefront.",
  required = false,
  disabled = false,
  aspectRatio = "wide",
}: BannerImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string>(value);

  const [error, setError] =
    useState<string>("");

  /* ========================= Sync Existing Image ========================= */

  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  /* ========================= Aspect Ratio ========================= */

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
        ? "aspect-[4/5]"
        : "aspect-[16/7]";

  /* ========================= Open File Picker ========================= */

  const handleOpenPicker = () => {
    if (disabled) return;

    inputRef.current?.click();
  };

  /* ========================= File Change ========================= */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    /* ========================= File Type ========================= */

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, or WebP image.",
      );

      event.target.value = "";
      return;
    }

    /* ========================= File Size ========================= */

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 10 MB.",
      );

      event.target.value = "";
      return;
    }

    /* ========================= Preview ========================= */

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    onChange?.(
      file,
      objectUrl,
    );

    /* ========================= Cleanup ========================= */

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  };

  /* ========================= Remove Image ========================= */

  const handleRemove = () => {
    if (disabled) return;

    setPreviewUrl("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(null, "");
    onRemove?.();
  };

  /* ========================= Render ========================= */

  return (
    <div className="space-y-2.5">
      {/* ========================= Label ========================= */}

      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="text-xs font-semibold text-[#29231F]">
            {label}

            {required && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}
          </label>

          <p className="mt-0.5 text-[10px] leading-4 text-[#A0958C]">
            {description}
          </p>
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={handleOpenPicker}
            disabled={disabled}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#6B3E1E]/10 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={12}
              strokeWidth={1.8}
            />

            Change
          </button>
        )}
      </div>

      {/* ========================= Hidden Input ========================= */}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {/* ========================= Image Preview ========================= */}

      {previewUrl ? (
        <div
          className={`group relative w-full overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] ${aspectClass}`}
        >
          <Image
            src={previewUrl}
            alt="Banner preview"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />

          {/* Image Actions */}

          <div className="absolute right-3 top-3 flex items-center gap-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
            {/* Change */}

            <button
              type="button"
              onClick={handleOpenPicker}
              disabled={disabled}
              aria-label="Change banner image"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-[#6B3E1E] shadow-md backdrop-blur-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                strokeWidth={1.8}
              />
            </button>

            {/* Remove */}

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove banner image"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-red-600 shadow-md backdrop-blur-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={15}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Preview Label */}

          <div className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
            Banner Preview
          </div>
        </div>
      ) : (
        /* ========================= Empty Upload State ========================= */

        <button
          type="button"
          onClick={handleOpenPicker}
          disabled={disabled}
          className={`group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#6B3E1E]/20 bg-[#F8F5F0]/60 px-5 py-10 text-center transition-all duration-200 hover:border-[#6B3E1E]/35 hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50 ${aspectClass}`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6B3E1E]/8 transition-colors group-hover:bg-[#6B3E1E]/12">
            <ImagePlus
              size={20}
              strokeWidth={1.6}
              className="text-[#6B3E1E]"
            />
          </div>

          <p className="mt-3 text-xs font-semibold text-[#29231F]">
            Upload Banner Image
          </p>

          <p className="mt-1 text-[10px] text-[#A0958C]">
            JPG, PNG or WebP · Max 10 MB
          </p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-[#6B3E1E] shadow-sm">
            <Upload
              size={12}
              strokeWidth={1.8}
            />

            Choose Image
          </span>
        </button>
      )}

      {/* ========================= Error ========================= */}

      {error && (
        <p className="text-[10px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}