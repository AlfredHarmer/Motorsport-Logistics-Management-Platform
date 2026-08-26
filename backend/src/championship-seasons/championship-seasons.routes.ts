import { Router } from "express";
import {
  createChampionshipSeason,
  getAllChampionshipSeasons,
  getChampionshipSeasonById,
  updateChampionshipSeason
} from "./championship-season.repository.js";
import { 
  championshipSeasonIdSchema, 
  createChampionshipSeasonSchema 
} from "./championship-season.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";


export const championshipSeasonsRouter = Router();

// Get all championship seasons
championshipSeasonsRouter.get("/", async (_req, res) => {
  try {
    const results = await getAllChampionshipSeasons();

    res.status(200).json(results);
  } catch (error) {
    
    console.error("Failed to fetch championship seasons", error);
    res.status(500).json({ error: "Failed to fetch championship seasons"});
  }
});
//Create championship season
championshipSeasonsRouter.post("/", async (req, res) => {
  try {
    const validationResult = createChampionshipSeasonSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid championship season data",
        details: validationResult.error.issues,
      });
      return;
    }

    const newChampionshipSeason = await createChampionshipSeason(
      validationResult.data,
    );

    res.status(201).json(newChampionshipSeason);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(400).json({
        error: "Championship ID does not exist",
      });
      return;
    }

   console.error("Failed to create championship season", error);
   res.status(500).json({ error: "Failed to create championship season" });
  }
});
//Get championship season by id
championshipSeasonsRouter.get("/:id", async (req, res) => {
  try {
    const validationResult = championshipSeasonIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid championship season ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const championshipSeason = await getChampionshipSeasonById(validationResult.data);

    if (championshipSeason === null) {
      res.status(404).json({ error: "Championship season not found" });
      return;
    }

    return res.status(200).json(championshipSeason);
  } catch (error) {
    console.error("Failed to fetch championship season", error);
    res.status(500).json({ error: "Failed to fetch championship season"});
  }
}); 
//Update championship season
championshipSeasonsRouter.put("/:id", async (req, res) => {
  try {
    const idValidation = championshipSeasonIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      res.status(400).json({
        error: "Invalid championship season ID",
        details: idValidation.error.issues,
      });
      return;
    } 

    const bodyValidation = createChampionshipSeasonSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        error: "Invalid championship season data",
        details: bodyValidation.error.issues,
      });
      return; 
    }

    const updatedChampionshipSeason = await updateChampionshipSeason(
      idValidation.data, 
      bodyValidation.data,
    );

    if (updatedChampionshipSeason === null) {
      res.status(404).json({ error: "Championship season not found"});
      return;
    }

    res.status(200).json(updatedChampionshipSeason);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(400).json({
        error: "Championship ID does not exist",
      });
      return;
    }

    console.error("Failed to update championship season", error);
    res.status(500).json({ error: "Failed to update championship season"});
  }
});