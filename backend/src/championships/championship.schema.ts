import { z } from "zod";

export const createChampionshipSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export const championshipIdSchema = z.coerce.number().int().positive();