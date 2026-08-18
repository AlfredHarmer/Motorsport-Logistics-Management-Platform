import { Router } from "express";
import { getAllLocations } from "./location.repository.js";

export const locationRouter = Router();

locationRouter.get("/", async (_req, res) => {
  try {
    const locations = await getAllLocations();

    res.status(200).json(locations);
  } catch (error) {
    console.error("Failed to get locations", error);
    res.status(500).json({ error: "Failed to get locations" });
  }
});
