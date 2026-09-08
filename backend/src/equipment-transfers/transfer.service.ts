import { pool } from "../database.js";
import type {
  CreateEquipmentTransferInput,
  EquipmentTransferRecord,
} from "./transfer.types.js";
import {
  getEquipmentCurrentLocationForUpdate,
  insertPlannedTransfer,
} from "./transfer.repository.js";
import { TransferError } from "./transfer.errors.js";

export const createPlannedTransfer = async (
  input: CreateEquipmentTransferInput,
): Promise<EquipmentTransferRecord> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const currentLocationId = await getEquipmentCurrentLocationForUpdate(
      client,
      input.equipmentId,
    );

    if (currentLocationId === null) {
      throw new TransferError(
        "EQUIPMENT_NOT_FOUND",
        "Equipment not found",
      );
    }

    if (currentLocationId !== input.originLocationId) {
      throw new TransferError(
        "ORIGIN_MISMATCH",
        "Transfer origin does not match equipment location",
      );
    }

    const newTransfer = await insertPlannedTransfer(client, input);

    await client.query("COMMIT");
    return newTransfer;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  };
};