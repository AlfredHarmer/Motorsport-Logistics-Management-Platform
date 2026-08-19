import { Router } from "express";
import { getAllLocations, createLocation } from "./location.repository.js";
import { createLocationSchema } from "./locations.schema.js";

export const locationRouter = Router();
// Handles dupliate locations in the database
const hasDatabaseErrorCode = (error: unknown): error is { code: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
};

locationRouter.get("/", async (_req, res) => {
  try {
    const locations = await getAllLocations();

    res.status(200).json(locations);
  } catch (error) {
    console.error("Failed to get locations", error);
    res.status(500).json({ error: "Failed to get locations" });
  }
});

locationRouter.post("/", async (req, res) => {
  try {
    const validationResult = createLocationSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid location data",
        details: validationResult.error.issues,
      });
      return;
    }

    const newLocation = await createLocation(validationResult.data);

    res.status(201).json(newLocation);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "A location with this code already exists",
      });
      return;
    }

    console.log("Failed to create new Location", error);
    res.status(500).json({ error: "Failed to create new locations" });
  }
});
