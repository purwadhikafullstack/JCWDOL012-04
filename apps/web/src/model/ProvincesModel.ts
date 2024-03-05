import { CitiesModel } from './CitiesModel';

export interface ProvincesModel {
    id: number;
    name: string;
    regionId: number;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    cities?: CitiesModel[];
}