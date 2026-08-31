import { pool } from "../database.js";
import type {
  CreateEquipmentInput,
  EquipmentRecord,
} from "./equipment.types.js";

export const getAllEquipment = async (): Promise<EquipmentRecord[]> => {
  const result = await pool.query<EquipmentRecord>(
    `SELECT
    id,
    code,
    name,
    category,
    current_location_id AS "currentLocationId",
    condition_status AS "conditionStatus",
    notes
    FROM equipment
    ORDER BY code`,
  );

  return result.rows;
};

export const createEquipment = async (
  input: CreateEquipmentInput,
): Promise<EquipmentRecord> => {
  const result = await pool.query<EquipmentRecord>(
    `INSERT INTO equipment (
    code,
    name,
    category,
    current_location_id,
    condition_status,
    notes
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
    id,
    code,
    name,
    category,
    current_location_id AS "currentLocationId",
    condition_status AS "conditionStatus",
    notes`,
    [
      input.code,
      input.name,
      input.category,
      input.currentLocationId,
      input.conditionStatus,
      input.notes,
    ],
  );

  const equipment = result.rows[0];

  if (!equipment) {
    throw new Error("Equipment was created but no row was returned");
  }

  return equipment;
};

export const getEquipmentById = async (
  id: number,
): Promise<EquipmentRecord | null> => {
  const result = await pool.query<EquipmentRecord>(
    `SELECT
    id,
    code,
    name,
    category,
    current_location_id AS "currentLocationId",
    condition_status AS "conditionStatus",
    notes
    FROM equipment
    WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateEquipment = async (
  id: number,
  input: CreateEquipmentInput,
): Promise<EquipmentRecord | null> => {
  const result = await pool.query<EquipmentRecord>(
    `UPDATE equipment
    SET
    code = $1,
    name = $2,
    category = $3,
    current_location_id = $4,
    condition_status = $5,
    notes = $6
    WHERE id = $7
    RETURNING
    id,
    code,
    name,
    category,
    current_location_id AS "currentLocationId",
    condition_status AS "conditionStatus",
    notes`,
    [
      input.code,
      input.name,
      input.category,
      input.currentLocationId,
      input.conditionStatus,
      input.notes,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteEquipment = async (id: number): Promise<boolean> => {
  const result = await pool.query<{ id: number }>(
    `DELETE FROM equipment
    WHERE id = $1
    RETURNING id`,
    [id],
  );

  return result.rowCount === 1;
};
