import { Router } from "express";
import {
  createPlannedTransfer,
} from "./transfer.service.js";
import {
  createEquipmentTransferSchema,
} from "./transfer.schema.js";
import { hasDatabaseErrorCode } from "../shared/database-error.js";
import { TransferError } from "./transfer.errors.js";

export const transfersRouter = Router();

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
        error: "Equipment already has an open transfer"
      });
      return;
    }

    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({
        error: "Equipment or Location does not exist"
      });
      return;
    }

    console.error("Failed to create equipment transfer", error);
    res.status(500).json({ error: "Failed to create equipment transfer" });
  };
});