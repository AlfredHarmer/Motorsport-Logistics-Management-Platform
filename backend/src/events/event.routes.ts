import { Router } from "express";
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
} from "./event.repository.js";
import { createEventRecordSchema, eventIdSchema } from "./event.schema.js";
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
//Create event
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
      res.status(409).json({
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
// Get event by id
eventsRouter.get("/:id", async (req, res) => {
  try {
    const validationResult = eventIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid event id",
        details: validationResult.error.issues,
      });
      return;
    }

    const event = await getEventById(validationResult.data);

    if (event === null) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Failed to fetch event", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});
// Update event
eventsRouter.put("/:id", async (req, res) => {
  try {
    const idValidation = eventIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      res.status(400).json({
        error: "Invalid event id",
        details: idValidation.error.issues,
      });
      return;
    }
    const bodyValidation = createEventRecordSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        error: "Invalid event data",
        details: bodyValidation.error.issues,
      });
      return;
    }

    const updatedEvent = await updateEvent(
      idValidation.data,
      bodyValidation.data,
    );

    if (updatedEvent === null) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
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

    console.error("Failed to update event", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});
