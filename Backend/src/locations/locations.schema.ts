
import { z } from "zod";

export const createLocationSchema = z.object({
    code: z.string().trim().min(1),
    name: z.string().trim().min(1),
    kind: z.enum([
    "workshop",
    "airport",
    "seaport",
    "warehouse",
    "racetrack",
    "other",
  ]),
  city: z.string().trim().min(1),
  country: z.string().trim().min(1),
});


export const locationIdSchema = z.coerce.number().int().positive();