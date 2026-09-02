import { z } from "zod";

export const createEquipmentTransferSchema = z.object({
  equipmentId: z.coerce.number().int().positive(),
  originLocationId: z.coerce.number().int().positive(),
  destinationLocationId: z.coerce.number().int().positive(),
  relatedEventId: z.coerce.number().int().positive().nullable().optional().default(null),
  plannedDeparture: z.iso.datetime({ offset: true }),
  expectedArrival: z.iso.datetime({ offset: true }),
  transportMethod: z.enum([
    "air_freight",
    "sea_freight",
    "road_freight_artic",
    "team_transport",
    "other",
  ]),
  notes: z.string().trim().min(1).nullable().optional().default(null),
})
.refine(
  ({ plannedDeparture, expectedArrival }) => Date.parse(expectedArrival) >= Date.parse(plannedDeparture),
  {
    message: "Expected Arrival must be on or after planned departure",
    path: ["expectedArrival"],
  },
)
.refine(
  ({ originLocationId, destinationLocationId }) => originLocationId !== destinationLocationId,
  {
    message: "Origin location and destination location must not be the same",
    path: ["destinationLocationId"],
  },
);

export const equipmentTransferIdSchema = z.coerce.number().int().positive();