import { Router } from "express";
import {
  getAllEvents,
} from "./event.repository.js";

export const eventsRouter = Router();

eventsRouter.get("/", async (_req, res) => {
  try {
    const events = await getAllEvents();

    res.status(200).json(events);
  } catch (error) {
    console.error("Failed to fetch events", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});