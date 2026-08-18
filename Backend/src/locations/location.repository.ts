import { pool } from "../database.js";
import type { Location } from "./location.types.js";

export async function getAllLocations(): Promise<Location[]> {
  const result = await pool.query<Location>(
    `SELECT id, code, name, kind, city, country
     FROM locations
     ORDER BY code`,
  );

  return result.rows;
}
