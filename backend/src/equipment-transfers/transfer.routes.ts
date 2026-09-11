import { Router } from "express";
import { createPlannedTransfer, deletePlannedTransfer } from "./transfer.service.js";
import {
  createEquipmentTransferSchema,
  equipmentTransferIdSchema,
} from "./transfer.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";
import { TransferError } from "./transfer.errors.js";
import {
  getAllActiveTransfers,
  getTransferById,
} from "./transfer.repository.js";

export const transfersRouter = Router();

transfersRouter.get("/", async (_req, res) => {
  try {
    const activeTransfers = await getAllActiveTransfers();

    res.status(200).json(activeTransfers);
  } catch (error) {
    console.error("Failed to fetch active transfers", error);
    res.status(500).json({ error: "Failed to fetch active transfers" });
  }
});

transfersRouter.get("/:id", async (req, res) => {
  try {
    const validationResult = equipmentTransferIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid transfer ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const transfer = await getTransferById(validationResult.data);

    if (transfer === null) {
      res.status(404).json({ error: "Transfer not found" });
      return;
    }

    res.status(200).json(transfer);
  } catch (error) {
    console.error("Failed to fetch transfer", error);
    res.status(500).json({ error: "Failed to fetch transfer" });
  }
});

transfersRouter.post("/", async (req, res) => {
  try {
    const validationResult = createEquipmentTransferSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid transfer request data",
        details: validationResult.error.issues,
      });
      return;
    }

    const newTransfer = await createPlannedTransfer(validationResult.data);

    res.status(201).json(newTransfer);
  } catch (error) {
    if (error instanceof TransferError) {
      if (error.code === "EQUIPMENT_NOT_FOUND") {
        res.status(404).json({ error: error.message });
        return;
      }

      if (error.code === "ORIGIN_MISMATCH") {
        res.status(409).json({ error: error.message });
        return;
      }
    }

    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "Equipment already has an open transfer",
      });
      return;
    }

    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({
        error: "Equipment, Location or Event does not exist",
      });
      return;
    }

    console.error("Failed to create equipment transfer", error);
    res.status(500).json({ error: "Failed to create equipment transfer" });
  }
});

transfersRouter.delete("/:id", async (req, res) => {
  try {
    const validationResult = equipmentTransferIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid transfer ID data",
        details: validationResult.error.issues,
      });
      return;
    }

    await deletePlannedTransfer(validationResult.data);

    res.status(204).send();
  } catch (error) {
    if (error instanceof TransferError) {
      if (error.code === "TRANSFER_NOT_FOUND") {
        res.status(404).json({ error: error.message });
        return;
      }

      if (error.code === "TRANSFER_NOT_DELETABLE") {
        res.status(409).json({ error: error.message });
        return;
      }
    }
    console.error("Failed to delete Transfer", error);
    res.status(500).json({ error: "Failed to delete Transfer"})
  }
});
