import { pool } from "../database.js";
import type { EventRecord, CreateEventRecordInput } from "./event.types.js";

export const getAllEvents = async (): Promise<EventRecord[]> => {
  const result = await pool.query<EventRecord>(
    `SELECT
    id,
    code,
    championship_season_id AS "championshipSeasonId",
    name,
    location_id AS "locationId",
    start_date::TEXT AS "startDate",
    end_date::TEXT AS "endDate",
    notes
    FROM events
    ORDER BY start_date`,
  );
  return result.rows;
};

export const createEvent = async (
  input: CreateEventRecordInput
): Promise<EventRecord> => {
  const result = await pool.query<EventRecord>(
    `INSERT INTO events (
    code,
    championship_season_id,
    name,
    location_id,
    start_date,
    end_date,
    notes
    )
    Values ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
    id,
    code,
    championship_season_id AS "championshipSeasonId",
    name,
    location_id AS "locationId",
    start_date::TEXT AS "startDate",
    end_date::TEXT AS "endDate",
    notes`,
    [
      input.code,
      input.championshipSeasonId,
      input.name,
      input.locationId,
      input.startDate,
      input.endDate,
      input.notes,
    ],
  );

  const event = result.rows[0];

  if (!event) {
    throw new Error("Event was created but no row returned");
  }
  return event;
};