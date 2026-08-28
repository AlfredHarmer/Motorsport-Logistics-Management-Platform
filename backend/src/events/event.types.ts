export interface EventRecord {
  id: number;
  code: string;
  championshipSeasonId: number;
  name: string;
  locationId: number;
  startDate: string;
  endDate: string;
  notes: string | null;
}

export interface CreateEventRecordInput {
  code: string;
  championshipSeasonId: number;
  name: string;
  locationId: number;
  startDate: string;
  endDate: string;
  notes: string | null;
}