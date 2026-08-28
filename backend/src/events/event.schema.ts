import { z } from "zod";

export const createEventRecordSchema = z.object({
  code: z.string().trim().min(1).toUpperCase(),
  championshipSeasonId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  locationId: z.coerce.number().int().positive(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  notes: z.string().trim().min(1).nullable().optional().default(null),
})
.refine(
  ({ startDate, endDate }) => endDate >= startDate,
  {
    message: "End date must be on or after start date",
    path: ["endDate"],
  },
);