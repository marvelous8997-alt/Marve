
import { z } from "zod";

/* =========================================================
   SHIPMENT STATUS & TRACKING SOURCE
========================================================= */

export const SHIPMENT_STATUSES = [
  "PENDING",
  "READY_TO_SHIP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
  "RETURN_TO_ORIGIN",
] as const;

export const TRACKING_SOURCES = [
  "ADMIN",
  "COURIER",
  "SYSTEM",
] as const;

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_NOTES_LENGTH = 1000;
const MAX_LOCATION_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 1000;

  /* =========================================================
   PACKAGE WEIGHT
========================================================= */

const packageWeightSchema = z
  .number({
    error: "Please enter a valid package weight.",
  })
  .finite()
  .positive("Package weight must be greater than zero.")
  .refine(
    (value) => /^\d+(\.\d{1,3})?$/.test(String(value)),
    "Package weight can have a maximum of 3 decimal places."
  );
/* =========================================================
   ORDER IDENTIFIER
========================================================= */

const orderIdentifierSchema = z
  .union([z.number(), z.string().trim()])
  .refine(
    (value) => {
      if (typeof value === "number") {
        return Number.isSafeInteger(value) && value > 0;
      }

      return value.length > 0 && value.length <= 255;
    },
    "Please select a valid order."
  );

/* =========================================================
   COURIER ID
========================================================= */

const courierIdSchema = z
  .number({
    error: "Please enter a valid courier ID.",
  })
  .int("Courier ID must be a whole number.")
  .positive("Courier ID must be greater than zero.")
  .nullable()
  .optional();

/* =========================================================
   PACKAGE DIMENSIONS
========================================================= */

// Dimensions are entered in centimeters.
// Supports up to 2 decimal places.

const packageDimensionSchema = z
  .number({
    error: "Please enter a valid package dimension.",
  })
  .finite()
  .positive("Package dimension must be greater than zero.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
    "Package dimension can have a maximum of 2 decimal places."
  );

const packageDimensionsSchema = z
  .object({
    length: packageDimensionSchema,
    breadth: packageDimensionSchema,
    height: packageDimensionSchema,
  })
  .strict();

/* =========================================================
   SHIPMENT NOTES
========================================================= */

const shipmentNotesSchema = z
  .string()
  .trim()
  .max(
    MAX_NOTES_LENGTH,
    `Notes cannot exceed ${MAX_NOTES_LENGTH} characters.`
  )
  .nullable()
  .optional();

/* =========================================================
   LOCATION
========================================================= */

const trackingLocationSchema = z
  .string()
  .trim()
  .max(
    MAX_LOCATION_LENGTH,
    `Location cannot exceed ${MAX_LOCATION_LENGTH} characters.`
  )
  .nullable()
  .optional();

/* =========================================================
   TRACKING DESCRIPTION
========================================================= */

const trackingDescriptionSchema = z
  .string()
  .trim()
  .max(
    MAX_DESCRIPTION_LENGTH,
    `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`
  )
  .nullable()
  .optional();

/* =========================================================
   TRACKING EVENT DATE
========================================================= */

const trackingEventDateSchema = z
  .string()
  .datetime({
    error: "Please enter a valid tracking event date.",
  })
  .optional();

/* =========================================================
   TRACKING SOURCE
========================================================= */

const trackingSourceSchema = z
  .enum(TRACKING_SOURCES, {
    error: "Please select a valid tracking source.",
  })
  .optional()
  .default("ADMIN");

/* =========================================================
   SHIPMENT STATUS
========================================================= */

const shipmentStatusSchema = z.enum(
  SHIPMENT_STATUSES,
  {
    error: "Please select a valid shipment status.",
  }
);

/* =========================================================
   CREATE SHIPMENT SCHEMA
========================================================= */

export const createShipmentSchema = z
  .object({
    orderIdentifier: orderIdentifierSchema,
    courierId: courierIdSchema,
    notes: shipmentNotesSchema,
    length: packageDimensionSchema,
    breadth: packageDimensionSchema,
    height: packageDimensionSchema,
    weight: packageWeightSchema,
  })
  .strict();

/* =========================================================
   UPDATE SHIPMENT STATUS SCHEMA
========================================================= */

export const updateShipmentStatusSchema = z
  .object({
    status: shipmentStatusSchema,

    location: trackingLocationSchema,

    description: trackingDescriptionSchema,

    eventAt: trackingEventDateSchema,

    source: trackingSourceSchema,
  })
  .strict();

/* =========================================================
   OTHER SCHEMAS AND TYPES
========================================================= */

export type CreateShipmentFormValues = z.infer<
  typeof createShipmentSchema
>;

export type UpdateShipmentStatusFormValues = z.infer<
  typeof updateShipmentStatusSchema
>;

export type ShipmentStatusValue =
  (typeof SHIPMENT_STATUSES)[number];

export type TrackingSourceValue =
  (typeof TRACKING_SOURCES)[number];
