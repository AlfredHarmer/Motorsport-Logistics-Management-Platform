export type TransportMethod =
| "air_freight"
| "sea_freight"
| "road_freight_artic"
| "team_transport"
| "other";

export type TransferStatus =
| "in_transit"
| "planned"
| "arrived"
| "cancelled"
| "diverted";

export interface EquipmentTransferRecord {
  id: number;
  equipmentId: number;
  originLocationId: number;
  destinationLocationId: number;
  relatedEventId: number | null;
  plannedDeparture: string;
  expectedArrival: string;
  actualDeparture: string | null;
  isDelayed: boolean;
  revisedExpectedArrival: string | null;
  revisedDeparture: string | null;
  delayReason: string | null;
  actualArrival: string | null;
  transportMethod: TransportMethod;
  status: TransferStatus;
  notes: string | null;
}

export interface CreateEquipmentTransferInput {
  equipmentId: number;
  originLocationId: number;
  destinationLocationId: number;
  relatedEventId: number | null;
  plannedDeparture: string;
  expectedArrival: string;
  transportMethod: TransportMethod;
  notes: string | null;
}

