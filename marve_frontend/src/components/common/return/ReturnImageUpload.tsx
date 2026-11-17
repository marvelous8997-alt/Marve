
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ImagePlus,
  X,
  Upload,
  AlertCircle,
} from "lucide-react";

/* =========================
   Props
========================= */

interface ReturnImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

/* =========================
   Constants
========================= */

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================
   Component
========================= */

export default function ReturnImageUpload({
  files,
  onChange,
  disabled = false,
}: ReturnImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  /* =========================
     File Selection
  ========================= */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);

    setError("");

    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Only JPG, PNG and WebP images are allowed.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Image size must be 5 MB or less.`);
        return;
      }

      const isDuplicate = files.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified
      );

      if (isDuplicate) {
        errors.push(`${file.name}: This image is already selected.`);
        return;
      }

      validFiles.push(file);
    });

    const remainingSlots = MAX_IMAGES - files.length;

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const acceptedFiles = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      errors.push(`You can select only ${remainingSlots} more image(s).`);
    }

    if (acceptedFiles.length > 0) {
      onChange([...files, ...acceptedFiles]);
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    }

    // Allow selecting the same file again after removal.
    event.target.value = "";
  };

  /* =========================
     Remove Image
  ========================= */

  const handleRemove = (index: number) => {
    if (disabled) return;

    onChange(files.filter((_, fileIndex) => fileIndex !== index));
    setError("");
  };

  /* =========================
     Open File Picker
  ========================= */

  const openFilePicker = () => {
    if (disabled || files.length >= MAX_IMAGES) return;

    inputRef.current?.click();
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      {files.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8CEC4] bg-[#FCFAF7] px-5 py-7 text-center transition hover:border-[#A66A32] hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E7DD] text-[#6B3E1E]">
            <ImagePlus size={23} />
          </div>

          <p className="mt-3 text-sm font-semibold text-[#39312B]">
            Upload Product Images
          </p>

          <p className="mt-1 text-xs text-[#8A7D72]">
            Click to browse or select images from your device
          </p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#6B3E1E] shadow-sm">
            <Upload size={13} />
            Choose Images
          </span>

          <p className="mt-2 text-[11px] text-[#A0958C]">
            JPG, PNG or WebP · Maximum 5 MB per image
          </p>
        </button>
      )}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#6B3E1E]">
          Selected Images
        </p>

        <p className="text-xs text-[#8A7D72]">
          {files.length}/{MAX_IMAGES}
        </p>
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {files.map((file, index) => {
            const previewUrl = URL.createObjectURL(file);

            return (
              <ImagePreview
                key={`${file.name}-${file.lastModified}-${index}`}
                file={file}
                previewUrl={previewUrl}
                index={index}
                disabled={disabled}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-[11px] leading-5 text-[#A0958C]">
        Upload clear images showing the product condition or issue.
        These images may help our team review your return request.
      </p>
    </div>
  );
}

/* =========================
   Image Preview
========================= */

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  index: number;
  disabled: boolean;
  onRemove: (index: number) => void;
}

function ImagePreview({
  file,
  previewUrl,
  index,
  disabled,
  onRemove,
}: ImagePreviewProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#EAE5DF] bg-[#F8F5F0]">
      <div className="relative aspect-square">
        <Image
          src={previewUrl}
          alt={`Return product image ${index + 1}`}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, 160px"
          className="object-cover"
        />

        {!disabled && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${file.name}`}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="px-2 py-2">
        <p className="truncate text-[11px] font-medium text-[#39312B]">
          {file.name}
        </p>

        <p className="mt-0.5 text-[10px] text-[#A0958C]">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
