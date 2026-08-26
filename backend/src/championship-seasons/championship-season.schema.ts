import { z } from "zod";

export const createChampionshipSeasonSchema = z.object({
  championshipId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
})
.refine(
  ({ startDate, endDate }) => endDate >= startDate,
  {
    message: "End date must be on or after start date",
    path: ["endDate"],
  },
);

export const championshipSeasonIdSchema = z.coerce.number().int().positive();

