import { Router } from "express";
import {
  createChampionshipSeason,
  getAllChampionshipSeasons
} from "./championship-season.repository.js";
import { 
  championshipSeasonIdSchema, 
  createChampionshipSeasonSchema 
} from "./championship-season.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";



export const championshipSeasonsRouter = Router();


championshipSeasonsRouter.get("/", async (_req, res) => {
  try {
    const results = await getAllChampionshipSeasons();

    res.status(200).json(results);
  } catch (error) {
    
    console.error("Failed to fetch championship seasons", error);
    res.status(500).json({ error: "Failed to fetch championship seasons"});
  }
});

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