import { Router } from "express";
import {
  createChampionship,
  getAllChampionships,
  getChampionshipById,
} from "./championship.repository.js";
import { 
  championshipIdSchema, 
  createChampionshipSchema 
} from "./championship.schema.js";

export const championshipsRouter = Router();


const hasDatabaseErrorCode = (error: unknown): error is { code: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
};
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
