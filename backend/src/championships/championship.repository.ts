import { pool } from "../database.js";
import type {
  Championship,
  CreateChampionshipInput,
} from "./championship.types.js";

export const getAllChampionships = async (): Promise<Championship[]> => {
  const result = await pool.query<Championship>(
    `SELECT id, code, name
			FROM championships
      ORDER BY code`,
  );

  return result.rows;
};

export const createChampionship = async (
  input: CreateChampionshipInput,
): Promise<Championship> => {
  const result = await pool.query<Championship>(
    `INSERT INTO championships (code, name)
        VALUES ($1, $2)
        RETURNING id, code, name`,
    [input.code, input.name],
  );

  const championship = result.rows[0];

  if (!championship) {
    throw new Error("Championship was created but no row returned");
  }

  return championship;
};

export const getChampionshipById = async (
  id: number,
): Promise<Championship | null> => {
  const result = await pool.query<Championship>(
    `SELECT id, code, name
        FROM championships
        WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
};
