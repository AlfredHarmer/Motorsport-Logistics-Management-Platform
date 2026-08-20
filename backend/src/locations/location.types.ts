export type LocationKind =
  | "workshop"
  | "airport"
  | "seaport"
  | "warehouse"
  | "racetrack"
  | "other";

export interface Location {
  id: number;
  code: string;
  name: string;
  kind: LocationKind;
  city: string;
  country: string;
}

export interface CreateLocationInput {
  code: string;
  name: string;
  kind: LocationKind;
  city: string;
  country: string;
}
