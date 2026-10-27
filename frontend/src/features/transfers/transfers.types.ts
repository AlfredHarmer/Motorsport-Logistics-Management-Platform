
export type TransferStatus =
| "planned"
| "in_transit"
| "arrived"
| "cancelled"
| "diverted"

export interface TransferListItem {
  id: number;
  equipmentName: string;
  destinationName: string;
  isDelayed: boolean;
  status: TransferStatus;
  notes: string | null;
}