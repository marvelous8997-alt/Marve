import { z } from "zod";
export const CATEGORY_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export const CATEGORY_ICONS = [
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
const categoryImageSchema = z
  .instanceof(File, {
    message: "Please select a valid image file.",
  })
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    "File size must be 10 MB or less."
  )
  .nullable()
  .optional();

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Please enter a category name.")
  .min(2, "Category name must be at least 2 characters long.")
  .max(150, "Category name cannot exceed 150 characters.");

const categorySlugSchema = z
  .string()
  .trim()
  .min(1, "Please enter a category slug.")
  .min(2, "Category slug must be at least 2 characters long.")
  .max(180, "Category slug cannot exceed 180 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers, and hyphens only."
  );

const categoryDescriptionSchema = z
  .string()
  .trim()
  .max(5000, "Description cannot exceed 5000 characters.")
  .optional()
  .or(z.literal(""));

const categoryIconSchema = z
  .enum(CATEGORY_ICONS)
  .nullable()
  .optional();

const categoryStatusSchema = z.enum(CATEGORY_STATUSES);

const categorySortOrderSchema = z
  .number()
  .int("Sort order must be a whole number.")
  .min(0, "Sort order cannot be negative.");

export const createCategorySchema = z
  .object({
    name: categoryNameSchema,
    slug: categorySlugSchema,
    description: categoryDescriptionSchema,
    icon: categoryIconSchema,
    status: categoryStatusSchema.default("ACTIVE"),
    sort_order: categorySortOrderSchema.default(0),
    image: categoryImageSchema,
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema.optional(),
    slug: categorySlugSchema.optional(),
    description: categoryDescriptionSchema,
    icon: categoryIconSchema,
    status: categoryStatusSchema.optional(),
    sort_order: categorySortOrderSchema.optional(),
    image: categoryImageSchema,
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Please provide at least one field to update.",
    }
  );

export const updateCategoryStatusSchema = z
  .object({
    status: categoryStatusSchema,
  })
  .strict();

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryStatusFormValues = z.infer<typeof updateCategoryStatusSchema>;
export type CategoryIconValue = (typeof CATEGORY_ICONS)[number];
export type CategoryStatusValue = (typeof CATEGORY_STATUSES)[number];