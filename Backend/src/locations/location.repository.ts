import { pool } from "../database.js";
import type { Location, CreateLocationInput } from "./location.types.js";

export const getAllLocations = async (): Promise<Location[]> => {
  const result = await pool.query<Location>(
    `SELECT id, code, name, kind, city, country
     FROM locations
     ORDER BY code`,
  );

  return result.rows;
};

export const createLocation = async (
  input: CreateLocationInput,
): Promise<Location> => {
  const result = await pool.query<Location>(
    `INSERT INTO locations (code, name, kind, city, country)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, code, name, kind, city, country`,
    [input.code, input.name, input.kind, input.city, input.country],
  );

  const location = result.rows[0];

  if (!location) {
    throw new Error("Location was created but no row was returned");
  }

  return location;
};

export const getLocationById = async (
  id: number,
): Promise<Location | null> => {
  const result = await pool.query<Location>(
    `SELECT id, code, name, kind, city, country
    FROM locations
    WHERE id = $1`,
    [id],
  );
  
  return result.rows[0] ?? null;
};
