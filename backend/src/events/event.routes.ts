import { Router } from "express";
import {
  getAllEvents,
  createEvent,
} from "./event.repository.js";
import { createEventRecordSchema } from "./event.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";

export const eventsRouter = Router();
//Get all events
eventsRouter.get("/", async (_req, res) => {
  try {
    const events = await getAllEvents();

    res.status(200).json(events);
  } catch (error) {
    console.error("Failed to fetch events", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

eventsRouter.post("/", async (req, res) => {
  try {
    const validationResult = createEventRecordSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid event data",
        details: validationResult.error.issues,
      });
      return;
    }

    const newEvent = await createEvent(validationResult.data);

    res.status(201).json(newEvent);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(400).json({
        error: "An event with this code already exists",
      });
      return;
    }

    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({
        error: "Location or championship season ID do not exist",
      });
      return;
    }

    console.error("Failed to create event", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});