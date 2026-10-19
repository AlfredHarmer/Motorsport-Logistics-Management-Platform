import { z } from "zod";

const transportMethodSchema = z.enum([
  "air_freight",
  "sea_freight",
  "road_freight_artic",
  "team_transport",
  "other",
]);

export const createEquipmentTransferSchema = z
  .object({
    equipmentId: z.coerce.number().int().positive(),
    originLocationId: z.coerce.number().int().positive(),
    destinationLocationId: z.coerce.number().int().positive(),
    relatedEventId: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional()
      .default(null),
    plannedDeparture: z.iso.datetime({ offset: true }),
    expectedArrival: z.iso.datetime({ offset: true }),
    transportMethod: transportMethodSchema,
    notes: z.string().trim().min(1).nullable().optional().default(null),
  })
  .refine(
    (data) =>
      Date.parse(data.expectedArrival) >= Date.parse(data.plannedDeparture),
    {
      message: "Expected arrival must be on or after planned departure",
      path: ["expectedArrival"],
    },
  )
  .refine(
    (data) => data.originLocationId !== data.destinationLocationId,
    {
      message: "Origin location and destination location must not be the same",
      path: ["destinationLocationId"],
    },
  );

export const equipmentTransferIdSchema = z.coerce.number().int().positive();

export const divertTransferSchema = z.object({
  destinationLocationId: z.coerce.number().int().positive(),
});

export const editEquipmentTransferSchema = z
  .object({
    relatedEventId: z.number().int().positive().nullable(),
    plannedDeparture: z.iso.datetime({ offset: true }),
    expectedArrival: z.iso.datetime({ offset: true }),
    isDelayed: z.boolean(),
    revisedExpectedArrival: z.iso.datetime({ offset: true }).nullable(),
    revisedDeparture: z.iso.datetime({ offset: true }).nullable(),
    delayReason: z.string().trim().min(1).nullable(),
    transportMethod: transportMethodSchema,
    notes: z.string().trim().min(1).nullable(),
  })
  .refine(
    (data) =>
      Date.parse(data.expectedArrival) >= Date.parse(data.plannedDeparture),
    {
      message: "Expected arrival must be on or after planned departure",
      path: ["expectedArrival"],
    },
  )
  .refine(
    (data) =>
      Date.parse(data.revisedExpectedArrival ?? data.expectedArrival) >=
      Date.parse(data.revisedDeparture ?? data.plannedDeparture),
    {
      message: "Effective arrival must be on or after effective departure",
      path: ["revisedExpectedArrival"],
    },
  );