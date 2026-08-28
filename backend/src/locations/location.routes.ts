import { Router } from "express";
import {
  getAllLocations,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "./location.repository.js";
import { createLocationSchema, locationIdSchema } from "./location.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";

export const locationRouter = Router();

// Get all locations
locationRouter.get("/", async (_req, res) => {
  try {
    const locations = await getAllLocations();

    res.status(200).json(locations);
  } catch (error) {
    console.error("Failed to get locations", error);
    res.status(500).json({ error: "Failed to get locations" });
  }
});

// Create Location
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

    console.error("Failed to create new Location", error);
    res.status(500).json({ error: "Failed to create new locations" });
  }
});

//Get locations by id
locationRouter.get("/:id", async (req, res) => {
  try {
    const validationResult = locationIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid location ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const location = await getLocationById(validationResult.data);

    if (location === null) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Failed to fetch location", error);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

//Update location
locationRouter.put("/:id", async (req, res) => {
  try {
    const idValidation = locationIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      res.status(400).json({
        error: "Invalid location ID",
        details: idValidation.error.issues,
      });
      return;
    }

    const bodyValidation = createLocationSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        error: "Invalid location data",
        details: bodyValidation.error.issues,
      });
      return;
    }

    const updatedLocation = await updateLocation(
      idValidation.data,
      bodyValidation.data,
    );

    if (updatedLocation === null) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(updatedLocation);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "A location with this code already exists",
      });
      return;
    }

    console.error("Failed to update location", error);
    res.status(500).json({ error: "Failed to update location" });
  }
});

//Delete location
locationRouter.delete("/:id", async (req, res) => {
  try {
    const validationResult = locationIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid location ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const wasDeleted = await deleteLocation(validationResult.data);

    if (!wasDeleted) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({
        error: "Location cannot be deleted because it is still in use",
      });
      return;
    }

    console.error("Failed to delete location", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
});
