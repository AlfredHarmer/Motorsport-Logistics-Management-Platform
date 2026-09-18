import { pool } from "../database.js";
import type {
  CreateEquipmentTransferInput,
  EquipmentTransferRecord,
} from "./transfer.types.js";
import {
  deleteTransfer,
  getEquipmentCurrentLocationForUpdate,
  getTransferStatusForUpdate,
  insertPlannedTransfer,
  markTransferDeparted,
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
      throw new TransferError("EQUIPMENT_NOT_FOUND", "Equipment not found");
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
  }
};

export const deletePlannedTransfer = async (id: number): Promise<boolean> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transferStatus = await getTransferStatusForUpdate(client, id);

    if (transferStatus === null) {
      throw new TransferError(
        "TRANSFER_NOT_FOUND",
        "No transfer with that id was found",
      );
    }

    if (transferStatus !== "planned") {
      throw new TransferError(
        "TRANSFER_NOT_DELETABLE",
        "Transfer can not be deleted when status is not planned",
      );
    }

    const wasDeleted = await deleteTransfer(client, id);
    await client.query("COMMIT");
    return wasDeleted;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const departTransfer = async (
  id: number,
): Promise<EquipmentTransferRecord> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const transferStatus = await getTransferStatusForUpdate(client, id);

    if (transferStatus === null) {
      throw new TransferError(
        "TRANSFER_NOT_FOUND",
        "No transfer with that id found",
      );
    }

    if (transferStatus !== "planned") {
      throw new TransferError(
        "TRANSFER_NOT_DEPARTABLE",
        "Transfer can not be departed when status is not planned",
      );
    }

    const departedTransfer = await markTransferDeparted(client, id);

    if (departedTransfer === null) {
      throw new Error("Transfer was eligible to depart but no row returned");
    }

    await client.query("COMMIT");
    return departedTransfer;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
