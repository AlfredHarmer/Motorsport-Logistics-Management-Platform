import { Router } from "express";
import {
  createChampionship,
  deleteChampionship,
  getAllChampionships,
  getChampionshipById,
  updateChampionship,
} from "./championship.repository.js";
import { 
  championshipIdSchema, 
  createChampionshipSchema 
} from "./championship.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";

export const championshipsRouter = Router();



// Get all championships
championshipsRouter.get("/", async (_req, res) => {
  try {
    const championships = await getAllChampionships();

    res.status(200).json(championships);
  } catch (error) {
    console.error("Failed to fetch championships", error);
    res.status(500).json({ error: "Failed to fetch championships" });
  }
});
//Create new championship
championshipsRouter.post("/", async (req, res) => {
  try {
    const validationResult = createChampionshipSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid championship data",
        details: validationResult.error.issues,
      });
      return;
    }

    const newChampionship = await createChampionship(validationResult.data);

    res.status(201).json(newChampionship);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "A championship with this code already exists",
      });
      return;
    }

    console.error("Failed to create new championship", error);
    res.status(500).json({ error: "Failed to create new championship" });
  }
});
// Get Championship by ID
championshipsRouter.get("/:id", async (req, res) => {
  try {
    const validationResult = championshipIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid championship ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const championship = await getChampionshipById(validationResult.data);

    if (championship === null) {
      res.status(404).json({ error: "No championship found"});
      return;
    }

    res.status(200).json(championship);
  } catch (error) {
    console.error("Failed to fetch championship", error);
    res.status(500).json({ error: "Failed to fetch championship"});
  }
});
// Update championship
championshipsRouter.put("/:id", async (req, res) => {
  try {
    const idValidation = championshipIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      res.status(400).json({
        error: "Invalid championship ID",
        details: idValidation.error.issues,
      });
      return;
    }

    const bodyValidation = createChampionshipSchema.safeParse(req.body);
  
    if (!bodyValidation.success) {
      res.status(400).json({
        error: "Invalid championship data",
        details: bodyValidation.error.issues,
      });
      return;
    }

    const updatedChampionship = await updateChampionship(
      idValidation.data, 
      bodyValidation.data
    );

    if (updatedChampionship === null) {
      res.status(404).json({ error: "Championship not found" });
      return;
    }

    res.status(200).json(updatedChampionship);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "A championship with this code already exists",
      });
      return;
    }

    console.error("Failed to update championship", error);
    res.status(500).json({ error: "Failed to update championship" });
  }
});
// Delete championship
championshipsRouter.delete("/:id", async (req, res) => {
  try {
    const validationResult = championshipIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid championship ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const wasDeleted = await deleteChampionship(validationResult.data);

    if (!wasDeleted) {
      res.status(404).json({ error: "Championship not found"});
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({
        error: "Championship cannot be deleted because it is still in use",
      });
      return;
    }
    
    console.error("Failed to delete championship", error );
    res.status(500).json({ error: "Failed to delete championship"});
  }
});
