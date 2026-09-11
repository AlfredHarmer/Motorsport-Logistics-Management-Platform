import { pool } from "../database.js";
import type { 
  CreateEquipmentTransferInput,
  EquipmentTransferRecord,
  TransferStatus,
} from "./transfer.types.js";
import type { PoolClient } from "pg";


export const getAllActiveTransfers = async (): Promise<EquipmentTransferRecord[]> => {
  const result = await pool.query<EquipmentTransferRecord>(
    `SELECT
    id,
    equipment_id AS "equipmentId",
    origin_location_id AS "originLocationId",
    destination_location_id AS "destinationLocationId",
    related_event_id AS "relatedEventId",
    planned_departure::text AS "plannedDeparture",
    expected_arrival::text AS "expectedArrival",
    actual_departure::text AS "actualDeparture",
    is_delayed AS "isDelayed",
    revised_expected_arrival::text AS "revisedExpectedArrival",
    revised_departure::text AS "revisedDeparture",
    delay_reason AS "delayReason",
    actual_arrival::text AS "actualArrival",
    transport_method AS "transportMethod",
    status,
    notes
    FROM equipment_transfers
    WHERE status IN ('planned', 'in_transit', 'diverted')
    ORDER BY
    is_delayed DESC,
    COALESCE(revised_expected_arrival, expected_arrival),
    planned_departure`,
  );
  return result.rows;
};

export const getTransferById = async (
  id: number,
): Promise<EquipmentTransferRecord | null> => {
  const result = await pool.query<EquipmentTransferRecord>(
    `SELECT
    id,
    equipment_id AS "equipmentId",
    origin_location_id AS "originLocationId",
    destination_location_id AS "destinationLocationId",
    related_event_id AS "relatedEventId",
    planned_departure::text AS "plannedDeparture",
    expected_arrival::text AS "expectedArrival",
    actual_departure::text AS "actualDeparture",
    is_delayed AS "isDelayed",
    revised_expected_arrival::text AS "revisedExpectedArrival",
    revised_departure::text AS "revisedDeparture",
    delay_reason AS "delayReason",
    actual_arrival::text AS "actualArrival",
    transport_method AS "transportMethod",
    status,
    notes
    FROM equipment_transfers
    WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
};

export const insertPlannedTransfer = async (
  client: PoolClient,
  input: CreateEquipmentTransferInput,
): Promise<EquipmentTransferRecord> => {
  const result = await client.query<EquipmentTransferRecord>(
    `INSERT INTO equipment_transfers (
    equipment_id,
    origin_location_id,
    destination_location_id,
    related_event_id,
    planned_departure,
    expected_arrival,
    transport_method,
    notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
    id,
    equipment_id AS "equipmentId",
    origin_location_id AS "originLocationId",
    destination_location_id AS "destinationLocationId",
    related_event_id AS "relatedEventId",
    planned_departure::text AS "plannedDeparture",
    expected_arrival::text AS "expectedArrival",
    actual_departure::text AS "actualDeparture",
    is_delayed AS "isDelayed",
    revised_expected_arrival::text AS "revisedExpectedArrival",
    revised_departure::text AS "revisedDeparture",
    delay_reason AS "delayReason",
    actual_arrival::text AS "actualArrival",
    transport_method AS "transportMethod",
    status,
    notes`,
    [
      input.equipmentId,
      input.originLocationId,
      input.destinationLocationId,
      input.relatedEventId,
      input.plannedDeparture,
      input.expectedArrival,
      input.transportMethod,
      input.notes,
    ],
  );

  const transfer = result.rows[0];

  if (!transfer) {
    throw new Error("Transfer was created but no row was returned");
  }

  return transfer;
};

export const getEquipmentCurrentLocationForUpdate = async (
  client: PoolClient,
  equipmentId: number,
): Promise<number | null> => {
  const result = await client.query<{ currentLocationId: number }>(
    `SELECT
    current_location_id AS "currentLocationId"
    FROM equipment 
    WHERE id = $1
    FOR UPDATE`,
    [equipmentId],
  );
  return result.rows[0]?.currentLocationId ?? null;
};


export const getTransferStatusForUpdate = async (
  client: PoolClient,
  transferId: number,
): Promise<TransferStatus | null> => {
  const result = await client.query<{ status: TransferStatus }>(
    `SELECT
    status
    FROM equipment_transfers
    WHERE id = $1
    FOR UPDATE`,
    [transferId],
  );
  return result.rows[0]?.status ?? null;
};

export const deleteTransfer = async (
  client: PoolClient,
  id: number,
): Promise<boolean> => {
  const result = await client.query<{ id: number }>(
    `DELETE FROM equipment_transfers
    WHERE id = $1
    RETURNING id`,
    [id],
  );
  return result.rowCount === 1; 
};