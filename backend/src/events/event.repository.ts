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

