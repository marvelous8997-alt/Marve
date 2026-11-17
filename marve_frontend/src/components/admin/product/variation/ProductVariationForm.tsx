
"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Layers3,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import type {
  ProductVariationAttributes,
  ProductVariationBulkItem,
  ProductVariationStatus,
} from "@/src/types/admin/productVariation.types";

import type {
  BulkCreateProductVariationsFormValues,
} from "@/src/validations/admin/productVariation.validation";

/* =========================================================
   TYPES
========================================================= */

interface ProductVariationBulkFormProps {
  product?: {
    id: number | string;
    name: string;
    sku?: string | null;
  } | null;

  onSubmit: (
    data: BulkCreateProductVariationsFormValues
  ) => void | Promise<void>;

  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface AttributeOption {
  id: string;
  name: string;
  values: string[];
}

interface GeneratedVariation {
  id: string;
  name: string;
  sku: string;
  attributes: ProductVariationAttributes;
  price: string;
  compare_at_price: string;
  stock: string;
  status: ProductVariationStatus;
  sort_order: string;
}

interface FieldErrors {
  [key: string]: string;
}

/* =========================================================
   CONSTANTS & HELPERS
========================================================= */

const COMMON_ATTRIBUTES = [
  "Size",
  "Color",
  "Capacity",
  "Material",
  "Style",
  "Finish",
  "Pattern",
  "Shape",
];

const MAX_VARIATIONS = 100;
const MAX_PRICE = 99_999_999.99;
const MAX_INTEGER = 4_294_967_295;

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanValues(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter((value) => {
      if (!value) return false;

      const normalized = value.toLowerCase();

      if (seen.has(normalized)) return false;

      seen.add(normalized);
      return true;
    });
}

function buildCombinations(
  attributes: AttributeOption[],
): ProductVariationAttributes[] {
  return attributes.reduce<ProductVariationAttributes[]>(
    (combinations, attribute) => {
      const next: ProductVariationAttributes[] = [];

      for (const combination of combinations) {
        for (const value of attribute.values) {
          next.push({
            ...combination,
            [attribute.name.trim()]: value,
          });
        }
      }

      return next;
    },
    [{}],
  );
}

function buildVariationName(
  attributes: ProductVariationAttributes,
) {
  return Object.entries(attributes)
    .map(([name, value]) => `${name}: ${String(value)}`)
    .join(" / ");
}

function createSku(
  productSku: string | null | undefined,
  productId: number,
  attributes: ProductVariationAttributes,
  index: number,
) {
  const prefix =
    slugify(productSku || `MAR-${productId}`) || `MAR-${productId}`;

  const suffix = Object.values(attributes)
    .map((value) => slugify(String(value)))
    .filter(Boolean)
    .join("-");

  return `${prefix}-${suffix || `VAR-${index + 1}`}`;
}

function attributesKey(
  attributes: ProductVariationAttributes,
) {
  return JSON.stringify(
    Object.entries(attributes).sort(([a], [b]) =>
      a.localeCompare(b),
    ),
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductVariationBulkForm({
  product = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductVariationBulkFormProps) {
  const [attributeOptions, setAttributeOptions] =
    useState<AttributeOption[]>([
      {
        id: createId(),
        name: "Size",
        values: ["Small", "Medium", "Large"],
      },
      {
        id: createId(),
        name: "Color",
        values: ["Black", "White"],
      },
    ]);

  const [variations, setVariations] = useState<
    GeneratedVariation[]
  >([]);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");

  const productId = Number(product?.id);

  const combinationCount = useMemo(() => {
    const validAttributes = attributeOptions
      .map((attribute) => ({
        ...attribute,
        name: attribute.name.trim(),
        values: cleanValues(attribute.values),
      }))
      .filter(
        (attribute) =>
          attribute.name && attribute.values.length > 0,
      );

    if (!validAttributes.length) return 0;

    return validAttributes.reduce(
      (count, attribute) => count * attribute.values.length,
      1,
    );
  }, [attributeOptions]);

  /* =======================================================
     ATTRIBUTE EDITING
  ======================================================= */

  function addAttribute() {
    setAttributeOptions((current) => [
      ...current,
      {
        id: createId(),
        name: "",
        values: [""],
      },
    ]);

    setGeneralError("");
  }

  function removeAttribute(id: string) {
    setAttributeOptions((current) =>
      current.filter((attribute) => attribute.id !== id),
    );

    setErrors({});
    setGeneralError("");
  }

  function updateAttributeName(
    id: string,
    name: string,
  ) {
    setAttributeOptions((current) =>
      current.map((attribute) =>
        attribute.id === id
          ? { ...attribute, name }
          : attribute,
      ),
    );

    setErrors({});
    setGeneralError("");
  }

  function addAttributeValue(id: string) {
    setAttributeOptions((current) =>
      current.map((attribute) =>
        attribute.id === id
          ? {
              ...attribute,
              values: [...attribute.values, ""],
            }
          : attribute,
      ),
    );

    setGeneralError("");
  }

  function updateAttributeValue(
    id: string,
    valueIndex: number,
    value: string,
  ) {
    setAttributeOptions((current) =>
      current.map((attribute) =>
        attribute.id === id
          ? {
              ...attribute,
              values: attribute.values.map((item, index) =>
                index === valueIndex ? value : item,
              ),
            }
          : attribute,
      ),
    );

    setGeneralError("");
  }

  function removeAttributeValue(
    id: string,
    valueIndex: number,
  ) {
    setAttributeOptions((current) =>
      current.map((attribute) =>
        attribute.id === id
          ? {
              ...attribute,
              values: attribute.values.filter(
                (_, index) => index !== valueIndex,
              ),
            }
          : attribute,
      ),
    );

    setGeneralError("");
  }

  /* =======================================================
     GENERATE COMBINATIONS
  ======================================================= */

  function generateCombinations() {
    const nextErrors: FieldErrors = {};
    const normalizedAttributes = attributeOptions.map(
      (attribute) => ({
        ...attribute,
        name: attribute.name.trim(),
        values: cleanValues(attribute.values),
      }),
    );

    if (!productId || !Number.isSafeInteger(productId) || productId < 1) {
      nextErrors.product = "Please select a valid product.";
    }

    if (normalizedAttributes.length === 0) {
      nextErrors.attributes =
        "Add at least one attribute.";
    }

    const attributeNames = normalizedAttributes
      .map((attribute) => attribute.name.toLowerCase())
      .filter(Boolean);

    if (
      new Set(attributeNames).size !== attributeNames.length
    ) {
      nextErrors.attributes =
        "Attribute names must be unique.";
    }

    normalizedAttributes.forEach((attribute) => {
      if (!attribute.name) {
        nextErrors.attributes =
          "Enter a name for every attribute.";
      }

      if (attribute.values.length === 0) {
        nextErrors.attributes =
          "Add at least one non-empty value to every attribute.";
      }

      if (
        attribute.values.some(
          (value) => value.length > 255,
        )
      ) {
        nextErrors.attributes =
          "Attribute values must be 255 characters or fewer.";
      }

      if (attribute.name.length > 100) {
        nextErrors.attributes =
          "Attribute names must be 100 characters or fewer.";
      }
    });

    const validAttributes = normalizedAttributes.filter(
      (attribute) =>
        attribute.name && attribute.values.length > 0,
    );

    const count = validAttributes.reduce(
      (total, attribute) => total * attribute.values.length,
      1,
    );

    if (count > MAX_VARIATIONS) {
      nextErrors.attributes =
        `These options generate ${count} combinations. The maximum is ${MAX_VARIATIONS}.`;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setGeneralError("");
      return;
    }

    const combinations = buildCombinations(validAttributes);
    const previousByKey = new Map(
      variations.map((variation) => [
        attributesKey(variation.attributes),
        variation,
      ]),
    );

    const generated = combinations.map(
      (attributes, index): GeneratedVariation => {
        const previous = previousByKey.get(
          attributesKey(attributes),
        );

        return {
          id: previous?.id ?? createId(),
          name: buildVariationName(attributes),
          sku:
            previous?.sku ??
            createSku(
              product?.sku,
              productId,
              attributes,
              index,
            ),
          attributes,
          price: previous?.price ?? "",
          compare_at_price:
            previous?.compare_at_price ?? "",
          stock: previous?.stock ?? "0",
          status: previous?.status ?? "ACTIVE",
          sort_order: previous?.sort_order ?? String(index + 1),
        };
      },
    );

    setVariations(generated);
    setGeneralError("");
  }

  /* =======================================================
     UPDATE GENERATED ROW
  ======================================================= */

  function updateVariation(
    id: string,
    field: keyof Omit<GeneratedVariation, "id" | "attributes">,
    value: string,
  ) {
    setVariations((current) =>
      current.map((variation) =>
        variation.id === id
          ? {
              ...variation,
              [field]:
                field === "sku" ? value.toUpperCase() : value,
            }
          : variation,
      ),
    );

    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      delete next.submit;
      return next;
    });

    setGeneralError("");
  }

  function removeVariation(id: string) {
    setVariations((current) =>
      current
        .filter((variation) => variation.id !== id)
        .map((variation, index) => ({
          ...variation,
          sort_order: String(index + 1),
        })),
    );

    setGeneralError("");
  }

  /* =======================================================
     VALIDATION & SUBMIT
  ======================================================= */

  function validateVariations() {
    const nextErrors: FieldErrors = {};
    const skuSet = new Set<string>();

    if (!productId || !Number.isSafeInteger(productId) || productId < 1) {
      nextErrors.product = "Please select a valid product.";
    }

    if (variations.length === 0) {
      nextErrors.submit =
        "Generate at least one variation before submitting.";
    }

    if (variations.length > MAX_VARIATIONS) {
      nextErrors.submit =
        `You can submit at most ${MAX_VARIATIONS} variations at once.`;
    }

    variations.forEach((variation, index) => {
      const rowErrors: string[] = [];

      if (!variation.name.trim()) {
        rowErrors.push("Name is required.");
      }

      if (!variation.sku.trim()) {
        rowErrors.push("SKU is required.");
      } else {
        const normalizedSku = variation.sku.trim().toLowerCase();

        if (skuSet.has(normalizedSku)) {
          rowErrors.push("SKU must be unique in this batch.");
        }

        skuSet.add(normalizedSku);
      }

      if (
        variation.price.trim() === "" ||
        !/^\d+(\.\d{1,2})?$/.test(variation.price.trim()) ||
        !Number.isFinite(Number(variation.price)) ||
        Number(variation.price) < 0 ||
        Number(variation.price) > MAX_PRICE
      ) {
        rowErrors.push("Enter a valid price (up to 2 decimals).");
      }

      if (variation.compare_at_price.trim() !== "") {
        const compareAt = Number(variation.compare_at_price);
        const price = Number(variation.price);

        if (
          !/^\d+(\.\d{1,2})?$/.test(
            variation.compare_at_price.trim(),
          ) ||
          !Number.isFinite(compareAt) ||
          compareAt < 0 ||
          compareAt > MAX_PRICE
        ) {
          rowErrors.push("Compare price is invalid.");
        } else if (
          Number.isFinite(price) &&
          compareAt < price
        ) {
          rowErrors.push(
            "Compare price must be at least the selling price.",
          );
        }
      }

      if (
        variation.stock.trim() === "" ||
        !/^\d+$/.test(variation.stock.trim()) ||
        !Number.isSafeInteger(Number(variation.stock)) ||
        Number(variation.stock) > MAX_INTEGER
      ) {
        rowErrors.push("Stock must be a whole number ≥ 0.");
      }

      if (
        variation.sort_order.trim() === "" ||
        !/^\d+$/.test(variation.sort_order.trim()) ||
        !Number.isSafeInteger(Number(variation.sort_order)) ||
        Number(variation.sort_order) > MAX_INTEGER
      ) {
        rowErrors.push("Sort order must be a whole number ≥ 0.");
      }

      if (
        !variation.attributes ||
        Object.keys(variation.attributes).length === 0
      ) {
        rowErrors.push("At least one attribute is required.");
      }

      if (rowErrors.length) {
        nextErrors[variation.id] =
          `Variation ${index + 1}: ${rowErrors.join(" ")}`;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setGeneralError("");

    if (!validateVariations()) {
      setGeneralError(
        "Please correct the highlighted errors before submitting.",
      );
      return;
    }

    try {
      await onSubmit({
        product_id: productId,
        variations: variations.map((variation) => ({
          name: variation.name.trim(),
          sku: variation.sku.trim(),
          attributes: variation.attributes,
          price: Number(variation.price),
          compare_at_price:
            variation.compare_at_price.trim() === ""
              ? null
              : Number(variation.compare_at_price),
          stock: Number(variation.stock),
          status: variation.status,
          sort_order: Number(variation.sort_order),
        })),
      });
    } catch {
      setGeneralError(
        "Unable to create variations. Please review the form and try again.",
      );
    }
  }

  const inputClass =
    "h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/5 disabled:cursor-not-allowed disabled:bg-[#F8F5F0]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* PRODUCT */}
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
            <Package size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Product
            </h3>
            <p className="mt-1 text-xs text-[#8A7D72]">
              All generated variations will belong to this product.
            </p>
          </div>

          <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[10px] font-semibold text-[#6B3E1E]">
            Bulk Create
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]">
            Selected product
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#29231F]">
            {product?.name ?? "No product selected"}
          </p>
          {product?.sku && (
            <p className="mt-1 text-xs text-[#8A7D72]">
              SKU: {product.sku}
            </p>
          )}
          {errors.product && (
            <p className="mt-2 text-xs text-red-500">
              {errors.product}
            </p>
          )}
        </div>
      </section>

      {/* ATTRIBUTE CONFIGURATION */}
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
              <Layers3 size={17} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#29231F]">
                Variation Attributes
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                Add attribute values to generate every combination automatically.
              </p>
            </div>
          </div>

          <span className="rounded-lg bg-[#F8F5F0] px-3 py-2 text-xs font-semibold text-[#6B3E1E]">
            {combinationCount} combination
            {combinationCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {attributeOptions.map((attribute, attributeIndex) => (
            <div
              key={attribute.id}
              className="rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/50 p-3 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#6B3E1E]">
                  Attribute {attributeIndex + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeAttribute(attribute.id)}
                  disabled={isSubmitting || attributeOptions.length === 1}
                  aria-label={`Remove attribute ${attributeIndex + 1}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-3">
                <label
                  htmlFor={`attribute-name-${attribute.id}`}
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                >
                  Attribute name
                </label>

                <div className="relative">
                  <select
                    id={`attribute-name-${attribute.id}`}
                    value={
                      COMMON_ATTRIBUTES.includes(attribute.name)
                        ? attribute.name
                        : attribute.name
                          ? "CUSTOM"
                          : ""
                    }
                    onChange={(event) =>
                      updateAttributeName(
                        attribute.id,
                        event.target.value === "CUSTOM"
                          ? ""
                          : event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    <option value="">Select attribute</option>
                    {COMMON_ATTRIBUTES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                    <option value="CUSTOM">Custom attribute</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
                  />
                </div>

                {(!COMMON_ATTRIBUTES.includes(attribute.name) ||
                  attribute.name === "") && (
                  <input
                    value={attribute.name}
                    onChange={(event) =>
                      updateAttributeName(
                        attribute.id,
                        event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    placeholder="Enter custom attribute name"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]">
                    Values
                  </label>
                  <button
                    type="button"
                    onClick={() => addAttributeValue(attribute.id)}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-[#6B3E1E] transition hover:bg-[#6B3E1E]/5"
                  >
                    <Plus size={12} />
                    Add value
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {attribute.values.map((value, valueIndex) => (
                    <div
                      key={`${attribute.id}-${valueIndex}`}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={value}
                        onChange={(event) =>
                          updateAttributeValue(
                            attribute.id,
                            valueIndex,
                            event.target.value,
                          )
                        }
                        disabled={isSubmitting}
                        placeholder={`Value ${valueIndex + 1}`}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeAttributeValue(
                            attribute.id,
                            valueIndex,
                          )
                        }
                        disabled={
                          isSubmitting ||
                          attribute.values.length === 1
                        }
                        aria-label={`Remove value ${valueIndex + 1}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#8A7D72] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors.attributes && (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-red-500">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {errors.attributes}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={addAttribute}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/15 bg-white px-4 text-xs font-semibold text-[#6B3E1E] transition hover:bg-[#F8F5F0] disabled:opacity-50"
          >
            <Plus size={14} />
            Add attribute
          </button>

          <button
            type="button"
            onClick={generateCombinations}
            disabled={isSubmitting}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#A66A32] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WandSparkles size={15} />
            Generate combinations
          </button>
        </div>

        <p className="mt-3 text-[10px] leading-4 text-[#8A7D72]">
          Example: 3 sizes × 2 colors = 6 variations. A maximum of 100
          combinations can be submitted in one request.
        </p>
      </section>

      {/* GENERATED VARIATIONS */}
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Generated Variations
            </h3>
            <p className="mt-1 text-xs text-[#8A7D72]">
              Review each SKU, price and inventory before saving.
            </p>
          </div>

          <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-xs font-semibold text-[#6B3E1E]">
            {variations.length} rows
          </span>
        </div>

        {variations.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-[#6B3E1E]/20 bg-[#F8F5F0]/40 px-4 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
              <Sparkles size={20} />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#29231F]">
              No variations generated yet
            </p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-[#8A7D72]">
              Configure your attributes above, then click Generate combinations.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {variations.map((variation, index) => (
              <div
                key={variation.id}
                className="rounded-xl border border-[#6B3E1E]/10 p-3 sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8 text-xs font-bold text-[#6B3E1E]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-xs font-semibold text-[#29231F]">
                        {variation.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(variation.attributes).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="rounded-md bg-[#F8F5F0] px-2 py-1 text-[10px] text-[#6B3E1E]"
                            >
                              {key}: {String(value)}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVariation(variation.id)}
                    disabled={isSubmitting}
                    aria-label={`Remove variation ${index + 1}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {errors[variation.id] && (
                  <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-red-50 p-2 text-[10px] leading-4 text-red-600">
                    <AlertCircle size={12} className="mt-0.5 shrink-0" />
                    {errors[variation.id]}
                  </p>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label
                      htmlFor={`name-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      Variation name
                    </label>
                    <input
                      id={`name-${variation.id}`}
                      value={variation.name}
                      onChange={(event) =>
                        updateVariation(
                          variation.id,
                          "name",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`sku-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      SKU
                    </label>
                    <input
                      id={`sku-${variation.id}`}
                      value={variation.sku}
                      onChange={(event) =>
                        updateVariation(
                          variation.id,
                          "sku",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`price-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      Price (₹)
                    </label>
                    <input
                      id={`price-${variation.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={variation.price}
                      onChange={(event) =>
                        updateVariation(
                          variation.id,
                          "price",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      placeholder="e.g. 1399"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`compare-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      Compare at price (₹)
                    </label>
                    <input
                      id={`compare-${variation.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={variation.compare_at_price}
                      onChange={(event) =>
                        updateVariation(
                          variation.id,
                          "compare_at_price",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`stock-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      Stock quantity
                    </label>
                    <input
                      id={`stock-${variation.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={variation.stock}
                      onChange={(event) =>
                        updateVariation(
                          variation.id,
                          "stock",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`status-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id={`status-${variation.id}`}
                        value={variation.status}
                        onChange={(event) =>
                          updateVariation(
                            variation.id,
                            "status",
                            event.target.value,
                          )
                        }
                        disabled={isSubmitting}
                        className={`${inputClass} appearance-none pr-9`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`sort-${variation.id}`}
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#8A7D72]"
                    >
                      Sort order
                    </label>
                    <input
                      id={`sort-${variation.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={variation.sort_order}
                      onChange={(event) =>
                        updateVariation(
                          variation.id,
                          "sort_order",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FORM ERROR */}
      {generalError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-600"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => {
            setVariations([]);
            setErrors({});
            setGeneralError("");
          }}
          disabled={isSubmitting || variations.length === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#665B53] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw size={14} />
          Clear generated rows
        </button>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-5 text-xs font-semibold text-[#665B53] transition hover:bg-[#F8F5F0] disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || variations.length === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#A66A32] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Creating variations...
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                Create {variations.length} variations
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
