import { z } from "zod";
export const SUBCATEGORY_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export const SUBCATEGORY_ICONS = [
  "CookingPot",
  "ChefHat",
  "Utensils",
  "UtensilsCrossed",
  "Soup",
  "Salad",
  "Wheat",
  "Egg",
  "Pizza",
  "CakeSlice",
  "Coffee",
  "Wine",
  "Microwave",
  "Container",
  "Archive",
  "Package",
  "Boxes",
  "Box",
  "Layers",
  "CupSoda",
  "GlassWater",
  "House",
  "Wrench",
  "Hammer",
  "Brush",
  "SprayCan",
  "Trash2",
  "Sparkles",
  "Flower2",
  "Lamp",
  "Frame",
  "Palette",
  "Heart",
  "Cake",
  "Lightbulb",
  "LampCeiling",
  "LampDesk",
  "Sun",
  "LightbulbOff",
] as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const subcategoryImageSchema = z
  .instanceof(File, {
    message: "Please select a valid image file.",
  })
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    "File size must be 10 MB or less."
  )
  .nullable()
  .optional();

const subcategoryCategoryIdSchema = z
  .union([z.number(), z.string()])
  .refine(
    (value) => {
      if (typeof value === "number") {
        return Number.isInteger(value) && value > 0;
      }
      const id = value.trim();
      if (!id) return false;
      return (
        /^[1-9]\d*$/.test(id) ||
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      );
    },
    "Please select a valid parent category.",
  );

const subcategoryNameSchema = z
  .string()
  .trim()
  .min(1, "Please enter a subcategory name.")
  .min(2, "Subcategory name must be at least 2 characters long.")
  .max(150, "Subcategory name cannot exceed 150 characters.");

const subcategorySlugSchema = z
  .string()
  .trim()
  .min(1, "Please enter a subcategory slug.")
  .min(2, "Subcategory slug must be at least 2 characters long.")
  .max(180, "Subcategory slug cannot exceed 180 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers, and hyphens only."
  );

const subcategoryDescriptionSchema = z
  .string()
  .trim()
  .max(5000, "Description cannot exceed 5000 characters.")
  .optional()
  .or(z.literal(""));

const subcategoryIconSchema = z
  .enum(SUBCATEGORY_ICONS)
  .nullable()
  .optional();

const subcategoryStatusSchema = z.enum(SUBCATEGORY_STATUSES);

const subcategorySortOrderSchema = z
  .number()
  .int("Sort order must be a whole number.")
  .min(0, "Sort order cannot be negative.");

export const createSubcategorySchema = z
  .object({
    category_id: subcategoryCategoryIdSchema,
    name: subcategoryNameSchema,
    slug: subcategorySlugSchema,
    description: subcategoryDescriptionSchema,
    icon: subcategoryIconSchema,
    status: subcategoryStatusSchema.default("ACTIVE"),
    sort_order: subcategorySortOrderSchema.default(0),
    image: subcategoryImageSchema,
  })
  .strict();

export const updateSubcategorySchema = z
  .object({
    category_id: subcategoryCategoryIdSchema.optional(),
    name: subcategoryNameSchema.optional(),
    slug: subcategorySlugSchema.optional(),
    description: subcategoryDescriptionSchema,
    icon: subcategoryIconSchema,
    status: subcategoryStatusSchema.optional(),
    sort_order: subcategorySortOrderSchema.optional(),
    image: subcategoryImageSchema,
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Please provide at least one field to update.",
    }
  );

export const updateSubcategoryStatusSchema = z
  .object({
    status: subcategoryStatusSchema,
  })
  .strict();

export type CreateSubcategoryFormValues = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategoryFormValues = z.infer<typeof updateSubcategorySchema>;
export type UpdateSubcategoryStatusFormValues = z.infer<typeof updateSubcategoryStatusSchema>;
export type SubcategoryIconValue = (typeof SUBCATEGORY_ICONS)[number];
export type SubcategoryStatusValue = (typeof SUBCATEGORY_STATUSES)[number];