import { pool } from "../database.js";
import type {
  ChampionshipSeason,
  CreateChampionshipSeasonInput,
} from "./championship-season.types.js";

export const getAllChampionshipSeasons = 
async (): Promise<ChampionshipSeason[]> => {
  const result = await pool.query<ChampionshipSeason>(
    `SELECT
     id, 
     championship_id AS "championshipId", 
     name, 
     start_date::text AS "startDate", 
     end_date::text AS "endDate"
    FROM championship_seasons
    ORDER BY start_date`,
  );
  return result.rows;
};

export const createChampionshipSeason = async (
  input: CreateChampionshipSeasonInput,
): Promise<ChampionshipSeason> => {
  const result = await pool.query<ChampionshipSeason>(
    `INSERT INTO championship_seasons (championship_id, name, start_date, end_date)
    Values ($1, $2, $3, $4)
    RETURNING 
    id,
    championship_id AS "championshipId",
    name, 
    start_date::TEXT AS "startDate", 
    end_date::TEXT AS "endDate"`,
    [input.championshipId, input.name, input.startDate, input.endDate],
  );

  const championSeason = result.rows[0];

  if (!championSeason) {
    throw new Error("Championship season was created but no row returned");
  }
  return championSeason;
};

export const getChampionshipSeasonById = async (
  id: number,
): Promise<ChampionshipSeason | null> => {
  const result = await pool.query<ChampionshipSeason>(
    `SELECT
    id,
    championship_id AS "championshipId",
    name,
    start_date::TEXT AS "startDate",
    end_date::TEXT AS "endDate"
    FROM championship_seasons
    WHERE id = $1`,
    [id],    
  );

  return result.rows[0] ?? null;
};