export interface Championship {
  id: number;
  code: string;
  name: string;
}

export interface CreateChampionshipInput {
  code: string;
  name: string;
}
