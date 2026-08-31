export type EquipmentCategory =
  | "pit_stop_rig"
  | "garage_pneumatics"
  | "fueling"
  | "personnel"
  | "engineering"
  | "other";

export type EquipmentConditionStatus =
  | "available"
  | "under_service"
  | "out_of_service";

export interface EquipmentRecord {
  id: number;
  code: string;
  name: string;
  category: EquipmentCategory;
  currentLocationId: number;
  conditionStatus: EquipmentConditionStatus;
  notes: string | null;
}

export interface CreateEquipmentInput {
  code: string;
  name: string;
  category: EquipmentCategory;
  currentLocationId: number;
  conditionStatus: EquipmentConditionStatus;
  notes: string | null;
}
