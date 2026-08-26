export interface ChampionshipSeason {
    id: number;
    championshipId: number;
    name: string;
    startDate: string;
    endDate: string;
}

export interface CreateChampionshipSeasonInput {
    championshipId: number;
    name: string;
    startDate: string;
    endDate: string;
}