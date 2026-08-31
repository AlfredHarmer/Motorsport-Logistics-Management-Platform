import { z } from "zod";

export const createEquipmentSchema = z.object({
  code: z.string().trim().min(1).toUpperCase(),
  name: z.string().trim().min(1),
  category: z.enum([
    "pit_stop_rig",
    "garage_pneumatics",
    "fueling",
    "personnel",
    "engineering",
    "other",
  ]),
  currentLocationId: z.coerce.number().int().positive(),
  conditionStatus: z.enum([
    "available",
    "under_service",
    "out_of_service",
  ]).default("available"),
  notes: z.string().trim().min(1).nullable().optional().default(null),
});

export const equipmentIdSchema = z.coerce.number().int().positive();
