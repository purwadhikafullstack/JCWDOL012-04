import { ProvincesModel } from './ProvincesModel';

export interface RegionsModel {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    provinces?: ProvincesModel[];
}