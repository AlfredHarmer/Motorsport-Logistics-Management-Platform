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

export const updateChampionship = async (
  id: number,
  input: CreateChampionshipInput,
): Promise<Championship | null> => {
  const result = await pool.query<Championship>(
    `UPDATE championships
    SET
    code = $1,
    name = $2
    WHERE id = $3
    RETURNING id, code, name`,
    [input.code, input.name, id],
  );

  return result.rows[0] ?? null;
};

export const deleteChampionship = async (
  id: number,
): Promise<boolean> => {
  const result = await pool.query<{ id: number }>(
    `DELETE FROM championships WHERE id = $1
    RETURNING id`, [id],
  );

  return result.rowCount === 1;
};