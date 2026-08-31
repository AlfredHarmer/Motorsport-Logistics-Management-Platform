import { Router } from "express";
import { hasDatabaseErrorCode } from "../shared/database-error.js";
import {
  createEquipment,
  deleteEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
} from "./equipment.repository.js";
import {
  createEquipmentSchema,
  equipmentIdSchema,
} from "./equipment.schema.js";

export const equipmentRouter = Router();

// Get all equipment
equipmentRouter.get("/", async (_req, res) => {
  try {
    const equipment = await getAllEquipment();

    res.status(200).json(equipment);
  } catch (error) {
    console.error("Failed to fetch equipment", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// Create equipment
equipmentRouter.post("/", async (req, res) => {
  try {
    const validationResult = createEquipmentSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid equipment data",
        details: validationResult.error.issues,
      });
      return;
    }

    const newEquipment = await createEquipment(validationResult.data);
    res.status(201).json(newEquipment);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "Equipment with this code already exists",
      });
      return;
    }

    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({ error: "Location does not exist" });
      return;
    }

    console.error("Failed to create equipment", error);
    res.status(500).json({ error: "Failed to create equipment" });
  }
});

// Get equipment by ID
equipmentRouter.get("/:id", async (req, res) => {
  try {
    const validationResult = equipmentIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid equipment ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const equipment = await getEquipmentById(validationResult.data);

    if (equipment === null) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }

    res.status(200).json(equipment);
  } catch (error) {
    console.error("Failed to fetch equipment", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// Update equipment
equipmentRouter.put("/:id", async (req, res) => {
  try {
    const idValidation = equipmentIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      res.status(400).json({
        error: "Invalid equipment ID",
        details: idValidation.error.issues,
      });
      return;
    }

    const bodyValidation = createEquipmentSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        error: "Invalid equipment data",
        details: bodyValidation.error.issues,
      });
      return;
    }

    const updatedEquipment = await updateEquipment(
      idValidation.data,
      bodyValidation.data,
    );

    if (updatedEquipment === null) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }

    res.status(200).json(updatedEquipment);
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23505") {
      res.status(409).json({
        error: "Equipment with this code already exists",
      });
      return;
    }

    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({ error: "Location does not exist" });
      return;
    }

    console.error("Failed to update equipment", error);
    res.status(500).json({ error: "Failed to update equipment" });
  }
});

// Delete equipment
equipmentRouter.delete("/:id", async (req, res) => {
  try {
    const validationResult = equipmentIdSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid equipment ID",
        details: validationResult.error.issues,
      });
      return;
    }

    const wasDeleted = await deleteEquipment(validationResult.data);

    if (!wasDeleted) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (hasDatabaseErrorCode(error) && error.code === "23503") {
      res.status(409).json({
        error: "Equipment cannot be deleted because it is still in use",
      });
      return;
    }

    console.error("Failed to delete equipment", error);
    res.status(500).json({ error: "Failed to delete equipment" });
  }
});
